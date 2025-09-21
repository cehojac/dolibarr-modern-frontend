<?php

// Script para probar conexión con Dolibarr
echo "🔍 PROBANDO CONEXIÓN CON DOLIBARR\n";
echo "==================================\n\n";

// Cargar Laravel
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Obtener configuración
$baseUrl = config('services.dolibarr.base_url');
$apiKey = config('services.dolibarr.api_key');

echo "1. Configuración:\n";
echo "   - Base URL: " . ($baseUrl ?: '❌ NO CONFIGURADA') . "\n";
echo "   - API Key: " . ($apiKey ? '✅ Configurada (' . strlen($apiKey) . ' caracteres)' : '❌ NO CONFIGURADA') . "\n\n";

if (!$baseUrl || !$apiKey) {
    echo "❌ ERROR: Configuración incompleta en .env\n";
    echo "Verificar:\n";
    echo "- DOLIBARR_BASE_URL=https://gestion.carlos-herrera-consulting/api/index.php\n";
    echo "- DOLIBARR_API_KEY=tu_api_key_aqui\n";
    exit(1);
}

// Test 1: Ping básico al servidor
echo "2. Test de conectividad básica:\n";
$host = parse_url($baseUrl, PHP_URL_HOST);
$port = parse_url($baseUrl, PHP_URL_PORT) ?: (parse_url($baseUrl, PHP_URL_SCHEME) === 'https' ? 443 : 80);

echo "   - Host: $host\n";
echo "   - Puerto: $port\n";

$connection = @fsockopen($host, $port, $errno, $errstr, 10);
if ($connection) {
    echo "   - Conectividad: ✅ OK\n";
    fclose($connection);
} else {
    echo "   - Conectividad: ❌ ERROR ($errno: $errstr)\n";
}
echo "\n";

// Test 2: cURL directo
echo "3. Test cURL directo:\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/users',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'DOLAPIKEY: ' . $apiKey,
        'Accept: application/json'
    ],
    CURLOPT_SSL_VERIFYPEER => false, // Para testing
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_VERBOSE => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$info = curl_getinfo($ch);

echo "   - HTTP Code: " . ($httpCode ?: 'N/A') . "\n";
echo "   - Tiempo total: " . round($info['total_time'] ?? 0, 2) . "s\n";
echo "   - Tiempo conexión: " . round($info['connect_time'] ?? 0, 2) . "s\n";

if ($error) {
    echo "   - Error cURL: ❌ $error\n";
} else {
    echo "   - cURL: ✅ OK\n";
}

if ($httpCode === 200) {
    echo "   - Respuesta API: ✅ OK\n";
    $data = json_decode($response, true);
    if ($data) {
        echo "   - JSON válido: ✅ OK\n";
        echo "   - Registros: " . (is_array($data) ? count($data) : 'N/A') . "\n";
    } else {
        echo "   - JSON: ❌ Inválido\n";
        echo "   - Respuesta: " . substr($response, 0, 200) . "...\n";
    }
} else {
    echo "   - Respuesta API: ❌ HTTP $httpCode\n";
    echo "   - Respuesta: " . substr($response, 0, 200) . "...\n";
}

curl_close($ch);
echo "\n";

// Test 3: Usando Laravel HTTP Client
echo "4. Test con Laravel HTTP Client:\n";
try {
    $client = \Illuminate\Support\Facades\Http::withHeaders([
        'DOLAPIKEY' => $apiKey,
        'Accept' => 'application/json',
    ])->timeout(30);
    
    $startTime = microtime(true);
    $response = $client->get($baseUrl . '/users');
    $endTime = microtime(true);
    
    echo "   - Tiempo respuesta: " . round(($endTime - $startTime), 2) . "s\n";
    echo "   - Status: " . $response->status() . "\n";
    echo "   - Exitoso: " . ($response->successful() ? '✅ SÍ' : '❌ NO') . "\n";
    
    if ($response->successful()) {
        $data = $response->json();
        echo "   - Datos recibidos: " . (is_array($data) ? count($data) : 'N/A') . " registros\n";
    } else {
        echo "   - Error: " . $response->body() . "\n";
    }
    
} catch (\Exception $e) {
    echo "   - Exception: ❌ " . $e->getMessage() . "\n";
}
echo "\n";

// Test 4: Verificar endpoints específicos
echo "5. Test de endpoints específicos:\n";
$endpoints = [
    '/users' => 'Usuarios',
    '/tickets' => 'Tickets', 
    '/thirdparties' => 'Terceros',
    '/dolibarmodernfrontendapi/status' => 'Módulo personalizado'
];

foreach ($endpoints as $endpoint => $description) {
    echo "   - $description ($endpoint): ";
    try {
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'DOLAPIKEY' => $apiKey,
            'Accept' => 'application/json',
        ])->timeout(15)->get($baseUrl . $endpoint);
        
        if ($response->successful()) {
            echo "✅ OK (" . $response->status() . ")\n";
        } else {
            echo "❌ ERROR (" . $response->status() . ")\n";
        }
    } catch (\Exception $e) {
        echo "❌ EXCEPTION (" . $e->getMessage() . ")\n";
    }
}
echo "\n";

// Test 5: Verificar configuración de red
echo "6. Configuración de red:\n";
echo "   - User Agent: " . (ini_get('user_agent') ?: 'Default') . "\n";
echo "   - Allow URL fopen: " . (ini_get('allow_url_fopen') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - cURL disponible: " . (function_exists('curl_init') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - OpenSSL: " . (extension_loaded('openssl') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - Default socket timeout: " . ini_get('default_socket_timeout') . "s\n";
echo "\n";

echo "🎯 RECOMENDACIONES:\n";
echo "==================\n";

if (!$connection) {
    echo "❌ Problema de conectividad de red\n";
    echo "   - Verificar firewall del servidor\n";
    echo "   - Verificar DNS\n";
    echo "   - Verificar que Dolibarr esté accesible\n";
}

if ($httpCode !== 200) {
    echo "❌ Problema con la API de Dolibarr\n";
    echo "   - Verificar que la API esté habilitada\n";
    echo "   - Verificar la API Key\n";
    echo "   - Verificar permisos del usuario API\n";
}

if ($error && strpos($error, 'timeout') !== false) {
    echo "❌ Problema de timeout\n";
    echo "   - Aumentar timeout en PHP (max_execution_time)\n";
    echo "   - Verificar rendimiento del servidor Dolibarr\n";
    echo "   - Considerar usar caché\n";
}

echo "\n✅ DIAGNÓSTICO COMPLETADO\n";
