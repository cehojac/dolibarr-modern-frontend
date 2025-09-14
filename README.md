# Dolibarr Modern Frontend

Un frontend moderno y responsive para Dolibarr ERP/CRM construido con Laravel, Vue 3 y Tailwind CSS.

## 🚀 Características

- **SPA moderna** con Vue 3 + Vue Router + Pinia
- **Proxy seguro** Laravel que oculta la API key de Dolibarr
- **UI moderna** con Tailwind CSS y modo oscuro
- **Búsqueda y filtros** en tiempo real
- **Paginación** para grandes volúmenes de datos
- **Notificaciones toast** para mejor UX
- **Loading skeletons** para mejor percepción de velocidad
- **Responsive design** para desktop y móvil
- **6 módulos principales**: Terceros, Productos, Servicios, Documentos, Agenda, Tickets

## 🛠️ Stack Tecnológico

- **Backend**: Laravel 12
- **Frontend**: Vue 3, Vue Router 4, Pinia 2
- **Estilos**: Tailwind CSS 4
- **Build**: Vite 7
- **HTTP Client**: Axios con interceptores globales

## 📋 Requisitos

- PHP >= 8.2
- Node.js >= 18
- Composer
- Dolibarr con API REST habilitada

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd dolibar-modern-frontend
```

2. **Instalar dependencias PHP**
```bash
composer install
```

3. **Instalar dependencias Node.js**
```bash
npm install
```

4. **Configurar entorno**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar Dolibarr en .env**
```env
DOLIBARR_BASE_URL=https://tu-dolibarr.com/api/index.php
DOLIBARR_API_KEY=tu_api_key_aqui
```

## 🚀 Desarrollo

1. **Iniciar servidor Laravel**
```bash
php artisan serve
```

2. **Iniciar Vite (en otra terminal)**
```bash
npm run dev
```

3. **Acceder a la aplicación**
```
http://localhost:8000
```

## 📦 Producción

1. **Build de assets**
```bash
npm run build
```

2. **Optimizar Laravel**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. **Configurar servidor web** (Apache/Nginx) apuntando a `/public`

## 🔐 Autenticación

El sistema usa la API key de Dolibarr para autenticación:

- **Automática**: Si está configurada en `.env`, se usa automáticamente
- **Manual**: El usuario puede introducir su propia API key en el login
- **Segura**: La API key nunca se expone al navegador, solo al backend Laravel

## 📱 Uso

### Login
1. Accede a la aplicación
2. Deja el campo vacío para usar la API key del `.env` o introduce una específica
3. Haz clic en "Acceder"

### Navegación
- **Sidebar**: Navega entre los diferentes módulos
- **Búsqueda**: Usa la barra de búsqueda para filtrar resultados
- **Filtros**: Aplica filtros específicos por tipo, estado, etc.
- **Paginación**: Navega por grandes conjuntos de datos
- **Modo oscuro**: Alterna con el botón sol/luna en la topbar

### Módulos Disponibles

#### Terceros
- Lista de clientes, prospectos y proveedores
- Búsqueda por nombre y email
- Filtros por tipo y estado
- Paginación automática

#### Productos
- Catálogo de productos
- Vista en cards con precios
- Estados activo/inactivo

#### Servicios
- Catálogo de servicios
- Similar a productos pero para servicios

#### Documentos
- Lista de documentos disponibles
- Información de fecha y tipo
- Botones de descarga

#### Agenda
- Eventos y citas programadas
- Vista cronológica
- Detalles de duración y notas

#### Tickets
- Sistema de soporte
- Estados y prioridades
- Seguimiento completo

## 🎨 Personalización

### Colores
Los colores principales se pueden cambiar en `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#7C3AED', // Purple por defecto
    }
  }
}
```

### Módulos
Para añadir nuevos módulos:

1. Crear vista en `resources/js/views/`
2. Añadir ruta en `resources/js/router/index.js`
3. Añadir al sidebar en `resources/js/layouts/AppLayout.vue`
4. Crear endpoint proxy si es necesario

## 🔧 API Endpoints

El sistema proxy de Laravel expone estos endpoints:

- `POST /api/auth/login` - Autenticación
- `GET /api/auth/me` - Estado de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET|POST|PUT|DELETE /api/doli/*` - Proxy a Dolibarr API

## 🐛 Troubleshooting

### Error de CORS
Asegúrate de que Dolibarr permite requests desde tu dominio.

### API Key inválida
Verifica que la API key sea correcta y tenga los permisos necesarios.

### Errores de build
```bash
npm run build --verbose
```

### Cache issues
```bash
php artisan cache:clear
php artisan config:clear
```

## 📄 Licencia

[Especificar licencia aquí]

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico, crear un issue en el repositorio o contactar al equipo de desarrollo.
