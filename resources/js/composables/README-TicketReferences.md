# useTicketReferences Composable

Composable de Vue para gestionar las referencias de características de tickets desde la API de Dolibarr.

## 📋 Descripción

Este composable proporciona acceso a las referencias del diccionario de tickets de Dolibarr:
- **Categorías de tickets** (`ticket_categories`)
- **Gravedades de tickets** (`ticket_severities`)
- **Tipos de tickets** (`ticket_types`)

## 🚀 Uso Básico

```javascript
import { useTicketReferences } from '@/composables/useTicketReferences'

export default {
  setup() {
    const {
      ticketCategories,
      ticketSeverities,
      ticketTypes,
      fetchAllTicketReferences,
      isLoading
    } = useTicketReferences()

    // Cargar todas las referencias al montar el componente
    onMounted(async () => {
      await fetchAllTicketReferences()
    })

    return {
      ticketCategories,
      ticketSeverities,
      ticketTypes,
      isLoading
    }
  }
}
```

## 📡 Endpoints API

- **Categorías**: `GET /api/doli/setup/dictionary/ticket_categories`
- **Gravedades**: `GET /api/doli/setup/dictionary/ticket_severities`
- **Tipos**: `GET /api/doli/setup/dictionary/ticket_types`

## 🎯 Métodos Disponibles

### fetchTicketCategories(forceRefresh = false)
Obtiene las categorías de tickets desde la API.

```javascript
const { fetchTicketCategories } = useTicketReferences()

// Cargar desde caché si ya existen
await fetchTicketCategories()

// Forzar recarga desde API
await fetchTicketCategories(true)
```

### fetchTicketSeverities(forceRefresh = false)
Obtiene las gravedades de tickets desde la API.

```javascript
const { fetchTicketSeverities } = useTicketReferences()

await fetchTicketSeverities()
```

### fetchTicketTypes(forceRefresh = false)
Obtiene los tipos de tickets desde la API.

```javascript
const { fetchTicketTypes } = useTicketReferences()

await fetchTicketTypes()
```

### fetchAllTicketReferences(forceRefresh = false)
Carga todas las referencias en paralelo (recomendado).

```javascript
const { fetchAllTicketReferences } = useTicketReferences()

const references = await fetchAllTicketReferences()
// Retorna: { categories: [], severities: [], types: [] }
```

## 🔍 Métodos Helper

### getCategoryName(code)
Obtiene el nombre de una categoría por su código.

```javascript
const { getCategoryName } = useTicketReferences()

const categoryName = getCategoryName('TECH_SUPPORT')
// Retorna: "Soporte Técnico" o el código si no se encuentra
```

### getSeverityName(code)
Obtiene el nombre de una gravedad por su código.

```javascript
const { getSeverityName } = useTicketReferences()

const severityName = getSeverityName('HIGH')
// Retorna: "Alta" o el código si no se encuentra
```

### getTypeName(code)
Obtiene el nombre de un tipo por su código.

```javascript
const { getTypeName } = useTicketReferences()

const typeName = getTypeName('INCIDENT')
// Retorna: "Incidente" o el código si no se encuentra
```

## 🗑️ Gestión de Caché

### clearCache()
Limpia el caché de todas las referencias.

```javascript
const { clearCache } = useTicketReferences()

clearCache()
```

## 📊 Estado y Propiedades

### Estados Reactivos
```javascript
const {
  ticketCategories,      // ref([]) - Array de categorías
  ticketSeverities,      // ref([]) - Array de gravedades
  ticketTypes,           // ref([]) - Array de tipos
  loadingCategories,     // ref(false) - Estado de carga de categorías
  loadingSeverities,     // ref(false) - Estado de carga de gravedades
  loadingTypes,          // ref(false) - Estado de carga de tipos
  categoriesLoaded,      // ref(false) - Indica si categorías están cargadas
  severitiesLoaded,      // ref(false) - Indica si gravedades están cargadas
  typesLoaded            // ref(false) - Indica si tipos están cargados
} = useTicketReferences()
```

### Computed Properties
```javascript
const {
  isLoading,    // computed - true si alguna referencia está cargando
  allLoaded     // computed - true si todas las referencias están cargadas
} = useTicketReferences()
```

## 💡 Ejemplos de Uso

