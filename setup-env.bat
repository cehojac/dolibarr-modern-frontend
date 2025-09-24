@echo off
echo 🔧 Configurando archivo .env para desarrollo local...
echo.

REM Copiar .env.local a .env si no existe
if not exist .env (
    echo 📝 Copiando .env.local a .env...
    copy .env.local .env
    echo ✅ Archivo .env creado
) else (
    echo ℹ️  Archivo .env ya existe
)

echo.
echo ⚠️  IMPORTANTE: Debes editar el archivo .env con tus datos reales:
echo.
echo 📝 Edita estas variables en .env:
echo    DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
echo    DOLIBARR_API_KEY=tu_api_key_real_aqui
echo.

REM Generar APP_KEY si no existe
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

echo.
echo 📋 Próximos pasos:
echo    1. Editar .env con tus datos de Dolibarr
echo    2. Ejecutar: php artisan migrate
echo    3. Ejecutar: php artisan serve
echo    4. Abrir: http://localhost:8000
echo.

pause
