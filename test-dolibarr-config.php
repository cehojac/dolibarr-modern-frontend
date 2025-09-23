<?php
/**
 * TEST CONFIGURACIÓN DOLIBARR
 */

echo "🔧 VERIFICANDO CONFIGURACIÓN DOLIBARR\n";
echo "====================================\n\n";

// 1. Verificar variables de entorno
echo "1. VARIABLES DE ENTORNO:\n";

if (file_exists('.env')) {
    $env_content = file_get_contents('.env');
    
    // Buscar DOLIBARR_BASE_URL
    if (preg_match('/^DOLIBARR_BASE_URL=(.*)$/m', $env_content, $matches)) {
        $base_url = trim($matches[1]);
        echo "   ✅ DOLIBARR_BASE_URL: {$base_url}\n";
        
        // Verificar formato
        if (empty($base_url)) {
            echo "   ❌ DOLIBARR_BASE_URL está vacía\n";
        } elseif (!str_contains($base_url, 'YOUR_DOMAIN')) {
            echo "   ⚠️ URL no apunta a YOUR_DOMAIN\n";
        } else {
            echo "   ✅ URL correcta\n";
        }
    } else {
        echo "   ❌ DOLIBARR_BASE_URL no definida en .env\n";
    }
    
    // Buscar DOLIBARR_API_KEY
    if (preg_match('/^DOLIBARR_API_KEY=(.*)$/m', $env_content, $matches)) {
        $api_key = trim($matches[1]);
        if (!empty($api_key)) {
            echo "   ✅ DOLIBARR_API_KEY: " . substr($api_key, 0, 10) . "...\n";
        } else {
            echo "   ❌ DOLIBARR_API_KEY está vacía\n";
        }
    } else {
        echo "   ❌ DOLIBARR_API_KEY no definida en .env\n";
    }
} else {
    echo "   ❌ Archivo .env no existe\n";
}

echo "\n";

// 2. Verificar configuración de Laravel (si podemos cargar)
echo "2. CONFIGURACIÓN LARAVEL:\n";
try {
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        
        // Simular configuración
        $base_url = $_ENV['DOLIBARR_BASE_URL'] ?? 'NO_DEFINIDA';
        $api_key = $_ENV['DOLIBARR_API_KEY'] ?? 'NO_DEFINIDA';
        
        echo "   - Base URL desde config: {$base_url}\n";
        echo "   - API Key desde config: " . (strlen($api_key) > 10 ? substr($api_key, 0, 10) . '...' : $api_key) . "\n";
        
    } else {
        echo "   ⚠️ No se puede cargar Laravel (vendor faltante)\n";
    }
} catch (Exception $e) {
    echo "   ⚠️ Error cargando Laravel: " . $e->getMessage() . "\n";
}

echo "\n";

// 3. Sugerencias de configuración
echo "3. CONFIGURACIÓN RECOMENDADA:\n";
echo "   En .env debería tener:\n";
echo "   DOLIBARR_BASE_URL=https://YOUR_DOMAIN/api/index.php\n";
echo "   DOLIBARR_API_KEY=tu_api_key_aqui\n";
echo "\n";

// 4. Test de conectividad básica
echo "4. TEST DE CONECTIVIDAD:\n";
$test_url = "https://YOUR_DOMAIN";
$context = stream_context_create([
    'http' => [
        'timeout' => 10,
        'ignore_errors' => true
    ]
]);

$result = @file_get_contents($test_url, false, $context);
if ($result !== false) {
    echo "   ✅ Servidor Dolibarr responde\n";
} else {
    echo "   ❌ No se puede conectar al servidor Dolibarr\n";
}

echo "\n";
echo "✅ VERIFICACIÓN COMPLETADA\n";
?>
