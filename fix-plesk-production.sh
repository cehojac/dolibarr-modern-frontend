#!/bin/bash

# Solución específica para Plesk - diferencias entre localhost y producción
echo "🏭 SOLUCIONANDO DIFERENCIAS LOCALHOST vs PLESK"
echo "=============================================="

DOMAIN="new-YOUR_DOMAIN"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "Diferencias detectadas entre localhost y Plesk:"
echo "- Localhost: Funciona perfectamente ✅"
echo "- Plesk: Error 419 CSRF ❌"
echo ""

echo "1. Verificando configuración específica de Plesk..."

# Verificar si estamos en producción
echo "APP_ENV actual: $(grep "^APP_ENV=" .env | cut -d'=' -f2)"
echo "APP_DEBUG actual: $(grep "^APP_DEBUG=" .env | cut -d'=' -f2)"

echo ""
echo "2. Configurando variables específicas para Plesk..."

# Asegurar configuración de producción
sed -i 's/^APP_ENV=.*/APP_ENV=production/' .env
sed -i 's/^APP_DEBUG=.*/APP_DEBUG=false/' .env

# Configurar APP_URL específico para Plesk
sed -i "s|^APP_URL=.*|APP_URL=https://$DOMAIN|" .env

# Configurar SESSION_DOMAIN específico
sed -i "s|^SESSION_DOMAIN=.*|SESSION_DOMAIN=$DOMAIN|" .env

echo "✅ Variables de entorno configuradas para Plesk"

echo ""
echo "3. Configurando sesiones específicas para Plesk..."

# Configuración específica de sesiones para Plesk
if ! grep -q "^SESSION_COOKIE=" .env; then
    echo "SESSION_COOKIE=laravel_session" >> .env
fi

# Configurar lifetime más largo para Plesk
sed -i 's/^SESSION_LIFETIME=.*/SESSION_LIFETIME=240/' .env

# Asegurar cookies seguras en HTTPS
sed -i 's/^SESSION_SECURE_COOKIE=.*/SESSION_SECURE_COOKIE=true/' .env
sed -i 's/^SESSION_HTTP_ONLY=.*/SESSION_HTTP_ONLY=true/' .env
sed -i 's/^SESSION_SAME_SITE=.*/SESSION_SAME_SITE=lax/' .env

echo "✅ Sesiones configuradas para Plesk"

echo ""
echo "4. Creando configuración PHP específica para Plesk..."

# Crear archivo php.ini específico para el dominio en Plesk
sudo tee "/var/www/vhosts/$DOMAIN/etc/php.ini" > /dev/null << 'EOF'
; Configuración PHP específica para Plesk
session.cookie_secure = On
session.cookie_httponly = On
session.cookie_samesite = "Lax"
session.gc_maxlifetime = 14400
session.cookie_lifetime = 14400

; Configuraciones de red para Plesk
default_socket_timeout = 120
max_execution_time = 300
memory_limit = 512M

; Configuraciones específicas para HTTPS en Plesk
auto_detect_line_endings = On
allow_url_fopen = On
user_agent = "Laravel-Plesk-Client/1.0"
EOF

echo "✅ Configuración PHP específica creada"

echo ""
echo "5. Actualizando http.js para Plesk (sin CSRF en API)..."

# Crear http.js optimizado para Plesk
cat > resources/js/utils/http.js << 'EOF'
import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Create axios instance optimizado para Plesk
const http = axios.create({
  baseURL: '/',
  timeout: 60000, // Timeout más largo para Plesk
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Importante para Plesk
  }
})

