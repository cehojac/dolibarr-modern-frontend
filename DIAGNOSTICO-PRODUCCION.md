# 🚨 Diagnóstico Crítico - Producción

## 🔍 Problema Identificado:
- **Local**: `/api/auth/permissions` → ✅ JSON correcto
- **Producción**: `/api/auth/permissions` → ❌ HTML (página de login)

## 🛠️ Debug Implementado:

### 1. **Logs Agregados en AuthController:**
```php
Log::info('getPermissions: Iniciando', [
    'url' => $request->fullUrl(),
    'method' => $request->method(),
    'session_id' => $request->session()->getId(),
    'user_agent' => $request->userAgent(),
    'ip' => $request->ip(),
    'headers' => $request->headers->all(),
    'is_api_route' => $request->is('api/*')
]);
```

### 2. **Middleware ForceJsonResponse:**
- ✅ Detecta respuestas HTML automáticamente
- ✅ Convierte a JSON con error 404
- ✅ Logs de warning cuando detecta HTML

## 🔍 Posibles Causas:

### **A. Middleware no se ejecuta:**
- Ruta no coincide con `api/*`
- Middleware no registrado correctamente

### **B. Sesión no válida:**
- Configuración de sesiones diferente en producción
- Cookies no se envían correctamente
- CORS bloqueando cookies

### **C. Ruta no encontrada:**
- AuthController no se está ejecutando
- Ruta cayendo en fallback de SPA

## 📋 Pasos de Diagnóstico:

### **Paso 1: Verificar Logs de Laravel**
En producción, revisar logs en `storage/logs/laravel.log`:

```bash
tail -f storage/logs/laravel.log
```

Buscar:
- `getPermissions: Iniciando`
- `ForceJsonResponse: Detectada respuesta HTML`
- Errores de sesión

### **Paso 2: Verificar Configuración**

#### **A. Archivo .env de Producción:**
```env
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=.carlos-herrera.consulting
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

#### **B. Verificar Middleware Registrado:**
En `app/Http/Kernel.php`:
```php
protected $middlewareAliases = [
    // ...
    'force.json' => \App\Http\Middleware\ForceJsonResponse::class,
];
```

### **Paso 3: Test Manual**

#### **A. Verificar Ruta Directa:**
```bash
curl -X GET "https://new-gestion.carlos-herrera.consulting/api/auth/permissions" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json"
```

#### **B. Verificar con Sesión:**
```bash
# Primero hacer login para obtener cookies
curl -X POST "https://new-gestion.carlos-herrera.consulting/api/auth/login" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"login":"usuario","password":"password"}' \
     -c cookies.txt

# Luego usar las cookies para permisos
curl -X GET "https://new-gestion.carlos-herrera.consulting/api/auth/permissions" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -b cookies.txt
```

## 🎯 Soluciones Probables:

### **1. Si no aparecen logs de AuthController:**
- La ruta no se está ejecutando
- Verificar configuración de servidor web (Apache/Nginx)

### **2. Si aparecen logs pero devuelve HTML:**
- Problema con middleware ForceJsonResponse
- Verificar orden de middlewares

### **3. Si hay error de sesión:**
- Configurar correctamente SESSION_DOMAIN
- Verificar configuración CORS

## 🚀 Próximos Pasos:

1. **Subir cambios** con logs de debug
2. **Revisar logs** de Laravel en producción
3. **Identificar** dónde se rompe el flujo
4. **Aplicar solución** específica según logs

## 📊 Resultado Esperado:

Después del debug deberías ver en logs:
```
[2024-01-01 12:00:00] getPermissions: Iniciando
[2024-01-01 12:00:00] getPermissions: Permisos devueltos
```

En lugar de:
```
[2024-01-01 12:00:00] ForceJsonResponse: Detectada respuesta HTML
```
