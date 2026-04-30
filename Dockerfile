# ============================================
# Stage 1: Compilar assets Vue.js con Node.js
# ============================================
FROM node:20-alpine AS node-builder

WORKDIR /app

COPY package.json vite.config.js tailwind.config.cjs postcss.config.cjs ./
COPY package-lock.json* ./

RUN npm install --no-audit --no-fund

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
        curl \
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
RUN printf "opcache.enable=1\nopcache.memory_consumption=128\nopcache.interned_strings_buffer=8\nopcache.max_accelerated_files=10000\nopcache.validate_timestamps=0\n" \
    > /usr/local/etc/php/conf.d/opcache-prod.ini

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache: habilitar módulos necesarios (NO reemplazar apache2.conf del sistema)
RUN a2enmod rewrite headers expires
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

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

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

CMD ["/usr/local/bin/init.sh"]
