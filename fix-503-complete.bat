@echo off
echo ========================================
echo SOLUCIONANDO ERROR 503 - PASO A PASO
echo ========================================
echo.

echo 1. Copiando .env.example a .env...
if not exist .env (
    copy .env.example .env
    echo    ✅ Archivo .env creado
) else (
    echo    ✅ Archivo .env ya existe
)
echo.

echo 2. Instalando dependencias de Composer...
composer install --no-dev --optimize-autoloader
echo.

echo 3. Generando clave de aplicación...
php artisan key:generate --force
echo.

echo 4. Limpiando cachés...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo.

echo 5. Creando directorios necesarios...
if not exist "storage\app" mkdir "storage\app"
if not exist "storage\framework\cache\data" mkdir "storage\framework\cache\data"
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions"
if not exist "storage\framework\views" mkdir "storage\framework\views"
if not exist "storage\logs" mkdir "storage\logs"
if not exist "bootstrap\cache" mkdir "bootstrap\cache"
echo    ✅ Directorios creados
echo.

echo 6. Configurando permisos (Windows)...
attrib -R storage\* /S /D
attrib -R bootstrap\cache\* /S /D
echo    ✅ Permisos configurados
echo.

echo 7. Creando .htaccess en public...
if not exist "public\.htaccess" (
    echo ^<IfModule mod_rewrite.c^> > "public\.htaccess"
    echo     ^<IfModule mod_negotiation.c^> >> "public\.htaccess"
    echo         Options -MultiViews -Indexes >> "public\.htaccess"
    echo     ^</IfModule^> >> "public\.htaccess"
    echo. >> "public\.htaccess"
    echo     RewriteEngine On >> "public\.htaccess"
    echo. >> "public\.htaccess"
    echo     # Handle Authorization Header >> "public\.htaccess"
    echo     RewriteCond %%{HTTP:Authorization} . >> "public\.htaccess"
    echo     RewriteRule .* - [E=HTTP_AUTHORIZATION:%%{HTTP:Authorization}] >> "public\.htaccess"
    echo. >> "public\.htaccess"
    echo     # Redirect Trailing Slashes If Not A Folder... >> "public\.htaccess"
    echo     RewriteCond %%{REQUEST_FILENAME} !-d >> "public\.htaccess"
    echo     RewriteCond %%{REQUEST_URI} ^(.+^)/$ >> "public\.htaccess"
    echo     RewriteRule ^ %%1 [L,R=301] >> "public\.htaccess"
    echo. >> "public\.htaccess"
    echo     # Send Requests To Front Controller... >> "public\.htaccess"
    echo     RewriteCond %%{REQUEST_FILENAME} !-d >> "public\.htaccess"
    echo     RewriteCond %%{REQUEST_FILENAME} !-f >> "public\.htaccess"
    echo     RewriteRule ^ index.php [L] >> "public\.htaccess"
    echo ^</IfModule^> >> "public\.htaccess"
    echo    ✅ .htaccess creado
) else (
    echo    ✅ .htaccess ya existe
)
echo.

echo 8. Optimizando para producción...
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo.

echo 9. Compilando assets...
npm install
npm run build
echo.

echo ========================================
echo ✅ PROCESO COMPLETADO
echo ========================================
echo.
echo PRÓXIMOS PASOS:
echo 1. Reiniciar Laragon completamente
echo 2. Verificar que Apache/Nginx esté corriendo
echo 3. Acceder a http://localhost/dolibar-modern-frontend/public
echo 4. Si persiste el error, revisar logs de Laragon
echo.
pause
