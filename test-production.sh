#!/bin/bash

# 🧪 Script de Testing Post-Despliegue - Dolibarr Modern Frontend
# Verifica que la solución de sesiones funcione correctamente en producción

echo "🚀 Iniciando tests post-despliegue..."
echo "=================================="

# Configuración
FRONTEND_URL="https://new-YOUR_DOMAIN"
API_BASE="${FRONTEND_URL}/api"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Verificar que el frontend carga
echo "📱 Test 1: Frontend accesible..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$response" = "200" ]; then
    show_result 0 "Frontend carga correctamente"
else
    show_result 1 "Frontend no accesible (HTTP $response)"
fi

# Test 2: Verificar rutas API devuelven JSON (no HTML)
echo ""
echo "🔌 Test 2: APIs devuelven JSON..."

# Test endpoint que NO requiere autenticación
echo "  Probando /api/auth/debug-session..."
response=$(curl -s -H "Accept: application/json" "$API_BASE/auth/debug-session")
if echo "$response" | grep -q "session_id"; then
    show_result 0 "debug-session devuelve JSON válido"
else
    show_result 1 "debug-session no devuelve JSON esperado"
    echo "    Respuesta: ${response:0:100}..."
fi

# Test 3: Verificar headers CORS
echo ""
echo "🌐 Test 3: Configuración CORS..."
cors_headers=$(curl -s -I -H "Origin: $FRONTEND_URL" "$API_BASE/auth/debug-session" | grep -i "access-control")
if echo "$cors_headers" | grep -q "access-control-allow-credentials: true"; then
    show_result 0 "CORS credentials habilitado"
else
    show_result 1 "CORS credentials NO habilitado"
fi

if echo "$cors_headers" | grep -q "access-control-allow-origin"; then
    show_result 0 "CORS origins configurado"
else
    show_result 1 "CORS origins NO configurado"
fi

# Test 4: Verificar middleware de rutas
echo ""
echo "🛡️  Test 4: Middleware de rutas..."
route_output=$(curl -s "$FRONTEND_URL" | grep -o "csrf-token.*content=\"[^\"]*\"" | head -1)
if [ ! -z "$route_output" ]; then
    show_result 0 "CSRF token presente en HTML"
else
    show_result 1 "CSRF token NO encontrado"
fi

# Test 5: Simular flujo de login (requiere credenciales)
echo ""
echo "🔐 Test 5: Flujo de login (manual)..."
echo -e "${YELLOW}⚠️  Para probar el login completo:${NC}"
echo "   1. Abrir: $FRONTEND_URL"
echo "   2. Hacer login con credenciales válidas"
echo "   3. Verificar en consola del navegador:"
echo "      ✅ PASO 1 COMPLETADO: Usuario autenticado"
echo "      ✅ PASO 2 COMPLETADO: Permisos cargados correctamente"
echo "      ✅ PASO 3 COMPLETADO: Intervenciones cargadas"
echo "      ✅ LOGIN COMPLETADO: Todos los pasos exitosos"

# Test 6: Verificar logs de Laravel (si es accesible)
echo ""
echo "📋 Test 6: Logs de Laravel..."
if [ -f "storage/logs/laravel.log" ]; then
    recent_errors=$(tail -100 storage/logs/laravel.log | grep -i "error\|exception" | wc -l)
    if [ "$recent_errors" -eq 0 ]; then
        show_result 0 "No hay errores recientes en logs"
    else
        show_result 1 "$recent_errors errores encontrados en logs recientes"
    fi
    
    # Verificar logs específicos de la solución
    permissions_logs=$(tail -100 storage/logs/laravel.log | grep "getPermissions: Permisos devueltos" | wc -l)
    if [ "$permissions_logs" -gt 0 ]; then
        show_result 0 "Logs de permisos funcionando correctamente"
    else
        echo -e "${YELLOW}⚠️  No se encontraron logs de permisos recientes${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Archivo de logs no accesible desde este script${NC}"
fi

# Resumen
echo ""
echo "=================================="
echo "🎯 Resumen de Tests"
echo "=================================="
echo "Si todos los tests pasan y el login manual funciona,"
echo "la solución de sesiones está funcionando correctamente."
echo ""
echo "🔍 Para debugging adicional:"
echo "   - Revisar logs: tail -f storage/logs/laravel.log"
echo "   - Verificar configuración: php artisan config:show session"
echo "   - Test de rutas: php artisan route:list | grep api"
echo ""
echo "📞 Si hay problemas, verificar:"
echo "   1. Variables de entorno (.env)"
echo "   2. Caché de configuración (php artisan config:clear)"
echo "   3. Middleware en routes/web.php"
echo "   4. Configuración CORS en config/cors.php"

echo ""
echo "✨ Tests completados!"
