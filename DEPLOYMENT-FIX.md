# 🚀 Corrección del Problema de Sesión en Producción

## 📋 Problema Identificado

En producción, la aplicación devuelve HTML en lugar de JSON para las rutas API, específicamente `/api/auth/permissions`, causando errores de autenticación.

## 🔧 Correcciones Implementadas

### 1. **Middleware ForceJsonResponse**
- ✅ Creado middleware para forzar respuestas JSON en rutas API
- ✅ Registrado en `bootstrap/app.php` con alias `force.json`
- ✅ Aplicado a todas las rutas API en `routes/web.php`

### 2. **Mejoras en AuthController**
- ✅ Verificación de sesión activa en `getPermissions()`
- ✅ Logs detallados para debugging
- ✅ Manejo de errores 401 cuando no hay sesión
- ✅ Información adicional de debugging

### 3. **Configuración CORS Actualizada**
- ✅ Dominios de producción incluidos
- ✅ `supports_credentials: true` mantenido
- ✅ Paths `api/*` incluidos

### 4. **HTTP Client Mejorado**
- ✅ `withCredentials: true` configurado
- ✅ Detector de respuestas HTML mejorado
- ✅ Manejo automático de redirecciones

## 🚀 Instrucciones de Despliegue

### Paso 1: Verificar Configuración Local
```bash
# Verificar que todas las configuraciones están correctas
php artisan verify:config

# Verificar rutas API
php artisan debug:api-routes
```

### Paso 2: Desplegar en Producción
```bash
# Ejecutar script de despliegue
chmod +x deploy-fix.sh
./deploy-fix.sh
```

### Paso 3: Verificación Manual

1. **Verificar variables de entorno en producción:**
   ```bash
   # Asegúrate de que estas variables estén configuradas:
   DOLIBARR_BASE_URL=https://gestion.carlos-herrera.consulting/api/index.php
   DOLIBARR_API_KEY=tu_api_key_aqui
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Verificar logs de Laravel:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Probar endpoint manualmente:**
   ```bash
   # Desde el servidor de producción
   curl -X GET "https://new-gestion.carlos-herrera.consulting/api/auth/permissions" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        --cookie-jar cookies.txt \
        --cookie cookies.txt
   ```

## 🔍 Debugging

### Comandos Útiles
```bash
# Verificar configuración completa
php artisan verify:config

# Ver todas las rutas API
php artisan debug:api-routes

# Limpiar caché
php artisan config:clear && php artisan route:clear && php artisan cache:clear

# Recompilar caché
php artisan config:cache && php artisan route:cache
```

### Logs a Revisar
- `storage/logs/laravel.log` - Logs de Laravel
- Logs del servidor web (Apache/Nginx)
- Logs de PHP-FPM (si aplica)

## ✅ Checklist de Verificación

- [ ] Middleware `ForceJsonResponse` creado y registrado
- [ ] Rutas API usan middleware `force.json`
- [ ] `withCredentials: true` en `http.js`
- [ ] CORS incluye dominios de producción
- [ ] Variables de entorno configuradas
- [ ] Caché limpiada y recompilada
- [ ] Assets compilados con `npm run build`
- [ ] Permisos de archivos correctos
- [ ] Servicios web reiniciados

## 🎯 Resultado Esperado

Después del despliegue:
1. ✅ Login funciona correctamente
2. ✅ Permisos se cargan sin errores
3. ✅ No más respuestas HTML en rutas API
4. ✅ Sesión se mantiene correctamente
5. ✅ Navegación funciona sin redirecciones inesperadas

## 🆘 Solución de Problemas

### Si sigue devolviendo HTML:
1. Verificar configuración del servidor web
2. Revisar logs de Apache/Nginx
3. Comprobar que las rutas están llegando a Laravel
4. Verificar middleware en las rutas

### Si hay errores de CORS:
1. Verificar dominio en `config/cors.php`
2. Comprobar `supports_credentials: true`
3. Revisar headers en la respuesta

### Si la sesión no se mantiene:
1. Verificar `withCredentials: true`
2. Comprobar configuración de cookies en `.env`
3. Revisar configuración de sesiones de Laravel

## 📞 Contacto

Si necesitas ayuda adicional, revisa los logs y proporciona:
- Logs de Laravel
- Logs del servidor web
- Respuesta exacta del endpoint problemático
- Configuración de variables de entorno (sin API keys)
