@echo off
echo 🚀 Solución rápida para Tailwind CSS
echo.

REM Eliminar archivos .js si existen
if exist postcss.config.js (
    echo 🗑️ Eliminando postcss.config.js...
    del postcss.config.js
)

if exist tailwind.config.js (
    echo 🗑️ Eliminando tailwind.config.js...
    del tailwind.config.js
)

REM Verificar que existen los archivos .cjs
if not exist postcss.config.cjs (
    echo ❌ postcss.config.cjs no existe
    echo Creando archivo...
    echo module.exports = { > postcss.config.cjs
    echo   plugins: { >> postcss.config.cjs
    echo     tailwindcss: {}, >> postcss.config.cjs
    echo     autoprefixer: {}, >> postcss.config.cjs
    echo   }, >> postcss.config.cjs
    echo } >> postcss.config.cjs
    echo ✅ postcss.config.cjs creado
)

if not exist tailwind.config.cjs (
    echo ❌ tailwind.config.cjs no existe - usando configuración básica
    echo module.exports = { > tailwind.config.cjs
    echo   content: ["./resources/**/*.{js,vue,blade.php}"], >> tailwind.config.cjs
    echo   theme: { extend: {} }, >> tailwind.config.cjs
    echo   plugins: [], >> tailwind.config.cjs
    echo } >> tailwind.config.cjs
    echo ✅ tailwind.config.cjs creado
)

echo.
echo 📋 Archivos de configuración:
dir *.config.cjs

echo.
echo 🎨 Compilando assets...
npm run build

if %errorlevel% equ 0 (
    echo ✅ ¡Problema solucionado!
    echo.
    echo 🚀 Ahora puedes ejecutar:
    echo    php artisan serve
    echo.
    echo 📁 Archivos generados en public/build/
    dir public\build
) else (
    echo ❌ Error en compilación
    echo.
    echo 💡 Intenta:
    echo    1. npm install
    echo    2. npm run build
)

echo.
pause
