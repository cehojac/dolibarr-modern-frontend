<?php

// Test específico para el endpoint de login
echo "🔐 PROBANDO LOGIN EN DOLIBARR\n";
echo "=============================\n\n";

// Cargar Laravel
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Obtener configuración
$baseUrl = config('services.dolibarr.base_url');
$apiKey = config('services.dolibarr.api_key');

echo "Configuración:\n";
echo "- Base URL: " . ($baseUrl ?: '❌ NO CONFIGURADA') . "\n";
echo "- API Key: " . ($apiKey ? '✅ Configurada' : '❌ NO CONFIGURADA') . "\n\n";

if (!$baseUrl) {
    echo "❌ ERROR: DOLIBARR_BASE_URL no configurada\n";
    exit(1);
}

// Solicitar credenciales para test
echo "Ingresa credenciales para probar login:\n";
echo "Login: ";
$login = trim(fgets(STDIN));

echo "Password: ";
// Ocultar password en terminal
system('stty -echo');
$password = trim(fgets(STDIN));
system('stty echo');
echo "\n\n";

if (empty($login) || empty($password)) {
    echo "❌ ERROR: Login y password son requeridos\n";
    exit(1);
}

// Test 1: Login directo con cURL
echo "1. Test de login con cURL directo:\n";
$loginUrl = $baseUrl . '/login?login=' . urlencode($login) . '&password=' . urlencode($password);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $loginUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json'
    ],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_VERBOSE => false
]);

$startTime = microtime(true);
$response = curl_exec($ch);
$endTime = microtime(true);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
$info = curl_getinfo($ch);

echo "   - Tiempo total: " . round(($endTime - $startTime), 2) . "s\n";
echo "   - Tiempo conexión: " . round($info['connect_time'] ?? 0, 2) . "s\n";
echo "   - HTTP Code: " . ($httpCode ?: 'N/A') . "\n";

if ($error) {
    echo "   - Error cURL: ❌ $error\n";
    curl_close($ch);
    exit(1);
} else {
    echo "   - cURL: ✅ OK\n";
}

if ($httpCode === 200) {
    echo "   - Login: ✅ EXITOSO\n";
    $data = json_decode($response, true);
    if ($data) {
        echo "   - Token recibido: ✅ SÍ\n";
        $token = is_array($data) ? ($data['success']['token'] ?? $data) : $data;
        echo "   - Token length: " . strlen($token) . " caracteres\n";
    } else {
        echo "   - JSON: ❌ Inválido\n";
        echo "   - Respuesta: " . substr($response, 0, 200) . "...\n";
    }
} else {
    echo "   - Login: ❌ FALLÓ (HTTP $httpCode)\n";
    echo "   - Respuesta: " . substr($response, 0, 200) . "...\n";
    curl_close($ch);
    exit(1);
}

curl_close($ch);
echo "\n";

// Test 2: Login con Laravel HTTP Client (como lo hace AuthController)
echo "2. Test con Laravel HTTP Client:\n";
try {
    $startTime = microtime(true);
    $response = \Illuminate\Support\Facades\Http::timeout(60)->retry(3, 1000)->get($baseUrl . '/login', [
        'login' => $login,
        'password' => $password
    ]);
    $endTime = microtime(true);
    
    echo "   - Tiempo respuesta: " . round(($endTime - $startTime), 2) . "s\n";
    echo "   - Status: " . $response->status() . "\n";
    echo "   - Exitoso: " . ($response->successful() ? '✅ SÍ' : '❌ NO') . "\n";
    
    if ($response->successful()) {
        $data = $response->json();
        echo "   - Token recibido: ✅ SÍ\n";
        $token = is_array($data) ? ($data['success']['token'] ?? $data) : $data;
        echo "   - Token: " . substr($token, 0, 20) . "...\n";
        
        // Test 3: Probar token obtenido
        echo "\n3. Probando token obtenido:\n";
        try {
            $userResponse = \Illuminate\Support\Facades\Http::withHeaders([
                'DOLAPIKEY' => $token,
                'Accept' => 'application/json',
            ])->timeout(30)->get($baseUrl . '/users');
            
            if ($userResponse->successful()) {
                echo "   - Token válido: ✅ SÍ\n";
                $users = $userResponse->json();
                echo "   - Usuarios accesibles: " . (is_array($users) ? count($users) : 'N/A') . "\n";
            } else {
                echo "   - Token válido: ❌ NO (HTTP " . $userResponse->status() . ")\n";
            }
        } catch (\Exception $e) {
            echo "   - Error probando token: " . $e->getMessage() . "\n";
        }
        
    } else {
        echo "   - Error: " . $response->body() . "\n";
    }
    
} catch (\Exception $e) {
    echo "   - Exception: ❌ " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Simular el proceso completo de AuthController
echo "4. Simulando AuthController completo:\n";
try {
    // Crear una request simulada
    $request = new \Illuminate\Http\Request();
    $request->merge(['login' => $login, 'password' => $password]);
    
    // Crear sesión simulada
    $session = new \Illuminate\Session\Store('test', new \Illuminate\Session\ArraySessionHandler(60));
    $request->setLaravelSession($session);
    
    // Crear instancia del controller
    $controller = new \App\Http\Controllers\AuthController();
    
    echo "   - Ejecutando login...\n";
    $result = $controller->login($request);
    
    if ($result->getStatusCode() === 200) {
        echo "   - AuthController: ✅ EXITOSO\n";
        $responseData = json_decode($result->getContent(), true);
        echo "   - Usuario en sesión: " . ($responseData['user']['login'] ?? 'N/A') . "\n";
        echo "   - ID usuario: " . ($responseData['user']['id'] ?? 'N/A') . "\n";
    } else {
        echo "   - AuthController: ❌ FALLÓ (HTTP " . $result->getStatusCode() . ")\n";
        echo "   - Error: " . $result->getContent() . "\n";
    }
    
} catch (\Exception $e) {
    echo "   - Exception en AuthController: " . $e->getMessage() . "\n";
}

echo "\n";
echo "🎯 RESUMEN:\n";
echo "===========\n";
echo "Si todos los tests son exitosos, el problema de timeout está resuelto.\n";
echo "Si algún test falla, revisar:\n";
echo "1. Conectividad de red entre servidores\n";
echo "2. Configuración de Dolibarr API\n";
echo "3. Credenciales correctas\n";
echo "4. Firewall/proxy entre servidores\n";
echo "\n✅ TEST COMPLETADO\n";
