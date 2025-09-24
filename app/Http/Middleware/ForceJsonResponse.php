<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forzar que las rutas API siempre devuelvan JSON
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
            $request->headers->set('Content-Type', 'application/json');
        }

        $response = $next($request);

        // Si es una ruta API, asegurar que la respuesta sea JSON
        if ($request->is('api/*')) {
            // Si la respuesta es HTML (indica que cayó en el fallback de la SPA)
            $contentType = $response->headers->get('Content-Type', '');
            $content = $response->getContent();
            
            if (str_contains($contentType, 'text/html') || 
                (is_string($content) && str_contains($content, '<!DOCTYPE html>'))) {
                
                // Log del problema para debugging
                \Log::warning('ForceJsonResponse: Detectada respuesta HTML en ruta API', [
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'content_type' => $contentType,
                    'content_preview' => is_string($content) ? substr($content, 0, 200) : 'N/A'
                ]);
                
                // Devolver error JSON en lugar de HTML
                return response()->json([
                    'error' => 'Ruta API no encontrada',
                    'message' => 'La ruta solicitada no existe o no está configurada correctamente',
                    'url' => $request->fullUrl(),
                    'method' => $request->method()
                ], 404);
            }
            
            // Asegurar que el Content-Type sea JSON
            if (!str_contains($contentType, 'application/json')) {
                $response->headers->set('Content-Type', 'application/json');
            }
        }

        return $response;
    }
}
