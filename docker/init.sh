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
