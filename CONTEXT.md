# Contexto del Proyecto — Dolibarr Modern Frontend

Documento de referencia generado a partir del estado actual del repositorio. Úsalo para retomar el trabajo sin tener que releer todo el código.

---

## 1. Información General

- **Nombre**: Dolibarr Modern Frontend
- **Rama activa**: `dev`
- **Dominio de producción objetivo**: `new.gestion.carlos-herrera-consulting`
- **Propósito**: Frontend moderno (SPA) para Dolibarr ERP/CRM. Capa de presentación sobre la API REST de Dolibarr, construida con Laravel 12, Vue 3 y Tailwind CSS.

---

## 2. Estado de Git

- **Rama**: `dev`
- **Últimos commits**:
  - `c51246d` feat: reorder ticket timeline to show newest messages first and move message form above history
  - `a312e7e` feat: add file attachment support to public ticket messaging with size validation
  - `7013068` chore: remove production domain references from configuration files
  - `e2a97e9` Merge branch 'docker' into dev - resolve conflicts
  - `d548e97` Merge branch 'dev' of origin into dev

- **Archivos con cambios pendientes (modified / untracked)**:
  - `composer.lock`
  - `package.json`
  - `pnpm-lock.yaml`
  - `pnpm-workspace.yaml`
  - `BLOG_ARTICLE.md` (nuevo)
  - `DEPLOYMENT.md` ya existe en repo

- **Nota**: Los cambios en `package.json`, `pnpm-workspace.yaml` y lockfiles indican ajustes recientes de dependencias / workspace. Revisar antes de mergear.

---

## 3. Stack Tecnológico

### Backend
- **Laravel 12** (`laravel/framework ^12.0`)
- **PHP** `^8.2`
- **Livewire/Volt** (`livewire/volt ^1.7.0`)
- **Base de datos**: SQLite por defecto (configurable MySQL)
- **HTTP Client**: `App\Http\Clients\PleskHttpClient`

### Frontend
- **Vue 3** `^3.5.41`
- **Vue Router 4** `^4.6.4`
- **Pinia 2** `^2.3.1` + `pinia-plugin-persistedstate`
- **Vue I18n 9** `^9.14.5`
- **Axios** `^1.19.0`
- **TipTap 2** (`@tiptap/vue-3 ^2.27.2`)
- **Tailwind CSS 3** `^3.4.19`
- **Vite 7** `^7.3.6`
- **lodash-es**

---

## 4. Estructura del Proyecto

```
dolibarr-modern-frontend/
├── app/
│   └── Http/
│       ├── Clients/PleskHttpClient.php
│       ├── Controllers/
│       │   ├── AuthController.php
│       │   ├── CacheController.php
│       │   ├── DoliImageProxyController.php
│       │   └── DoliProxyController.php
│       └── Middleware/
├── bootstrap/
├── config/
├── database/
├── docker/
├── public/
├── resources/
│   ├── css/app.css
│   ├── js/
│   │   ├── app.js
│   │   ├── App.vue
│   │   ├── components/
│   │   ├── composables/
│   │   ├── i18n/
│   │   ├── layouts/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── utils/
│   │   └── views/
│   └── views/app.blade.php
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php
├── .env.example
├── composer.json
├── package.json
├── tailwind.config.cjs
└── vite.config.js
```

---

## 5. Backend — Controladores y Rutas

### Rutas principales (`routes/web.php`)

```
GET  /                         → SPA (app.blade.php)
GET  /api/doli-image           → Proxy de imágenes de Dolibarr
POST /api/auth/login           → Login
POST /api/auth/logout          → Logout
GET  /api/auth/me              → Estado de sesión
GET  /api/auth/permissions     → Permisos del usuario
POST /api/auth/check-permission→ Verificar permiso específico
GET  /api/auth/debug-session   → Debug de sesión
GET  /api/cache/stats          → Stats de caché
POST /api/cache/clear/{module} → Limpiar caché de módulo
POST /api/cache/flush          → Limpiar toda la caché
POST /api/cache/check          → Verificar caché
ANY  /api/doli/{path}          → Proxy general a API Dolibarr
```

### Controladores (`app/Http/Controllers/`)

- **AuthController.php**: Login con Dolibarr, gestión de sesión, permisos.
- **DoliProxyController.php**: Proxy seguro a la API de Dolibarr (GET, POST, PUT, DELETE).
- **DoliImageProxyController.php**: Proxy de imágenes.
- **CacheController.php**: Gestión de caché inteligente.

---

## 6. Frontend — Arquitectura

### Vistas principales (`resources/js/views/`)

- `Dashboard.vue`
- `Terceros.vue` (vista general)
- `terceros/` (submódulos)
  - `Clientes.vue`, `Proveedores.vue`, `Contactos.vue`, `Socios.vue`
