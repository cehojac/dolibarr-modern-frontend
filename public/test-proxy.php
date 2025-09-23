<?php
/**
 * TEST SIMPLE DEL PROXY DOLIBARR
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Proxy Dolibarr</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🧪 Test Proxy Dolibarr</h1>
    
    <h2>1. Verificación de archivos</h2>
    <?php
    $files = [
        '../.env' => 'Archivo .env',
        '../vendor/autoload.php' => 'Composer autoload',
        '../bootstrap/app.php' => 'Laravel bootstrap'
    ];
    
    foreach ($files as $file => $name) {
        if (file_exists($file)) {
            echo "<p class='success'>✅ {$name}: Existe</p>";
        } else {
            echo "<p class='error'>❌ {$name}: No existe</p>";
        }
    }
    ?>
    
    <h2>2. Variables de entorno</h2>
    <?php
    if (file_exists('../.env')) {
        $env = file_get_contents('../.env');
        
        // DOLIBARR_BASE_URL
        if (preg_match('/^DOLIBARR_BASE_URL=(.*)$/m', $env, $matches)) {
            $url = trim($matches[1]);
            echo "<p class='info'>DOLIBARR_BASE_URL: <code>{$url}</code></p>";
            
            if (empty($url)) {
                echo "<p class='error'>❌ URL vacía</p>";
            } elseif (strpos($url, 'gestion.carlos-herrera.consulting') !== false) {
                echo "<p class='success'>✅ URL correcta</p>";
            } else {
                echo "<p class='error'>❌ URL incorrecta</p>";
            }
        } else {
            echo "<p class='error'>❌ DOLIBARR_BASE_URL no definida</p>";
        }
        
        // DOLIBARR_API_KEY
        if (preg_match('/^DOLIBARR_API_KEY=(.*)$/m', $env, $matches)) {
            $key = trim($matches[1]);
            if (!empty($key) && $key !== 'your-actual-api-key-here') {
                echo "<p class='success'>✅ DOLIBARR_API_KEY: Configurada</p>";
            } else {
                echo "<p class='error'>❌ DOLIBARR_API_KEY: Necesita configuración real</p>";
            }
        } else {
            echo "<p class='error'>❌ DOLIBARR_API_KEY no definida</p>";
        }
        
        // APP_KEY
        if (preg_match('/^APP_KEY=(.*)$/m', $env, $matches)) {
            $appKey = trim($matches[1]);
            if (!empty($appKey) && $appKey !== 'base64:') {
                echo "<p class='success'>✅ APP_KEY: Configurada</p>";
            } else {
                echo "<p class='error'>❌ APP_KEY: Necesita generación</p>";
            }
        }
    }
    ?>
    
    <h2>3. Test de conectividad</h2>
    <?php
    $testUrl = "https://gestion.carlos-herrera.consulting";
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);
    
    $result = @file_get_contents($testUrl, false, $context);
    if ($result !== false) {
        echo "<p class='success'>✅ Servidor Dolibarr responde</p>";
    } else {
        echo "<p class='error'>❌ No se puede conectar al servidor Dolibarr</p>";
    }
    ?>
    
    <h2>4. Próximos pasos</h2>
    <ol>
        <li>Editar <code>.env</code> y poner tu API key real de Dolibarr</li>
        <li>Ejecutar: <code>php artisan key:generate</code></li>
        <li>Ejecutar: <code>php artisan config:clear</code></li>
        <li>Reiniciar Laragon</li>
        <li>Probar: <a href="../">http://localhost/dolibar-modern-frontend/public</a></li>
    </ol>
    
    <h2>5. URLs de prueba</h2>
    <ul>
        <li><a href="test.html">test.html</a> - Página estática</li>
        <li><a href="../">index.php</a> - Aplicación Laravel/Vue</li>
    </ul>
    
    <p><strong>Nota:</strong> Si ves esta página, el servidor web funciona. El error 503 probablemente es por configuración de Laravel.</p>
</body>
</html>
