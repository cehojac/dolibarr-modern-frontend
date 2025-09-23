@echo off
echo ========================================
echo CONFIGURANDO VARIABLES DOLIBARR EN .ENV
echo ========================================
echo.

echo Verificando archivo .env...
if not exist .env (
    echo Copiando .env.example a .env...
    copy .env.example .env
    echo ✅ Archivo .env creado
) else (
    echo ✅ Archivo .env ya existe
)
echo.

echo Configurando variables de Dolibarr...

:: Leer .env actual
set "env_file=.env"
set "temp_file=.env.temp"

:: Crear archivo temporal con las configuraciones actualizadas
(
    for /f "usebackq delims=" %%a in ("%env_file%") do (
        set "line=%%a"
        setlocal enabledelayedexpansion
        
        :: Reemplazar DOLIBARR_BASE_URL
        if "!line:~0,17!"=="DOLIBARR_BASE_URL" (
            echo DOLIBARR_BASE_URL=https://gestion.carlos-herrera.consulting/api/index.php
        ) else if "!line:~0,16!"=="DOLIBARR_API_KEY" (
            echo DOLIBARR_API_KEY=your-dolibarr-api-key
        ) else (
            echo !line!
        )
        endlocal
    )
) > "%temp_file%"

:: Reemplazar archivo original
move "%temp_file%" "%env_file%"

echo ✅ Variables de Dolibarr configuradas en .env
echo.

echo IMPORTANTE:
echo 1. Edita el archivo .env manualmente
echo 2. Reemplaza "your-dolibarr-api-key" con tu API key real
echo 3. La URL ya está configurada correctamente
echo.

echo Ejemplo de configuración:
echo DOLIBARR_BASE_URL=https://gestion.carlos-herrera.consulting/api/index.php
echo DOLIBARR_API_KEY=tu_api_key_real_aqui
echo.

pause
