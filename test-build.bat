@echo off
echo 🧪 Probando compilación de Tailwind CSS...
echo.

echo 📋 Verificando archivos de configuración:
if exist postcss.config.cjs (
    echo ✅ postcss.config.cjs existe
) else (
    echo ❌ postcss.config.cjs NO existe
)

if exist tailwind.config.cjs (
    echo ✅ tailwind.config.cjs existe
) else (
    echo ❌ tailwind.config.cjs NO existe
)

echo.
echo 📄 Verificando estructura CSS:
echo Primeras líneas de app.css:
type resources\css\app.css | more +1 | head -10

echo.
echo 🎨 Compilando assets...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ ¡COMPILACIÓN EXITOSA!
    echo.
    echo 📁 Archivos generados:
    if exist public\build (
        dir public\build
    ) else (
        echo ❌ Directorio public\build no existe
    )
    echo.
    echo 🚀 Ahora puedes ejecutar:
    echo    php artisan serve
    echo    Luego abrir: http://localhost:8000
) else (
    echo.
    echo ❌ Error en la compilación
    echo.
    echo 💡 Posibles soluciones:
    echo    1. Verificar que Node.js esté instalado
    echo    2. Ejecutar: npm install
    echo    3. Verificar sintaxis en resources/css/app.css
)

echo.
pause
