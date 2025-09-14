<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CacheService;

class CacheController extends Controller
{
    private CacheService $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Obtener estadísticas del caché
     */
    public function stats()
    {
        return response()->json([
            'stats' => $this->cacheService->getStats(),
            'status' => 'active'
        ]);
    }

    /**
     * Limpiar caché de un módulo específico
     */
    public function clearModule(Request $request)
    {
        $request->validate([
            'module' => 'required|string|in:terceros,productos,servicios,documentos,agenda,tickets,user'
        ]);

        $module = $request->input('module');
        $cleared = $this->cacheService->forgetModule($module);

        return response()->json([
            'message' => $cleared ? "Caché del módulo {$module} limpiado" : "Error al limpiar caché",
            'success' => $cleared
        ]);
    }

    /**
     * Limpiar todo el caché de Dolibarr
     */
    public function flush()
    {
        $flushed = $this->cacheService->flush();

        return response()->json([
            'message' => $flushed ? 'Todo el caché ha sido limpiado' : 'Error al limpiar caché',
            'success' => $flushed
        ]);
    }

    /**
     * Verificar si una clave específica existe
     */
    public function check(Request $request)
    {
        $request->validate([
            'key' => 'required|string'
        ]);

        $key = $request->input('key');
        $exists = $this->cacheService->has($key);

        return response()->json([
            'key' => $key,
            'exists' => $exists,
            'data' => $exists ? $this->cacheService->get($key) : null
        ]);
    }
}
