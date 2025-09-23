<?php
/**
 * SOLUCIÓN ESPECÍFICA ERROR 503 - LARAGON
 */

echo "🔧 SOLUCIONANDO ERROR 503 EN LARAGON\n";
echo "===================================\n\n";

$base_path = __DIR__;

// 1. Verificar estructura básica
echo "1. VERIFICANDO ESTRUCTURA:\n";
$required_files = [
    'composer.json' => $base_path . '/composer.json',
    'artisan' => $base_path . '/artisan', 
    '.env' => $base_path . '/.env',
    'public/index.php' => $base_path . '/public/index.php',
    'bootstrap/app.php' => $base_path . '/bootstrap/app.php'
];

foreach ($required_files as $name => $path) {
    if (file_exists($path)) {
        echo "   ✅ {$name}\n";
    } else {
        echo "   ❌ {$name} - FALTA\n";
    }
}
echo "\n";

// 2. Verificar vendor
echo "2. VERIFICANDO DEPENDENCIAS:\n";
if (!is_dir($base_path . '/vendor')) {
    echo "   ❌ Directorio vendor no existe\n";
    echo "   🔧 SOLUCIÓN: Ejecutar 'composer install'\n\n";
} else {
    echo "   ✅ Directorio vendor existe\n";
    
    if (file_exists($base_path . '/vendor/autoload.php')) {
        echo "   ✅ Autoload existe\n";
    } else {
        echo "   ❌ Autoload no existe\n";
        echo "   🔧 SOLUCIÓN: Ejecutar 'composer dump-autoload'\n";
    }
}
echo "\n";

// 3. Verificar .env
echo "3. VERIFICANDO CONFIGURACIÓN:\n";
if (file_exists($base_path . '/.env')) {
    $env_content = file_get_contents($base_path . '/.env');
    
    // Verificar APP_KEY
    if (preg_match('/^APP_KEY=(.+)$/m', $env_content, $matches)) {
        $key = trim($matches[1]);
        if (empty($key) || $key === 'base64:') {
            echo "   ❌ APP_KEY vacía\n";
            echo "   🔧 SOLUCIÓN: Ejecutar 'php artisan key:generate'\n";
        } else {
            echo "   ✅ APP_KEY configurada\n";
        }
    } else {
        echo "   ❌ APP_KEY no definida\n";
    }
    
    // Verificar APP_URL
    if (preg_match('/^APP_URL=(.+)$/m', $env_content, $matches)) {
        echo "   ✅ APP_URL: " . trim($matches[1]) . "\n";
    } else {
        echo "   ❌ APP_URL no definida\n";
    }
} else {
    echo "   ❌ Archivo .env no existe\n";
    echo "   🔧 SOLUCIÓN: Copiar .env.example a .env\n";
}
echo "\n";

// 4. Verificar permisos (Windows)
echo "4. VERIFICANDO PERMISOS:\n";
$dirs_to_check = [
    'storage',
    'storage/app', 
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
];

foreach ($dirs_to_check as $dir) {
    $full_path = $base_path . '/' . $dir;
    if (is_dir($full_path)) {
        if (is_writable($full_path)) {
            echo "   ✅ {$dir} - escribible\n";
        } else {
            echo "   ❌ {$dir} - NO escribible\n";
        }
    } else {
        echo "   ❌ {$dir} - NO EXISTE\n";
        // Crear directorio si no existe
        if (mkdir($full_path, 0755, true)) {
            echo "   🔧 Directorio {$dir} creado\n";
        }
    }
}
echo "\n";

// 5. Limpiar cachés
echo "5. LIMPIANDO CACHÉS:\n";
$cache_dirs = [
    'storage/framework/cache/data',
    'storage/framework/sessions', 
    'storage/framework/views',
    'bootstrap/cache'
];

foreach ($cache_dirs as $dir) {
    $full_path = $base_path . '/' . $dir;
    if (is_dir($full_path)) {
        $files = glob($full_path . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        echo "   ✅ {$dir} limpiado\n";
    }
}
echo "\n";

// 6. Verificar Apache en Laragon
echo "6. VERIFICANDO LARAGON:\n";
$laragon_apache = 'C:\laragon\bin\apache\httpd-2.4.47-win64-VS16\bin\httpd.exe';
$laragon_nginx = 'C:\laragon\bin\nginx\nginx-1.20.1\nginx.exe';

if (file_exists($laragon_apache)) {
    echo "   ✅ Apache Laragon encontrado\n";
} elseif (file_exists($laragon_nginx)) {
    echo "   ✅ Nginx Laragon encontrado\n";
} else {
    echo "   ⚠️ Servidor web Laragon no encontrado en rutas típicas\n";
}

// Verificar si Laragon está corriendo
$output = shell_exec('tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL');
if (strpos($output, 'httpd.exe') !== false) {
    echo "   ✅ Apache está ejecutándose\n";
} else {
    $output = shell_exec('tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL');
    if (strpos($output, 'nginx.exe') !== false) {
        echo "   ✅ Nginx está ejecutándose\n";
    } else {
        echo "   ❌ Servidor web NO está ejecutándose\n";
        echo "   🔧 SOLUCIÓN: Iniciar Laragon y arrancar Apache/Nginx\n";
    }
}
echo "\n";

// 7. Crear .htaccess si no existe
echo "7. VERIFICANDO .HTACCESS:\n";
$htaccess_path = $base_path . '/public/.htaccess';
if (!file_exists($htaccess_path)) {
    $htaccess_content = <<<'HTACCESS'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
HTACCESS;
    
    file_put_contents($htaccess_path, $htaccess_content);
    echo "   🔧 .htaccess creado en /public\n";
} else {
    echo "   ✅ .htaccess existe\n";
}
echo "\n";

// 8. Comandos de reparación
echo "8. COMANDOS DE REPARACIÓN SUGERIDOS:\n";
echo "   Ejecutar en orden:\n";
echo "   1. composer install --no-dev --optimize-autoloader\n";
echo "   2. php artisan key:generate\n";
echo "   3. php artisan config:clear\n";
echo "   4. php artisan cache:clear\n";
echo "   5. php artisan route:clear\n";
echo "   6. php artisan view:clear\n";
echo "   7. Reiniciar Laragon\n\n";

echo "✅ DIAGNÓSTICO COMPLETADO\n";
echo "Si el problema persiste, verificar:\n";
echo "- Que Laragon esté ejecutándose\n";
echo "- Que el DocumentRoot apunte a la carpeta /public\n";
echo "- Los logs de error en Laragon\n";
