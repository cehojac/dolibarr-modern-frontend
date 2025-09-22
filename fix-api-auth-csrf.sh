#!/bin/bash

# Solución específica para error 419 en /api/auth/login
echo "🔐 SOLUCIONANDO ERROR 419 EN API AUTH"
echo "===================================="

DOMAIN="new-gestion.carlos-herrera.consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

echo "1. Verificando middleware CSRF para rutas API..."

# Verificar si existe el middleware VerifyCsrfToken
if [ -f "app/Http/Middleware/VerifyCsrfToken.php" ]; then
    echo "✅ VerifyCsrfToken middleware encontrado"
    
    # Hacer backup
    cp app/Http/Middleware/VerifyCsrfToken.php app/Http/Middleware/VerifyCsrfToken.php.backup
    
    # Actualizar middleware para excluir rutas de API auth
    cat > app/Http/Middleware/VerifyCsrfToken.php << 'EOF'
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        '/api/*',
        'api/auth/*',
        '/api/auth/*',
        'api/auth/login',
        '/api/auth/login',
        'api/auth/logout',
        '/api/auth/logout',
        'api/doli/*',
        '/api/doli/*',
    ];
}
EOF
    
    echo "✅ VerifyCsrfToken actualizado para excluir rutas API"
else
    echo "❌ VerifyCsrfToken middleware no encontrado"
fi

echo "2. Verificando configuración de rutas API..."

# Verificar routes/api.php
if [ -f "routes/api.php" ]; then
    echo "✅ routes/api.php encontrado"
    
    # Verificar que las rutas de auth estén configuradas correctamente
    if grep -q "auth" routes/api.php; then
        echo "✅ Rutas de auth encontradas en api.php"
    else
        echo "⚠️ Agregando rutas de auth a api.php"
        
        # Agregar rutas de auth si no existen
        cat >> routes/api.php << 'EOF'

// Rutas de autenticación
Route::post('/auth/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/auth/logout', [App\Http\Controllers\AuthController::class, 'logout']);
Route::get('/auth/me', [App\Http\Controllers\AuthController::class, 'me']);
EOF
    fi
else
    echo "❌ routes/api.php no encontrado"
fi

echo "3. Verificando configuración de Sanctum..."

# Verificar si Sanctum está configurado
if [ -f "config/sanctum.php" ]; then
    echo "✅ Sanctum configurado"
    
    # Verificar stateful domains
    if grep -q "stateful" config/sanctum.php; then
        # Actualizar dominios stateful
        sed -i "s|'localhost'|'localhost','$DOMAIN'|g" config/sanctum.php
        echo "✅ Dominios stateful actualizados"
    fi
else
    echo "⚠️ Sanctum no configurado"
fi

echo "4. Actualizando configuración CORS para API..."

# Actualizar CORS para incluir rutas de auth
if [ -f "config/cors.php" ]; then
    # Hacer backup
    cp config/cors.php config/cors.php.backup
    
    # Actualizar paths para incluir auth
    sed -i "s|'paths' => \['api/\*'\]|'paths' => ['api/*', 'sanctum/csrf-cookie', 'api/auth/*']|g" config/cors.php
    
    echo "✅ CORS actualizado para rutas de auth"
fi

echo "5. Creando endpoint para obtener token CSRF..."

# Crear ruta para obtener token CSRF
cat >> routes/web.php << 'EOF'

// Endpoint para obtener token CSRF
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
EOF

echo "✅ Endpoint CSRF creado"

echo "6. Actualizando frontend para obtener token CSRF antes del login..."

# Actualizar http.js para obtener token CSRF antes de requests
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

// Función para obtener token CSRF
const getCsrfToken = async () => {
  try {
    // Intentar obtener del meta tag primero
    const metaToken = document.head.querySelector('meta[name="csrf-token"]')
    if (metaToken && metaToken.content) {
      return metaToken.content
    }
    
    // Si no existe, obtener del endpoint
    const response = await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
    if (response.data && response.data.csrf_token) {
      return response.data.csrf_token
    }
    
    return null
  } catch (error) {
    console.warn('No se pudo obtener token CSRF:', error)
    return null
  }
}

// Request interceptor
http.interceptors.request.use(
  async (config) => {
    // Para rutas de API que no sean auth, no enviar CSRF token
    if (config.url && config.url.startsWith('/api/') && !config.url.includes('/auth/')) {
      return config
    }
    
    // Para rutas de auth y web, obtener y enviar token CSRF
    const token = await getCsrfToken()
    if (token) {
      config.headers['X-CSRF-TOKEN'] = token
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
  async (error) => {
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
          notificationStore.error('Token CSRF expirado. Reintentando...')
          
          // Intentar obtener nuevo token y reintentar la request
          try {
            const newToken = await getCsrfToken()
            if (newToken && error.config) {
              error.config.headers['X-CSRF-TOKEN'] = newToken
              return http.request(error.config)
            }
          } catch (retryError) {
            console.error('Error al reintentar con nuevo token:', retryError)
          }
          
          // Si falla, recargar página
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

echo "✅ http.js actualizado con manejo inteligente de CSRF"

echo "7. Compilando assets..."

npm run build

echo "8. Copiando assets..."

PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"
if [ -d "public/build" ]; then
    cp -r public/build "$PUBLIC_DIR/"
    echo "✅ Assets copiados"
fi

echo "9. Limpiando cachés..."

sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear

# Cachear configuración
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan route:cache

echo "10. Verificación final..."

echo ""
echo "Middleware CSRF:"
if [ -f "app/Http/Middleware/VerifyCsrfToken.php" ]; then
    echo "✅ VerifyCsrfToken existe"
    if grep -q "api/auth" app/Http/Middleware/VerifyCsrfToken.php; then
        echo "✅ Rutas API excluidas del CSRF"
    else
        echo "❌ Rutas API NO excluidas del CSRF"
    fi
else
    echo "❌ VerifyCsrfToken no encontrado"
fi

echo ""
echo "Rutas API:"
if [ -f "routes/api.php" ]; then
    echo "✅ routes/api.php existe"
    if grep -q "auth/login" routes/api.php; then
        echo "✅ Ruta auth/login configurada"
    else
        echo "❌ Ruta auth/login NO configurada"
    fi
else
    echo "❌ routes/api.php no encontrado"
fi

echo ""
echo "✅ CONFIGURACIÓN API AUTH COMPLETADA"
echo "===================================="
echo ""
echo "🚀 PROBAR AHORA:"
echo "1. Limpiar cookies del navegador completamente"
echo "2. Ir a: https://$DOMAIN"
echo "3. Abrir DevTools > Network"
echo "4. Intentar login"
echo "5. Verificar que NO aparece error 419"
echo ""
echo "💡 Cambios aplicados:"
echo "- Rutas API excluidas del middleware CSRF"
echo "- Manejo inteligente de tokens CSRF en frontend"
echo "- Endpoint para obtener token CSRF"
echo "- Reintentos automáticos en caso de error 419"
echo ""
echo "¡El error 419 en /api/auth/login debería estar resuelto! ✅"
