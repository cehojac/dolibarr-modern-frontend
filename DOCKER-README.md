# 🐳 Docker Setup para Dolibarr Modern Frontend

Esta guía te ayudará a ejecutar la aplicación Dolibarr Modern Frontend usando Docker, proporcionando un entorno consistente y fácil de desplegar.

## 📋 Requisitos Previos

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git** (para clonar el repositorio)
- Al menos **2GB de RAM** disponible
- Al menos **5GB de espacio en disco**

## 🚀 Inicio Rápido

### 1. Preparar el Entorno

```bash
# Clonar el repositorio (si no lo tienes)
git clone <repository-url>
cd dolibar-modern-frontend

# Hacer ejecutable el script de construcción
chmod +x docker/scripts/build.sh
```

### 2. Configurar Variables de Entorno

```bash
# Copiar y editar el archivo de configuración
cp .env.docker .env

# Editar las variables importantes:
nano .env
```

**Variables críticas a configurar:**

```env
# URL de tu aplicación
APP_URL=http://localhost:8080

# Configuración de Dolibarr
DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
DOLIBARR_API_KEY=tu_api_key_aqui

# CORS (agregar tu dominio)
CORS_ALLOWED_ORIGINS=http://localhost:8080,https://tu-dominio.com
```

### 3. Construir y Ejecutar

```bash
# Opción 1: Usar el script helper
./docker/scripts/build.sh build
./docker/scripts/build.sh up

# Opción 2: Usar Docker Compose directamente
docker-compose build
docker-compose up -d
```

### 4. Verificar que Funciona

- **Aplicación**: http://localhost:8080
- **Base de datos**: localhost:3306 (si está habilitada)
- **Redis**: localhost:6379 (si está habilitado)

## 🛠️ Comandos Útiles

### Script Helper

```bash
# Construir imagen
./docker/scripts/build.sh build

# Levantar servicios
./docker/scripts/build.sh up

# Ver logs
./docker/scripts/build.sh logs

# Acceder al shell del contenedor
./docker/scripts/build.sh shell

# Detener servicios
./docker/scripts/build.sh down

# Reiniciar servicios
./docker/scripts/build.sh restart

# Limpiar Docker
./docker/scripts/build.sh clean
```

### Docker Compose Directo

```bash
# Construir y levantar
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Ejecutar comandos dentro del contenedor
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan migrate

# Detener todo
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## 🏗️ Arquitectura del Contenedor

### Servicios Incluidos

1. **app** - Aplicación Laravel + Vue.js
   - PHP 8.2 + Apache
   - Puerto: 8080
   - Compilación automática de assets

2. **db** - Base de datos MySQL (opcional)
   - MySQL 8.0
   - Puerto: 3306
   - Datos persistentes

3. **redis** - Cache Redis (opcional)
   - Redis 7
   - Puerto: 6379

4. **nginx** - Proxy reverso (opcional para producción)
   - Nginx con SSL
   - Puertos: 80, 443

### Estructura de Archivos

```
docker/
├── apache/
│   ├── 000-default.conf    # Configuración de Apache
│   └── apache2.conf        # Configuración principal
├── nginx/
│   └── default.conf        # Configuración de Nginx
├── scripts/
│   └── build.sh           # Script helper
└── init.sh                # Script de inicialización

.env.docker                # Variables de entorno para Docker
docker-compose.yml         # Configuración de servicios
Dockerfile                 # Imagen de la aplicación
.dockerignore             # Archivos excluidos
```

## ⚙️ Configuración Avanzada

### Variables de Entorno Importantes

```env
# Aplicación
APP_NAME="Dolibarr Modern Frontend"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8080

# Base de datos (si usas la incluida)
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=dolibarr_frontend
DB_USERNAME=dolibarr_user
DB_PASSWORD=secure_password

# Dolibarr API
DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
DOLIBARR_API_KEY=tu_api_key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080,https://tu-dominio.com
CORS_SUPPORTS_CREDENTIALS=true

# Cache (opcional)
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379
```

### Personalizar la Configuración

#### 1. Modificar Apache

Edita `docker/apache/000-default.conf` para cambiar la configuración del servidor web.

#### 2. Agregar SSL

```bash
# Crear certificados SSL
mkdir -p docker/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout docker/ssl/key.pem \
    -out docker/ssl/cert.pem

# Habilitar Nginx con SSL
# Descomenta el servicio nginx en docker-compose.yml
```

#### 3. Usar Base de Datos Externa

```env
# En .env, cambiar:
DB_HOST=tu-servidor-mysql.com
DB_PORT=3306
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Comentar el servicio 'db' en docker-compose.yml
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "8081:80"  # En lugar de 8080:80
```

#### 2. Permisos de archivos
```bash
# Ejecutar dentro del contenedor
docker-compose exec app chown -R www-data:www-data /var/www/html/storage
docker-compose exec app chmod -R 775 /var/www/html/storage
```

#### 3. Error de memoria
```bash
# Aumentar memoria disponible para Docker
# En Docker Desktop: Settings > Resources > Memory
```

#### 4. Assets no se compilan
```bash
# Reconstruir con caché limpio
docker-compose build --no-cache app
```

### Logs y Debugging

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs app
docker-compose logs db

# Ver logs en tiempo real
docker-compose logs -f app

# Acceder al contenedor para debugging
docker-compose exec app bash

# Ver procesos dentro del contenedor
docker-compose exec app ps aux

# Ver configuración de PHP
docker-compose exec app php -i
```

## 🚀 Despliegue en Producción

### 1. Preparar para Producción

```bash
# Usar configuración de producción
cp .env.docker .env.production

# Editar variables críticas
nano .env.production
```

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Usar base de datos externa
DB_HOST=tu-servidor-produccion.com

# Configurar cache con Redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 2. Construir para Producción

```bash
# Construir imagen optimizada
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Levantar con configuración de producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Configurar Proxy Reverso

Si usas un proxy reverso externo (como Nginx o Traefik), configura:

```nginx
upstream dolibarr_frontend {
    server localhost:8080;
}

server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://dolibarr_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoreo y Mantenimiento

### Health Checks

```bash
# Verificar estado de los servicios
docker-compose ps

# Health check manual
curl http://localhost:8080/health

# Ver uso de recursos
docker stats
```

### Backups

```bash
# Backup de la base de datos
docker-compose exec db mysqldump -u root -p dolibarr_frontend > backup.sql

# Backup de archivos de storage
docker cp dolibarr-modern-frontend:/var/www/html/storage ./storage-backup
```

### Actualizaciones

```bash
# Actualizar código
git pull origin main

# Reconstruir imagen
docker-compose build --no-cache app

# Reiniciar servicios
docker-compose up -d --force-recreate app
```

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs**: `docker-compose logs app`
2. **Verifica la configuración**: Variables de entorno en `.env`
3. **Comprueba conectividad**: Acceso a Dolibarr API
4. **Recursos del sistema**: Memoria y espacio en disco disponibles

Para más ayuda, consulta la documentación principal del proyecto o abre un issue en el repositorio.
