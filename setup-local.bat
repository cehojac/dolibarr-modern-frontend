@echo off
echo 🚀 Configurando Dolibarr Modern Frontend para desarrollo local...
echo.

REM Verificar si existe .env
if not exist .env (
    echo 📝 Copiando archivo de configuración...
    copy .env.local .env
    echo ✅ Archivo .env creado
) else (
    echo ℹ️  Archivo .env ya existe
)

REM Verificar si existe APP_KEY
findstr /C:"APP_KEY=" .env | findstr /C:"APP_KEY=$" >nul
if %errorlevel% equ 0 (
    echo 🔑 Generando clave de aplicación...
    php artisan key:generate
    echo ✅ Clave de aplicación generada
) else (
    echo ℹ️  Clave de aplicación ya existe
)

REM Crear base de datos SQLite si no existe
if not exist database\database.sqlite (
    echo 🗄️ Creando base de datos SQLite...
    if not exist database mkdir database
    type nul > database\database.sqlite
    echo ✅ Base de datos SQLite creada
) else (
    echo ℹ️  Base de datos SQLite ya existe
)

REM Ejecutar migraciones
echo 📊 Ejecutando migraciones...
php artisan migrate --force
echo ✅ Migraciones ejecutadas

REM Limpiar caché
echo 🧹 Limpiando caché...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
echo ✅ Caché limpiado

REM Crear enlace simbólico para storage
echo 🔗 Creando enlace simbólico para storage...
php artisan storage:link
echo ✅ Enlace simbólico creado

REM Instalar dependencias de Node.js si es necesario
if not exist node_modules\tailwindcss (
    echo 📦 Instalando dependencias de Node.js...
    npm install
    echo ✅ Dependencias de Node.js instaladas
) else (
    echo ℹ️  Dependencias de Node.js ya instaladas
)

REM Compilar assets
echo 🎨 Compilando assets...
npm run build
echo ✅ Assets compilados

echo.
echo 🎉 ¡Configuración completada!
echo.
echo 📋 Próximos pasos:
echo    1. Edita el archivo .env con tus configuraciones de Dolibarr:
echo       - DOLIBARR_BASE_URL
echo       - DOLIBARR_API_KEY
echo.
echo    2. Para desarrollo, ejecuta:
echo       npm run dev (en una terminal)
echo       php artisan serve (en otra terminal)
echo.
echo    3. Accede a: http://localhost:8000
echo.
pause
