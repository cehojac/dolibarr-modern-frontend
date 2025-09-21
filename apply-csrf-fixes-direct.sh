#!/bin/bash

# Aplicar cambios CSRF directamente en el servidor
echo "🔧 APLICANDO CAMBIOS CSRF DIRECTAMENTE"
echo "====================================="

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "1. Agregando meta tag CSRF al template..."

# Verificar si ya existe el meta tag
if ! grep -q 'csrf-token' resources/views/app.blade.php; then
    # Hacer backup
    cp resources/views/app.blade.php resources/views/app.blade.php.backup
    
    # Agregar meta tag después de viewport
    sed -i '/<meta name="viewport"/a\    <meta name="csrf-token" content="{{ csrf_token() }}">' resources/views/app.blade.php
    
    echo "✅ Meta tag CSRF agregado"
else
    echo "✅ Meta tag CSRF ya existe"
fi

echo "2. Configurando withCredentials en http.js..."

# Verificar si ya existe withCredentials
if ! grep -q 'withCredentials: true' resources/js/utils/http.js; then
    # Hacer backup
    cp resources/js/utils/http.js resources/js/utils/http.js.backup
    
    # Agregar withCredentials después de timeout
    sed -i '/timeout: 30000,/a\  withCredentials: true, // Importante para cookies de sesión' resources/js/utils/http.js
    
    echo "✅ withCredentials agregado"
else
    echo "✅ withCredentials ya existe"
fi

echo "3. Agregando configuración CSRF token en http.js..."

# Verificar si ya existe la configuración del token CSRF
if ! grep -q 'csrf-token' resources/js/utils/http.js; then
    # Agregar configuración del token CSRF después de la creación del instance
    sed -i '/^})$/a\\n// Configurar token CSRF automáticamente\nconst token = document.head.querySelector('\''meta[name="csrf-token"]'\'')\nif (token) {\n  http.defaults.headers.common['\''X-CSRF-TOKEN'\''] = token.content\n}' resources/js/utils/http.js
    
    echo "✅ Configuración CSRF token agregada"
else
    echo "✅ Configuración CSRF token ya existe"
fi

echo "4. Agregando manejo de error 419..."

# Verificar si ya existe el manejo del error 419
if ! grep -q 'case 419:' resources/js/utils/http.js; then
    # Agregar manejo del error 419 después del case 403
    sed -i '/case 403:/,/break/{
        /break/a\          \n        case 419:\n          notificationStore.error('\''Sesión expirada. Recargando página...'\'')\n          // Recargar la página para obtener un nuevo token CSRF\n          setTimeout(() => {\n            window.location.reload()\n          }, 1500)\n          break
    }' resources/js/utils/http.js
    
    echo "✅ Manejo de error 419 agregado"
else
    echo "✅ Manejo de error 419 ya existe"
fi

echo "5. Verificando cambios aplicados..."

echo "Verificando app.blade.php:"
if grep -q 'csrf-token' resources/views/app.blade.php; then
    echo "✅ Meta tag CSRF: OK"
    grep 'csrf-token' resources/views/app.blade.php
else
    echo "❌ Meta tag CSRF: FALTA"
fi

echo ""
echo "Verificando http.js:"
if grep -q 'withCredentials: true' resources/js/utils/http.js; then
    echo "✅ withCredentials: OK"
else
    echo "❌ withCredentials: FALTA"
fi

if grep -q 'X-CSRF-TOKEN' resources/js/utils/http.js; then
    echo "✅ CSRF token config: OK"
else
    echo "❌ CSRF token config: FALTA"
fi

if grep -q 'case 419:' resources/js/utils/http.js; then
    echo "✅ Error 419 handling: OK"
else
    echo "❌ Error 419 handling: FALTA"
fi

echo ""
echo "6. Compilando assets con cambios..."

# Compilar assets
npm run build

echo "7. Copiando assets al directorio público..."

PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"

# Copiar assets compilados
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "✅ Assets copiados"
else
    echo "❌ No se encontraron assets compilados"
fi

echo "8. Limpiando cachés..."

# Limpiar cachés
sudo -u psacln php artisan view:clear
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear

# Cachear para producción
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan view:cache

echo ""
echo "✅ CAMBIOS CSRF APLICADOS DIRECTAMENTE"
echo "====================================="
echo ""
echo "Archivos modificados:"
echo "- resources/views/app.blade.php (meta tag CSRF)"
echo "- resources/js/utils/http.js (withCredentials + CSRF config)"
echo "- Assets recompilados y copiados"
echo ""
echo "🚀 Probar ahora:"
echo "1. Limpiar cookies del navegador"
echo "2. Ir a: https://$DOMAIN"
echo "3. Intentar login"
echo ""
echo "💡 Verificar en DevTools > Network:"
echo "- Header X-CSRF-TOKEN debe estar presente"
echo "- Cookie laravel_session debe enviarse"
