# 🚨 Solución Error de Producción

## 🔍 Problema Identificado:

**Error**: `/api/auth/permissions` devuelve **HTML** en lugar de **JSON** en producción

**Causa**: Problema de **sesión/CORS** específico de producción

## 🛠️ Soluciones a Implementar:

### 1. **Agregar Imports Faltantes**

En `resources/js/composables/usePermissions.js`, línea 3, agregar:

```javascript
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notifications'
```

### 2. **Verificar Configuración de Producción**

#### **A. Archivo `.env` de Producción:**
```env
# Sesiones
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.carlos-herrera.consulting
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# CORS
CORS_ALLOWED_ORIGINS="https://new-gestion.carlos-herrera.consulting,https://gestion.carlos-herrera.consulting"
CORS_SUPPORTS_CREDENTIALS=true
```

#### **B. Verificar CORS en `config/cors.php`:**
```php
'allowed_origins' => [
    'https://new-gestion.carlos-herrera.consulting',
    'https://new.gestion.carlos-herrera.consulting', 
    'https://gestion.carlos-herrera.consulting',
    // ... otros dominios
],
'supports_credentials' => true,
```

### 3. **Verificar Rutas API**

En `routes/api.php`, asegurar que las rutas usen middleware correcto:

```php
Route::middleware(['web'])->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/auth/permissions', [AuthController::class, 'getPermissions']);
    // ... otras rutas
});
```

### 4. **Verificar AuthController**

En `app/Http/Controllers/AuthController.php`, método `getPermissions()`:

```php
public function getPermissions()
{
    // Verificar sesión activa
    if (!session()->has('dolibarr_user_login')) {
        return response()->json(['error' => 'No authenticated'], 401);
    }
    
    // ... resto del código
}
```

### 5. **Mejorar Detección de Errores**

El código ya está actualizado para:
- ✅ Detectar respuestas HTML automáticamente
- ✅ Limpiar estado cuando hay error de sesión
- ✅ Redirigir al login automáticamente
- ✅ Mostrar mensaje específico de error

## 🚀 Pasos para Solucionar:

### **Paso 1: Actualizar Código**
```bash
# 1. Agregar imports en usePermissions.js
# 2. Compilar cambios
npm run build
```

### **Paso 2: Verificar Configuración del Servidor**
```bash
# 1. Verificar .env de producción
# 2. Verificar configuración CORS
# 3. Verificar middleware de rutas
# 4. Reiniciar servidor si es necesario
```

### **Paso 3: Probar en Producción**
1. Hacer login
2. Verificar en consola si aparecen errores
3. Si persiste, verificar logs del servidor Laravel

## 🔍 Debug Adicional:

Si el problema persiste, agregar temporalmente en `AuthController.php`:

```php
public function getPermissions()
{
    Log::info('getPermissions called', [
        'session_id' => session()->getId(),
        'has_user' => session()->has('dolibarr_user_login'),
        'user_agent' => request()->userAgent(),
        'ip' => request()->ip(),
    ]);
    
    // ... resto del código
}
```

## 📊 Resultado Esperado:

- ✅ Login funciona en producción
- ✅ Permisos se cargan correctamente
- ✅ No más errores HTML en lugar de JSON
- ✅ Menú aparece según permisos del usuario
