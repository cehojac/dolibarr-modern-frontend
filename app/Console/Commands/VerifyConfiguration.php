<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;

class VerifyConfiguration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify all configuration for the session/CORS fix';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== VERIFICACIÓN DE CONFIGURACIÓN ===');
        
        // 1. Verificar CORS
        $this->checkCorsConfiguration();
        
        // 2. Verificar rutas API
        $this->checkApiRoutes();
        
        // 3. Verificar middleware
        $this->checkMiddleware();
        
        // 4. Verificar variables de entorno
        $this->checkEnvironmentVariables();
        
        // 5. Verificar archivos críticos
        $this->checkCriticalFiles();
        
        $this->info('=== VERIFICACIÓN COMPLETADA ===');
    }
    
    private function checkCorsConfiguration()
    {
        $this->info('🔍 Verificando configuración CORS...');
        
        $corsConfig = Config::get('cors');
        
        // Verificar paths
        $paths = $corsConfig['paths'] ?? [];
        if (in_array('api/*', $paths)) {
            $this->info('✅ CORS paths incluye api/*');
        } else {
            $this->error('❌ CORS paths NO incluye api/*');
        }
        
        // Verificar supports_credentials
        $supportsCredentials = $corsConfig['supports_credentials'] ?? false;
        if ($supportsCredentials) {
            $this->info('✅ CORS supports_credentials está en true');
        } else {
            $this->error('❌ CORS supports_credentials está en false');
        }
        
        // Verificar allowed_origins
        $allowedOrigins = $corsConfig['allowed_origins'] ?? [];
        $productionDomains = [
            'https://new-gestion.carlos-herrera.consulting',
            'https://gestion.carlos-herrera.consulting'
        ];
        
        $hasProductionDomains = false;
        foreach ($productionDomains as $domain) {
            if (in_array($domain, $allowedOrigins)) {
                $hasProductionDomains = true;
                break;
            }
        }
        
        if ($hasProductionDomains) {
            $this->info('✅ CORS incluye dominios de producción');
        } else {
            $this->warn('⚠️  CORS puede no incluir todos los dominios de producción');
        }
    }
    
    private function checkApiRoutes()
    {
        $this->info('🔍 Verificando rutas API...');
        
        $routes = Route::getRoutes();
        $apiRoutes = [];
        
        foreach ($routes as $route) {
            if (str_starts_with($route->uri(), 'api/')) {
                $apiRoutes[] = $route->uri();
            }
        }
        
        $requiredRoutes = [
            'api/auth/login',
            'api/auth/permissions',
            'api/auth/me',
            'api/auth/logout'
        ];
        
        foreach ($requiredRoutes as $requiredRoute) {
            if (in_array($requiredRoute, $apiRoutes)) {
                $this->info("✅ Ruta {$requiredRoute} está registrada");
            } else {
                $this->error("❌ Ruta {$requiredRoute} NO está registrada");
            }
        }
    }
    
    private function checkMiddleware()
    {
        $this->info('🔍 Verificando middleware...');
        
        // Verificar que el middleware ForceJsonResponse existe
        $middlewareFile = app_path('Http/Middleware/ForceJsonResponse.php');
        if (file_exists($middlewareFile)) {
            $this->info('✅ Middleware ForceJsonResponse existe');
        } else {
            $this->error('❌ Middleware ForceJsonResponse NO existe');
        }
        
        // Verificar CSRF middleware personalizado
        $csrfFile = app_path('Http/Middleware/VerifyCsrfToken.php');
        if (file_exists($csrfFile)) {
            $content = file_get_contents($csrfFile);
            if (str_contains($content, 'api/*')) {
                $this->info('✅ CSRF middleware excluye rutas API');
            } else {
                $this->warn('⚠️  CSRF middleware puede no excluir rutas API');
            }
        }
    }
    
    private function checkEnvironmentVariables()
    {
        $this->info('🔍 Verificando variables de entorno...');
        
        $requiredEnvVars = [
            'DOLIBARR_BASE_URL',
            'DOLIBARR_API_KEY',
            'APP_ENV',
            'APP_DEBUG'
        ];
        
        foreach ($requiredEnvVars as $envVar) {
            $value = env($envVar);
            if ($value !== null) {
                $this->info("✅ {$envVar} está configurada");
            } else {
                $this->error("❌ {$envVar} NO está configurada");
            }
        }
    }
    
    private function checkCriticalFiles()
    {
        $this->info('🔍 Verificando archivos críticos...');
        
        $criticalFiles = [
            'resources/js/utils/http.js',
            'resources/js/stores/auth.js',
            'resources/js/composables/usePermissions.js',
            'config/cors.php',
            'routes/web.php'
        ];
        
        foreach ($criticalFiles as $file) {
            $fullPath = base_path($file);
            if (file_exists($fullPath)) {
                $this->info("✅ {$file} existe");
                
                // Verificaciones específicas
                if ($file === 'resources/js/utils/http.js') {
                    $content = file_get_contents($fullPath);
                    if (str_contains($content, 'withCredentials: true')) {
                        $this->info('✅ http.js tiene withCredentials: true');
                    } else {
                        $this->error('❌ http.js NO tiene withCredentials: true');
                    }
                }
            } else {
                $this->error("❌ {$file} NO existe");
            }
        }
    }
}
