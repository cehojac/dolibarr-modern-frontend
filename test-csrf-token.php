<?php

// Test específico para verificar token CSRF y sesiones
echo "🔐 PROBANDO TOKEN CSRF Y SESIONES\n";
echo "=================================\n\n";

// Cargar Laravel
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "1. CONFIGURACIÓN DE SESIONES:\n";
echo "   - Driver: " . config('session.driver') . "\n";
echo "   - Dominio: " . (config('session.domain') ?: 'null') . "\n";
echo "   - Secure: " . (config('session.secure') ? 'true' : 'false') . "\n";
echo "   - HttpOnly: " . (config('session.http_only') ? 'true' : 'false') . "\n";
echo "   - SameSite: " . config('session.same_site') . "\n";
echo "   - Path: " . config('session.path') . "\n";
echo "   - Lifetime: " . config('session.lifetime') . " minutos\n";
echo "\n";

echo "2. CONFIGURACIÓN DE APP:\n";
echo "   - APP_URL: " . config('app.url') . "\n";
echo "   - APP_ENV: " . config('app.env') . "\n";
echo "   - APP_DEBUG: " . (config('app.debug') ? 'true' : 'false') . "\n";
echo "   - APP_KEY configurada: " . (config('app.key') ? 'Sí' : 'No') . "\n";
echo "\n";

echo "3. CONFIGURACIÓN CORS:\n";
echo "   - Paths: " . implode(', ', config('cors.paths', [])) . "\n";
echo "   - Allowed Origins: " . implode(', ', config('cors.allowed_origins', [])) . "\n";
echo "   - Supports Credentials: " . (config('cors.supports_credentials') ? 'true' : 'false') . "\n";
echo "\n";

echo "4. DIRECTORIO DE SESIONES:\n";
$sessionPath = storage_path('framework/sessions');
echo "   - Path: $sessionPath\n";
echo "   - Existe: " . (is_dir($sessionPath) ? 'Sí' : 'No') . "\n";
echo "   - Escribible: " . (is_writable($sessionPath) ? 'Sí' : 'No') . "\n";
if (is_dir($sessionPath)) {
    $files = glob($sessionPath . '/*');
    echo "   - Archivos de sesión: " . count($files) . "\n";
}
echo "\n";

echo "5. TEST DE GENERACIÓN DE TOKEN CSRF:\n";
try {
    // Simular una sesión
    $session = new \Illuminate\Session\Store(
        'test_session',
        new \Illuminate\Session\FileSessionHandler(
            new \Illuminate\Filesystem\Filesystem(),
            storage_path('framework/sessions'),
            120
        )
    );
    
    $session->start();
    
    // Generar token CSRF
    $token = $session->token();
    echo "   - Token CSRF generado: ✅ Sí\n";
    echo "   - Token length: " . strlen($token) . " caracteres\n";
    echo "   - Token preview: " . substr($token, 0, 10) . "...\n";
    
    // Verificar que se puede regenerar
    $session->regenerateToken();
    $newToken = $session->token();
    echo "   - Token regenerado: ✅ Sí\n";
    echo "   - Nuevo token diferente: " . ($token !== $newToken ? 'Sí' : 'No') . "\n";
    
} catch (Exception $e) {
    echo "   - Error generando token: ❌ " . $e->getMessage() . "\n";
}
echo "\n";

echo "6. TEST DE MIDDLEWARE CSRF:\n";
try {
    // Verificar que el middleware CSRF está registrado
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $middlewareGroups = $app['config']['app.middleware_groups'] ?? [];
    
    echo "   - Middleware web group existe: " . (isset($middlewareGroups['web']) ? 'Sí' : 'No') . "\n";
    
    if (isset($middlewareGroups['web'])) {
        $hasVerifyCsrf = false;
        foreach ($middlewareGroups['web'] as $middleware) {
            if (str_contains($middleware, 'VerifyCsrfToken')) {
                $hasVerifyCsrf = true;
                break;
            }
        }
        echo "   - VerifyCsrfToken en web group: " . ($hasVerifyCsrf ? 'Sí' : 'No') . "\n";
    }
    
} catch (Exception $e) {
    echo "   - Error verificando middleware: " . $e->getMessage() . "\n";
}
echo "\n";

echo "7. VERIFICAR RUTAS DE API:\n";
try {
    $routes = \Illuminate\Support\Facades\Route::getRoutes();
    $apiRoutes = 0;
    $webRoutes = 0;
    $authRoutes = 0;
    
    foreach ($routes as $route) {
        $uri = $route->uri();
        if (str_starts_with($uri, 'api/')) {
            $apiRoutes++;
            if (str_contains($uri, 'auth')) {
                $authRoutes++;
            }
        } else {
            $webRoutes++;
        }
    }
    
    echo "   - Rutas API: $apiRoutes\n";
    echo "   - Rutas Web: $webRoutes\n";
    echo "   - Rutas Auth: $authRoutes\n";
    
} catch (Exception $e) {
    echo "   - Error verificando rutas: " . $e->getMessage() . "\n";
}
echo "\n";

echo "🎯 DIAGNÓSTICO Y RECOMENDACIONES:\n";
echo "=================================\n";

// Verificar problemas comunes
$issues = [];
$fixes = [];

if (!config('app.key')) {
    $issues[] = "APP_KEY no configurada";
    $fixes[] = "Ejecutar: php artisan key:generate";
}

if (!is_dir($sessionPath) || !is_writable($sessionPath)) {
    $issues[] = "Directorio de sesiones no escribible";
    $fixes[] = "Ejecutar: mkdir -p $sessionPath && chmod 775 $sessionPath";
}

if (config('session.domain') !== 'new.gestion.carlos-herrera-consulting') {
    $issues[] = "SESSION_DOMAIN no coincide con el dominio actual";
    $fixes[] = "Configurar: SESSION_DOMAIN=new.gestion.carlos-herrera-consulting";
}

if (!config('session.secure') && config('app.env') === 'production') {
    $issues[] = "Cookies no seguras en producción";
    $fixes[] = "Configurar: SESSION_SECURE_COOKIE=true";
}

if (empty($issues)) {
    echo "✅ NO SE ENCONTRARON PROBLEMAS OBVIOS\n";
    echo "\nSi persiste el error 419:\n";
    echo "1. Limpiar cookies del navegador\n";
    echo "2. Verificar que el frontend esté enviando el token CSRF\n";
    echo "3. Revisar logs: tail -f storage/logs/laravel.log\n";
} else {
    echo "❌ PROBLEMAS ENCONTRADOS:\n";
    foreach ($issues as $i => $issue) {
        echo "   " . ($i + 1) . ". $issue\n";
    }
    echo "\n🔧 SOLUCIONES:\n";
    foreach ($fixes as $i => $fix) {
        echo "   " . ($i + 1) . ". $fix\n";
    }
}

echo "\n✅ DIAGNÓSTICO CSRF COMPLETADO\n";
