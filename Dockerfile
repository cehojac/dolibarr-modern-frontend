# Multi-stage build optimizado para Portainer
FROM node:20-alpine AS node-builder

# Instalar dependencias del sistema
RUN apk add --no-cache git curl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Node.js
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias de Node.js
RUN npm ci --only=production --silent

# Copiar código fuente para compilar
COPY resources/ ./resources/
COPY public/ ./public/

# Compilar assets
RUN npm run build

# Stage 2: PHP con Apache optimizado
FROM php:8.2-apache

# Instalar extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    git \
    curl \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo \
        pdo_mysql \
        mysqli \
        zip \
        intl \
        mbstring \
        xml \
        curl \
        fileinfo \
        tokenizer \
        bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
RUN a2enmod rewrite headers ssl
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache/apache2.conf /etc/apache2/apache2.conf

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar código PHP
COPY . .

# Copiar assets compilados desde el stage anterior
COPY --from=node-builder /app/public/build ./public/build

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Crear script de inicialización
COPY docker/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["/usr/local/bin/init.sh"]
