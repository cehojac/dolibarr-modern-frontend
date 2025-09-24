@echo off
echo 🔧 Solucionando problema de Tailwind CSS...
echo.

REM Limpiar cache de npm
echo 🧹 Limpiando cache de npm...
npm cache clean --force

REM Limpiar node_modules y package-lock.json
if exist node_modules (
    echo 🧹 Limpiando node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo 🧹 Limpiando package-lock.json...
    del package-lock.json
)

REM Instalar dependencias con versión específica de Tailwind
echo 📦 Instalando dependencias...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencias instaladas correctamente
    echo.
    echo 🔍 Verificando instalación de Tailwind...
    npm list tailwindcss
    echo.
    echo 🎨 Compilando assets...
    npm run build
    
    if %errorlevel% equ 0 (
        echo ✅ Assets compilados correctamente
        echo.
        echo 🚀 Todo listo! Ahora puedes ejecutar:
        echo    php artisan serve
        echo.
        echo 📋 URLs disponibles:
        echo    - Aplicación: http://localhost:8000
        echo    - Vite dev: npm run dev (en otra terminal)
    ) else (
        echo ❌ Error al compilar assets
        echo.
        echo 🔧 Intentando solución alternativa...
        echo Copiando configuración de respaldo...
        
        if exist tailwind.config.cjs (
            copy tailwind.config.cjs tailwind.config.js
            echo ✅ Configuración de Tailwind actualizada
        )
        
        if exist postcss.config.cjs (
            copy postcss.config.cjs postcss.config.js
            echo ✅ Configuración de PostCSS actualizada
        )
        
        echo.
        echo 🎨 Intentando compilar nuevamente...
        npm run build
    )
) else (
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 Sugerencias:
    echo    1. Verificar conexión a internet
    echo    2. Ejecutar como administrador
    echo    3. Verificar que Node.js esté instalado
)

echo.
pause
