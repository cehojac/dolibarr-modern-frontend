#!/bin/bash

# Solución rápida para sesiones - cambiar a archivos
echo "🔧 SOLUCIONANDO SESIONES RÁPIDAMENTE"
echo "==================================="

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "1. Cambiando sesiones de database a file..."

# Cambiar SESSION_DRIVER a file en lugar de database
sed -i 's/^SESSION_DRIVER=.*/SESSION_DRIVER=file/' .env

# Si no existe, agregarlo
if ! grep -q "^SESSION_DRIVER=" .env; then
    echo "SESSION_DRIVER=file" >> .env
fi

echo "2. Cambiando caché de database a file..."

# Cambiar CACHE_STORE a file también
sed -i 's/^CACHE_STORE=.*/CACHE_STORE=file/' .env

# Si no existe, agregarlo
if ! grep -q "^CACHE_STORE=" .env; then
    echo "CACHE_STORE=file" >> .env
fi

echo "3. Creando directorios necesarios..."

# Asegurar que existen los directorios
mkdir -p storage/framework/sessions
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/views

# Configurar permisos
chmod -R 775 storage/framework
chown -R psacln:psaserv storage/framework

echo "4. Limpiando cachés..."

# Limpiar cachés
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear

echo "5. Verificando configuración..."

echo "Configuración actual:"
grep -E "^(SESSION_DRIVER|CACHE_STORE|DB_CONNECTION)=" .env

echo ""
echo "✅ SOLUCIONADO - Ahora usa archivos para sesiones y caché"
echo "🚀 Probar aplicación: https://$DOMAIN"
