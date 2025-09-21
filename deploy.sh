#!/bin/bash

# Script de despliegue para new.gestion.carlos-herrera-consulting
# Ejecutar como: bash deploy.sh

echo "🚀 Iniciando despliegue de Dolibarr Modern Frontend..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "artisan" ]; then
    log_error "No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de Laravel."
    exit 1
fi

# 1. Modo mantenimiento
log_info "Activando modo mantenimiento..."
php artisan down --message="Actualizando sistema..." --retry=60

# 2. Actualizar código desde Git (si aplica)
if [ -d ".git" ]; then
    log_info "Actualizando código desde Git..."
    git pull origin main
    log_success "Código actualizado"
fi

# 3. Instalar dependencias de Composer
log_info "Instalando dependencias de Composer..."
composer install --no-dev --optimize-autoloader --no-interaction
log_success "Dependencias de Composer instaladas"

# 4. Instalar dependencias de Node.js
log_info "Instalando dependencias de Node.js..."
npm ci --production
log_success "Dependencias de Node.js instaladas"

# 5. Compilar assets para producción
log_info "Compilando assets para producción..."
npm run build
log_success "Assets compilados"

# 6. Verificar archivo .env
if [ ! -f ".env" ]; then
    log_warning "Archivo .env no encontrado. Copiando desde .env.example..."
    cp .env.example .env
    log_warning "¡IMPORTANTE! Configura el archivo .env con los valores de producción"
fi

# 7. Generar clave de aplicación (solo si no existe)
if ! grep -q "APP_KEY=base64:" .env; then
    log_info "Generando clave de aplicación..."
    php artisan key:generate --force
    log_success "Clave de aplicación generada"
fi

# 8. Ejecutar migraciones de base de datos
log_info "Ejecutando migraciones de base de datos..."
php artisan migrate --force
log_success "Migraciones ejecutadas"

# 9. Limpiar y optimizar cachés
log_info "Limpiando cachés..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

log_info "Optimizando cachés para producción..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
log_success "Cachés optimizados"

# 10. Optimizar autoloader
log_info "Optimizando autoloader..."
composer dump-autoload --optimize
log_success "Autoloader optimizado"

# 11. Configurar permisos
log_info "Configurando permisos de archivos..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
log_success "Permisos configurados"

# 12. Crear enlace simbólico para storage (si no existe)
if [ ! -L "public/storage" ]; then
    log_info "Creando enlace simbólico para storage..."
    php artisan storage:link
    log_success "Enlace simbólico creado"
fi

# 13. Verificar configuración
log_info "Verificando configuración..."
php artisan config:show app.url
php artisan config:show app.env
php artisan config:show app.debug

# 14. Desactivar modo mantenimiento
log_info "Desactivando modo mantenimiento..."
php artisan up
log_success "Modo mantenimiento desactivado"

echo ""
log_success "🎉 ¡Despliegue completado exitosamente!"
echo ""
log_info "Pasos adicionales recomendados:"
echo "1. Verificar que el archivo .env tenga la configuración correcta"
echo "2. Configurar el certificado SSL"
echo "3. Configurar el virtual host de Apache/Nginx"
echo "4. Verificar que la aplicación funcione correctamente"
echo ""
log_info "URLs importantes:"
echo "- Aplicación: https://new.gestion.carlos-herrera-consulting"
echo "- API Dolibarr: $(php artisan config:show dolibarr.base_url 2>/dev/null || echo 'No configurada')"
echo ""
