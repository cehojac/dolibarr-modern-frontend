<?php
echo "Status Check - Dolibarr Modern Frontend\n";
echo "======================================\n";

echo "PHP Version: " . PHP_VERSION . "\n";
echo "Current Directory: " . __DIR__ . "\n";

if (file_exists('.env')) {
    echo "✅ .env file exists\n";
} else {
    echo "❌ .env file missing\n";
}

if (file_exists('vendor/autoload.php')) {
    echo "✅ Composer dependencies installed\n";
} else {
    echo "❌ Run 'composer install'\n";
}

if (file_exists('public/index.php')) {
    echo "✅ Laravel public/index.php exists\n";
} else {
    echo "❌ Laravel public/index.php missing\n";
}

echo "\nNext steps if 503 persists:\n";
echo "1. php artisan key:generate\n";
echo "2. Check Laragon is running\n";
echo "3. Access via http://localhost/dolibar-modern-frontend/public\n";
?>
