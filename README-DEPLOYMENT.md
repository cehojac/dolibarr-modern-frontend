# 🚀 Despliegue en new.gestion.carlos-herrera-consulting

## Resumen Rápido

Este proyecto Laravel está configurado para desplegarse en el dominio `new.gestion.carlos-herrera-consulting` con integración completa a Dolibarr.

## 📁 Archivos de Configuración Creados

- `📄 env.production.example` - Configuración de variables de entorno para producción
- `🌐 apache-vhost.conf` - Configuración de Virtual Host para Apache
- `🌐 nginx-site.conf` - Configuración alternativa para Nginx
- `🔒 config/cors.php` - Configuración de CORS para el dominio
- `🚀 deploy.sh` - Script automatizado de despliegue
- `⚙️ production-setup.sh` - Script de configuración inicial del servidor
- `📚 DEPLOYMENT.md` - Guía completa de despliegue

## ⚡ Despliegue Rápido

### 1. Preparar Servidor (Solo primera vez)
```bash
# Ejecutar como root
sudo bash production-setup.sh
```

### 2. Configurar Aplicación
```bash
# Copiar configuración
cp env.production.example .env

# Editar variables importantes
nano .env
```

### 3. Desplegar
```bash
# Ejecutar script de despliegue
bash deploy.sh
```

### 4. Configurar Dominio
```bash
# Para Apache
sudo cp apache-vhost.conf /etc/apache2/sites-available/new.gestion.carlos-herrera-consulting.conf
sudo a2ensite new.gestion.carlos-herrera-consulting.conf
sudo systemctl restart apache2

# Obtener SSL
sudo certbot --apache -d new.gestion.carlos-herrera-consulting
```

## 🔧 Variables de Entorno Críticas

```env
# Dominio principal
APP_URL=https://new.gestion.carlos-herrera-consulting

# Conexión a Dolibarr
DOLIBARR_BASE_URL=https://gestion.carlos-herrera-consulting/api/index.php
DOLIBARR_API_KEY=tu_api_key_aqui

# Configuración de sesiones para el dominio
SESSION_DOMAIN=.carlos-herrera-consulting
SESSION_SECURE_COOKIE=true

# CORS
FRONTEND_URL=https://new.gestion.carlos-herrera-consulting
```

## 🎯 Funcionalidades Principales

### ✅ Sistema de Tickets
- Cronómetro integrado con persistencia en localStorage
- Creación automática de intervenciones en Dolibarr
- Vinculación ticket-intervención mediante módulo personalizado
- Interfaz responsive con tema claro/oscuro

### ✅ Gestión de Terceros
- **Clientes**: Filtrado por tipo de cliente
- **Proveedores**: Gestión de proveedores y pedidos
- **Contactos**: Directorio de contactos con email
- **Socios**: Gestión de partnerships

### ✅ Dashboard Inteligente
- Contadores en tiempo real de tickets y tareas asignadas
- Métricas de intervenciones del usuario
- Eventos de agenda del día
- Auto-refresh cada 5 minutos

### ✅ Integración Dolibarr
- API proxy Laravel para comunicación segura
- Autenticación unificada
- Sincronización de datos en tiempo real
- Módulo personalizado `dolibarrmodernfrontendapi`

## 🔒 Configuraciones de Seguridad

### Headers de Seguridad Implementados
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`

### CORS Configurado
- Dominios permitidos: `*.carlos-herrera-consulting`
- Credenciales habilitadas para autenticación
- Headers específicos para API de Dolibarr

### Cookies Seguras
- `HttpOnly` y `Secure` habilitados
- Dominio compartido para subdominios
- `SameSite=Lax` para compatibilidad

## 📊 Monitoreo y Logs

### Ubicaciones de Logs
```bash
# Laravel
tail -f storage/logs/laravel.log

# Servidor web
tail -f /var/log/apache2/new.gestion.carlos-herrera-consulting_access.log

# Monitoreo automático
tail -f /var/log/laravel-monitor.log
```

### Comandos Útiles
```bash
# Estado de la aplicación
php artisan about

# Verificar configuración
php artisan config:show app.url
php artisan config:show cors

# Limpiar cachés
php artisan optimize:clear

# Ver rutas
php artisan route:list
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# Modo mantenimiento
php artisan down

# Actualizar código
git pull origin main

# Ejecutar despliegue
bash deploy.sh

# La aplicación se reactiva automáticamente
```

## 🆘 Solución de Problemas Comunes

### Error 500
```bash
# Verificar logs
tail -f storage/logs/laravel.log

# Verificar permisos
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Error de CORS
```bash
# Limpiar caché de configuración
php artisan config:clear
php artisan config:cache
```

### Error de Conexión a Dolibarr
```bash
# Verificar configuración
php artisan config:show dolibarr

# Probar conexión
curl -H "DOLAPIKEY: tu_api_key" https://gestion.carlos-herrera-consulting/api/index.php/users
```

## 📞 URLs Importantes

- **Aplicación**: https://new.gestion.carlos-herrera-consulting
- **Dolibarr**: https://gestion.carlos-herrera-consulting
- **API Dolibarr**: https://gestion.carlos-herrera-consulting/api/index.php

## 🎉 Estado del Proyecto

- ✅ **Frontend Vue.js**: Completamente funcional
- ✅ **Backend Laravel**: API proxy configurada
- ✅ **Integración Dolibarr**: Módulo personalizado activo
- ✅ **Cronómetro**: Persistencia y sincronización completa
- ✅ **Responsive Design**: Optimizado para móvil y desktop
- ✅ **Seguridad**: Headers y CORS configurados
- ✅ **Monitoreo**: Scripts automáticos implementados

---

**¡La aplicación está lista para producción! 🚀**

Para soporte técnico, revisar los logs o contactar al equipo de desarrollo.
