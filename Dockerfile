# ============================================
# Stage 1: Compilar assets Vue.js con Node.js
# ============================================
FROM node:20-alpine AS node-builder

WORKDIR /app

COPY package.json package-lock.json vite.config.js tailwind.config.cjs postcss.config.cjs ./

RUN npm install --no-audit --no-fund

COPY resources/ ./resources/
COPY public/ ./public/

RUN npm run build \
    && echo "=== Vite build output ===" \
    && find /app/public/build -type f | head -20 \
    && echo "=== Manifest check ===" \
    && (cat /app/public/build/manifest.json 2>/dev/null | head -3 || echo "NO manifest.json at root") \
    && (cat /app/public/build/.vite/manifest.json 2>/dev/null | head -3 || echo "NO .vite/manifest.json") \
    && if [ -f /app/public/build/.vite/manifest.json ] && [ ! -f /app/public/build/manifest.json ]; then \
        cp /app/public/build/.vite/manifest.json /app/public/build/manifest.json; \
        echo "=> Copied .vite/manifest.json -> manifest.json"; \
    fi \
    && if [ -f /app/public/build/manifest.json ] && [ ! -d /app/public/build/.vite ]; then \
        mkdir -p /app/public/build/.vite && \
        cp /app/public/build/manifest.json /app/public/build/.vite/manifest.json; \
        echo "=> Copied manifest.json -> .vite/manifest.json"; \
    fi \
    && echo "=== Final manifest locations ===" \
    && ls -la /app/public/build/manifest.json 2>/dev/null || true \
    && ls -la /app/public/build/.vite/manifest.json 2>/dev/null || true

# ============================================
# Stage 2: PHP + Apache (mínimo para Laravel)
# ============================================
FROM php:8.2-apache

# Instalar SOLO las extensiones que Laravel necesita para funcionar como proxy API
# curl: peticiones HTTP a Dolibarr | mbstring/xml/fileinfo: Laravel core
# pdo_sqlite: sesiones/cache local | opcache: rendimiento PHP
RUN savedAptMark="$(apt-mark showmanual)" \
    && apt-get update \
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
    && apt-mark auto '.*' > /dev/null \
    && apt-mark manual $savedAptMark unzip \
    && ldd /usr/local/lib/php/extensions/*/*.so 2>/dev/null \
        | awk '/=>/ { print $3 }' \
        | sort -u \
        | xargs -r dpkg-query --search 2>/dev/null \
        | cut -d: -f1 \
        | sort -u \
        | xargs -r apt-mark manual \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
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
COPY docker/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

EXPOSE 80

CMD ["/usr/local/bin/init.sh"]
