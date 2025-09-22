<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

class FixPleskProduction extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'plesk:fix-production {--domain=new-gestion.carlos-herrera.consulting}';

    /**
     * The description of the console command.
     */
    protected $description = 'Fix CSRF and session issues for Plesk production environment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $domain = $this->option('domain');
        
        $this->info('🏭 SOLUCIONANDO DIFERENCIAS LOCALHOST vs PLESK');
        $this->info('==============================================');
        
        // 1. Verificar entorno actual
        $this->checkCurrentEnvironment();
        
        // 2. Configurar variables de entorno para Plesk
        $this->configureEnvironmentForPlesk($domain);
        
        // 3. Actualizar http.js para Plesk
        $this->updateHttpJsForPlesk();
        
        // 4. Asegurar meta tag CSRF
        $this->ensureCsrfMetaTag();
        
        // 5. Limpiar y optimizar cachés
        $this->optimizeCaches();
        
        // 6. Compilar assets
        $this->compileAssets($domain);
        
        // 7. Verificación final
        $this->finalVerification();
        
        $this->info('✅ CONFIGURACIÓN PLESK COMPLETADA');
        $this->info('¡Ahora debería funcionar igual que en localhost! 🎉');
    }
    
    private function checkCurrentEnvironment()
    {
        $this->info('1. Verificando configuración actual...');
        
        $appEnv = config('app.env');
        $appDebug = config('app.debug') ? 'true' : 'false';
        $appUrl = config('app.url');
        
        $this->line("   - APP_ENV: {$appEnv}");
        $this->line("   - APP_DEBUG: {$appDebug}");
        $this->line("   - APP_URL: {$appUrl}");
    }
    
    private function configureEnvironmentForPlesk($domain)
    {
        $this->info('2. Configurando variables para Plesk...');
        
        $envPath = base_path('.env');
        $envContent = File::get($envPath);
        
        // Actualizar configuraciones clave
        $updates = [
            'APP_ENV' => 'production',
            'APP_DEBUG' => 'false',
            'APP_URL' => "https://{$domain}",
            'SESSION_DOMAIN' => $domain,
            'SESSION_DRIVER' => 'file',
            'SESSION_LIFETIME' => '240',
            'SESSION_SECURE_COOKIE' => 'true',
            'SESSION_HTTP_ONLY' => 'true',
            'SESSION_SAME_SITE' => 'lax',
            'CACHE_STORE' => 'file',
        ];
        
        foreach ($updates as $key => $value) {
            if (preg_match("/^{$key}=.*/m", $envContent)) {
                $envContent = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $envContent);
            } else {
                $envContent .= "\n{$key}={$value}";
            }
        }
        
        File::put($envPath, $envContent);
        $this->line('   ✅ Variables de entorno actualizadas');
    }
    
    private function updateHttpJsForPlesk()
    {
        $this->info('3. Actualizando http.js para Plesk...');
        
        $httpJsContent = <<<'EOF'
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
          notificationStore.error('Servidor temporalmente no disponible.')
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
EOF;
        
        $httpJsPath = resource_path('js/utils/http.js');
        File::put($httpJsPath, $httpJsContent);
        $this->line('   ✅ http.js optimizado para Plesk');
    }
    
    private function ensureCsrfMetaTag()
    {
        $this->info('4. Verificando meta tag CSRF...');
        
        $appBladePath = resource_path('views/app.blade.php');
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
    
    private function optimizeCaches()
    {
        $this->info('5. Optimizando cachés para Plesk...');
        
        // Limpiar sesiones existentes
        $sessionPath = storage_path('framework/sessions');
        $cachePath = storage_path('framework/cache/data');
        
        if (File::exists($sessionPath)) {
            File::cleanDirectory($sessionPath);
        }
        
        if (File::exists($cachePath)) {
            File::cleanDirectory($cachePath);
        }
        
        // Limpiar cachés de Laravel
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        
        // Cachear para producción
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:cache');
        
        $this->line('   ✅ Cachés optimizados');
    }
    
    private function compileAssets($domain)
    {
        $this->info('6. Compilando assets...');
        
        // Ejecutar npm run build
        $buildProcess = proc_open(
            'npm run build',
            [
                0 => ['pipe', 'r'],
                1 => ['pipe', 'w'],
                2 => ['pipe', 'w']
            ],
            $pipes,
            base_path()
        );
        
        if (is_resource($buildProcess)) {
            fclose($pipes[0]);
            $output = stream_get_contents($pipes[1]);
            $error = stream_get_contents($pipes[2]);
            fclose($pipes[1]);
            fclose($pipes[2]);
            
            $returnCode = proc_close($buildProcess);
            
            if ($returnCode === 0) {
                $this->line('   ✅ Assets compilados exitosamente');
                
                // Copiar assets si estamos en Plesk
                $publicDir = "/var/www/vhosts/{$domain}/httpdocs";
                $buildDir = public_path('build');
                
                if (File::exists($buildDir) && File::exists($publicDir)) {
                    File::copyDirectory($buildDir, $publicDir . '/build');
                    $this->line('   ✅ Assets copiados a Plesk');
                }
            } else {
                $this->error('   ❌ Error compilando assets: ' . $error);
            }
        }
    }
    
    private function finalVerification()
    {
        $this->info('7. Verificación final...');
        
        $checks = [
            'APP_ENV' => config('app.env'),
            'APP_URL' => config('app.url'),
            'SESSION_DOMAIN' => config('session.domain'),
            'SESSION_DRIVER' => config('session.driver'),
        ];
        
        foreach ($checks as $key => $value) {
            $this->line("   - {$key}: {$value}");
        }
        
        // Verificar archivos críticos
        $httpJsExists = File::exists(resource_path('js/utils/http.js'));
        $csrfMetaExists = str_contains(
            File::get(resource_path('views/app.blade.php')), 
            'csrf-token'
        );
        
        $this->line('   - http.js: ' . ($httpJsExists ? '✅ OK' : '❌ FALTA'));
        $this->line('   - Meta CSRF: ' . ($csrfMetaExists ? '✅ OK' : '❌ FALTA'));
    }
}