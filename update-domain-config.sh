#!/bin/bash

# Actualizar configuración para nuevo dominio: new-YOUR_DOMAIN
echo "🌐 ACTUALIZANDO CONFIGURACIÓN PARA NUEVO DOMINIO"
echo "==============================================="

OLD_DOMAIN="new.gestion.carlos-herrera-consulting"
NEW_DOMAIN="new-YOUR_DOMAIN"
PRIVATE_DIR="/var/www/vhosts/$NEW_DOMAIN/private"

echo "Dominio anterior: $OLD_DOMAIN"
echo "Dominio nuevo: $NEW_DOMAIN"
echo "Directorio: $PRIVATE_DIR"
echo ""

cd "$PRIVATE_DIR" || exit 1

echo "1. Actualizando archivo .env..."

# Actualizar APP_URL
sed -i "s|APP_URL=.*|APP_URL=https://$NEW_DOMAIN|" .env

# Actualizar SESSION_DOMAIN
sed -i "s|SESSION_DOMAIN=.*|SESSION_DOMAIN=$NEW_DOMAIN|" .env

# Actualizar FRONTEND_URL si existe
sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$NEW_DOMAIN|" .env

# Actualizar SANCTUM_STATEFUL_DOMAINS si existe
sed -i "s|SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=$NEW_DOMAIN|" .env

echo "✅ Archivo .env actualizado"

echo "2. Actualizando configuración CORS..."

# Actualizar config/cors.php si existe
if [ -f "config/cors.php" ]; then
    # Hacer backup
    cp config/cors.php config/cors.php.backup
    
    # Actualizar allowed_origins
    sed -i "s|'https://$OLD_DOMAIN'|'https://$NEW_DOMAIN'|g" config/cors.php
    sed -i "s|new\.gestion\.carlos-herrera-consulting|new-YOUR_DOMAIN|g" config/cors.php
    
    echo "✅ Configuración CORS actualizada"
else
    echo "⚠️ config/cors.php no encontrado"
fi

echo "3. Generando nueva APP_KEY para el nuevo dominio..."

# Generar nueva APP_KEY
sudo -u psacln php artisan key:generate --force

echo "✅ Nueva APP_KEY generada"

echo "4. Limpiando sesiones del dominio anterior..."

# Limpiar todas las sesiones existentes
rm -rf storage/framework/sessions/*
rm -rf storage/framework/cache/data/*

# Asegurar permisos
mkdir -p storage/framework/sessions
mkdir -p storage/framework/cache/data
chmod -R 775 storage/framework
chown -R psacln:psaserv storage/framework

echo "✅ Sesiones limpiadas"

echo "5. Aplicando cambios CSRF para el nuevo dominio..."

# Asegurar que app.blade.php tiene el meta tag CSRF
if ! grep -q 'csrf-token' resources/views/app.blade.php; then
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
    echo "✅ Meta tag CSRF agregado"
else
    echo "✅ Meta tag CSRF ya existe"
fi

# Asegurar que http.js tiene withCredentials y CSRF
if ! grep -q 'withCredentials: true' resources/js/utils/http.js; then
    # Recrear http.js completo con configuración CSRF
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
    // Refrescar token CSRF si es necesario
    const currentToken = document.head.querySelector('meta[name="csrf-token"]')
    if (currentToken && currentToken.content) {
      config.headers['X-CSRF-TOKEN'] = currentToken.content
    }
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
          notificationStore.error('Token CSRF expirado. Recargando página...')
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
    echo "✅ http.js actualizado con CSRF completo"
else
    echo "✅ http.js ya tiene configuración CSRF"
fi

echo "6. Compilando assets para el nuevo dominio..."

# Compilar assets
npm run build

echo "7. Copiando assets al directorio público..."

PUBLIC_DIR="/var/www/vhosts/$NEW_DOMAIN/httpdocs"

# Copiar assets compilados
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "✅ Assets copiados"
fi

# Copiar otros archivos necesarios
if [ -f "public/favicon.ico" ]; then
    cp public/favicon.ico "$PUBLIC_DIR/"
fi

echo "8. Limpiando y recacheando configuración..."

# Limpiar cachés
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear

# Cachear para producción
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan route:cache
sudo -u psacln php artisan view:cache

echo "9. Verificación final..."

echo ""
echo "Configuración actualizada:"
echo "APP_URL: $(grep "^APP_URL=" .env | cut -d'=' -f2)"
echo "SESSION_DOMAIN: $(grep "^SESSION_DOMAIN=" .env | cut -d'=' -f2)"
echo "APP_KEY: $(grep -q "^APP_KEY=base64:" .env && echo 'Configurada' || echo 'NO CONFIGURADA')"

echo ""
echo "Archivos verificados:"
grep -q "csrf-token" resources/views/app.blade.php && echo "✅ Meta tag CSRF: OK" || echo "❌ Meta tag CSRF: FALTA"
grep -q "withCredentials: true" resources/js/utils/http.js && echo "✅ withCredentials: OK" || echo "❌ withCredentials: FALTA"
grep -q "X-CSRF-TOKEN" resources/js/utils/http.js && echo "✅ CSRF config: OK" || echo "❌ CSRF config: FALTA"

echo ""
echo "✅ CONFIGURACIÓN ACTUALIZADA PARA NUEVO DOMINIO"
echo "==============================================="
echo ""
echo "🚀 PASOS FINALES:"
echo "1. Limpiar cookies del navegador completamente"
echo "2. Ir a: https://$NEW_DOMAIN"
echo "3. Verificar en DevTools > Network que se envía X-CSRF-TOKEN"
echo "4. Intentar login"
echo ""
echo "💡 El cambio de dominio requiere:"
echo "- Nuevas cookies de sesión"
echo "- Nuevo token CSRF"
echo "- Configuración actualizada"
echo ""
echo "¡Todo debería funcionar ahora! 🎉"
