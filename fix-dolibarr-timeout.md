# 🔧 Solución Error Timeout Dolibarr

## Error Actual
```
cURL error 28: Connection timed out after 10001 milliseconds
```

## ✅ Soluciones Aplicadas

### 1. Aumentado Timeout en DoliProxyController
- ✅ Timeout aumentado de 30s a 60s
- ✅ Agregado retry automático (3 intentos)
- ✅ Delay de 1 segundo entre reintentos

### 2. Verificaciones Necesarias

#### A. Verificar Configuración .env
```env
# Verificar que estas variables estén correctas:
DOLIBARR_BASE_URL=https://gestion.carlos-herrera-consulting/api/index.php
DOLIBARR_API_KEY=tu_api_key_real_aqui
```

#### B. Ejecutar Test de Conexión
```bash
cd /var/www/vhosts/new.gestion.carlos-herrera-consulting/private
php test-dolibarr-connection.php
```

### 3. Configuraciones PHP Requeridas

#### En Plesk > PHP Settings:
```ini
max_execution_time = 300
default_socket_timeout = 60
memory_limit = 256M
```

#### O en php.ini:
```ini
max_execution_time = 300
default_socket_timeout = 60
curl.cainfo = /path/to/cacert.pem  # Si hay problemas SSL
```

### 4. Verificar Conectividad de Red

#### Test básico desde servidor:
```bash
# Test ping
ping gestion.carlos-herrera-consulting

# Test puerto HTTPS
telnet gestion.carlos-herrera-consulting 443

# Test cURL directo
curl -I https://gestion.carlos-herrera-consulting/api/index.php/users \
  -H "DOLAPIKEY: tu_api_key"
```

### 5. Verificar API Dolibarr

#### En Dolibarr (gestion.carlos-herrera-consulting):

1. **Módulo API habilitado**:
   - Home > Setup > Modules > API/Web services > ✅ Enabled

2. **Usuario API configurado**:
   - Users & Groups > Users > [tu usuario]
   - API Key generada y activa
   - Permisos suficientes

3. **Módulo personalizado activo**:
   - Setup > Modules > Other modules
   - `dolibarrmodernfrontendapi` > ✅ Enabled

### 6. Configurar Firewall/Proxy

#### Si hay proxy/firewall entre servidores:
```bash
# Whitelist IPs
# Servidor new.gestion.carlos-herrera-consulting -> gestion.carlos-herrera-consulting
# Puerto 443 (HTTPS)
```

### 7. Optimizaciones Adicionales

#### Caché para reducir llamadas:
```bash
# Limpiar caché actual
php artisan cache:clear

# Configurar Redis si está disponible (opcional)
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
```

## 🔍 Diagnóstico Paso a Paso

### Paso 1: Ejecutar Test
```bash
php test-dolibarr-connection.php
```

### Paso 2: Verificar Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# PHP errors
tail -f /var/www/vhosts/new.gestion.carlos-herrera-consulting/logs/php_error.log

# Apache errors  
tail -f /var/www/vhosts/new.gestion.carlos-herrera-consulting/logs/error_log
```

### Paso 3: Test Manual cURL
```bash
curl -v -X GET \
  "https://gestion.carlos-herrera-consulting/api/index.php/users" \
  -H "DOLAPIKEY: TU_API_KEY_AQUI" \
  -H "Accept: application/json" \
  --max-time 30
```

## 🚨 Problemas Comunes y Soluciones

### Error: "API Key inválida"
```bash
# Verificar en Dolibarr:
# Users > [usuario] > API Key
# Regenerar si es necesario
```

### Error: "SSL certificate problem"
```bash
# Temporal (solo para testing):
curl -k https://gestion.carlos-herrera-consulting/...

# Permanente: actualizar certificados CA
```

### Error: "Connection refused"
```bash
# Verificar que Dolibarr esté accesible:
curl -I https://gestion.carlos-herrera-consulting

# Verificar firewall del servidor
```

### Error: "Timeout intermitente"
```bash
# Aumentar timeouts del sistema:
echo 'net.ipv4.tcp_keepalive_time = 600' >> /etc/sysctl.conf
sysctl -p
```

## ⚡ Solución Rápida

Si el problema persiste, ejecutar en orden:

```bash
# 1. Ir al directorio correcto
cd /var/www/vhosts/new.gestion.carlos-herrera-consulting/private

# 2. Limpiar cachés
php artisan cache:clear
php artisan config:clear

# 3. Test de conexión
php test-dolibarr-connection.php

# 4. Ver logs en tiempo real
tail -f storage/logs/laravel.log &

# 5. Probar login desde navegador
# https://new.gestion.carlos-herrera-consulting
```

## 📞 Si Nada Funciona

1. **Verificar que Dolibarr esté funcionando**:
   - Acceder a https://gestion.carlos-herrera-consulting
   - Login manual exitoso

2. **Verificar API desde Postman/curl**:
   - GET https://gestion.carlos-herrera-consulting/api/index.php/users
   - Header: DOLAPIKEY: tu_key

3. **Contactar administrador de servidor**:
   - Revisar logs del servidor Dolibarr
   - Verificar conectividad entre servidores
   - Revisar configuración de red/firewall

---

**El timeout aumentado y los reintentos deberían resolver el problema en la mayoría de casos. 🚀**
