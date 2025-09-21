#!/bin/bash

# Script para configurar base de datos en Plesk
echo "🗄️ CONFIGURANDO BASE DE DATOS PARA PLESK"
echo "========================================"

DOMAIN="new.gestion.carlos-herrera-consulting"
PRIVATE_DIR="/var/www/vhosts/$DOMAIN/private"

cd "$PRIVATE_DIR" || exit 1

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

# 1. Verificar archivo .env
log_info "1. Verificando configuración de base de datos..."

if [ ! -f ".env" ]; then
    log_error "Archivo .env no encontrado"
    exit 1
fi

# Verificar configuración actual
DB_CONNECTION=$(grep "^DB_CONNECTION=" .env | cut -d'=' -f2)
DB_DATABASE=$(grep "^DB_DATABASE=" .env | cut -d'=' -f2)

echo "   - Conexión actual: ${DB_CONNECTION:-'no configurada'}"
echo "   - Base de datos: ${DB_DATABASE:-'no configurada'}"

# 2. Configurar para MySQL si está usando SQLite
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    log_warning "Configuración actual usa SQLite, cambiando a MySQL..."
    
    # Backup del .env actual
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    
    # Configurar MySQL
    sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
    
    # Si no existe DB_HOST, agregarlo
    if ! grep -q "^DB_HOST=" .env; then
        echo "DB_HOST=localhost" >> .env
    fi
    
    # Si no existe DB_PORT, agregarlo
    if ! grep -q "^DB_PORT=" .env; then
        echo "DB_PORT=3306" >> .env
    fi
    
    # Configurar base de datos por defecto si no existe
    if [ -z "$DB_DATABASE" ]; then
        DB_NAME="dmf_$(echo $DOMAIN | tr '.' '_' | tr '-' '_')"
        sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env || echo "DB_DATABASE=$DB_NAME" >> .env
        log_info "Base de datos configurada como: $DB_NAME"
    fi
    
    # Configurar usuario por defecto si no existe
    if ! grep -q "^DB_USERNAME=" .env; then
        echo "DB_USERNAME=dmf_user" >> .env
    fi
    
    # Configurar password por defecto si no existe
    if ! grep -q "^DB_PASSWORD=" .env; then
        echo "DB_PASSWORD=CAMBIAR_PASSWORD_AQUI" >> .env
        log_warning "IMPORTANTE: Cambiar DB_PASSWORD en .env"
    fi
    
    log_success "Configuración cambiada a MySQL"
else
    log_success "Ya está configurado para MySQL"
fi

# 3. Crear base de datos SQLite temporal si es necesario para desarrollo
log_info "3. Verificando si necesita SQLite temporal..."

if [ "$DB_CONNECTION" = "sqlite" ]; then
    log_info "Creando base de datos SQLite temporal..."
    
    # Crear directorio database si no existe
    mkdir -p database
    
    # Crear archivo SQLite vacío
    touch database/database.sqlite
    chmod 664 database/database.sqlite
    chown psacln:psaserv database/database.sqlite
    
    log_success "Base de datos SQLite creada temporalmente"
fi

# 4. Verificar conexión MySQL
log_info "4. Verificando conexión MySQL..."

# Leer configuración actual
DB_HOST=$(grep "^DB_HOST=" .env | cut -d'=' -f2)
DB_PORT=$(grep "^DB_PORT=" .env | cut -d'=' -f2)
DB_DATABASE=$(grep "^DB_DATABASE=" .env | cut -d'=' -f2)
DB_USERNAME=$(grep "^DB_USERNAME=" .env | cut -d'=' -f2)
DB_PASSWORD=$(grep "^DB_PASSWORD=" .env | cut -d'=' -f2)

echo "   - Host: ${DB_HOST:-localhost}"
echo "   - Puerto: ${DB_PORT:-3306}"
echo "   - Base de datos: ${DB_DATABASE:-no configurada}"
echo "   - Usuario: ${DB_USERNAME:-no configurado}"

# Test de conexión MySQL si las credenciales están configuradas
if [ -n "$DB_HOST" ] && [ -n "$DB_USERNAME" ] && [ -n "$DB_PASSWORD" ] && [ "$DB_PASSWORD" != "CAMBIAR_PASSWORD_AQUI" ]; then
    log_info "Probando conexión MySQL..."
    
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
        log_success "Conexión MySQL exitosa"
        
        # Verificar si la base de datos existe
        if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "USE $DB_DATABASE;" > /dev/null 2>&1; then
            log_success "Base de datos '$DB_DATABASE' existe"
        else
            log_warning "Base de datos '$DB_DATABASE' no existe"
            echo "   Para crearla manualmente:"
            echo "   mysql -h$DB_HOST -P$DB_PORT -u$DB_USERNAME -p$DB_PASSWORD -e \"CREATE DATABASE $DB_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
        fi
    else
        log_error "No se puede conectar a MySQL con las credenciales proporcionadas"
    fi
else
    log_warning "Credenciales MySQL no configuradas completamente"
fi

# 5. Limpiar cachés de configuración
log_info "5. Limpiando cachés de configuración..."

sudo -u psacln php artisan config:clear
sudo -u psacln php artisan cache:clear

log_success "Cachés limpiados"

# 6. Verificar configuración de Laravel
log_info "6. Verificando configuración de Laravel..."

# Test de configuración
if sudo -u psacln php artisan config:show database.default > /dev/null 2>&1; then
    DB_DEFAULT=$(sudo -u psacln php artisan config:show database.default 2>/dev/null)
    log_success "Configuración Laravel OK - Usando: $DB_DEFAULT"
else
    log_error "Error en configuración de Laravel"
fi

# 7. Intentar ejecutar migraciones si MySQL está configurado
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_PASSWORD" ] && [ "$DB_PASSWORD" != "CAMBIAR_PASSWORD_AQUI" ]; then
    log_info "7. Ejecutando migraciones..."
    
    if sudo -u psacln php artisan migrate:status > /dev/null 2>&1; then
        sudo -u psacln php artisan migrate --force
        log_success "Migraciones ejecutadas"
    else
        log_warning "No se pueden ejecutar migraciones (verificar conexión DB)"
    fi
else
    log_warning "7. Saltando migraciones (configurar credenciales MySQL primero)"
fi

# 8. Mostrar configuración final
echo ""
log_info "CONFIGURACIÓN FINAL:"
echo "==================="

if [ -f ".env" ]; then
    echo "Variables de base de datos en .env:"
    grep -E "^DB_" .env | sed 's/^/   /'
fi

echo ""
log_info "PRÓXIMOS PASOS:"
echo "==============="

if [ "$DB_PASSWORD" = "CAMBIAR_PASSWORD_AQUI" ]; then
    echo "1. ⚠️  IMPORTANTE: Configurar credenciales MySQL reales en .env"
    echo "2. Crear base de datos en Plesk > Databases"
    echo "3. Ejecutar: php artisan migrate"
    echo "4. Probar aplicación"
else
    echo "1. Verificar que la base de datos existe en Plesk > Databases"
    echo "2. Si hay errores, revisar logs: tail -f storage/logs/laravel.log"
    echo "3. Probar aplicación: https://$DOMAIN"
fi

echo ""
log_success "CONFIGURACIÓN DE BASE DE DATOS COMPLETADA"
