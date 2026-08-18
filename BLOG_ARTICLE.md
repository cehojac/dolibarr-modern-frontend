# Dolibarr Modern Frontend: Una Revolución en la Gestión de Tickets y Tareas

## Introducción

Dolibarr Modern Frontend es un proyecto innovador que transforma la experiencia de usuario de Dolibarr mediante una interfaz moderna, intuitiva y altamente funcional. Este artículo detalla el desarrollo de características avanzadas que mejoran significativamente la gestión de tickets, tareas, intervenciones y más.

## Arquitectura del Proyecto

### Stack Tecnológico
- **Backend**: Laravel 12 con PHP 8.3
- **Frontend**: Vue 3 con Vite
- **Estilos**: TailwindCSS
- **Base de Datos**: SQLite
- **Contenedorización**: Docker con multi-stage builds
- **API**: Proxy Laravel hacia API REST de Dolibarr

### Características de Arquitectura
- Multi-stage Docker builds optimizados para producción
- Sistema de caché inteligente con invalidación selectiva
- Proxy API con manejo de tokens públicos y privados
- Soporte para temas claro y oscuro
- Internacionalización automática basada en configuración de empresa

## Sistema de Gestión de Tickets

### Overview de Tickets con Métricas Inteligentes
El sistema incluye un panel de métricas en tiempo real que muestra:
- **Tickets Pendientes**: Alerta visual cuando hay tickets sin asignar
- **Tickets En Progreso**: Tickets actualmente en desarrollo
- **Tickets Completados**: Tickets finalizados
- **Tickets Vencidos**: Alerta para tickets pasados de fecha
- **Tickets de Alta Prioridad**: Alerta para tickets urgentes
- **Total de Tickets**: Conteo total filtrado

### Cronómetro Integrado con Dolibarr
Implementación completa de sistema de cronómetro que crea automáticamente intervenciones en Dolibarr:

**Flujo Técnico:**
1. **Crear Borrador**: POST `/api/doli/interventions` - Retorna ID de intervención
2. **Agregar Línea**: POST `/api/doli/interventions/{id}/lines` con nota y duración
3. **Vincular a Ticket**: PUT `/api/doli/dolibarmodernfrontendapi/link/{ticket_id}/{intervention_id}`
4. **Validar**: POST `/api/doli/interventions/{id}/validate` con `{"notrigger": 1}`

**Características:**
- Panel lateral con selector de proyectos dinámico por cliente
- Tiempo total de intervenciones calculado automáticamente
- Contador de intervenciones por ticket
- Interfaz responsive con tema claro/oscuro
- Validación automática de intervenciones

### Búsqueda por Tracking ID
Sistema de búsqueda pública que permite a clientes encontrar sus tickets:

**Comportamiento por Tipo de Búsqueda:**
- **Solo Tracking ID**: Abre modal directamente con detalles del ticket
- **Tracking ID + Email**: Verifica propiedad y muestra todos los tickets del tercero
- **Solo Email**: Busca tercero y muestra todos sus tickets

**Endpoints Implementados:**
- `GET /api/doli/tickets/track_id/{track_id}` - Búsqueda por tracking ID
- `GET /api/doli/tickets?socid={socid}` - Lista de tickets del tercero
- `GET /api/doli/thirdparties?email={email}` - Búsqueda por email

### Sistema de Plantillas de Email
Integración completa de plantillas de email con sustitución automática de variables:

**Variables Soportadas:**
- **Ticket**: ID, Ref, Tracking ID, Asunto, Mensaje, Tipo, Categoría, Severidad, Estado, Fechas
- **Tercero**: Nombre, Email, Teléfono, Dirección, CP, Ciudad
- **Usuario Asignado**: Nombre, Email, Teléfono
- **Usuario Actual**: Nombre, Email, Teléfono, Firma
- **Fecha**: Fecha actual, Hora, Fecha/Hora completa

**Características:**
- Selector de plantillas filtrado por tipo 'ticket'
- Sustitución automática de variables
- Integración con editor WYSIWYG
- Caché inteligente de plantillas

