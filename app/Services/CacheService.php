<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    private const DEFAULT_TTL = 300; // 5 minutos
    private const CACHE_PREFIX = 'dolibarr_';
    
    private array $ttlConfig = [
        'terceros' => 600,      // 10 minutos - datos que cambian poco
        'productos' => 900,     // 15 minutos - catálogo relativamente estable
        'servicios' => 900,     // 15 minutos
        'documentos' => 180,    // 3 minutos - pueden cambiar más frecuentemente
        'agenda' => 120,        // 2 minutos - eventos pueden cambiar rápido
        'tickets' => 60,        // 1 minuto - tickets cambian frecuentemente
        'user' => 1800,         // 30 minutos - info de usuario
    ];

    /**
     * Obtener datos del caché o ejecutar callback si no existe
     */
    public function remember(string $key, callable $callback, ?int $ttl = null): mixed
    {
        $cacheKey = $this->getCacheKey($key);
        $ttl = $ttl ?? $this->getTtlForKey($key);
        
        try {
            return Cache::remember($cacheKey, $ttl, function () use ($callback, $key) {
                Log::info("Cache miss for key: {$key}");
                return $callback();
            });
        } catch (\Exception $e) {
            Log::error("Cache error for key {$key}: " . $e->getMessage());
            // Si falla el caché, ejecutar directamente el callback
            return $callback();
        }
    }

    /**
     * Almacenar datos en caché
     */
    public function put(string $key, mixed $value, ?int $ttl = null): bool
    {
        $cacheKey = $this->getCacheKey($key);
        $ttl = $ttl ?? $this->getTtlForKey($key);
        
        try {
            return Cache::put($cacheKey, $value, $ttl);
        } catch (\Exception $e) {
            Log::error("Failed to cache key {$key}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener datos del caché
     */
    public function get(string $key, mixed $default = null): mixed
    {
        $cacheKey = $this->getCacheKey($key);
        
        try {
            return Cache::get($cacheKey, $default);
        } catch (\Exception $e) {
            Log::error("Failed to get cache key {$key}: " . $e->getMessage());
            return $default;
        }
    }

    /**
     * Eliminar una clave específica del caché
     */
    public function forget(string $key): bool
    {
        $cacheKey = $this->getCacheKey($key);
        
        try {
            return Cache::forget($cacheKey);
        } catch (\Exception $e) {
            Log::error("Failed to forget cache key {$key}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Limpiar caché por patrón (ej: todos los terceros)
     */
    public function forgetByPattern(string $pattern): int
    {
        $pattern = $this->getCacheKey($pattern);
        $deleted = 0;
        
        try {
            // Para Redis
            if (Cache::getStore() instanceof \Illuminate\Cache\RedisStore) {
                $keys = Cache::getStore()->getRedis()->keys($pattern . '*');
                foreach ($keys as $key) {
                    Cache::forget(str_replace(Cache::getStore()->getPrefix(), '', $key));
                    $deleted++;
                }
            } else {
                // Para otros drivers, limpiar todo el caché relacionado
                $this->forgetModule($this->getModuleFromPattern($pattern));
                $deleted = 1;
            }
        } catch (\Exception $e) {
            Log::error("Failed to forget pattern {$pattern}: " . $e->getMessage());
        }
        
        return $deleted;
    }

    /**
     * Limpiar caché de un módulo completo
     */
    public function forgetModule(string $module): bool
    {
        $modules = ['terceros', 'productos', 'servicios', 'documentos', 'agenda', 'tickets'];
        
        if (!in_array($module, $modules)) {
            return false;
        }
        
        try {
            $patterns = [
                $module,
                $module . '_list',
                $module . '_detail_*',
                $module . '_search_*',
            ];
            
            foreach ($patterns as $pattern) {
                $this->forgetByPattern($pattern);
            }
            
            Log::info("Cleared cache for module: {$module}");
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to clear module cache {$module}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Limpiar todo el caché de Dolibarr
     */
    public function flush(): bool
    {
        try {
            // Limpiar todos los módulos
            $modules = ['terceros', 'productos', 'servicios', 'documentos', 'agenda', 'tickets', 'user'];
            
            foreach ($modules as $module) {
                $this->forgetModule($module);
            }
            
            Log::info("Flushed all Dolibarr cache");
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to flush cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Generar clave de caché con prefijo
     */
    private function getCacheKey(string $key): string
    {
        return self::CACHE_PREFIX . $key;
    }

    /**
     * Obtener TTL según el tipo de datos
     */
    private function getTtlForKey(string $key): int
    {
        foreach ($this->ttlConfig as $module => $ttl) {
            if (str_starts_with($key, $module)) {
                return $ttl;
            }
        }
        
        return self::DEFAULT_TTL;
    }

    /**
     * Extraer módulo del patrón de caché
     */
    private function getModuleFromPattern(string $pattern): string
    {
        $pattern = str_replace(self::CACHE_PREFIX, '', $pattern);
        
        foreach (array_keys($this->ttlConfig) as $module) {
            if (str_starts_with($pattern, $module)) {
                return $module;
            }
        }
        
        return 'default';
    }

    /**
     * Generar clave única para petición con parámetros
     */
    public function generateKey(string $endpoint, array $params = [], ?string $userId = null): string
    {
        $keyParts = [$endpoint];
        
        if ($userId) {
            $keyParts[] = "user_{$userId}";
        }
        
        if (!empty($params)) {
            ksort($params); // Ordenar para consistencia
            $keyParts[] = md5(serialize($params));
        }
        
        return implode('_', $keyParts);
    }

    /**
     * Verificar si una clave existe en caché
     */
    public function has(string $key): bool
    {
        $cacheKey = $this->getCacheKey($key);
        
        try {
            return Cache::has($cacheKey);
        } catch (\Exception $e) {
            Log::error("Failed to check cache key {$key}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener estadísticas del caché
     */
    public function getStats(): array
    {
        return [
            'driver' => config('cache.default'),
            'prefix' => self::CACHE_PREFIX,
            'ttl_config' => $this->ttlConfig,
            'default_ttl' => self::DEFAULT_TTL,
        ];
    }
}
