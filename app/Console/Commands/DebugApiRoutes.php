<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

class DebugApiRoutes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:api-routes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug API routes configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== DEBUG: API Routes Configuration ===');
        
        // Obtener todas las rutas
        $routes = Route::getRoutes();
        
        $apiRoutes = [];
        foreach ($routes as $route) {
            $uri = $route->uri();
            if (str_starts_with($uri, 'api/')) {
                $apiRoutes[] = [
                    'method' => implode('|', $route->methods()),
                    'uri' => $uri,
                    'name' => $route->getName(),
                    'action' => $route->getActionName(),
                    'middleware' => implode(', ', $route->middleware())
                ];
            }
        }
        
        if (empty($apiRoutes)) {
            $this->error('No se encontraron rutas API');
            return;
        }
        
        $this->table(
            ['Method', 'URI', 'Name', 'Action', 'Middleware'],
            $apiRoutes
        );
        
        $this->info('Total rutas API encontradas: ' . count($apiRoutes));
        
        // Verificar middleware específico
        $this->info('=== Verificando middleware ForceJsonResponse ===');
        
        $forceJsonRoutes = array_filter($apiRoutes, function($route) {
            return str_contains($route['middleware'], 'force.json') || 
                   str_contains($route['middleware'], 'ForceJsonResponse');
        });
        
        $this->info('Rutas con middleware ForceJsonResponse: ' . count($forceJsonRoutes));
        
        if (count($forceJsonRoutes) > 0) {
            $this->info('✅ Middleware ForceJsonResponse está aplicado correctamente');
        } else {
            $this->warn('⚠️  Middleware ForceJsonResponse no está aplicado a ninguna ruta');
        }
    }
}
