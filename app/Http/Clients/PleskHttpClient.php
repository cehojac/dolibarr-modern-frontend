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
            'timeout' => 30,
            'connect_timeout' => 10,
            
            'verify' => env('DOLIBARR_VERIFY_SSL', true),
            'http_errors' => false,
            
            'headers' => [
                'User-Agent' => 'Laravel-Dolibarr-Client/1.0',
                'Accept' => 'application/json',
            ],
            
            'curl' => [
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_MAXREDIRS => 3,
                CURLOPT_TCP_KEEPALIVE => 1,
                CURLOPT_DNS_CACHE_TIMEOUT => 120,
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
            ]
        ])->retry(2, 1000, throw: false);
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
     * Cliente con token específico
     */
    public static function withToken(string $token): PendingRequest
    {
        return self::create()->withHeaders([
            'DOLAPIKEY' => $token,
        ]);
    }
    
    /**
     * Cliente con API key de Dolibarr desde configuración
     */
    public static function withDolibarrApiKey(): PendingRequest
    {
        return self::create()->withHeaders([
            'DOLAPIKEY' => config('services.dolibarr.api_key'),
        ]);
    }
}
