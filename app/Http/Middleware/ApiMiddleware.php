<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forzar headers JSON para rutas API
        $request->headers->set('Accept', 'application/json');
        $request->headers->set('Content-Type', 'application/json');
        
        // Iniciar sesión si no existe (sin redirecciones)
        if (!$request->hasSession()) {
            $request->setLaravelSession(app('session.store'));
        }
        
        $response = $next($request);
        
        // Asegurar que la respuesta sea JSON
        if (!$response->headers->has('Content-Type') || 
            !str_contains($response->headers->get('Content-Type'), 'application/json')) {
            $response->headers->set('Content-Type', 'application/json');
        }
        
        // Agregar headers CORS si es necesario
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
}
