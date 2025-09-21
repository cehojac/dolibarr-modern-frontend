<?php

echo "🔍 DIAGNÓSTICO DE ERROR 500\n";
echo "==========================\n\n";

// 1. Verificar PHP
echo "1. Versión de PHP: " . PHP_VERSION . "\n";

// 2. Verificar archivo .env
echo "2. Archivo .env: ";
if (file_exists('.env')) {
    echo "✅ Existe\n";
} else {
    echo "❌ No existe\n";
    exit(1);
}

// 3. Verificar APP_KEY
$envContent = file_get_contents('.env');
if (strpos($envContent, 'APP_KEY=base64:') !== false) {
    echo "3. APP_KEY: ✅ Configurada\n";
} else {
    echo "3. APP_KEY: ❌ No configurada o inválida\n";
}

// 4. Verificar permisos de directorios
echo "4. Permisos:\n";
$directories = ['storage', 'bootstrap/cache'];
foreach ($directories as $dir) {
    if (is_writable($dir)) {
        echo "   - $dir: ✅ Escribible\n";
    } else {
        echo "   - $dir: ❌ No escribible\n";
    }
}

// 5. Verificar extensiones PHP requeridas
echo "5. Extensiones PHP:\n";
$required = ['pdo', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath'];
foreach ($required as $ext) {
    if (extension_loaded($ext)) {
        echo "   - $ext: ✅\n";
    } else {
        echo "   - $ext: ❌\n";
    }
}

// 6. Verificar conexión a base de datos
echo "6. Base de datos:\n";
try {
    require_once 'vendor/autoload.php';
    
    $app = require_once 'bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    
    $config = $app['config'];
    $dbConfig = $config->get('database.connections.' . $config->get('database.default'));
    
    echo "   - Driver: " . $dbConfig['driver'] . "\n";
    echo "   - Host: " . $dbConfig['host'] . "\n";
    echo "   - Database: " . $dbConfig['database'] . "\n";
    
    // Intentar conexión
    $pdo = new PDO(
        $dbConfig['driver'] . ':host=' . $dbConfig['host'] . ';dbname=' . $dbConfig['database'],
        $dbConfig['username'],
        $dbConfig['password']
    );
    echo "   - Conexión: ✅ Exitosa\n";
    
} catch (Exception $e) {
    echo "   - Conexión: ❌ Error: " . $e->getMessage() . "\n";
}

// 7. Verificar rutas
echo "7. Rutas:\n";
try {
    $routes = $app['router']->getRoutes();
    $authRoutes = 0;
    foreach ($routes as $route) {
        if (strpos($route->uri(), 'api/auth') !== false) {
            $authRoutes++;
        }
    }
    echo "   - Rutas de auth encontradas: $authRoutes\n";
} catch (Exception $e) {
    echo "   - Error verificando rutas: " . $e->getMessage() . "\n";
}

// 8. Verificar logs recientes
echo "8. Logs recientes:\n";
$logFile = 'storage/logs/laravel.log';
if (file_exists($logFile)) {
    $logs = file_get_contents($logFile);
    $recentLogs = substr($logs, -2000); // Últimos 2000 caracteres
    if (strpos($recentLogs, '[' . date('Y-m-d')) !== false) {
        echo "   - Logs de hoy: ✅ Encontrados\n";
        // Mostrar últimas líneas de error
        $lines = explode("\n", $recentLogs);
        $errorLines = array_filter($lines, function($line) {
            return strpos($line, 'ERROR') !== false || strpos($line, 'CRITICAL') !== false;
        });
        if (!empty($errorLines)) {
            echo "   - Últimos errores:\n";
            foreach (array_slice($errorLines, -3) as $errorLine) {
                echo "     " . trim($errorLine) . "\n";
            }
        }
    } else {
        echo "   - Logs de hoy: ❌ No encontrados\n";
    }
} else {
    echo "   - Archivo de log: ❌ No existe\n";
}

echo "\n🔍 DIAGNÓSTICO COMPLETADO\n";
echo "Si hay errores marcados con ❌, esos son los problemas a resolver.\n";
