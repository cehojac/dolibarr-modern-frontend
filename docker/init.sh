#!/bin/bash
set -e

echo "==> Iniciando Dolibarr Modern Frontend..."

cd /var/www/html

# PASO 1: Crear directorios ANTES de cualquier comando artisan
# (los volumenes Docker arrancan vacios y Laravel necesita estos paths)
echo "--> Preparando directorios..."
mkdir -p storage/framework/{cache/data,sessions,views} \
         storage/logs \
         bootstrap/cache \
         database
touch database/database.sqlite
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# PASO 2: Preparar archivo .env
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.docker ]; then
        echo "--> Copiando .env.docker a .env..."
        cp /var/www/html/.env.docker /var/www/html/.env
        # key:generate necesita la linea APP_KEY= para saber donde escribir
        if ! grep -q "^APP_KEY=" /var/www/html/.env; then
            echo "APP_KEY=" >> /var/www/html/.env
        fi
    else
        echo "--> Creando .env minimo desde variables de entorno..."
        cat > /var/www/html/.env <<EOF
APP_NAME="${APP_NAME:-Dolibarr Modern Frontend}"
APP_ENV=${APP_ENV:-production}
APP_KEY=
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}
LOG_CHANNEL=stack
LOG_LEVEL=${LOG_LEVEL:-error}
DB_CONNECTION=sqlite
SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync
DOLIBARR_BASE_URL=${DOLIBARR_BASE_URL}
DOLIBARR_API_KEY=${DOLIBARR_API_KEY}
DOLIBARR_VERIFY_SSL=${DOLIBARR_VERIFY_SSL:-true}
EOF
    fi
fi

# PASO 3: Generar APP_KEY (ahora los directorios ya existen)
if ! grep -q "APP_KEY=base64:" /var/www/html/.env; then
    echo "--> Generando APP_KEY..."
    php artisan key:generate --no-interaction --force
fi

# Exportar APP_KEY al entorno para que config:cache la recoja
# (evita que la variable Docker vacia APP_KEY= sobreescriba la generada)
GENERATED_KEY=$(grep "^APP_KEY=" /var/www/html/.env | cut -d= -f2-)
if [ -n "$GENERATED_KEY" ]; then
    export APP_KEY="$GENERATED_KEY"
    echo "--> APP_KEY exportada al entorno"
fi

# Limpiar cache (sin set -e para que no falle si ya estaba limpia)
echo "--> Limpiando cache..."
php artisan config:clear || true
php artisan route:clear  || true
php artisan view:clear   || true
php artisan cache:clear  || true

# Optimizar para produccion
echo "--> Optimizando aplicacion..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones si hay archivos de migracion
if [ -d "database/migrations" ] && [ "$(ls -A database/migrations 2>/dev/null)" ]; then
    echo "--> Ejecutando migraciones..."
    php artisan migrate --force --no-interaction || true
fi

# Enlace simbolico para storage publico
php artisan storage:link 2>/dev/null || true

# Verificar configuracion critica
if [ -z "$DOLIBARR_BASE_URL" ]; then
    echo "[WARN] DOLIBARR_BASE_URL no configurada"
fi
if [ -z "$DOLIBARR_API_KEY" ]; then
    echo "[WARN] DOLIBARR_API_KEY no configurada"
fi

echo "--> PHP: $(php -r 'echo PHP_VERSION;')"
echo "--> APP_URL: ${APP_URL:-http://localhost}"
echo "--> Iniciando Apache..."

# Iniciar Apache en primer plano
exec apache2-foreground
