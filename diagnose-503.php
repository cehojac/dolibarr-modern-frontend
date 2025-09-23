<?php
/**
 * DIAGNÓSTICO COMPLETO ERROR 503
 * Script para identificar la causa del error 503
 */

echo "🔍 DIAGNÓSTICO ERROR 503 - DOLIBARR MODERN FRONTEND\n";
echo "================================================\n\n";

// 1. Verificar PHP básico
echo "1. VERIFICACIÓN PHP BÁSICA:\n";
echo "   - Versión PHP: " . PHP_VERSION . "\n";
echo "   - SAPI: " . php_sapi_name() . "\n";
echo "   - Memoria límite: " . ini_get('memory_limit') . "\n";
echo "   - Tiempo máximo: " . ini_get('max_execution_time') . "s\n";
echo "   - Upload máximo: " . ini_get('upload_max_filesize') . "\n";
echo "   - Post máximo: " . ini_get('post_max_size') . "\n\n";

// 2. Verificar extensiones críticas
echo "2. EXTENSIONES PHP CRÍTICAS:\n";
$required_extensions = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath', 'curl', 'fileinfo'];
foreach ($required_extensions as $ext) {
    $status = extension_loaded($ext) ? '✅' : '❌';
    echo "   - {$ext}: {$status}\n";
}
echo "\n";

// 3. Verificar archivos y permisos
echo "3. ARCHIVOS Y PERMISOS:\n";
$critical_files = [
    __DIR__ . '/composer.json',
    __DIR__ . '/artisan',
    __DIR__ . '/.env',
    __DIR__ . '/bootstrap/app.php',
    __DIR__ . '/public/index.php',
    __DIR__ . '/storage',
    __DIR__ . '/bootstrap/cache'
];

foreach ($critical_files as $file) {
    if (file_exists($file)) {
        $perms = substr(sprintf('%o', fileperms($file)), -4);
        $writable = is_writable($file) ? '✅' : '❌';
        echo "   - " . basename($file) . ": ✅ existe, permisos: {$perms}, escribible: {$writable}\n";
    } else {
        echo "   - " . basename($file) . ": ❌ NO EXISTE\n";
    }
}
echo "\n";

// 4. Verificar directorios de escritura
echo "4. DIRECTORIOS DE ESCRITURA:\n";
$writable_dirs = [
    __DIR__ . '/storage/app',
    __DIR__ . '/storage/framework/cache',
    __DIR__ . '/storage/framework/sessions',
    __DIR__ . '/storage/framework/views',
    __DIR__ . '/storage/logs',
    __DIR__ . '/bootstrap/cache'
];

foreach ($writable_dirs as $dir) {
    if (is_dir($dir)) {
        $writable = is_writable($dir) ? '✅' : '❌';
        $perms = substr(sprintf('%o', fileperms($dir)), -4);
        echo "   - " . basename($dir) . ": {$writable} permisos: {$perms}\n";
    } else {
        echo "   - " . basename($dir) . ": ❌ NO EXISTE\n";
    }
}
echo "\n";

// 5. Verificar .env
echo "5. CONFIGURACIÓN .ENV:\n";
if (file_exists(__DIR__ . '/.env')) {
    $env_content = file_get_contents(__DIR__ . '/.env');
    $env_vars = ['APP_ENV', 'APP_DEBUG', 'APP_KEY', 'APP_URL', 'DB_CONNECTION'];
    
    foreach ($env_vars as $var) {
        if (preg_match("/^{$var}=(.*)$/m", $env_content, $matches)) {
            $value = trim($matches[1]);
            if ($var === 'APP_KEY') {
                $value = !empty($value) ? 'SET ✅' : 'VACÍO ❌';
            }
            echo "   - {$var}: {$value}\n";
        } else {
            echo "   - {$var}: ❌ NO DEFINIDO\n";
        }
    }
} else {
    echo "   ❌ Archivo .env NO EXISTE\n";
}
echo "\n";

// 6. Test básico de Laravel
echo "6. TEST LARAVEL BÁSICO:\n";
try {
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        echo "   - Autoload: ✅ existe\n";
        
        // Intentar cargar Laravel
        require_once __DIR__ . '/vendor/autoload.php';
        echo "   - Vendor autoload: ✅ cargado\n";
        
        if (file_exists(__DIR__ . '/bootstrap/app.php')) {
            $app = require_once __DIR__ . '/bootstrap/app.php';
            echo "   - Bootstrap app: ✅ cargado\n";
            
            // Test básico de kernel
            $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
            echo "   - HTTP Kernel: ✅ creado\n";
            
        } else {
            echo "   - Bootstrap app: ❌ NO EXISTE\n";
        }
        
    } else {
        echo "   - Autoload: ❌ NO EXISTE - Ejecutar 'composer install'\n";
    }
} catch (Exception $e) {
    echo "   - Error Laravel: ❌ " . $e->getMessage() . "\n";
}
echo "\n";

// 7. Verificar logs de error
echo "7. LOGS DE ERROR:\n";
$log_files = [
    __DIR__ . '/storage/logs/laravel.log',
    '/var/log/apache2/error.log',
    '/var/log/nginx/error.log'
];

foreach ($log_files as $log_file) {
    if (file_exists($log_file) && is_readable($log_file)) {
        echo "   - " . basename($log_file) . ": ✅ existe\n";
        
        // Leer últimas líneas
        $lines = file($log_file);
        if ($lines && count($lines) > 0) {
            $recent_lines = array_slice($lines, -5);
            echo "     Últimas líneas:\n";
            foreach ($recent_lines as $line) {
                echo "     " . trim($line) . "\n";
            }
        }
    } else {
        echo "   - " . basename($log_file) . ": ❌ no accesible\n";
    }
}
echo "\n";

// 8. Test de conectividad
echo "8. TEST DE CONECTIVIDAD:\n";
$test_urls = [
    'http://localhost',
    'https://localhost',
    'http://127.0.0.1',
];

foreach ($test_urls as $url) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'ignore_errors' => true
        ]
    ]);
    
    $result = @file_get_contents($url, false, $context);
    $status = $result !== false ? '✅ responde' : '❌ no responde';
    echo "   - {$url}: {$status}\n";
}
echo "\n";

// 9. Recomendaciones
echo "9. RECOMENDACIONES PARA SOLUCIONAR 503:\n";
echo "   1. Verificar que Apache/Nginx esté ejecutándose\n";
echo "   2. Revisar configuración de virtual host\n";
echo "   3. Verificar permisos de directorios (755 para dirs, 644 para archivos)\n";
echo "   4. Ejecutar: chmod -R 755 storage bootstrap/cache\n";
echo "   5. Ejecutar: composer install --no-dev --optimize-autoloader\n";
echo "   6. Ejecutar: php artisan config:cache\n";
echo "   7. Verificar límites de PHP (memory_limit, max_execution_time)\n";
echo "   8. Revisar logs del servidor web\n";
echo "   9. Verificar que el DocumentRoot apunte a /public\n";
echo "   10. Reiniciar servidor web\n\n";

echo "✅ DIAGNÓSTICO COMPLETADO\n";
echo "Revisa los puntos marcados con ❌ para identificar el problema.\n";
