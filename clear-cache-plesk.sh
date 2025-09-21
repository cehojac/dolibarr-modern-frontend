#!/bin/bash

# Script para limpiar cachés en Plesk después de cambios
DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

echo "🧹 Limpiando cachés después de cambios..."

cd "$PRIVATE_DIR" || exit 1

# Limpiar todos los cachés de Laravel
echo "1. Limpiando cachés de Laravel..."
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear
sudo -u psacln php artisan cache:clear

# Limpiar caché de OPcache si está habilitado
echo "2. Limpiando OPcache..."
sudo -u psacln php -r "if (function_exists('opcache_reset')) { opcache_reset(); echo 'OPcache cleared'; } else { echo 'OPcache not available'; }"

# Recompilar configuración para producción
echo "3. Recompilando configuración..."
sudo -u psacln php artisan config:cache

echo "✅ Cachés limpiados. Los cambios de timeout ya están activos."
echo ""
echo "🔍 Para probar el login:"
echo "1. Ir a: https://$DOMAIN"
echo "2. Intentar login con credenciales de Dolibarr"
echo "3. Ver logs: tail -f storage/logs/laravel.log"
