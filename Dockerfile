<<<<<<< HEAD
# ============================================
# Stage 1: Compilar assets Vue.js con Node.js
# ============================================
FROM node:20-alpine AS node-builder

WORKDIR /app

COPY package.json package-lock.json vite.config.js tailwind.config.cjs postcss.config.cjs ./

RUN npm ci --no-audit --no-fund

COPY resources/ ./resources/
COPY public/ ./public/

RUN npm run build

# ============================================
# Stage 2: PHP + Apache (mínimo para Laravel)
# ============================================
FROM php:8.2-apache

# Instalar SOLO las extensiones que Laravel necesita para funcionar como proxy API
# curl: peticiones HTTP a Dolibarr | mbstring/xml/fileinfo: Laravel core
# pdo_sqlite: sesiones/cache local | opcache: rendimiento PHP
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libonig-dev \
        libxml2-dev \
        libcurl4-openssl-dev \
        libsqlite3-dev \
        unzip \
    && docker-php-ext-install -j$(nproc) \
        curl \
        mbstring \
        xml \
        fileinfo \
        pdo \
        pdo_sqlite \
        opcache \
    && apt-get purge -y --auto-remove libonig-dev libxml2-dev libcurl4-openssl-dev libsqlite3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Configurar OPcache para producción
RUN echo "opcache.enable=1\n\
opcache.memory_consumption=128\n\
opcache.interned_strings_buffer=8\n\
opcache.max_accelerated_files=10000\n\
opcache.validate_timestamps=0" > /usr/local/etc/php/conf.d/opcache-prod.ini

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache: solo módulos necesarios
RUN a2enmod rewrite headers expires
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache/apache2.conf /etc/apache2/apache2.conf

# Directorio de logs
ENV APACHE_LOG_DIR=/var/log/apache2
RUN mkdir -p ${APACHE_LOG_DIR} \
    && ln -sf ${APACHE_LOG_DIR} /etc/apache2/logs

WORKDIR /var/www/html

# Copiar código PHP
COPY . .

# Copiar assets compilados desde Stage 1
COPY --from=node-builder /app/public/build ./public/build

# Instalar dependencias PHP (sin dev) y preparar directorios Laravel
RUN mkdir -p storage/framework/{cache/data,sessions,views} storage/logs bootstrap/cache database \
    && touch database/database.sqlite \
    && composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-scripts \
    && php artisan package:discover --ansi || true \
    && rm -rf /root/.composer/cache

# Permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 storage bootstrap/cache database

# Script de inicio
=======
# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: Vue 3 / Vite assets
# ============================================================
FROM node:20-alpine AS assets

WORKDIR /app

# Manifest first for cache reuse on source-only changes
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline || npm install --no-audit --no-fund

# Build config + source
COPY vite.config.js tailwind.config.cjs postcss.config.cjs ./
COPY resources/ ./resources/
COPY public/ ./public/

RUN npm run build && rm -rf node_modules

# ============================================================
# Stage 2: Composer dependencies
# ============================================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
COPY database/ ./database/
COPY bootstrap/ ./bootstrap/
COPY artisan ./

RUN --mount=type=cache,target=/tmp/composer-cache \
    composer install \
        --no-dev \
        --no-interaction \
        --no-progress \
        --no-scripts \
        --prefer-dist \
        --optimize-autoloader

# ============================================================
# Stage 3: Runtime (PHP 8.3 + Apache)
# ============================================================
FROM php:8.3-apache-bookworm AS runtime

# Required PHP extensions for Laravel 12 acting as Dolibarr API proxy
# Build with -dev headers, then remove only the build deps (keep runtime libs).
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        unzip \
        libonig-dev libxml2-dev libsqlite3-dev libzip-dev \
    ; \
    docker-php-ext-install -j"$(nproc)" \
        mbstring \
        xml \
        pdo \
        pdo_sqlite \
        opcache \
        zip \
    ; \
    apt-get remove -y --purge libonig-dev libxml2-dev libsqlite3-dev libzip-dev; \
    apt-get autoremove -y; \
    apt-get install -y --no-install-recommends libonig5 libxml2 libsqlite3-0 libzip4; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Production OPcache + PHP tuning
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=0'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=16'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.fast_shutdown=1'; \
    } > /usr/local/etc/php/conf.d/opcache.ini \
    && { \
        echo 'memory_limit=256M'; \
        echo 'upload_max_filesize=32M'; \
        echo 'post_max_size=32M'; \
        echo 'expose_php=Off'; \
    } > /usr/local/etc/php/conf.d/app.ini

# Apache: enable required modules, set ServerName, point to public/
RUN a2enmod rewrite headers expires \
    && echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public \
    APP_ENV=production \
    APP_DEBUG=false

WORKDIR /var/www/html

# Application code (filtered by .dockerignore)
COPY --chown=www-data:www-data . .

# Pre-built assets and vendor from prior stages
COPY --from=assets  --chown=www-data:www-data /app/public/build ./public/build
COPY --from=vendor  --chown=www-data:www-data /app/vendor ./vendor

# Laravel runtime directories + permissions
RUN set -eux; \
    mkdir -p \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
        database \
    ; \
    touch database/database.sqlite; \
    chown -R www-data:www-data storage bootstrap/cache database; \
    chmod -R 775 storage bootstrap/cache database; \
    php artisan package:discover --ansi || true

# Entrypoint
>>>>>>> c7c1f3c5a13ca892c07364a18054d0b85925375d
COPY docker/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

EXPOSE 80

<<<<<<< HEAD
CMD ["/usr/local/bin/init.sh"]
=======
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost/up >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/init.sh"]
CMD ["apache2-foreground"]
>>>>>>> c7c1f3c5a13ca892c07364a18054d0b85925375d
