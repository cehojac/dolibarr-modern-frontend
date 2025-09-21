# 🔧 Configuración para Plesk - new.gestion.carlos-herrera-consulting

## Estructura de Plesk

En Plesk, la configuración es diferente. No necesitas crear virtual hosts manualmente.

## 📁 Estructura de Directorios en Plesk

```
/var/www/vhosts/new.gestion.carlos-herrera-consulting/
├── httpdocs/          # <- Aquí va el contenido público (public/)
├── private/           # <- Aquí va el resto de Laravel
├── logs/
├── conf/
└── tmp/
```

## 🚀 Pasos para Configurar en Plesk

### 1. Estructura de Archivos Correcta

**Subir archivos así:**
```bash
# Todo Laravel EXCEPTO la carpeta public va aquí:
/var/www/vhosts/new.gestion.carlos-herrera-consulting/private/

# Solo el contenido de la carpeta public va aquí:
/var/www/vhosts/new.gestion.carlos-herrera-consulting/httpdocs/
```

### 2. Modificar index.php en httpdocs

Crear/editar `/var/www/vhosts/new.gestion.carlos-herrera-consulting/httpdocs/index.php`:

```php
<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/

if (file_exists($maintenance = __DIR__.'/../private/storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/

require __DIR__.'/../private/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
*/

$app = require_once __DIR__.'/../private/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
```

### 3. Copiar Assets a httpdocs

Copiar todo el contenido de `public/` a `httpdocs/`:
```bash
cp -r public/* /var/www/vhosts/new.gestion.carlos-herrera-consulting/httpdocs/
```

### 4. Configurar .htaccess en httpdocs

Crear `/var/www/vhosts/new.gestion.carlos-herrera-consulting/httpdocs/.htaccess`:

```apache
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
```

### 5. Configurar Variables de Entorno

Crear `.env` en `/var/www/vhosts/new.gestion.carlos-herrera-consulting/private/.env`:

```env
APP_NAME="Dolibarr Modern Frontend"
APP_ENV=production
APP_KEY=base64:GENERAR_CON_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://new.gestion.carlos-herrera-consulting

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_PATH=/
SESSION_DOMAIN=.carlos-herrera-consulting
SESSION_SECURE_COOKIE=true

DOLIBARR_BASE_URL=https://gestion.carlos-herrera-consulting/api/index.php
DOLIBARR_API_KEY=tu_api_key

FRONTEND_URL=https://new.gestion.carlos-herrera-consulting
```

## 🔧 Configuración en Panel Plesk

### 1. PHP Settings
- **Versión PHP**: 8.1 o superior
- **Memoria**: 256M mínimo
- **Max execution time**: 300
- **Upload max filesize**: 64M
- **Post max size**: 64M

### 2. Extensiones PHP Requeridas
Activar en Plesk > PHP Settings:
- ✅ mbstring
- ✅ openssl
- ✅ pdo_mysql
- ✅ tokenizer
- ✅ xml
- ✅ ctype
- ✅ json
- ✅ bcmath
- ✅ curl
- ✅ zip

### 3. Base de Datos
Crear en Plesk > Databases:
- **Nombre**: `dolibarr_modern_frontend`
- **Usuario**: Con permisos completos
- **Charset**: utf8mb4

## 🚀 Script de Despliegue para Plesk

```bash
#!/bin/bash
# deploy-plesk.sh

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"
PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"

echo "🚀 Desplegando en Plesk..."

# 1. Ir al directorio privado
cd $PRIVATE_DIR

# 2. Instalar dependencias
composer install --no-dev --optimize-autoloader

# 3. Generar key si no existe
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# 4. Ejecutar migraciones
php artisan migrate --force

# 5. Limpiar cachés
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# 6. Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Compilar assets
npm install
npm run build

# 8. Copiar assets al directorio público
cp -r public/* $PUBLIC_DIR/

# 9. Configurar permisos
chmod -R 755 storage bootstrap/cache
chown -R psacln:psaserv storage bootstrap/cache

echo "✅ Despliegue completado"
```

## 🔍 Solución Error 500 en Plesk

### Verificar Logs
```bash
# Logs de PHP
tail -f /var/www/vhosts/new.gestion.carlos-herrera-consulting/logs/php_error.log

# Logs de Apache
tail -f /var/www/vhosts/new.gestion.carlos-herrera-consulting/logs/error_log

# Logs de Laravel
tail -f /var/www/vhosts/new.gestion.carlos-herrera-consulting/private/storage/logs/laravel.log
```

### Comandos de Diagnóstico
```bash
cd /var/www/vhosts/new.gestion.carlos-herrera-consulting/private

# Verificar configuración
php artisan about

# Verificar rutas
php artisan route:list

# Probar conexión DB
php artisan migrate:status
```

## ⚠️ Problemas Comunes en Plesk

### 1. Error de Permisos
```bash
chown -R psacln:psaserv /var/www/vhosts/new.gestion.carlos-herrera-consulting/private/storage
chmod -R 755 /var/www/vhosts/new.gestion.carlos-herrera-consulting/private/storage
```

### 2. PHP CLI vs Web
Asegurarse que la versión PHP CLI coincida con la web:
```bash
/opt/plesk/php/8.2/bin/php artisan --version
```

### 3. Variables de Entorno
En Plesk, a veces las variables de entorno no se cargan. Verificar en:
`Plesk > Domains > PHP Settings > Environment Variables`

## 🎯 Checklist Final

- [ ] Archivos subidos a `/private/` excepto `public/`
- [ ] Contenido de `public/` copiado a `/httpdocs/`
- [ ] `index.php` modificado con rutas correctas
- [ ] `.htaccess` configurado
- [ ] `.env` configurado con datos correctos
- [ ] Base de datos creada y configurada
- [ ] Extensiones PHP activadas
- [ ] Permisos configurados
- [ ] Migraciones ejecutadas
- [ ] Assets compilados y copiados

¡Con esta configuración debería funcionar en Plesk! 🎉
