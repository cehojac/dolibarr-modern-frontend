#!/bin/bash

# Aplicación manual de cambios CSRF - método directo
echo "🔧 APLICACIÓN MANUAL DE CAMBIOS CSRF"
echo "===================================="

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "1. Creando nuevo app.blade.php con meta tag CSRF..."

cat > resources/views/app.blade.php << 'EOF'
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dolibarr Front</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
  </head>
  <body class="h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
    <div id="app"></div>
  </body>
</html>
EOF

echo "✅ app.blade.php actualizado con meta tag CSRF"

echo "2. Creando nuevo http.js con configuración CSRF..."

cat > resources/js/utils/http.js << 'EOF'
import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Create axios instance
const http = axios.create({
  baseURL: '/',
  timeout: 30000,
  withCredentials: true, // Importante para cookies de sesión
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Configurar token CSRF automáticamente
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
  http.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Add any global request modifications here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
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
          notificationStore.error('Sesión expirada. Recargando página...')
          // Recargar la página para obtener un nuevo token CSRF
          setTimeout(() => {
            window.location.reload()
          }, 1500)
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
          
        case 429:
          notificationStore.error('Demasiadas solicitudes. Por favor, espera un momento.')
          break
          
        case 500:
          notificationStore.error('Error interno del servidor. Por favor, contacta al administrador.')
          break
          
        default:
          notificationStore.error(data.message || `Error ${status}: ${error.message}`)
      }
    } else if (error.request) {
      notificationStore.error('Error de conexión. Verifica tu conexión a internet.')
    } else {
      notificationStore.error('Error inesperado: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
EOF

echo "✅ http.js actualizado con configuración CSRF completa"

echo "3. Compilando assets..."

npm run build

echo "4. Copiando assets..."

PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "✅ Assets copiados"
fi

echo "5. Limpiando cachés..."

sudo -u psacln php artisan view:clear
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan view:cache

echo "6. Verificación final..."

echo "Meta tag CSRF en template:"
grep -n "csrf-token" resources/views/app.blade.php || echo "❌ No encontrado"

echo ""
echo "withCredentials en http.js:"
grep -n "withCredentials" resources/js/utils/http.js || echo "❌ No encontrado"

echo ""
echo "X-CSRF-TOKEN config en http.js:"
grep -n "X-CSRF-TOKEN" resources/js/utils/http.js || echo "❌ No encontrado"

echo ""
echo "✅ CAMBIOS CSRF APLICADOS MANUALMENTE"
echo "===================================="
echo ""
echo "🚀 PROBAR AHORA:"
echo "1. Limpiar cookies del navegador (F12 > Application > Clear Storage)"
echo "2. Ir a: https://$DOMAIN"
echo "3. Abrir DevTools > Network"
echo "4. Intentar login"
echo "5. Verificar que aparece header 'X-CSRF-TOKEN' en las requests"
echo ""
echo "Si funciona, el error 419 debería desaparecer ✅"
