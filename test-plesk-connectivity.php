<?php

// Test específico de conectividad desde Plesk
echo "🌐 TEST DE CONECTIVIDAD DESDE PLESK\n";
echo "===================================\n\n";

$baseUrl = 'https://gestion.carlos-herrera-consulting';
$apiUrl = $baseUrl . '/api/index.php';

// Test 1: Configuración del sistema
echo "1. CONFIGURACIÓN DEL SISTEMA:\n";
echo "   - PHP Version: " . PHP_VERSION . "\n";
echo "   - cURL disponible: " . (function_exists('curl_init') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - OpenSSL: " . (extension_loaded('openssl') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - allow_url_fopen: " . (ini_get('allow_url_fopen') ? '✅ SÍ' : '❌ NO') . "\n";
echo "   - default_socket_timeout: " . ini_get('default_socket_timeout') . "s\n";
echo "   - max_execution_time: " . ini_get('max_execution_time') . "s\n";
echo "   - memory_limit: " . ini_get('memory_limit') . "\n";
echo "\n";

// Test 2: Resolución DNS
echo "2. RESOLUCIÓN DNS:\n";
$ip = gethostbyname('gestion.carlos-herrera-consulting');
if ($ip !== 'gestion.carlos-herrera-consulting') {
    echo "   - DNS resuelve a: ✅ $ip\n";
} else {
    echo "   - DNS: ❌ NO RESUELVE\n";
}
echo "\n";

// Test 3: Conectividad básica con socket
echo "3. CONECTIVIDAD BÁSICA (Socket):\n";
$startTime = microtime(true);
$socket = @fsockopen('gestion.carlos-herrera-consulting', 443, $errno, $errstr, 30);
$endTime = microtime(true);

if ($socket) {
    echo "   - Conexión socket: ✅ OK (" . round(($endTime - $startTime) * 1000) . "ms)\n";
    fclose($socket);
} else {
    echo "   - Conexión socket: ❌ ERROR ($errno: $errstr)\n";
}
echo "\n";

// Test 4: cURL básico
echo "4. CURL BÁSICO:\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => 'Laravel-Plesk-Client/1.0',
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);

$startTime = microtime(true);
$response = curl_exec($ch);
$endTime = microtime(true);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$info = curl_getinfo($ch);

echo "   - HTTP Code: " . ($httpCode ?: 'N/A') . "\n";
echo "   - Tiempo total: " . round(($endTime - $startTime), 2) . "s\n";
echo "   - Tiempo conexión: " . round($info['connect_time'] ?? 0, 2) . "s\n";
echo "   - Error cURL: " . ($error ?: 'Ninguno') . "\n";
echo "   - Tamaño respuesta: " . strlen($response) . " bytes\n";

curl_close($ch);
echo "\n";

// Test 5: cURL con configuraciones optimizadas para Plesk
echo "5. CURL OPTIMIZADO PARA PLESK:\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_USERAGENT => 'Laravel-Plesk-Client/1.0',
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Connection: close'
    ],
    // Configuraciones específicas para Plesk
    CURLOPT_TCP_KEEPALIVE => 0,
    CURLOPT_FRESH_CONNECT => true,
    CURLOPT_FORBID_REUSE => true,
    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
    CURLOPT_DNS_CACHE_TIMEOUT => 60,
]);

$attempts = 3;
$success = false;

for ($i = 1; $i <= $attempts; $i++) {
    echo "   - Intento $i/$attempts: ";
    
    $startTime = microtime(true);
    $response = curl_exec($ch);
    $endTime = microtime(true);
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    if ($error) {
        echo "❌ ERROR ($error)\n";
        if ($i < $attempts) {
            sleep(2); // Esperar 2 segundos antes del siguiente intento
        }
    } else {
        echo "✅ OK (HTTP $httpCode, " . round(($endTime - $startTime), 2) . "s)\n";
        $success = true;
        break;
    }
}

curl_close($ch);
echo "\n";

// Test 6: Usando file_get_contents (alternativa)
echo "6. FILE_GET_CONTENTS (Alternativa):\n";
if (ini_get('allow_url_fopen')) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 30,
            'user_agent' => 'Laravel-Plesk-Client/1.0',
            'header' => 'Accept: application/json'
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    
    $startTime = microtime(true);
    $result = @file_get_contents($baseUrl, false, $context);
    $endTime = microtime(true);
    
    if ($result !== false) {
        echo "   - file_get_contents: ✅ OK (" . round(($endTime - $startTime), 2) . "s, " . strlen($result) . " bytes)\n";
    } else {
        echo "   - file_get_contents: ❌ ERROR\n";
    }
} else {
    echo "   - file_get_contents: ❌ allow_url_fopen deshabilitado\n";
}
echo "\n";

// Test 7: Cargar Laravel y probar con nuestro cliente optimizado
echo "7. CLIENTE OPTIMIZADO LARAVEL:\n";
try {
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
        
        // Probar con nuestro cliente optimizado
        $client = new \App\Http\Clients\PleskHttpClient();
        
        $startTime = microtime(true);
        $response = $client::get($apiUrl);
        $endTime = microtime(true);
        
        echo "   - PleskHttpClient: ";
        if ($response->successful()) {
            echo "✅ OK (HTTP " . $response->status() . ", " . round(($endTime - $startTime), 2) . "s)\n";
        } else {
            echo "❌ ERROR (HTTP " . $response->status() . ")\n";
        }
        
    } else {
        echo "   - Laravel no disponible (vendor/autoload.php no encontrado)\n";
    }
} catch (Exception $e) {
    echo "   - Error cargando Laravel: " . $e->getMessage() . "\n";
}
echo "\n";

// Resumen y recomendaciones
echo "🎯 RESUMEN Y RECOMENDACIONES:\n";
echo "=============================\n";

if ($success) {
    echo "✅ CONECTIVIDAD: OK - El servidor puede conectarse a Dolibarr\n";
    echo "\nSi aún hay problemas de timeout en la aplicación:\n";
    echo "1. Ejecutar: bash plesk-network-config.sh\n";
    echo "2. Limpiar cachés: bash clear-cache-plesk.sh\n";
    echo "3. Verificar logs: tail -f storage/logs/laravel.log\n";
} else {
    echo "❌ CONECTIVIDAD: PROBLEMA - No se puede conectar a Dolibarr\n";
    echo "\nPosibles soluciones:\n";
    echo "1. Verificar firewall del servidor Plesk\n";
    echo "2. Verificar configuración DNS\n";
    echo "3. Contactar al proveedor de hosting\n";
    echo "4. Verificar que gestion.carlos-herrera-consulting esté accesible\n";
}

echo "\nConfiguración actual:\n";
echo "- Timeout configurado: " . ini_get('default_socket_timeout') . "s\n";
echo "- Max execution time: " . ini_get('max_execution_time') . "s\n";
echo "- Memory limit: " . ini_get('memory_limit') . "\n";

echo "\n✅ TEST DE CONECTIVIDAD COMPLETADO\n";