### Cambio de Empresa Asignada
Sistema para cambiar la empresa asignada a un ticket con buscador intuitivo:

**Características:**
- Buscador en tiempo real por nombre o código de cliente
- Dropdown filtrable con todas las empresas disponibles
- Opción "Sin empresa" siempre disponible
- Actualización en tiempo real sin recargar página
- Consistencia visual con otros selectores de la aplicación

### Formato de Fechas Relativo
Sistema de visualización de fechas en formato amigable para humanos:

**Rangos de Tiempo:**
- **< 1 minuto**: "hace unos segundos"
- **< 1 hora**: "hace X minutos" / "hace 1 minuto"
- **< 24 horas**: "hace X horas" / "hace 1 hora"
- **< 7 días**: "hace X días" / "hace 1 día"
- **< 4 semanas**: "hace X semanas" / "hace 1 semana"
- **< 12 meses**: "hace X meses" / "hace 1 mes"
- **≥ 12 meses**: "hace X años" / "hace 1 año"

**Beneficios:**
- Más intuitivo que fechas tradicionales
- Escaneo rápido de tickets recientes
- Contexto temporal inmediato
- Singular/plural correcto en español

## Sistema de Gestión de Tareas

### Overview de Tareas
Diseño consistente con Tickets y Agenda, incluyendo métricas especializadas:
- **Tareas Pendientes** (con alerta)
- **Tareas En Progreso**
- **Tareas Completadas**
- **Tareas Vencidas** (con alerta)
- **Tareas de Alta Prioridad** (con alerta)
- **Total de Tareas**

### Modal de Detalle de Tareas
Implementación completa con:
- Cronómetro integrado igual que tickets
- Visualización de terceros y usuarios asignados
- Barra de progreso de tareas
- Mejoras en tabla de tareas para diseño compacto
- Consistencia visual con tickets

### Integración API
Endpoint `POST /task/{id_task}` para guardar todos los cambios:
- Cambio de empresa asignada
- Cambio de usuario asignado
- Notas privadas y públicas
- Actualización de estado y prioridad

## Sistema de Gestión de Terceros

### Subsistema Completo con 4 Páginas Especializadas

**Estructura del Menú:**
- **Clientes**: Terceros con filtro client=1 o 3
- **Proveedores**: Terceros con filtro fournisseur=1
- **Contactos**: Contactos con statut=1
- **Socios**: Terceros que son cliente y proveedor

**Características por Página:**

**Clientes.vue:**
- Métricas: Total, Activos, Nuevos este mes, VIP, Ingresos mensuales
- Tabla con ID, Empresa, Contacto principal, Email, Teléfono, Estado, Categoría
- Esquema de color azul para avatares

**Proveedores.vue:**
- Métricas: Total, Activos, Preferidos, Pedidos este mes, Gastos mensuales
- Tabla con información de proveedores
- Esquema de color naranja para avatares
- Botón "Crear Pedido" específico

**Contactos.vue:**
- Métricas: Total, Activos, Principales, Nuevos este mes, Con email
- Tabla con información de contactos
- Esquema de color índigo para avatares
- Funcionalidad email con mailto links

**Socios.vue:**
- Métricas: Total, Activos, Estratégicos, Proyectos conjuntos, Valor de partnership
- Tabla con información de socios
- Esquema de color púrpura/índigo para avatares
- Botón "Gestionar Acuerdo"

## Sistema de Agenda

### Modal de Creación de Eventos
Modal completamente funcional con tema oscuro:
- Badge del usuario con colores dinámicos
- Checkboxes mejorados para tema oscuro
- Placeholders con mejor contraste
- Selects con iconos SVG apropiados
- Estilos CSS personalizados

## Internacionalización

### Sistema i18n con Detección Automática
Sistema completo que detecta automáticamente el idioma preferido:

**Idiomas Soportados:**
- 🇪🇸 Español (es) - Por defecto
- 🇬🇧 Inglés (en)
- 🇪🇸 Catalán (ca)

**Lógica de Prioridad:**
1. Idioma guardado en localStorage (preferencia del usuario)
2. default_lang de la empresa en Dolibarr
3. Fallback a español (es)

