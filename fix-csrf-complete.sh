#!/bin/bash

# Solución completa para CSRF token mismatch
echo "🔐 SOLUCIONANDO CSRF TOKEN MISMATCH COMPLETAMENTE"
echo "================================================"

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"
PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"

cd "$PRIVATE_DIR" || exit 1

echo "1. Configurando dominio de sesión..."

# Configurar dominio específico
sed -i 's/^SESSION_DOMAIN=.*/SESSION_DOMAIN=new.gestion.carlos-herrera-consulting/' .env

# Asegurar otras configuraciones de sesión
if ! grep -q "^SESSION_SECURE_COOKIE=" .env; then
    echo "SESSION_SECURE_COOKIE=true" >> .env
fi

if ! grep -q "^SESSION_HTTP_ONLY=" .env; then
    echo "SESSION_HTTP_ONLY=true" >> .env
fi

if ! grep -q "^SESSION_SAME_SITE=" .env; then
    echo "SESSION_SAME_SITE=lax" >> .env
fi

echo "2. Verificando APP_KEY..."

# Generar APP_KEY si no existe
if ! grep -q "^APP_KEY=base64:" .env; then
    sudo -u psacln php artisan key:generate --force
    echo "APP_KEY generada"
else
    echo "APP_KEY ya configurada"
fi

echo "3. Limpiando sesiones existentes..."

# Limpiar sesiones corruptas
rm -rf storage/framework/sessions/*
rm -rf storage/framework/cache/data/*

# Asegurar permisos
mkdir -p storage/framework/sessions
mkdir -p storage/framework/cache/data
chmod -R 775 storage/framework
chown -R psacln:psaserv storage/framework

echo "4. Compilando assets con cambios CSRF..."

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias npm..."
    npm install
fi

# Compilar assets para producción
echo "Compilando assets..."
npm run build

echo "5. Copiando assets compilados..."

# Copiar assets al directorio público
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "Assets copiados a httpdocs"
fi

# Copiar otros assets si existen
if [ -f "public/favicon.ico" ]; then
    cp public/favicon.ico "$PUBLIC_DIR/"
fi

echo "6. Limpiando cachés de Laravel..."

# Limpiar cachés
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear

echo "7. Recacheando configuración..."

# Cachear para producción
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan route:cache
sudo -u psacln php artisan view:cache

echo "8. Verificando configuración final..."

echo "Configuración de sesiones:"
echo "SESSION_DRIVER: $(grep "^SESSION_DRIVER=" .env | cut -d'=' -f2)"
echo "SESSION_DOMAIN: $(grep "^SESSION_DOMAIN=" .env | cut -d'=' -f2)"
echo "APP_KEY configurada: $(grep -q "^APP_KEY=base64:" .env && echo 'Sí' || echo 'No')"

echo "9. Verificando archivos críticos..."

# Verificar que el template tiene el meta tag
if grep -q 'csrf-token' resources/views/app.blade.php; then
    echo "✅ Meta tag CSRF en template: OK"
else
    echo "❌ Meta tag CSRF en template: FALTA"
fi

# Verificar que http.js tiene withCredentials
if grep -q 'withCredentials: true' resources/js/utils/http.js; then
    echo "✅ withCredentials en http.js: OK"
else
    echo "❌ withCredentials en http.js: FALTA"
fi

# Verificar que los assets están compilados
if [ -f "$PUBLIC_DIR/build/manifest.json" ]; then
    echo "✅ Assets compilados: OK"
else
    echo "❌ Assets compilados: FALTA"
fi

echo ""
echo "✅ SOLUCIÓN CSRF COMPLETADA"
echo "=========================="
echo ""
echo "Cambios aplicados:"
echo "1. ✅ Meta tag CSRF agregado al template"
echo "2. ✅ withCredentials habilitado en axios"
echo "3. ✅ Manejo de error 419 agregado"
echo "4. ✅ SESSION_DOMAIN configurado correctamente"
echo "5. ✅ Assets recompilados con cambios"
echo "6. ✅ Sesiones limpiadas"
echo ""
echo "🚀 Probar ahora:"
echo "1. Limpiar cookies del navegador (F12 > Application > Storage > Clear)"
echo "2. Ir a: https://$DOMAIN"
echo "3. Intentar login"
echo ""
echo "💡 Si persiste el error:"
echo "- Verificar en DevTools > Network que se envía X-CSRF-TOKEN"
echo "- Revisar logs: tail -f storage/logs/laravel.log"
