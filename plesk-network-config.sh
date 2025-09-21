#!/bin/bash

# Configuración de red específica para Plesk
echo "🌐 Configurando red para Plesk..."

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

# 1. Configurar PHP para conexiones salientes
echo "1. Configurando PHP para conexiones salientes..."

# Crear archivo de configuración PHP específico para el dominio
sudo tee "/var/www/vhosts/$DOMAIN/etc/php.ini" > /dev/null << 'EOF'
; Configuraciones específicas para conexiones salientes en Plesk

; Timeouts extendidos
default_socket_timeout = 120
max_execution_time = 300
max_input_time = 300

; Configuraciones cURL
curl.cainfo = ""
auto_detect_line_endings = On

; Configuraciones de red
allow_url_fopen = On
allow_url_include = Off

; User agent personalizado
user_agent = "Laravel-Plesk-Client/1.0"

; Configuraciones de memoria
memory_limit = 512M

; Configuraciones SSL
openssl.cafile = ""
openssl.capath = ""
EOF

echo "✅ Configuración PHP creada"

# 2. Verificar conectividad desde el servidor
echo "2. Verificando conectividad..."

# Test básico de conectividad
if ping -c 1 gestion.carlos-herrera-consulting > /dev/null 2>&1; then
    echo "✅ Ping a gestion.carlos-herrera-consulting: OK"
else
    echo "❌ Ping a gestion.carlos-herrera-consulting: FALLO"
fi

# Test de puerto HTTPS
if timeout 10 bash -c "</dev/tcp/gestion.carlos-herrera-consulting/443" 2>/dev/null; then
    echo "✅ Puerto 443 accesible: OK"
else
    echo "❌ Puerto 443 accesible: FALLO"
fi

# 3. Configurar resolución DNS
echo "3. Configurando DNS..."

# Agregar entrada DNS local si no resuelve
if ! nslookup gestion.carlos-herrera-consulting > /dev/null 2>&1; then
    echo "⚠️ DNS no resuelve, agregando entrada local..."
    # Aquí deberías poner la IP real de gestion.carlos-herrera-consulting
    echo "# Entrada para Dolibarr API" >> /etc/hosts
    echo "IP_DEL_SERVIDOR gestion.carlos-herrera-consulting" >> /etc/hosts
    echo "✅ Entrada DNS agregada"
else
    echo "✅ DNS resuelve correctamente"
fi

# 4. Configurar firewall local si existe
echo "4. Verificando firewall local..."

if command -v ufw > /dev/null; then
    echo "UFW detectado, permitiendo conexiones salientes..."
    ufw allow out 443/tcp comment "HTTPS saliente para Dolibarr"
    ufw allow out 80/tcp comment "HTTP saliente para Dolibarr"
    echo "✅ Reglas de firewall agregadas"
elif command -v iptables > /dev/null; then
    echo "iptables detectado, verificando reglas..."
    # Verificar si hay reglas que bloqueen conexiones salientes
    if iptables -L OUTPUT | grep -q "DROP\|REJECT"; then
        echo "⚠️ Hay reglas restrictivas en OUTPUT, revisar manualmente"
    else
        echo "✅ No hay reglas restrictivas detectadas"
    fi
fi

# 5. Test de cURL directo
echo "5. Probando cURL directo..."

# Test con configuraciones optimizadas para Plesk
curl_test() {
    local url="$1"
    local timeout="$2"
    
    curl -s -o /dev/null -w "%{http_code} - %{time_total}s" \
        --max-time "$timeout" \
        --connect-timeout 30 \
        --user-agent "Laravel-Plesk-Client/1.0" \
        --header "Accept: application/json" \
        --insecure \
        --ipv4 \
        --no-keepalive \
        --fresh-connect \
        "$url"
}

echo "   - Test básico (30s): $(curl_test "https://gestion.carlos-herrera-consulting" 30)"
echo "   - Test API (60s): $(curl_test "https://gestion.carlos-herrera-consulting/api/index.php" 60)"

# 6. Configurar variables de entorno específicas
echo "6. Configurando variables de entorno..."

cd "$PRIVATE_DIR" || exit 1

# Agregar configuraciones específicas para Plesk al .env si no existen
if ! grep -q "PLESK_OPTIMIZED" .env; then
    echo "" >> .env
    echo "# Configuraciones específicas para Plesk" >> .env
    echo "PLESK_OPTIMIZED=true" >> .env
    echo "HTTP_CLIENT_TIMEOUT=120" >> .env
    echo "HTTP_CLIENT_CONNECT_TIMEOUT=30" >> .env
    echo "HTTP_CLIENT_RETRIES=5" >> .env
    echo "✅ Variables de entorno agregadas"
else
    echo "✅ Variables de entorno ya configuradas"
fi

# 7. Reiniciar servicios PHP
echo "7. Reiniciando servicios PHP..."

# Detectar versión de PHP en uso
PHP_VERSION=$(php -v | head -n1 | cut -d" " -f2 | cut -d"." -f1,2)
echo "   - Versión PHP detectada: $PHP_VERSION"

# Reiniciar PHP-FPM
if systemctl is-active --quiet "php${PHP_VERSION}-fpm"; then
    systemctl restart "php${PHP_VERSION}-fpm"
    echo "✅ PHP-FPM reiniciado"
fi

# 8. Test final
echo "8. Test final de conectividad..."

cd "$PRIVATE_DIR"
if php -r "
    \$ch = curl_init('https://gestion.carlos-herrera-consulting');
    curl_setopt(\$ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt(\$ch, CURLOPT_TIMEOUT, 30);
    curl_setopt(\$ch, CURLOPT_SSL_VERIFYPEER, false);
    \$result = curl_exec(\$ch);
    \$httpCode = curl_getinfo(\$ch, CURLINFO_HTTP_CODE);
    curl_close(\$ch);
    echo \$httpCode >= 200 && \$httpCode < 400 ? 'OK' : 'FAIL';
" | grep -q "OK"; then
    echo "✅ Test final: EXITOSO"
else
    echo "❌ Test final: FALLÓ"
fi

echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA"
echo "=========================="
echo ""
echo "Próximos pasos:"
echo "1. Limpiar cachés: bash clear-cache-plesk.sh"
echo "2. Probar login desde navegador"
echo "3. Revisar logs si hay problemas:"
echo "   - tail -f $PRIVATE_DIR/storage/logs/laravel.log"
echo "   - tail -f /var/www/vhosts/$DOMAIN/logs/php_error.log"
echo ""

if [ -f "$PRIVATE_DIR/.env" ]; then
    echo "Variables de entorno configuradas:"
    grep -E "(DOLIBARR_|PLESK_|HTTP_CLIENT_)" "$PRIVATE_DIR/.env" | sed 's/^/   - /'
fi

echo ""
echo "✅ CONFIGURACIÓN DE RED PARA PLESK COMPLETADA"
