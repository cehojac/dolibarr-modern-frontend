#!/bin/bash

# Script de despliegue específico para Plesk
# Ejecutar desde el directorio del proyecto

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"
PUBLIC_DIR="/var/www/vhosts/$DOMAIN/httpdocs"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🚀 Desplegando Laravel en Plesk para $DOMAIN"
echo "================================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "artisan" ]; then
    log_error "No se encontró artisan. Ejecutar desde el directorio raíz de Laravel."
    exit 1
fi

# 1. Crear directorios si no existen
log_info "1. Preparando directorios..."
sudo mkdir -p "$PRIVATE_DIR"
sudo mkdir -p "$PUBLIC_DIR"
log_success "Directorios preparados"

# 2. Copiar archivos de Laravel (excepto public) a private
log_info "2. Copiando archivos de Laravel a directorio privado..."
sudo rsync -av --exclude='public' --exclude='node_modules' --exclude='.git' ./ "$PRIVATE_DIR/"
log_success "Archivos copiados a $PRIVATE_DIR"

# 3. Copiar contenido de public a httpdocs
log_info "3. Copiando archivos públicos..."
if [ -d "public" ]; then
    sudo cp -r public/* "$PUBLIC_DIR/"
    log_success "Archivos públicos copiados"
else
    log_error "Directorio public no encontrado"
    exit 1
fi

# 4. Crear index.php específico para Plesk
log_info "4. Configurando index.php para Plesk..."
sudo cp index-plesk.php "$PUBLIC_DIR/index.php"
log_success "index.php configurado"

# 5. Configurar .htaccess
log_info "5. Configurando .htaccess..."
sudo tee "$PUBLIC_DIR/.htaccess" > /dev/null << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF
log_success ".htaccess configurado"

# 6. Configurar archivo .env si no existe
log_info "6. Configurando variables de entorno..."
if [ ! -f "$PRIVATE_DIR/.env" ]; then
    if [ -f "env.production.example" ]; then
        sudo cp env.production.example "$PRIVATE_DIR/.env"
        log_success "Archivo .env creado desde template"
    else
        log_error "Template env.production.example no encontrado"
        exit 1
    fi
else
    log_success "Archivo .env ya existe"
fi

# 7. Cambiar al directorio privado para comandos de Laravel
cd "$PRIVATE_DIR" || exit 1

# 8. Instalar dependencias de Composer
log_info "8. Instalando dependencias de Composer..."
sudo -u psacln composer install --no-dev --optimize-autoloader --no-interaction
log_success "Dependencias instaladas"

# 9. Generar APP_KEY si no existe
log_info "9. Configurando APP_KEY..."
if ! sudo grep -q "APP_KEY=base64:" .env; then
    sudo -u psacln php artisan key:generate --force
    log_success "APP_KEY generada"
else
    log_success "APP_KEY ya configurada"
fi

# 10. Configurar permisos
log_info "10. Configurando permisos..."
sudo chown -R psacln:psaserv "$PRIVATE_DIR"
sudo chown -R psacln:psaserv "$PUBLIC_DIR"
sudo chmod -R 755 "$PRIVATE_DIR/storage" "$PRIVATE_DIR/bootstrap/cache"
log_success "Permisos configurados"

# 11. Limpiar cachés
log_info "11. Limpiando cachés..."
sudo -u psacln php artisan config:clear
sudo -u psacln php artisan route:clear
sudo -u psacln php artisan view:clear
sudo -u psacln php artisan cache:clear
log_success "Cachés limpiados"

# 12. Ejecutar migraciones
log_info "12. Ejecutando migraciones..."
sudo -u psacln php artisan migrate --force
log_success "Migraciones ejecutadas"

# 13. Optimizar para producción
log_info "13. Optimizando para producción..."
sudo -u psacln php artisan config:cache
sudo -u psacln php artisan route:cache
sudo -u psacln php artisan view:cache
log_success "Optimizaciones aplicadas"

# 14. Instalar dependencias de Node.js y compilar assets
log_info "14. Compilando assets..."
if [ -f "package.json" ]; then
    sudo -u psacln npm install --production
    sudo -u psacln npm run build
    
    # Copiar assets compilados al directorio público
    if [ -d "public/build" ]; then
        sudo cp -r public/build "$PUBLIC_DIR/"
        log_success "Assets compilados y copiados"
    fi
else
    log_warning "package.json no encontrado, saltando compilación de assets"
fi

# 15. Crear enlace simbólico para storage
log_info "15. Configurando storage..."
sudo -u psacln php artisan storage:link
log_success "Storage configurado"

# 16. Verificación final
log_info "16. Verificación final..."
echo "Configuración actual:"
echo "- APP_URL: $(sudo -u psacln php artisan tinker --execute="echo config('app.url');" 2>/dev/null)"
echo "- APP_ENV: $(sudo -u psacln php artisan tinker --execute="echo config('app.env');" 2>/dev/null)"
echo "- DB: $(sudo -u psacln php artisan tinker --execute="echo config('database.default');" 2>/dev/null)"

# Verificar que la aplicación responde
log_info "Probando respuesta de la aplicación..."
if curl -f -s "https://$DOMAIN" > /dev/null; then
    log_success "Aplicación responde correctamente"
else
    log_warning "La aplicación no responde aún (puede necesitar configuración adicional)"
fi

echo ""
log_success "🎉 ¡Despliegue en Plesk completado!"
echo ""
log_info "Pasos adicionales recomendados:"
echo "1. Verificar configuración PHP en Plesk (versión 8.1+, extensiones)"
echo "2. Configurar base de datos en Plesk si no está hecha"
echo "3. Verificar SSL en Plesk"
echo "4. Revisar logs si hay errores:"
echo "   - PHP: /var/www/vhosts/$DOMAIN/logs/php_error.log"
echo "   - Apache: /var/www/vhosts/$DOMAIN/logs/error_log"
echo "   - Laravel: $PRIVATE_DIR/storage/logs/laravel.log"
echo ""
log_info "URL de la aplicación: https://$DOMAIN"
echo ""
