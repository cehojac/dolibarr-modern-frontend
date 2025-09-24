#!/bin/bash

# Script para construir y ejecutar la aplicación Docker

set -e

echo "🚀 Construyendo Dolibarr Modern Frontend con Docker..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  build     Construir la imagen Docker"
    echo "  up        Levantar los servicios"
    echo "  down      Detener los servicios"
    echo "  restart   Reiniciar los servicios"
    echo "  logs      Ver logs de la aplicación"
    echo "  shell     Acceder al shell del contenedor"
    echo "  clean     Limpiar imágenes y volúmenes no utilizados"
    echo "  help      Mostrar esta ayuda"
    echo ""
}

# Función para construir la imagen
build_image() {
    echo -e "${BLUE}📦 Construyendo imagen Docker...${NC}"
    
    # Verificar que los archivos necesarios existen
    if [ ! -f "Dockerfile" ]; then
        echo -e "${RED}❌ Error: Dockerfile no encontrado${NC}"
        exit 1
    fi
    
    if [ ! -f "docker-compose.yml" ]; then
        echo -e "${RED}❌ Error: docker-compose.yml no encontrado${NC}"
        exit 1
    fi
    
    # Construir la imagen
    docker-compose build --no-cache
    
    echo -e "${GREEN}✅ Imagen construida exitosamente${NC}"
}

# Función para levantar servicios
start_services() {
    echo -e "${BLUE}🚀 Levantando servicios...${NC}"
    
    # Verificar configuración
    if [ ! -f ".env.docker" ]; then
        echo -e "${YELLOW}⚠️  Archivo .env.docker no encontrado, creando uno básico...${NC}"
        cp .env.example .env.docker 2>/dev/null || echo "# Configurar variables de entorno" > .env.docker
    fi
    
    # Levantar servicios
    docker-compose up -d
    
    echo -e "${GREEN}✅ Servicios iniciados${NC}"
    echo -e "${BLUE}🌐 Aplicación disponible en: http://localhost:8080${NC}"
    
    # Mostrar estado de los servicios
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    docker-compose ps
}

# Función para detener servicios
stop_services() {
    echo -e "${BLUE}🛑 Deteniendo servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

# Función para reiniciar servicios
restart_services() {
    echo -e "${BLUE}🔄 Reiniciando servicios...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

# Función para ver logs
show_logs() {
    echo -e "${BLUE}📋 Mostrando logs de la aplicación...${NC}"
    docker-compose logs -f app
}

# Función para acceder al shell
access_shell() {
    echo -e "${BLUE}🐚 Accediendo al shell del contenedor...${NC}"
    docker-compose exec app bash
}

# Función para limpiar
clean_docker() {
    echo -e "${BLUE}🧹 Limpiando Docker...${NC}"
    
    echo -e "${YELLOW}⚠️  Esto eliminará imágenes y volúmenes no utilizados${NC}"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -f
        docker volume prune -f
        echo -e "${GREEN}✅ Limpieza completada${NC}"
    else
        echo -e "${YELLOW}❌ Limpieza cancelada${NC}"
    fi
}

# Función principal
main() {
    case "${1:-help}" in
        build)
            build_image
            ;;
        up)
            start_services
            ;;
        down)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            show_logs
            ;;
        shell)
            access_shell
            ;;
        clean)
            clean_docker
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker no está instalado${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Error: Docker Compose no está instalado${NC}"
    exit 1
fi

# Ejecutar función principal
main "$@"
