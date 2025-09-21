<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Services\CacheService;

class DoliProxyController extends Controller
{
    private CacheService $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function handle(Request $request, string $path)
    {
        $baseUrl = rtrim(config('services.dolibarr.base_url'), '/');
        $token = $request->session()->get('dolibarr_token');
        if (!$token) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Debug: verificar qué contiene baseUrl
        \Log::info('PROXY DEBUG baseUrl', [
            'baseUrl' => $baseUrl,
            'path' => $path
        ]);

        // Construir URL específica para módulos personalizados
        if (str_contains($path, 'dolibarmodernfrontendapi')) {
            // Para el módulo personalizado, usar el token del .env en lugar del token de sesión
            $token = config('services.dolibarr.api_key');
            // baseUrl ya incluye /api/index.php, solo agregar el path
            $url = $baseUrl . '/' . ltrim($path, '/');
            \Log::info('PROXY: Módulo personalizado detectado', [
                'path_original' => $path,
                'baseUrl' => $baseUrl,
                'url_construida' => $url,
                'token_usado' => $token,
                'token_length' => strlen($token ?? '')
            ]);
        } else {
            $url = $baseUrl . '/' . ltrim($path, '/');
        }
        $method = strtoupper($request->getMethod());
        $userId = $request->session()->get('dolibarr_user.login', 'anonymous');

        // Generar clave de caché
        $queryParams = $request->query->all();
        $cacheKey = $this->cacheService->generateKey($path, $queryParams, $userId);

        // Solo cachear peticiones GET que no sean de escritura
        $shouldCache = $method === 'GET' && $this->isCacheableEndpoint($path);
        
        if ($shouldCache && $this->cacheService->has($cacheKey)) {
            $cachedData = $this->cacheService->get($cacheKey);
            return response()->json($cachedData)->header('X-Cache', 'HIT');
        }

        $client = Http::withHeaders([
            'DOLAPIKEY' => $token,
            'Accept' => 'application/json',
        ])->timeout(60)->retry(3, 1000);

        // Construir URL completa con parámetros por defecto para tickets
        $queryParams = [];
        
        // Si es una solicitud de tickets, agregar parámetros por defecto
        if (str_contains($url, '/tickets')) {
            $queryParams['sortfield'] = 'datec';
            $queryParams['sortorder'] = 'DESC';
            $queryParams['limit'] = '500';
        }
        
        // Si es una solicitud de tareas, agregar parámetros por defecto
        if (str_contains($url, '/tasks')) {
            $queryParams['limit'] = '500';
        }
        
        // Combinar con parámetros existentes
        if ($request->getQueryString()) {
            parse_str($request->getQueryString(), $existingParams);
            $queryParams = array_merge($queryParams, $existingParams);
        }
        
        if (!empty($queryParams)) {
            $url .= '?' . http_build_query($queryParams);
        }

        // Preparar datos según el método HTTP
        $requestData = [];
        if ($request->isJson()) {
            $requestData = $request->json()->all();
        } elseif (!empty($request->allFiles())) {
            // Para multipart, usar attach() method
            foreach ($request->allFiles() as $key => $file) {
                $client = $client->attach($key, fopen($file->getRealPath(), 'r'), $file->getClientOriginalName());
            }
            $requestData = $request->except(array_keys($request->allFiles()));
        } else {
            $requestData = $request->all();
        }

        // Log para debug
        if (str_contains($path, 'dolibarmodernfrontendapi') || str_contains($path, 'tickets')) {
            \Log::info('PROXY DEBUG', [
                'method' => $method,
                'path_original' => $path,
                'url_final' => $url,
                'request_data' => $requestData,
                'full_token' => substr($token, 0, 10) . '...',
                'headers_sent' => [
                    'DOLAPIKEY' => substr($token, 0, 10) . '...',
                    'Accept' => 'application/json'
                ]
            ]);
        }

        // Realizar la solicitud
        try {
            switch ($method) {
                case 'GET':
                    $response = $client->get($url);
                    break;
                case 'POST':
                    $response = $client->post($url, $requestData);
                    break;
                case 'PUT':
                    $response = $client->put($url, $requestData);
                    break;
                case 'DELETE':
                    $response = $client->delete($url);
                    break;
                case 'PATCH':
                    $response = $client->patch($url, $requestData);
                    break;
                default:
                    return response()->json(['error' => 'Método HTTP no soportado'], 405);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error de conexión con Dolibarr: ' . $e->getMessage()], 500);
        }

        // Log respuesta para módulo personalizado y tickets
        if (str_contains($path, 'dolibarmodernfrontendapi') || str_contains($path, 'tickets')) {
            \Log::info('PROXY RESPONSE', [
                'path' => $path,
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body' => $response->body()
            ]);
        }

        // Procesar respuesta
        if ($response->successful()) {
            try {
                $responseData = $response->json();
                
                // Log adicional para tickets
                if (str_contains($path, 'tickets')) {
                    \Log::info('PROXY SUCCESS PROCESSING', [
                        'path' => $path,
                        'response_data_type' => gettype($responseData),
                        'response_keys' => is_array($responseData) ? array_keys($responseData) : 'not_array'
                    ]);
                }
                
                // Cachear solo respuestas exitosas GET
                if ($shouldCache && $method === 'GET') {
                    $this->cacheService->put($cacheKey, $responseData);
                }
                
                return response()->json($responseData);
            } catch (\Exception $e) {
                \Log::error('PROXY JSON DECODE ERROR', [
                    'path' => $path,
                    'error' => $e->getMessage(),
                    'response_body' => $response->body()
                ]);
                
                return response()->json([
                    'error' => 'Error procesando respuesta JSON',
                    'message' => $e->getMessage()
                ], 500);
            }
        } else {
            \Log::error('PROXY API ERROR', [
                'path' => $path,
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Error en la API de Dolibarr',
                'status' => $response->status(),
                'message' => $response->body()
            ], $response->status());
        }

        // Si es un binario (PDF, etc.), stream al cliente
        $contentType = $response->header('Content-Type');
        if ($contentType && (str_starts_with($contentType, 'application/pdf') || str_starts_with($contentType, 'application/octet-stream'))) {
            return new StreamedResponse(function () use ($response) {
                echo $response->body();
            }, $response->status(), [
                'Content-Type' => $contentType,
                'Content-Disposition' => $response->header('Content-Disposition') ?? 'inline',
            ]);
        }

        // Respuesta de error
        return response()->json($response->json() ?? ['error' => 'Error en la API'], $response->status());
    }

    /**
     * Determinar si un endpoint es cacheable
     */
    private function isCacheableEndpoint(string $path): bool
    {
        $cacheablePatterns = [
            'thirdparties',     // terceros
            'products',         // productos
            'services',         // servicios
            'documents',        // documentos (solo listados)
            'agendaevents',     // agenda
            'tickets',          // tickets (solo listados)
            'users',            // usuarios
        ];

        // No cachear endpoints de escritura o específicos
        $nonCacheablePatterns = [
            'login',
            'logout',
            'upload',
            'download',
            'delete',
        ];

        foreach ($nonCacheablePatterns as $pattern) {
            if (str_contains($path, $pattern)) {
                return false;
            }
        }

        foreach ($cacheablePatterns as $pattern) {
            if (str_starts_with($path, $pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Invalidar caché relacionado cuando se modifica data
     */
    private function invalidateCacheForPath(string $path): void
    {
        $pathMappings = [
            'thirdparties' => 'terceros',
            'products' => 'productos', 
            'services' => 'servicios',
            'documents' => 'documentos',
            'agendaevents' => 'agenda',
            'tickets' => 'tickets',
        ];

        foreach ($pathMappings as $apiPath => $module) {
            if (str_starts_with($path, $apiPath)) {
                $this->cacheService->forgetModule($module);
                break;
            }
        }
    }
}
