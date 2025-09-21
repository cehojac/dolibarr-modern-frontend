# 🚀 Guía de Despliegue - Dolibarr Modern Frontend

## Configuración para `new.gestion.carlos-herrera-consulting`

Esta guía te ayudará a desplegar la aplicación Laravel en el dominio `new.gestion.carlos-herrera-consulting`.

## 📋 Requisitos Previos

- Servidor web (Apache 2.4+ o Nginx 1.18+)
- PHP 8.1 o superior
- MySQL 8.0+ o MariaDB 10.3+
- Node.js 18+ y npm
- Composer 2.x
- Certificado SSL válido
- Acceso SSH al servidor

## 🔧 Pasos de Configuración

### 1. Preparar el Servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-zip php8.2-mbstring php8.2-gd php8.2-bcmath php8.2-json php8.2-tokenizer

# Instalar Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Configurar Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE dolibarr_modern_frontend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario
CREATE USER 'dmf_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON dolibarr_modern_frontend.* TO 'dmf_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Subir Archivos al Servidor

```bash
# Clonar o subir el proyecto
cd /var/www/
sudo git clone https://github.com/tu-usuario/dolibar-modern-frontend.git
# O subir archivos via FTP/SFTP

# Cambiar propietario
sudo chown -R www-data:www-data /var/www/dolibar-modern-frontend
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de configuración
cd /var/www/dolibar-modern-frontend
cp env.production.example .env

# Editar configuración
sudo nano .env
```

**Configuración mínima requerida en `.env`:**

```env
APP_NAME="Dolibarr Modern Frontend"
APP_ENV=production
APP_KEY=base64:GENERAR_CON_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://new.gestion.carlos-herrera-consulting

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dolibarr_modern_frontend
DB_USERNAME=dmf_user
DB_PASSWORD=tu_password_seguro

SESSION_DOMAIN=.carlos-herrera-consulting
SESSION_SECURE_COOKIE=true

DOLIBARR_BASE_URL=https://gestion.carlos-herrera-consulting/api/index.php
DOLIBARR_API_KEY=tu_api_key_de_dolibarr

FRONTEND_URL=https://new.gestion.carlos-herrera-consulting
```

### 5. Ejecutar Script de Despliegue

```bash
# Hacer ejecutable el script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### 6. Configurar Servidor Web

#### Para Apache:

```bash
# Copiar configuración
sudo cp apache-vhost.conf /etc/apache2/sites-available/new.gestion.carlos-herrera-consulting.conf

# Habilitar módulos necesarios
sudo a2enmod rewrite ssl headers deflate expires

# Habilitar sitio
sudo a2ensite new.gestion.carlos-herrera-consulting.conf

# Reiniciar Apache
sudo systemctl restart apache2
```

#### Para Nginx:

```bash
# Copiar configuración
sudo cp nginx-site.conf /etc/nginx/sites-available/new.gestion.carlos-herrera-consulting

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/new.gestion.carlos-herrera-consulting /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 7. Configurar SSL

#### Con Let's Encrypt (Certbot):

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache  # Para Apache
# O
sudo apt install certbot python3-certbot-nginx   # Para Nginx

# Obtener certificado
sudo certbot --apache -d new.gestion.carlos-herrera-consulting
# O
sudo certbot --nginx -d new.gestion.carlos-herrera-consulting
```

### 8. Configurar Tareas Programadas (Cron)

```bash
# Editar crontab
sudo crontab -e

# Agregar estas líneas:
# Ejecutar scheduler de Laravel cada minuto
* * * * * cd /var/www/dolibar-modern-frontend && php artisan schedule:run >> /dev/null 2>&1

# Limpiar logs antiguos (opcional)
0 2 * * * cd /var/www/dolibar-modern-frontend && php artisan log:clear --days=30
```

## 🔒 Configuraciones de Seguridad

### 1. Firewall

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Apache Full'  # O 'Nginx Full'
sudo ufw enable
```

### 2. Permisos de Archivos

```bash
cd /var/www/dolibar-modern-frontend

# Configurar permisos correctos
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

### 3. Ocultar Información del Servidor

**Para Apache** (en `/etc/apache2/conf-available/security.conf`):
```apache
ServerTokens Prod
ServerSignature Off
```

**Para Nginx** (en `/etc/nginx/nginx.conf`):
```nginx
server_tokens off;
```

## 📊 Monitoreo y Logs

### Ubicaciones de Logs

- **Laravel**: `/var/www/dolibar-modern-frontend/storage/logs/`
- **Apache**: `/var/log/apache2/`
- **Nginx**: `/var/log/nginx/`
- **PHP**: `/var/log/php8.2-fpm.log`

### Comandos Útiles de Monitoreo

```bash
# Ver logs de Laravel en tiempo real
tail -f /var/www/dolibar-modern-frontend/storage/logs/laravel.log

# Ver logs de acceso del servidor web
tail -f /var/log/apache2/new.gestion.carlos-herrera-consulting_access.log
# O
tail -f /var/log/nginx/new.gestion.carlos-herrera-consulting_access.log

# Verificar estado de servicios
sudo systemctl status apache2  # O nginx
sudo systemctl status mysql
sudo systemctl status php8.2-fpm
```

## 🔄 Actualizaciones

Para futuras actualizaciones:

```bash
cd /var/www/dolibar-modern-frontend

# Activar modo mantenimiento
php artisan down

# Actualizar código
git pull origin main

# Ejecutar script de despliegue
./deploy.sh

# El script automáticamente desactiva el modo mantenimiento
```

## ✅ Verificación Post-Despliegue

1. **Verificar que la aplicación carga**: https://new.gestion.carlos-herrera-consulting
2. **Probar login** con credenciales de Dolibarr
3. **Verificar conexión API** con Dolibarr
4. **Probar funcionalidades principales**:
   - Dashboard
   - Tickets
   - Terceros
   - Cronómetro
5. **Verificar SSL**: https://www.ssllabs.com/ssltest/
6. **Probar rendimiento**: https://pagespeed.web.dev/

## 🆘 Solución de Problemas

### Error 500 - Internal Server Error

```bash
# Verificar logs
tail -f storage/logs/laravel.log

# Verificar permisos
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Limpiar cachés
php artisan config:clear
php artisan cache:clear
```

### Error de Conexión a Base de Datos

```bash
# Verificar configuración
php artisan config:show database.connections.mysql

# Probar conexión
php artisan migrate:status
```

### Problemas de CORS

```bash
# Verificar configuración CORS
php artisan config:show cors

# Limpiar caché de configuración
php artisan config:clear
php artisan config:cache
```

## 📞 Soporte

Para soporte técnico, contactar:
- Email: soporte@carlos-herrera-consulting
- Documentación: Esta guía
- Logs: Revisar archivos de log mencionados arriba

---

**¡Despliegue completado! 🎉**

La aplicación debería estar funcionando en: https://new.gestion.carlos-herrera-consulting
