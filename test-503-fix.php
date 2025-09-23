<?php
/**
 * TEST RÁPIDO - VERIFICAR SI ERROR 503 ESTÁ SOLUCIONADO
 */

echo "🧪 VERIFICANDO SOLUCIÓN ERROR 503\n";
echo "================================\n\n";

$errors = [];
$warnings = [];

// 1. Verificar archivos críticos
echo "1. ARCHIVOS CRÍTICOS:\n";
$critical_files = [
    '.env' => '.env',
    'vendor/autoload.php' => 'vendor/autoload.php',
    'bootstrap/app.php' => 'bootstrap/app.php',
    'public/index.php' => 'public/index.php',
    'public/.htaccess' => 'public/.htaccess'
];

foreach ($critical_files as $name => $path) {
    if (file_exists($path)) {
        echo "   ✅ {$name}\n";
    } else {
        echo "   ❌ {$name}\n";
        $errors[] = "Falta archivo: {$name}";
    }
}
echo "\n";

// 2. Verificar configuración Laravel
echo "2. CONFIGURACIÓN LARAVEL:\n";
if (file_exists('.env')) {
    $env = file_get_contents('.env');
    
    // APP_KEY
    if (preg_match('/^APP_KEY=(.+)$/m', $env, $matches)) {
        $key = trim($matches[1]);
        if (!empty($key) && $key !== 'base64:') {
            echo "   ✅ APP_KEY configurada\n";
        } else {
            echo "   ❌ APP_KEY vacía\n";
            $errors[] = "APP_KEY no generada";
        }
    } else {
        echo "   ❌ APP_KEY no definida\n";
        $errors[] = "APP_KEY no definida";
    }
    
    // APP_URL
    if (preg_match('/^APP_URL=(.+)$/m', $env, $matches)) {
        echo "   ✅ APP_URL: " . trim($matches[1]) . "\n";
    }
} else {
    echo "   ❌ Archivo .env no existe\n";
    $errors[] = "Archivo .env faltante";
}
echo "\n";

// 3. Verificar directorios de escritura
echo "3. DIRECTORIOS DE ESCRITURA:\n";
$writable_dirs = [
    'storage/app',
    'storage/framework/cache',
    'storage/framework/sessions', 
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
];

foreach ($writable_dirs as $dir) {
    if (is_dir($dir)) {
        if (is_writable($dir)) {
            echo "   ✅ {$dir}\n";
        } else {
            echo "   ⚠️ {$dir} - no escribible\n";
            $warnings[] = "Directorio no escribible: {$dir}";
        }
    } else {
        echo "   ❌ {$dir} - no existe\n";
        $errors[] = "Directorio faltante: {$dir}";
    }
}
echo "\n";

// 4. Test básico de Laravel
echo "4. TEST LARAVEL:\n";
try {
    if (file_exists('vendor/autoload.php')) {
        require_once 'vendor/autoload.php';
        echo "   ✅ Autoload cargado\n";
        
        if (file_exists('bootstrap/app.php')) {
            $app = require_once 'bootstrap/app.php';
            echo "   ✅ Aplicación Laravel inicializada\n";
            
            // Test básico de configuración
            $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
            echo "   ✅ HTTP Kernel creado\n";
            
        } else {
            echo "   ❌ bootstrap/app.php no encontrado\n";
            $errors[] = "Bootstrap de Laravel faltante";
        }
    } else {
        echo "   ❌ vendor/autoload.php no encontrado\n";
        $errors[] = "Dependencias de Composer no instaladas";
    }
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
    $errors[] = "Error en Laravel: " . $e->getMessage();
}
echo "\n";

// 5. Verificar servidor web
echo "5. SERVIDOR WEB:\n";
$apache_running = false;
$nginx_running = false;

// Verificar procesos
$output = shell_exec('tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL');
if ($output && strpos($output, 'httpd.exe') !== false) {
    echo "   ✅ Apache ejecutándose\n";
    $apache_running = true;
}

$output = shell_exec('tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL');
if ($output && strpos($output, 'nginx.exe') !== false) {
    echo "   ✅ Nginx ejecutándose\n";
    $nginx_running = true;
}

if (!$apache_running && !$nginx_running) {
    echo "   ❌ Servidor web no está ejecutándose\n";
    $errors[] = "Servidor web no activo";
}
echo "\n";

// 6. Resumen
echo "6. RESUMEN:\n";
if (empty($errors)) {
    echo "   🎉 ¡TODO CORRECTO! El error 503 debería estar solucionado.\n";
    echo "   \n";
    echo "   Accede a tu aplicación en:\n";
    echo "   - http://localhost/dolibar-modern-frontend/public\n";
    echo "   - http://dolibar-modern-frontend.test (si configuraste virtual host)\n";
} else {
    echo "   ❌ ERRORES ENCONTRADOS:\n";
    foreach ($errors as $error) {
        echo "      - {$error}\n";
    }
    echo "\n   🔧 SOLUCIONES:\n";
    echo "      1. Ejecutar: composer install\n";
    echo "      2. Ejecutar: php artisan key:generate\n";
    echo "      3. Verificar permisos de directorios\n";
    echo "      4. Reiniciar Laragon\n";
}

if (!empty($warnings)) {
    echo "\n   ⚠️ ADVERTENCIAS:\n";
    foreach ($warnings as $warning) {
        echo "      - {$warning}\n";
    }
}

echo "\n";
echo "================================\n";
echo "Test completado.\n";
