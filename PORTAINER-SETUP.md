# 🐳 Setup en Portainer - Dolibarr Modern Frontend

Guía rápida para desplegar el proyecto directamente desde GitHub en Portainer.

## 🚀 Despliegue Rápido en Portainer

### Opción 1: Stack desde Repositorio (Recomendado)

1. **Ir a Portainer** → **Stacks** → **Add Stack**

2. **Configurar el Stack:**
   - **Name**: `dolibarr-modern-frontend`
   - **Build method**: `Repository`
   - **Repository URL**: `https://github.com/cehojac/dolibarr-modern-frontend`
   - **Compose path**: `docker-compose.portainer.yml`

3. **Variables de Entorno (Environment variables):**
   ```env
   DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
   DOLIBARR_API_KEY=tu_api_key_aqui
   APP_URL=http://tu-servidor:8080
   ```

4. **Deploy the stack**

### Opción 2: Stack Manual

1. **Ir a Portainer** → **Stacks** → **Add Stack**

2. **Configurar el Stack:**
   - **Name**: `dolibarr-modern-frontend`
   - **Build method**: `Web editor`

3. **Copiar este docker-compose.yml:**

```yaml
version: '3.8'

services:
  dolibarr-frontend:
    build:
      context: https://github.com/cehojac/dolibarr-modern-frontend.git
      dockerfile: Dockerfile
    container_name: dolibarr-modern-frontend
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      # Configuración básica
      - APP_NAME=Dolibarr Modern Frontend
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_URL=http://localhost:8080
      
      # ⚠️ CONFIGURAR ESTOS VALORES ⚠️
      - DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
      - DOLIBARR_API_KEY=tu_api_key_aqui
      
      # Configuración interna
      - SESSION_DRIVER=file
      - SESSION_LIFETIME=120
      - CACHE_DRIVER=file
      - QUEUE_CONNECTION=sync
      - DB_CONNECTION=sqlite
      - DB_DATABASE=/var/www/html/database/database.sqlite
      - CORS_ALLOWED_ORIGINS=http://localhost:8080
      - CORS_SUPPORTS_CREDENTIALS=true
      
    volumes:
      - dolibarr_storage:/var/www/html/storage
      - dolibarr_cache:/var/www/html/bootstrap/cache
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  dolibarr_storage:
  dolibarr_cache:
```

4. **Variables de Entorno (Environment variables):**
   ```env
   DOLIBARR_BASE_URL=https://YOUR_DOMAIN/api/index.php
   DOLIBARR_API_KEY=tu_api_key_real_aqui
   APP_URL=http://tu-ip-servidor:8080
   CORS_ALLOWED_ORIGINS=http://tu-ip-servidor:8080,https://tu-dominio.com
   ```

5. **Deploy the stack**

## ⚙️ Configuración de Variables

### Variables Obligatorias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DOLIBARR_BASE_URL` | URL de la API de Dolibarr | `https://tu-dolibarr.com/api/index.php` |
| `DOLIBARR_API_KEY` | API Key de Dolibarr | `abc123def456...` |

### Variables Opcionales

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `APP_URL` | URL de tu aplicación | `http://localhost:8080` |
| `CORS_ALLOWED_ORIGINS` | Dominios permitidos para CORS | `http://localhost:8080` |
| `SESSION_LIFETIME` | Duración de sesión (minutos) | `120` |

## 🔧 Configuración Avanzada

### Usar con Proxy Reverso

Si usas Nginx Proxy Manager o Traefik:

```yaml
services:
  dolibarr-frontend:
    # ... configuración anterior ...
    environment:
      - APP_URL=https://dolibarr-frontend.tu-dominio.com
      - CORS_ALLOWED_ORIGINS=https://dolibarr-frontend.tu-dominio.com
    labels:
      # Para Traefik
      - "traefik.enable=true"
      - "traefik.http.routers.dolibarr-frontend.rule=Host(`dolibarr-frontend.tu-dominio.com`)"
      - "traefik.http.routers.dolibarr-frontend.tls=true"
      - "traefik.http.services.dolibarr-frontend.loadbalancer.server.port=80"
```

### Configurar SSL/HTTPS

Si necesitas SSL directo en el contenedor:

```yaml
services:
  dolibarr-frontend:
    # ... configuración anterior ...
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs/dolibarr:ro
    environment:
      - SSL_ENABLED=true
      - SSL_CERT_PATH=/etc/ssl/certs/dolibarr/cert.pem
      - SSL_KEY_PATH=/etc/ssl/certs/dolibarr/key.pem
```

## 📊 Monitoreo y Logs

### Ver Logs en Portainer

1. **Ir a Containers**
2. **Seleccionar** `dolibarr-modern-frontend`
3. **Logs** → Ver logs en tiempo real

### Health Check

El contenedor incluye un health check que verifica:
- ✅ Aplicación responde en puerto 80
- ✅ PHP-FPM funcionando
- ✅ Apache activo

### Comandos Útiles

```bash
# Acceder al contenedor
docker exec -it dolibarr-modern-frontend bash

# Ver logs
docker logs dolibarr-modern-frontend -f

# Reiniciar servicios internos
docker exec dolibarr-modern-frontend php artisan config:clear
docker exec dolibarr-modern-frontend php artisan cache:clear
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a Dolibarr
```
Error: cURL error 6: Could not resolve host
```
**Solución**: Verificar `DOLIBARR_BASE_URL` y conectividad de red.

#### 2. Error de permisos
```
Error: Permission denied
```
**Solución**: Los volúmenes se configuran automáticamente, reiniciar el contenedor.

#### 3. Error de CORS
```
Error: CORS policy blocked
```
**Solución**: Agregar tu dominio a `CORS_ALLOWED_ORIGINS`.

#### 4. Aplicación no carga
**Verificar**:
- Puerto 8080 disponible
- Variables de entorno configuradas
- Logs del contenedor

### Verificar Configuración

```bash
# Verificar variables de entorno
docker exec dolibarr-modern-frontend env | grep DOLIBARR

# Verificar conectividad a Dolibarr
docker exec dolibarr-modern-frontend curl -I $DOLIBARR_BASE_URL

# Verificar aplicación
curl http://tu-servidor:8080/health
```

## 🚀 Acceso a la Aplicación

Una vez desplegado:

- **URL**: `http://tu-servidor:8080`
- **Login**: Usar las credenciales de tu Dolibarr
- **API**: Automáticamente conectado a tu instancia Dolibarr

## 📝 Notas Importantes

1. **Seguridad**: Cambia el puerto por defecto en producción
2. **Backup**: Los volúmenes persisten datos importantes
3. **Actualizaciones**: Rebuild el stack para obtener actualizaciones
4. **Recursos**: Mínimo 1GB RAM recomendado
5. **Red**: Asegurar conectividad entre el contenedor y Dolibarr

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs** del contenedor en Portainer
2. **Verifica las variables** de entorno
3. **Comprueba conectividad** a tu instancia Dolibarr
4. **Consulta la documentación** del proyecto en GitHub

**Repositorio**: https://github.com/cehojac/dolibarr-modern-frontend
