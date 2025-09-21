#!/bin/bash

# Script de configuración inicial para producción
# Ejecutar como root: sudo bash production-setup.sh

echo "🔧 Configurando servidor para new.gestion.carlos-herrera-consulting..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    log_error "Este script debe ejecutarse como root (sudo)"
    exit 1
fi

# 1. Actualizar sistema
log_info "Actualizando sistema..."
apt update && apt upgrade -y
log_success "Sistema actualizado"

# 2. Instalar PHP y extensiones
log_info "Instalando PHP y extensiones..."
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update

apt install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-mbstring \
    php8.2-gd \
    php8.2-bcmath \
    php8.2-json \
    php8.2-tokenizer \
    php8.2-intl \
    php8.2-redis \
    php8.2-opcache

log_success "PHP instalado"

# 3. Configurar PHP para producción
log_info "Configurando PHP para producción..."

# Backup de configuración original
cp /etc/php/8.2/fpm/php.ini /etc/php/8.2/fpm/php.ini.backup

# Optimizaciones de PHP
cat >> /etc/php/8.2/fpm/conf.d/99-production.ini << 'EOF'
; Optimizaciones para producción
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=1

; Configuraciones de seguridad
expose_php=Off
display_errors=Off
display_startup_errors=Off
log_errors=On
error_log=/var/log/php_errors.log

; Límites de memoria y tiempo
memory_limit=256M
max_execution_time=300
max_input_time=300
post_max_size=64M
upload_max_filesize=64M

; Configuraciones de sesión
session.cookie_httponly=1
session.cookie_secure=1
session.use_strict_mode=1
EOF

log_success "PHP configurado"

# 4. Instalar y configurar MySQL
log_info "Instalando MySQL..."
apt install -y mysql-server

# Configurar MySQL para producción
mysql_secure_installation

log_success "MySQL instalado"

# 5. Instalar Composer
log_info "Instalando Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
log_success "Composer instalado"

# 6. Instalar Node.js
log_info "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
log_success "Node.js instalado"

# 7. Instalar y configurar Apache
log_info "Instalando Apache..."
apt install -y apache2

# Habilitar módulos necesarios
a2enmod rewrite ssl headers deflate expires php8.2

# Configurar Apache para producción
cat > /etc/apache2/conf-available/security-production.conf << 'EOF'
# Configuraciones de seguridad para producción
ServerTokens Prod
ServerSignature Off

# Ocultar versión de Apache
Header always unset Server
Header always unset X-Powered-By

# Configuraciones de seguridad adicionales
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Deshabilitar métodos HTTP innecesarios
<Location />
    <LimitExcept GET POST HEAD>
        Require all denied
    </LimitExcept>
</Location>
EOF

a2enconf security-production
log_success "Apache instalado y configurado"

# 8. Configurar firewall
log_info "Configurando firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Apache Full'
log_success "Firewall configurado"

# 9. Instalar Certbot para SSL
log_info "Instalando Certbot..."
apt install -y certbot python3-certbot-apache
log_success "Certbot instalado"

# 10. Crear directorio del proyecto
log_info "Preparando directorio del proyecto..."
mkdir -p /var/www/dolibar-modern-frontend
chown -R www-data:www-data /var/www/dolibar-modern-frontend
log_success "Directorio preparado"

# 11. Configurar logrotate para logs de Laravel
log_info "Configurando rotación de logs..."
cat > /etc/logrotate.d/laravel << 'EOF'
/var/www/dolibar-modern-frontend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload php8.2-fpm
    endscript
}
EOF
log_success "Rotación de logs configurada"

# 12. Crear script de monitoreo
log_info "Creando script de monitoreo..."
cat > /usr/local/bin/monitor-laravel.sh << 'EOF'
#!/bin/bash
# Script de monitoreo para Laravel

APP_DIR="/var/www/dolibar-modern-frontend"
LOG_FILE="/var/log/laravel-monitor.log"

# Función de logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Verificar que la aplicación responde
if ! curl -f -s https://new.gestion.carlos-herrera-consulting > /dev/null; then
    log_message "ERROR: Aplicación no responde"
    # Reiniciar servicios
    systemctl restart apache2
    systemctl restart php8.2-fpm
    log_message "INFO: Servicios reiniciados"
fi

# Verificar espacio en disco
DISK_USAGE=$(df /var/www | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    log_message "WARNING: Uso de disco alto: ${DISK_USAGE}%"
fi

# Limpiar logs antiguos de Laravel si es necesario
find $APP_DIR/storage/logs -name "*.log" -mtime +30 -delete 2>/dev/null
EOF

chmod +x /usr/local/bin/monitor-laravel.sh
log_success "Script de monitoreo creado"

# 13. Configurar cron para monitoreo
log_info "Configurando tareas programadas..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-laravel.sh") | crontab -
log_success "Tareas programadas configuradas"

# 14. Reiniciar servicios
log_info "Reiniciando servicios..."
systemctl restart apache2
systemctl restart php8.2-fpm
systemctl restart mysql
log_success "Servicios reiniciados"

echo ""
log_success "🎉 ¡Configuración del servidor completada!"
echo ""
log_info "Próximos pasos:"
echo "1. Subir el código de la aplicación a /var/www/dolibar-modern-frontend"
echo "2. Configurar el virtual host de Apache"
echo "3. Obtener certificado SSL con: sudo certbot --apache -d new.gestion.carlos-herrera-consulting"
echo "4. Ejecutar el script deploy.sh"
echo ""
log_info "Servicios instalados:"
echo "- PHP 8.2 con extensiones"
echo "- MySQL Server"
echo "- Apache 2.4"
echo "- Composer"
echo "- Node.js 18"
echo "- Certbot"
echo ""
log_info "Configuraciones aplicadas:"
echo "- Optimizaciones de PHP para producción"
echo "- Configuraciones de seguridad"
echo "- Firewall configurado"
echo "- Rotación de logs"
echo "- Monitoreo automático"
echo ""
