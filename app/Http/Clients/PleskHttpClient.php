<?php

namespace App\Http\Clients;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\PendingRequest;

class PleskHttpClient
{
    /**
     * Crear cliente HTTP optimizado para Plesk
     */
    public static function create(): PendingRequest
    {
        return Http::withOptions([
            // Timeouts extendidos
            'timeout' => 120,
            'connect_timeout' => 30,
            
            // Configuraciones específicas para Plesk
            'verify' => false, // Deshabilitar verificación SSL temporalmente
            'http_errors' => false, // No lanzar excepciones en errores HTTP
            
            // Headers específicos para evitar bloqueos
            'headers' => [
                'User-Agent' => 'Laravel-Plesk-Client/1.0',
                'Accept' => 'application/json',
                'Connection' => 'close', // Cerrar conexión después de cada request
            ],
            
            // Configuraciones cURL específicas
            'curl' => [
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_MAXREDIRS => 3,
                CURLOPT_TCP_KEEPALIVE => 0, // Deshabilitar keep-alive
                CURLOPT_FRESH_CONNECT => true, // Forzar nueva conexión
                CURLOPT_FORBID_REUSE => true, // No reutilizar conexiones
                CURLOPT_DNS_CACHE_TIMEOUT => 60,
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4, // Forzar IPv4
            ]
        ])->retry(5, 2000); // 5 reintentos con 2 segundos de delay
    }
    
    /**
     * Hacer petición GET con configuración optimizada para Plesk
     */
    public static function get(string $url, array $query = []): \Illuminate\Http\Client\Response
    {
        return self::create()->get($url, $query);
    }
    
    /**
     * Hacer petición POST con configuración optimizada para Plesk
     */
    public static function post(string $url, array $data = []): \Illuminate\Http\Client\Response
    {
        return self::create()->post($url, $data);
    }
    
    /**
     * Cliente con token de Dolibarr
     */
    public static function withDolibarrToken(string $token): PendingRequest
    {
        return self::create()->withHeaders([
            'DOLAPIKEY' => $token,
        ]);
    }
    
    /**
     * Cliente con API Key de Dolibarr desde configuración
     */
    public static function withDolibarrApiKey(): PendingRequest
    {
        return self::create()->withHeaders([
            'DOLAPIKEY' => config('services.dolibarr.api_key'),
        ]);
    }
}
