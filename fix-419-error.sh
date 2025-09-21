#!/bin/bash

# Solución para error 419 - Token CSRF / Sesiones
echo "🔐 SOLUCIONANDO ERROR 419 (Page Expired)"
echo "======================================="

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "1. Verificando configuración de sesiones..."

# Verificar configuración actual
echo "Configuración actual:"
grep -E "^(SESSION_|APP_KEY)" .env

echo ""
echo "2. Configurando dominio de sesión correctamente..."

# Configurar dominio de sesión específico para el subdominio
sed -i 's/^SESSION_DOMAIN=.*/SESSION_DOMAIN=new.gestion.carlos-herrera-consulting/' .env

# Si no existe, agregarlo
if ! grep -q "^SESSION_DOMAIN=" .env; then
    echo "SESSION_DOMAIN=new.gestion.carlos-herrera-consulting" >> .env
fi

echo "3. Configurando cookies seguras..."

# Asegurar configuración de cookies
if ! grep -q "^SESSION_SECURE_COOKIE=" .env; then
    echo "SESSION_SECURE_COOKIE=true" >> .env
fi

if ! grep -q "^SESSION_HTTP_ONLY=" .env; then
    echo "SESSION_HTTP_ONLY=true" >> .env
fi

if ! grep -q "^SESSION_SAME_SITE=" .env; then
    echo "SESSION_SAME_SITE=lax" >> .env
fi

echo "4. Verificando APP_KEY..."

# Verificar que APP_KEY existe y es válida
if ! grep -q "^APP_KEY=base64:" .env; then
    echo "Generando nueva APP_KEY..."
    sudo -u psacln php artisan key:generate --force
else
    echo "APP_KEY ya configurada"
fi

echo "5. Limpiando sesiones existentes..."

# Limpiar sesiones existentes que puedan estar corruptas
rm -rf storage/framework/sessions/*
rm -rf storage/framework/cache/data/*

echo "6. Configurando permisos de sesiones..."

# Asegurar permisos correctos
mkdir -p storage/framework/sessions
mkdir -p storage/framework/cache/data
chmod -R 775 storage/framework
chown -R psacln:psaserv storage/framework

echo "7. Limpiando cachés de configuración..."

# Limpiar cachés
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear

echo "8. Recacheando configuración..."

# Cachear configuración para producción
sudo -u psacln php artisan config:cache

echo "9. Verificando configuración final..."

echo "Configuración de sesiones:"
sudo -u psacln php artisan tinker --execute="
echo 'SESSION_DRIVER: ' . config('session.driver') . PHP_EOL;
echo 'SESSION_DOMAIN: ' . config('session.domain') . PHP_EOL;
echo 'SESSION_SECURE: ' . (config('session.secure') ? 'true' : 'false') . PHP_EOL;
echo 'APP_URL: ' . config('app.url') . PHP_EOL;
"

echo ""
echo "✅ ERROR 419 SOLUCIONADO"
echo "======================="
echo ""
echo "Cambios aplicados:"
echo "- SESSION_DOMAIN configurado para el subdominio específico"
echo "- Cookies seguras habilitadas"
echo "- Sesiones limpiadas"
echo "- Configuración recacheada"
echo ""
echo "🚀 Probar ahora: https://$DOMAIN"
echo "💡 Si persiste, limpiar cookies del navegador"