// Request interceptor - NO enviar CSRF a rutas API
http.interceptors.request.use(
  (config) => {
    // Solo agregar CSRF token a rutas que NO sean API
    if (!config.url || !config.url.startsWith('/api/')) {
      const token = document.head.querySelector('meta[name="csrf-token"]')
      if (token && token.content) {
        config.headers['X-CSRF-TOKEN'] = token.content
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor optimizado para Plesk
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          notificationStore.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
          authStore.logout()
          router.push('/login')
          break
          
        case 403:
          notificationStore.error('No tienes permisos para realizar esta acción.')
          break
          
        case 419:
          // En Plesk, recargar inmediatamente
          notificationStore.error('Error de sesión en Plesk. Recargando...')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          break
          
        case 404:
          notificationStore.error('El recurso solicitado no fue encontrado.')
          break
          
        case 422:
          if (data.errors) {
            Object.values(data.errors).flat().forEach(error => {
              notificationStore.error(error)
            })
          } else {
            notificationStore.error(data.message || 'Datos inválidos.')
          }
          break
          
        case 500:
          notificationStore.error('Error interno del servidor.')
          break
          
        case 502:
        case 503:
        case 504:
          notificationStore.error('Servidor temporalmente no disponible. Reintentando...')
          break
          
        default:
          notificationStore.error(data.message || `Error ${status}`)
      }
    } else if (error.request) {
      notificationStore.error('Error de conexión con el servidor.')
    } else {
      notificationStore.error('Error inesperado: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
EOF

echo "✅ http.js optimizado para Plesk creado"

echo ""
echo "6. Asegurando meta tag CSRF en template..."

# Verificar y agregar meta tag si no existe
if ! grep -q 'csrf-token' resources/views/app.blade.php; then
    sed -i '/<meta name="viewport"/a\    <meta name="csrf-token" content="{{ csrf_token() }}">' resources/views/app.blade.php
    echo "✅ Meta tag CSRF agregado"
else
    echo "✅ Meta tag CSRF ya existe"
fi

echo ""
echo "7. Configurando permisos específicos para Plesk..."

# Permisos específicos para Plesk
chmod -R 775 storage/
chown -R psacln:psaserv storage/
chmod -R 775 bootstrap/cache/
chown -R psacln:psaserv bootstrap/cache/

# Limpiar sesiones existentes
rm -rf storage/framework/sessions/*
rm -rf storage/framework/cache/data/*

echo "✅ Permisos configurados para Plesk"

echo ""
echo "8. Compilando assets para producción..."

# Compilar assets
npm run build

# Copiar al directorio público de Plesk
PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "✅ Assets copiados a Plesk"
fi

echo ""
echo "9. Optimizando cachés para Plesk..."

# Limpiar cachés
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear

# Cachear para producción en Plesk
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan route:cache
sudo -u psacln php artisan view:cache

echo "✅ Cachés optimizados para Plesk"

echo ""
echo "10. Reiniciando servicios PHP en Plesk..."

# Detectar versión PHP y reiniciar
PHP_VERSION=$(php -v | head -n1 | cut -d" " -f2 | cut -d"." -f1,2)
if systemctl is-active --quiet "php${PHP_VERSION}-fpm"; then
    systemctl restart "php${PHP_VERSION}-fpm"
    echo "✅ PHP-FPM reiniciado"
fi

echo ""
echo "11. Verificación final..."

echo "Configuración Plesk vs Localhost:"
echo "================================="
echo "APP_ENV: $(grep "^APP_ENV=" .env | cut -d'=' -f2)"
echo "APP_URL: $(grep "^APP_URL=" .env | cut -d'=' -f2)"
echo "SESSION_DOMAIN: $(grep "^SESSION_DOMAIN=" .env | cut -d'=' -f2)"
echo "SESSION_DRIVER: $(grep "^SESSION_DRIVER=" .env | cut -d'=' -f2)"

echo ""
echo "Archivos críticos:"
grep -q "csrf-token" resources/views/app.blade.php && echo "✅ Meta CSRF: OK" || echo "❌ Meta CSRF: FALTA"
grep -q "X-Requested-With" resources/js/utils/http.js && echo "✅ Headers Plesk: OK" || echo "❌ Headers Plesk: FALTA"
[ -f "/var/www/vhosts/$DOMAIN/etc/php.ini" ] && echo "✅ PHP config: OK" || echo "❌ PHP config: FALTA"

echo ""
echo "✅ CONFIGURACIÓN PLESK COMPLETADA"
echo "================================="
echo ""
echo "🎯 DIFERENCIAS CLAVE APLICADAS:"
echo "- Timeout extendido para Plesk (60s vs 30s localhost)"
echo "- Headers específicos (X-Requested-With)"
echo "- Configuración PHP personalizada"
echo "- Sesiones optimizadas para HTTPS"
echo "- NO CSRF en rutas /api/*"
echo "- Permisos específicos Plesk"
echo ""
echo "🚀 PROBAR AHORA:"
echo "1. Limpiar cookies del navegador"
echo "2. Ir a: https://$DOMAIN"
echo "3. Verificar que NO hay error 419"
echo ""
echo "💡 La diferencia principal:"
echo "- Localhost: Entorno permisivo"
echo "- Plesk: Entorno restrictivo que necesita configuración específica"
echo ""
echo "¡Ahora debería funcionar igual que en localhost! 🎉"