**Mapeo de Códigos:**
- `es_ES` → `es`
- `en_US` → `en`
- `ca_ES` → `ca`

**Componentes Internacionalizados:**
- NewTicket.vue - 100%
- ListTickets.vue - 100%
- CreateTicket.vue - Parcial
- LanguageSelector.vue - Componente de selección

## Sistema de Mensajes

### Historial de Mensajes con Nombres Reales
Implementación que muestra nombres reales de autores en lugar de "Usuario":

**Estructura de API:**
```
GET /api/index.php/dolibarmodernfrontendapi/tickets/{ticket_id}/messages
```

**Características:**
- Extracción de `author.name` del objeto author
- Soporte para usuarios internos y contactos externos
- Formato de fecha relativo amigable
- Enriquecimiento automático con datos de usuarios

### Envío de Mensajes Privados
Sistema completo para envío de mensajes en tickets públicos:

**Endpoint:**
```
POST /api/doli/tickets/newmessage
```

**Flujo:**
1. Obtener contacto por email
2. Validar mensaje y ticket seleccionado
3. Enviar mensaje como privado (private: 1)
4. Actualizar lista de mensajes
5. Mostrar confirmación

## Configuración y Despliegue

### Docker Optimizado
Multi-stage build con:
- **Stage 1**: Node.js 20 Alpine para assets Vue/Vite
- **Stage 2**: Composer para dependencias PHP
- **Stage 3**: PHP 8.3 + Apache Bookworm

**Características de Producción:**
- OPcache configurado para rendimiento
- Headers de seguridad (X-Content-Type-Options, X-Frame-Options)
- Healthcheck automático
- Volúmenes persistentes para storage, cache y database
- Límites de recursos (1 CPU, 512MB RAM)

### Configuración CORS
Configuración completa para producción:
```
CORS_ALLOWED_ORIGINS=http://localhost:8080,https://gestion.carlos-herrera.consulting
CORS_ALLOWED_METHODS=*
CORS_ALLOWED_HEADERS=*
CORS_SUPPORTS_CREDENTIALS=true
```

### Resolución de Problemas CSRF
Configuración funcional para Laravel 11:
- `bootstrap/app.php`: middleware->web(replace) con VerifyCsrfToken personalizado
- `VerifyCsrfToken.php`: excepciones 'api/*' y '/api/*'
- `routes/web.php`: rutas API con middleware ['web', 'force.json']
- `config/session.php`: driver database configurado

## Mejoras de UX/UI

### Consistencia Visual
- Timer de tareas con apariencia idéntica a tickets
- Layout balanceado entre contenido principal e información lateral
- Tarjetas de métricas consistentes en toda la aplicación
- Soporte completo para tema claro y oscuro

### Mejoras de Accesibilidad
- Contraste mejorado en modales para tema oscuro
- Placeholders con mejor visibilidad
- Checkboxes con estilos condicionales
- Headers de seguridad implementados

### Logging y Debugging
Sistema de logging detallado para:
- Búsqueda de tickets públicos
- Enrutamiento de proxy API
- Intervenciones y tickets
- Errores de conexión con Dolibarr

## Conclusión

Dolibarr Modern Frontend representa una transformación completa de la experiencia de usuario de Dolibarr, combinando las mejores prácticas de desarrollo moderno con una interfaz intuitiva y funcional. El sistema no solo mejora la estética, sino que optimiza significativamente los flujos de trabajo diarios de gestión de tickets, tareas, intervenciones y terceros.

**Características Clave:**
- ✅ Interfaz moderna y responsive
- ✅ Cronómetro integrado con Dolibarr
- ✅ Sistema de plantillas de email
- ✅ Búsqueda pública de tickets
- ✅ Internacionalización automática
- ✅ Gestión completa de terceros
- ✅ Métricas en tiempo real
- ✅ Docker optimizado para producción
- ✅ Tema claro y oscuro
- ✅ API proxy inteligente

Este proyecto demuestra cómo la modernización de sistemas legacy puede mejorar drásticamente la productividad y satisfacción de los usuarios sin perder la robustez de las funcionalidades existentes.