### Ejemplo 1: Selector de Categoría
```vue
<template>
  <select v-model="selectedCategory" :disabled="isLoading">
    <option value="">Seleccionar categoría...</option>
    <option 
      v-for="category in ticketCategories" 
      :key="category.id"
      :value="category.code"
    >
      {{ category.label || category.name }}
    </option>
  </select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTicketReferences } from '@/composables/useTicketReferences'

const selectedCategory = ref('')
const { ticketCategories, fetchTicketCategories, isLoading } = useTicketReferences()

onMounted(async () => {
  await fetchTicketCategories()
})
</script>
```

### Ejemplo 2: Mostrar Nombre de Gravedad
```vue
<template>
  <div>
    <span class="badge">{{ getSeverityName(ticket.severity) }}</span>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTicketReferences } from '@/composables/useTicketReferences'

const props = defineProps({
  ticket: Object
})

const { getSeverityName, fetchTicketSeverities } = useTicketReferences()

onMounted(async () => {
  await fetchTicketSeverities()
})
</script>
```

### Ejemplo 3: Cargar Todo al Inicio
```vue
<script setup>
import { onMounted } from 'vue'
import { useTicketReferences } from '@/composables/useTicketReferences'

const {
  ticketCategories,
  ticketSeverities,
  ticketTypes,
  fetchAllTicketReferences,
  allLoaded
} = useTicketReferences()

onMounted(async () => {
  // Cargar todas las referencias en paralelo
  await fetchAllTicketReferences()
  
  console.log('Categorías:', ticketCategories.value.length)
  console.log('Gravedades:', ticketSeverities.value.length)
  console.log('Tipos:', ticketTypes.value.length)
  console.log('Todo cargado:', allLoaded.value)
})
</script>
```

### Ejemplo 4: Formulario de Creación de Ticket
```vue
<template>
  <form @submit.prevent="createTicket">
    <div>
      <label>Categoría</label>
      <select v-model="form.category" required>
        <option value="">Seleccionar...</option>
        <option 
          v-for="cat in ticketCategories" 
          :key="cat.id"
          :value="cat.code"
        >
          {{ cat.label }}
        </option>
      </select>
    </div>

    <div>
      <label>Gravedad</label>
      <select v-model="form.severity" required>
        <option value="">Seleccionar...</option>
        <option 
          v-for="sev in ticketSeverities" 
          :key="sev.id"
          :value="sev.code"
        >
          {{ sev.label }}
        </option>
      </select>
    </div>

    <div>
      <label>Tipo</label>
      <select v-model="form.type" required>
        <option value="">Seleccionar...</option>
        <option 
          v-for="type in ticketTypes" 
          :key="type.id"
          :value="type.code"
        >
          {{ type.label }}
        </option>
      </select>
    </div>

    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Cargando...' : 'Crear Ticket' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTicketReferences } from '@/composables/useTicketReferences'

const form = ref({
  category: '',
  severity: '',
  type: ''
})

const {
  ticketCategories,
  ticketSeverities,
  ticketTypes,
  fetchAllTicketReferences,
  isLoading
} = useTicketReferences()

onMounted(async () => {
  await fetchAllTicketReferences()
})

const createTicket = () => {
  console.log('Crear ticket con:', form.value)
  // Lógica de creación...
}
</script>
```

## ⚡ Características

- ✅ **Caché automático**: Las referencias se cargan una sola vez por sesión
- ✅ **Carga paralela**: `fetchAllTicketReferences()` carga todo en paralelo
- ✅ **Estado compartido**: Todas las instancias comparten el mismo estado
- ✅ **Helpers incluidos**: Métodos para obtener nombres por código
- ✅ **TypeScript ready**: Preparado para TypeScript
- ✅ **Logging detallado**: Logs informativos en consola
- ✅ **Manejo de errores**: Gestión robusta de errores de API

## 🔄 Flujo de Trabajo Recomendado

1. **Importar el composable** en tu componente
2. **Cargar referencias** en `onMounted()` o cuando sea necesario
3. **Usar los datos reactivos** en el template
4. **Usar helpers** para mostrar nombres legibles

## 📝 Notas

- Las referencias se cachean automáticamente para evitar llamadas innecesarias a la API
- Usa `forceRefresh: true` solo cuando necesites actualizar los datos
- El estado es compartido entre todos los componentes que usen el composable
- Los helpers retornan el código original si no encuentran coincidencia

## 🎯 Casos de Uso

- Formularios de creación/edición de tickets
- Filtros de tickets por categoría/gravedad/tipo
- Visualización de badges con nombres legibles
- Validación de campos de tickets
- Reportes y estadísticas de tickets
