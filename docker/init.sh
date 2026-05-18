<<<<<<< HEAD
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
=======
#!/bin/sh
# Entrypoint for Dolibarr Modern Frontend
# Runs Laravel bootstrap tasks then execs the container CMD (apache2-foreground).
set -e

APP_DIR=/var/www/html
cd "$APP_DIR"

echo "==> Dolibarr Modern Frontend (PHP $(php -r 'echo PHP_VERSION;'))"

# ------------------------------------------------------------------
# 1. Ensure writable Laravel paths (volumes mount empty)
# ------------------------------------------------------------------
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    database
[ -f database/database.sqlite ] || touch database/database.sqlite
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# ------------------------------------------------------------------
# 2. .env bootstrap
#    The container expects DOLIBARR_BASE_URL / DOLIBARR_API_KEY to come
#    from the host env (compose env_file or `-e`). .env is regenerated
#    on each boot from those vars so config:cache always sees the latest.
# ------------------------------------------------------------------
cat > "$APP_DIR/.env" <<EOF
APP_NAME="${APP_NAME:-Dolibarr Modern Frontend}"
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}
APP_TIMEZONE=${APP_TIMEZONE:-UTC}
APP_LOCALE=${APP_LOCALE:-es}
APP_FALLBACK_LOCALE=${APP_FALLBACK_LOCALE:-en}

LOG_CHANNEL=${LOG_CHANNEL:-stack}
LOG_LEVEL=${LOG_LEVEL:-warning}

DB_CONNECTION=${DB_CONNECTION:-sqlite}
SESSION_DRIVER=${SESSION_DRIVER:-file}
SESSION_LIFETIME=${SESSION_LIFETIME:-120}
SESSION_SAME_SITE=${SESSION_SAME_SITE:-lax}
SESSION_SECURE_COOKIE=${SESSION_SECURE_COOKIE:-false}
CACHE_STORE=${CACHE_STORE:-file}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-sync}
BROADCAST_CONNECTION=${BROADCAST_CONNECTION:-log}
FILESYSTEM_DISK=${FILESYSTEM_DISK:-local}

DOLIBARR_BASE_URL=${DOLIBARR_BASE_URL:-}
DOLIBARR_API_KEY=${DOLIBARR_API_KEY:-}
DOLIBARR_VERIFY_SSL=${DOLIBARR_VERIFY_SSL:-true}
EOF
chown www-data:www-data "$APP_DIR/.env"
chmod 640 "$APP_DIR/.env"

# ------------------------------------------------------------------
# 3. APP_KEY: persisted on a volume so it stays stable across restarts
# ------------------------------------------------------------------
KEY_FILE=/var/www/html/storage/app_key
if [ -z "${APP_KEY:-}" ]; then
    if [ -s "$KEY_FILE" ]; then
        APP_KEY="$(cat "$KEY_FILE")"
        echo "--> Reusing APP_KEY from $KEY_FILE"
    else
        APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
        echo "$APP_KEY" > "$KEY_FILE"
        chown www-data:www-data "$KEY_FILE"
        chmod 600 "$KEY_FILE"
        echo "--> Generated new APP_KEY -> $KEY_FILE"
    fi
    export APP_KEY
fi
# Persist into .env so artisan reads it consistently
sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" "$APP_DIR/.env"

# ------------------------------------------------------------------
# 4. Warn (don't fail) on missing critical config
# ------------------------------------------------------------------
[ -z "${DOLIBARR_BASE_URL:-}" ] && echo "[WARN] DOLIBARR_BASE_URL is empty — set it in .env.docker"
[ -z "${DOLIBARR_API_KEY:-}" ]  && echo "[WARN] DOLIBARR_API_KEY is empty — set it in .env.docker"

# ------------------------------------------------------------------
# 5. Clear stale caches (volumes may carry old data) then rebuild
# ------------------------------------------------------------------
echo "--> Caching config / routes / views"
php artisan config:clear >/dev/null 2>&1 || true
php artisan route:clear  >/dev/null 2>&1 || true
php artisan view:clear   >/dev/null 2>&1 || true
php artisan config:cache >/dev/null
php artisan route:cache  >/dev/null
php artisan view:cache   >/dev/null

# ------------------------------------------------------------------
# 6. Migrations (idempotent) + storage symlink
# ------------------------------------------------------------------
if [ -d database/migrations ] && [ "$(ls -A database/migrations 2>/dev/null)" ]; then
    php artisan migrate --force --no-interaction >/dev/null 2>&1 || \
        echo "[WARN] migrations failed (continuing)"
fi
[ -L public/storage ] || php artisan storage:link >/dev/null 2>&1 || true

echo "==> Ready. Handing off to: $*"
exec "$@"
>>>>>>> c7c1f3c5a13ca892c07364a18054d0b85925375d
