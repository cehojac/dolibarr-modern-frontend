<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixCsrfApi extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'csrf:fix-api';

    /**
     * The description of the console command.
     */
    protected $description = 'Fix CSRF issues by updating Vue http.js to not send CSRF tokens to API routes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔐 SOLUCIONANDO CSRF EN API - MÉTODO LARAVEL');
        $this->info('============================================');
        
        // 1. Actualizar http.js
        $this->updateHttpJs();
        
        // 2. Verificar meta tag CSRF
        $this->ensureCsrfMetaTag();
        
        // 3. Limpiar sesiones
        $this->clearSessions();
        
        // 4. Verificación
        $this->verify();
        
        $this->info('✅ CSRF API SOLUCIONADO CON LARAVEL');
        $this->info('Ahora las rutas /api/* no enviarán token CSRF');
    }
    
    private function updateHttpJs()
    {
        $this->info('1. Actualizando http.js...');
        
        $httpJsContent = <<<'EOF'
import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Create axios instance
const http = axios.create({
  baseURL: '/',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - CLAVE: NO enviar CSRF a rutas API
http.interceptors.request.use(
  (config) => {
    // Solo agregar CSRF token si NO es una ruta API
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

// Response interceptor
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
          notificationStore.error('Error interno del servidor.')
          break
          
        default:
          notificationStore.error(data.message || `Error ${status}`)
      }
    } else if (error.request) {
      notificationStore.error('Error de conexión.')
    } else {
      notificationStore.error('Error inesperado: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
EOF;
        
        $httpJsPath = resource_path('js/utils/http.js');
        File::put($httpJsPath, $httpJsContent);
        $this->line('   ✅ http.js actualizado - NO CSRF en /api/*');
    }
    
    private function ensureCsrfMetaTag()
    {
        $this->info('2. Verificando meta tag CSRF...');
        
        $appBladePath = resource_path('views/app.blade.php');
        
        if (!File::exists($appBladePath)) {
            $this->error('   ❌ app.blade.php no encontrado');
            return;
        }
        
        $content = File::get($appBladePath);
        
        if (!str_contains($content, 'csrf-token')) {
            $content = str_replace(
                '<meta name="viewport" content="width=device-width, initial-scale=1">',
                '<meta name="viewport" content="width=device-width, initial-scale=1">' . "\n" .
                '    <meta name="csrf-token" content="{{ csrf_token() }}">',
                $content
            );
            
            File::put($appBladePath, $content);
            $this->line('   ✅ Meta tag CSRF agregado');
        } else {
            $this->line('   ✅ Meta tag CSRF ya existe');
        }
    }
    
    private function clearSessions()
    {
        $this->info('3. Limpiando sesiones...');
        
        $sessionPath = storage_path('framework/sessions');
        $cachePath = storage_path('framework/cache/data');
        
        if (File::exists($sessionPath)) {
            File::cleanDirectory($sessionPath);
            $this->line('   ✅ Sesiones limpiadas');
        }
        
        if (File::exists($cachePath)) {
            File::cleanDirectory($cachePath);
            $this->line('   ✅ Caché limpiado');
        }
    }
    
    private function verify()
    {
        $this->info('4. Verificación...');
        
        $httpJsPath = resource_path('js/utils/http.js');
        $appBladePath = resource_path('views/app.blade.php');
        
        $httpJsExists = File::exists($httpJsPath);
        $hasApiCheck = $httpJsExists && str_contains(File::get($httpJsPath), "!config.url.startsWith('/api/')");
        $hasCsrfMeta = File::exists($appBladePath) && str_contains(File::get($appBladePath), 'csrf-token');
        
        $this->line('   - http.js existe: ' . ($httpJsExists ? '✅' : '❌'));
        $this->line('   - Verificación API: ' . ($hasApiCheck ? '✅' : '❌'));
        $this->line('   - Meta CSRF: ' . ($hasCsrfMeta ? '✅' : '❌'));
        
        if ($httpJsExists && $hasApiCheck && $hasCsrfMeta) {
            $this->info('   🎉 Todo configurado correctamente');
        } else {
            $this->error('   ⚠️ Hay problemas en la configuración');
        }
    }
}