- `comercial/`
  - `ClientesPotenciales.vue`, `Presupuestos.vue`, `Contratos.vue`
- `financiera/` (8 submódulos)
- `Tickets.vue`
- `Tareas.vue`
- `Proyectos.vue`
- `Agenda.vue`
- `Documentos.vue`
- `Productos.vue`, `Servicios.vue`
- `Login.vue`
- `public/`: `NewTicket.vue`, `CreateTicket.vue`, `ListTickets.vue`, `TrackTicket.vue`

### Composables (`resources/js/composables/`)

- `useAuth.js`, `usePermissions.js`
- `useApiCache.js`, `useCache.js`
- `usePagination.js`, `useSearch.js`
- `useDateFormatter.js`, `useValidation.js`
- `useTheme.js`
- `useDolibarrStatus.js`
- `useExtrafields.js`
- `useWysiwygEditor.js`
- `useTicketTimer.js`, `useInterventions.js`
- `useThirdparties.js`, `useThirdpartySearch.js`
- `useProjects.js`
- `useEmailTemplates.js`
- `useTicketDetails.js`, `useTicketReferences.js`
- Contadores: `useAgendaCounter.js`, `useTicketsCounter.js`, `useTasksCounter.js`, etc.

### Componentes (`resources/js/components/`)

- `NotificationContainer.vue`
- `LoadingSkeleton.vue`
- `Pagination.vue`, `SearchFilter.vue`, `FormInput.vue`
- `Breadcrumbs.vue`, `LanguageSelector.vue`
- `PermissionGuard.vue`
- `WysiwygEditor.vue`, `TimerButton.vue`
- `ThirdpartySearchInput.vue`
- `TicketDetailModal.vue`
- `CacheManager.vue`, `LoginProgress.vue`

### Stores (`resources/js/stores/`)

- `auth.js` — sesión y usuario
- `notifications.js` — notificaciones toast

### Internacionalización (`resources/js/i18n/`)

- Idiomas: `es`, `en`, `ca`

---

## 7. Configuración Clave

### Variables de entorno (`.env` / `.env.example`)

```env
APP_NAME=DolibarrModernFrontend
APP_ENV=local
APP_URL=http://localhost
DB_CONNECTION=sqlite
SESSION_DRIVER=file
CACHE_STORE=database
QUEUE_CONNECTION=database

DOLIBARR_BASE_URL=https://your-dolibar.domain/api/index.php
DOLIBARR_API_KEY=your-dolibarr-api-key
FRONTEND_URL=http://localhost:8000
```

### Tailwind (`tailwind.config.cjs`)

- Colores: `primary`, `secondary`, `success`, `warning`, `danger`, `dolibarr`
- Fuentes: `Inter`, `JetBrains Mono`
- Dark mode: `class`
- Breakpoints: `xs` (475px), `3xl` (1600px)
- Animaciones: `fade-in`, `slide-in`, `bounce-in`, etc.

### Vite (`vite.config.js`)

- Alias: `@` → `/resources/js`, `~` → `/resources`
- Code splitting: `vendor`, `utils`
- HMR en `localhost:5173`

---

## 8. Funcionalidades Implementadas (resumen)

- Autenticación segura contra Dolibarr (API key oculta en backend).
- Sistema de permisos basado en Dolibarr, plano y seguro en sesión de servidor.
- Proxy a Dolibarr con caché inteligente.
- Sidebar colapsable con submenús y permisos dinámicos.
- Módulos: Terceros, Comercial, Financiera, Productos, Servicios, Proyectos, Documentos, Agenda, Tickets, Tareas.
- Portal público de tickets (crear, listar, seguimiento).
- Cronómetro de tiempo en tickets y tareas.
- Intervenciones vinculadas a tickets.
- Recordatorios integrados con agenda.
- Editor WYSIWYG con TipTap.
- Sistema de notificaciones toast y loading skeletons.
- Modo oscuro persistente.
- Internacionalización con detección automática de idioma.

---

## 9. Puntos de Atención / Áreas Activas

- **Tickets**: archivo más grande (`~388 KB`), funcionalidad principal con cronómetro, intervenciones, recordatorios, cambio de empresa, timeline.
- **Tareas**: (`~202 KB`) modal completo, timer, edición en línea.
- **Caché**: gestión de caché por módulo en backend.
- **CSRF**: configurado solo para rutas Laravel internas (`/api/auth/*`, `/api/cache/*`), no para proxy `/api/doli/*`.
- **Dependencias**: cambios recientes en `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`; verificar antes de build.
- **Docker**: configuración disponible, recientemente limpiada.

---

## 10. Comandos Rápidos

```bash
# Desarrollo
composer install
npm install
php artisan serve
npm run dev

# Producción
npm run build
php artisan optimize

# Cachés
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
```

---

*Última actualización: 2026-08-18*
