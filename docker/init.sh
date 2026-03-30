#!/bin/bash
set -e

echo "🚀 Iniciando Dolibarr Modern Frontend..."

# Asegurar directorios y permisos ANTES de cualquier comando artisan
mkdir -p storage/framework/{cache/data,sessions,views} storage/logs bootstrap/cache database
touch database/database.sqlite
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# Copiar .env si no existe
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

echo "⚡ Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones SQLite si existen
if [ -d "database/migrations" ] && [ "$(ls -A database/migrations 2>/dev/null)" ]; then
    echo "🗄️ Ejecutando migraciones..."
    php artisan migrate --force --no-interaction
fi

# Enlace simbólico para storage
php artisan storage:link 2>/dev/null || true

# Permisos finales (por si artisan creó algo nuevo)
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# Info
echo "📊 PHP: $(php -r 'echo PHP_VERSION;') | Laravel: $(php artisan --version --no-ansi) | URL: ${APP_URL:-http://localhost}"

# Verificar configuración crítica
[ -z "$DOLIBARR_BASE_URL" ] && echo "⚠️  DOLIBARR_BASE_URL no configurada"
[ -z "$DOLIBARR_API_KEY" ] && echo "⚠️  DOLIBARR_API_KEY no configurada"

echo "✅ Iniciando Apache..."
exec apache2-foreground
