# 🐳 Dolibarr Modern Frontend - Docker Deployment

Un frontend moderno y responsive para Dolibarr ERP/CRM construido con Laravel, Vue 3 y Tailwind CSS, listo para desplegar con Docker.

## 🚀 Despliegue Rápido con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/cehojac/dolibarr-modern-frontend.git
cd dolibarr-modern-frontend

# Configurar variables de entorno
cp .env.docker .env

# Editar las variables obligatorias
nano .env
```

Configurar estas variables en `.env`:
```env
DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
DOLIBARR_API_KEY=tu_api_key_aqui
APP_URL=http://localhost:8080
```

```bash
# Construir y ejecutar
docker-compose up -d

# Acceder a la aplicación
# http://localhost:8080
```

### Opción 2: Docker Run

```bash
docker run -d \
  --name dolibarr-modern-frontend \
  -p 8080:80 \
  -e DOLIBARR_BASE_URL="https://tu-dolibarr.com/api/index.php" \
  -e DOLIBARR_API_KEY="tu_api_key_aqui" \
  -e APP_URL="http://localhost:8080" \
  -v dolibarr_storage:/var/www/html/storage \
  -v dolibarr_cache:/var/www/html/bootstrap/cache \
  --restart unless-stopped \
  ghcr.io/cehojac/dolibarr-modern-frontend:latest
```

### Opción 3: Portainer Stack

1. **Ir a Portainer** → **Stacks** → **Add Stack**
2. **Repository**: `https://github.com/cehojac/dolibarr-modern-frontend`
3. **Compose file**: `docker-compose.simple.yml`
4. **Environment variables**:
   ```
   DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
   DOLIBARR_API_KEY=tu_api_key_aqui
   APP_URL=http://tu-servidor:8080
   ```

## ⚙️ Variables de Entorno

### Obligatorias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DOLIBARR_BASE_URL` | URL de la API de Dolibarr | `https://dolibarr.example.com/api/index.php` |
| `DOLIBARR_API_KEY` | Clave API de Dolibarr | `abc123def456ghi789...` |

### Opcionales

| Variable | Descripción | Por Defecto |
|----------|-------------|-------------|
| `APP_URL` | URL de la aplicación | `http://localhost:8080` |
| `CORS_ALLOWED_ORIGINS` | Dominios permitidos | `http://localhost:8080` |
| `SESSION_LIFETIME` | Duración sesión (min) | `120` |

## 🔧 Configuración de Dolibarr

### 1. Habilitar API REST

En tu Dolibarr:
1. **Setup** → **Modules/Applications**
2. Activar **"Web services API REST (server)"**
3. **Setup** → **Other setup** → **Web services**
4. Configurar **"API Explorer"**

### 2. Crear API Key

1. **Users & Groups** → **Users**
2. Seleccionar usuario
3. **API Keys** → **Generate**
4. Copiar la clave generada

### 3. Configurar Permisos

El usuario debe tener permisos para:
- ✅ **Third parties** (read)
- ✅ **Tickets** (read/write)
- ✅ **Projects** (read)
- ✅ **Tasks** (read)
- ✅ **Interventions** (read/write)
- ✅ **Users** (read)

## 🌐 Acceso y Uso

Una vez desplegado:

1. **Acceder**: `http://tu-servidor:8080`
2. **Login**: Usar credenciales de Dolibarr
3. **Navegación**: Menú lateral responsive
4. **Funcionalidades**:
   - 📊 Dashboard con métricas
   - 🎫 Gestión de tickets
   - 👥 Gestión de terceros
   - 📋 Tareas y proyectos
   - ⏱️ Cronómetro de intervenciones
   - 📅 Agenda y recordatorios

## 🔍 Troubleshooting

### Error de conexión
```
cURL error: Could not resolve host
```
**Solución**: Verificar `DOLIBARR_BASE_URL` y conectividad.

### Error de autenticación
```
401 Unauthorized
```
**Solución**: Verificar `DOLIBARR_API_KEY` y permisos del usuario.

### Error de CORS
```
CORS policy blocked
```
**Solución**: Agregar dominio a `CORS_ALLOWED_ORIGINS`.

### Ver logs
```bash
docker logs dolibarr-modern-frontend -f
```

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue 3 SPA     │    │  Laravel API    │    │  Dolibarr API   │
│  (Frontend)     │◄──►│   (Backend)     │◄──►│    (ERP/CRM)    │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Auth          │    │ • Users         │
│ • Tickets       │    │ • Proxy         │    │ • Tickets       │
│ • Terceros      │    │ • Permissions   │    │ • Third parties │
│ • Proyectos     │    │ • Sessions      │    │ • Projects      │
│ • Cronómetro    │    │ • CORS          │    │ • Interventions │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Características

- ✅ **Responsive**: Funciona en desktop, tablet y móvil
- ✅ **Moderno**: Vue 3 + Composition API + Tailwind CSS
- ✅ **Seguro**: Autenticación basada en sesiones
- ✅ **Rápido**: SPA con navegación instantánea
- ✅ **Integrado**: Conecta directamente con Dolibarr API
- ✅ **Docker Ready**: Despliegue con un comando
- ✅ **Multi-idioma**: Soporte para español e inglés

## 📊 Requisitos del Sistema

- **Docker**: >= 20.10
- **RAM**: >= 1GB disponible
- **Disco**: >= 2GB disponible
- **Red**: Acceso a tu instancia Dolibarr
- **Dolibarr**: >= 13.0 con API REST habilitada

## 🔄 Actualizaciones

```bash
# Actualizar imagen
docker pull ghcr.io/cehojac/dolibarr-modern-frontend:latest

# Reiniciar contenedor
docker-compose down
docker-compose up -d
```

## 📝 Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/cehojac/dolibarr-modern-frontend.git
cd dolibarr-modern-frontend

# Instalar dependencias
composer install
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Compilar assets
npm run dev

# Servidor de desarrollo
php artisan serve
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/cehojac/dolibarr-modern-frontend/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/cehojac/dolibarr-modern-frontend/wiki)
- **Discusiones**: [GitHub Discussions](https://github.com/cehojac/dolibarr-modern-frontend/discussions)

---

**Desarrollado con ❤️ para la comunidad Dolibarr**
