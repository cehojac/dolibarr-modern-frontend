#!/bin/bash

echo "🚀 Iniciando Dolibarr Modern Frontend..."

# Función para esperar a servicios externos (opcional)
wait_for_service() {
    if [ ! -z "$1" ] && [ ! -z "$2" ]; then
        echo "⏳ Esperando a que $1:$2 esté disponible..."
        timeout=60
        while ! nc -z $1 $2 && [ $timeout -gt 0 ]; do
            sleep 1
            timeout=$((timeout-1))
        done
        if [ $timeout -eq 0 ]; then
            echo "⚠️ Timeout esperando a $1:$2, continuando..."
        else
            echo "✅ $1:$2 disponible"
        fi
    fi
}

# Esperar a servicios externos si están configurados
wait_for_service "$DB_HOST" "${DB_PORT:-3306}"

# Generar clave de aplicación si no existe
if [ ! -f .env ]; then
    echo "📝 Copiando archivo de configuración..."
    cp .env.docker .env
fi

# Generar APP_KEY si no existe
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generando clave de aplicación..."
    php artisan key:generate --no-interaction
fi

# Limpiar y optimizar caché
echo "🧹 Limpiando caché..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimizar para producción
echo "⚡ Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones si existen
if [ -d "database/migrations" ] && [ "$(ls -A database/migrations)" ]; then
    echo "🗄️ Ejecutando migraciones..."
    php artisan migrate --force --no-interaction
fi

# Crear enlace simbólico para storage
echo "🔗 Creando enlace simbólico para storage..."
php artisan storage:link || true

# Configurar permisos finales
echo "🔐 Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Mostrar información de la aplicación
echo "📊 Información de la aplicación:"
echo "   - PHP Version: $(php -v | head -n 1)"
echo "   - Laravel Version: $(php artisan --version)"
echo "   - Environment: $(php artisan env)"
echo "   - URL: ${APP_URL:-http://localhost}"

# Verificar configuración crítica
echo "🔍 Verificando configuración..."
if [ -z "$DOLIBARR_BASE_URL" ]; then
    echo "⚠️  ADVERTENCIA: DOLIBARR_BASE_URL no está configurada"
fi

if [ -z "$DOLIBARR_API_KEY" ]; then
    echo "⚠️  ADVERTENCIA: DOLIBARR_API_KEY no está configurada"
fi

echo "✅ Inicialización completada. Iniciando Apache..."

# Iniciar Apache en primer plano
exec apache2-foreground
