# useEmailTemplates Composable

Composable reutilizable para gestionar plantillas de email y variables de sustitución de Dolibarr.

## Características

- ✅ Caché inteligente de plantillas y variables
- ✅ Filtrado por tipo, idioma, estado y privacidad
- ✅ Búsqueda de plantillas por nombre/etiqueta
- ✅ Variables de sustitución por contexto
- ✅ Gestión de errores y estados de carga
- ✅ Limpieza de caché

## Instalación

```javascript
import { useEmailTemplates } from '@/composables/useEmailTemplates'

const {
  loading,
  error,
  getEmailTemplates,
  getSubstitutionVariables
} = useEmailTemplates()
```

## API - Plantillas de Email

### getEmailTemplates(filters, useCache)

Obtiene plantillas de email con filtros opcionales.

**Parámetros:**
- `filters` (Object, opcional):
  - `type_template` (string): Tipo de plantilla ('thirdparty', 'invoice', 'ticket', etc.)
  - `lang` (string): Código de idioma ('es_ES', 'en_US', 'fr_FR')
  - `enabled` (number): Estado habilitado (0 o 1)
  - `private` (number): Estado privado (0=público, 1=privado)
- `useCache` (boolean): Si debe usar caché (default: true)

**Retorna:** `Promise<Array>` - Array de plantillas

**Ejemplo:**
```javascript
// Obtener todas las plantillas de tickets habilitadas
const templates = await getEmailTemplates({
  type_template: 'ticket',
  enabled: 1
})

// Obtener plantillas en español
const spanishTemplates = await getEmailTemplates({
  lang: 'es_ES'
})

// Obtener plantillas públicas habilitadas
const publicTemplates = await getEmailTemplates({
  enabled: 1,
  private: 0
})
```

### loadAllEmailTemplates()

Carga todas las plantillas de email sin filtros (para caché completo).

**Retorna:** `Promise<Array>` - Array de todas las plantillas

**Ejemplo:**
```javascript
const allTemplates = await loadAllEmailTemplates()
console.log(`Total de plantillas: ${allTemplates.length}`)
```

### getTemplatesByType(type, useCache)

Obtiene plantillas de email por tipo específico.

**Parámetros:**
- `type` (string): Tipo de plantilla
- `useCache` (boolean): Si debe usar caché (default: true)

**Retorna:** `Promise<Array>` - Array de plantillas del tipo especificado

**Ejemplo:**
```javascript
// Plantillas para tickets
const ticketTemplates = await getTemplatesByType('ticket')

// Plantillas para facturas
const invoiceTemplates = await getTemplatesByType('invoice')

// Plantillas para terceros
const thirdpartyTemplates = await getTemplatesByType('thirdparty')
```

### getTemplatesByLanguage(lang, useCache)

Obtiene plantillas de email por idioma.

**Parámetros:**
- `lang` (string): Código de idioma
- `useCache` (boolean): Si debe usar caché (default: true)

**Retorna:** `Promise<Array>` - Array de plantillas del idioma especificado

**Ejemplo:**
```javascript
const spanishTemplates = await getTemplatesByLanguage('es_ES')
const englishTemplates = await getTemplatesByLanguage('en_US')
const frenchTemplates = await getTemplatesByLanguage('fr_FR')
```

### getEnabledTemplates(useCache)

Obtiene solo plantillas habilitadas.

**Retorna:** `Promise<Array>` - Array de plantillas habilitadas

**Ejemplo:**
```javascript
const enabledTemplates = await getEnabledTemplates()
```

### getPublicTemplates(useCache)

Obtiene solo plantillas públicas.

**Retorna:** `Promise<Array>` - Array de plantillas públicas

**Ejemplo:**
```javascript
const publicTemplates = await getPublicTemplates()
```

### findTemplateById(templateId)

Busca una plantilla específica por ID en el caché.

**Parámetros:**
- `templateId` (number|string): ID de la plantilla

**Retorna:** `Object|null` - Plantilla encontrada o null

**Ejemplo:**
```javascript
const template = findTemplateById(123)
if (template) {
  console.log('Plantilla encontrada:', template.label)
}
```

### searchTemplates(searchTerm)

Busca plantillas por nombre, etiqueta o tipo.

**Parámetros:**
- `searchTerm` (string): Término de búsqueda

**Retorna:** `Array` - Array de plantillas que coinciden

**Ejemplo:**
```javascript
const results = searchTemplates('bienvenida')
console.log(`Encontradas ${results.length} plantillas`)
```

## API - Variables de Sustitución

### getSubstitutionVariables(context, useCache)

Obtiene variables de sustitución disponibles.

**Parámetros:**
- `context` (string, opcional): Contexto ('ticket', 'invoice', 'thirdparty', 'user', 'mycompany', 'global')
- `useCache` (boolean): Si debe usar caché (default: true)

**Retorna:** `Promise<Array>` - Array de variables de sustitución

**Ejemplo:**
```javascript
// Todas las variables
const allVariables = await getSubstitutionVariables()

// Variables para tickets
const ticketVariables = await getSubstitutionVariables('ticket')

// Variables para facturas
const invoiceVariables = await getSubstitutionVariables('invoice')

// Variables de terceros
const thirdpartyVariables = await getSubstitutionVariables('thirdparty')
```

### loadAllSubstitutionVariables()

Carga todas las variables de sustitución sin filtros.

**Retorna:** `Promise<Array>` - Array de todas las variables

**Ejemplo:**
```javascript
const allVariables = await loadAllSubstitutionVariables()
console.log(`Total de variables: ${allVariables.length}`)
```

### getVariablesByContext(context, useCache)

Obtiene variables de sustitución por contexto específico.

**Parámetros:**
- `context` (string): Contexto
- `useCache` (boolean): Si debe usar caché (default: true)

**Retorna:** `Promise<Array>` - Array de variables del contexto especificado

**Ejemplo:**
```javascript
const userVariables = await getVariablesByContext('user')
const globalVariables = await getVariablesByContext('global')
const companyVariables = await getVariablesByContext('mycompany')
```

## Gestión de Caché

### clearTemplatesCache()

Limpia el caché de plantillas de email.

**Ejemplo:**
```javascript
clearTemplatesCache()
```

### clearVariablesCache()

Limpia el caché de variables de sustitución.

**Ejemplo:**
```javascript
clearVariablesCache()
```

### clearAllCache()

Limpia todo el caché (plantillas y variables).

**Ejemplo:**
```javascript
clearAllCache()
```

### getCacheStats()

Obtiene estadísticas del caché.

**Retorna:** `Object` - Objeto con estadísticas

**Ejemplo:**
```javascript
const stats = getCacheStats()
console.log('Estadísticas del caché:', stats)
// {
//   templatesKeys: 5,
//   variablesKeys: 3,
//   allTemplatesLoaded: true,
//   allVariablesLoaded: true
// }
```

## Estados Reactivos

### loading

Estado de carga de las peticiones.

**Tipo:** `Ref<boolean>`

**Ejemplo:**
```vue
<template>
  <div v-if="loading">Cargando plantillas...</div>
</template>

<script setup>
const { loading, getEmailTemplates } = useEmailTemplates()
</script>
```

### error

Error de las peticiones (si existe).

**Tipo:** `Ref<string|null>`

**Ejemplo:**
```vue
<template>
  <div v-if="error" class="error">{{ error }}</div>
</template>

<script setup>
const { error, getEmailTemplates } = useEmailTemplates()
</script>
```

## Ejemplos de Uso Completos

### Ejemplo 1: Selector de Plantillas de Tickets

```vue
<template>
  <div>
    <select v-model="selectedTemplate" :disabled="loading">
      <option value="">Seleccionar plantilla...</option>
      <option 
        v-for="template in templates" 
        :key="template.id" 
        :value="template.id"
      >
        {{ template.label }}
      </option>
    </select>
    
    <div v-if="loading">Cargando plantillas...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmailTemplates } from '@/composables/useEmailTemplates'

const { loading, error, getTemplatesByType } = useEmailTemplates()
const templates = ref([])
const selectedTemplate = ref('')

onMounted(async () => {
  templates.value = await getTemplatesByType('ticket')
})
</script>
```

### Ejemplo 2: Editor de Email con Variables

```vue
<template>
  <div>
    <textarea v-model="emailContent"></textarea>
    
    <div class="variables">
      <h3>Variables disponibles:</h3>
      <button 
        v-for="variable in variables" 
        :key="variable"
        @click="insertVariable(variable)"
      >
        {{ variable }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmailTemplates } from '@/composables/useEmailTemplates'

const { getVariablesByContext } = useEmailTemplates()
const emailContent = ref('')
const variables = ref([])

onMounted(async () => {
  variables.value = await getVariablesByContext('ticket')
})

const insertVariable = (variable) => {
  emailContent.value += ` ${variable}`
}
</script>
```

### Ejemplo 3: Búsqueda de Plantillas

```vue
<template>
  <div>
    <input 
      v-model="searchTerm" 
      placeholder="Buscar plantillas..."
      @input="handleSearch"
    />
    
    <div v-for="template in searchResults" :key="template.id">
      <h4>{{ template.label }}</h4>
      <p>{{ template.topic }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEmailTemplates } from '@/composables/useEmailTemplates'

const { searchTemplates, loadAllEmailTemplates } = useEmailTemplates()
const searchTerm = ref('')
const searchResults = ref([])

// Cargar todas las plantillas al inicio
loadAllEmailTemplates()

const handleSearch = () => {
  if (searchTerm.value.length >= 3) {
    searchResults.value = searchTemplates(searchTerm.value)
  } else {
    searchResults.value = []
  }
}
</script>
```

### Ejemplo 4: Filtros Múltiples

```vue
<template>
  <div>
    <select v-model="filters.type_template">
      <option value="">Todos los tipos</option>
      <option value="ticket">Tickets</option>
      <option value="invoice">Facturas</option>
      <option value="thirdparty">Terceros</option>
    </select>
    
    <select v-model="filters.lang">
      <option value="">Todos los idiomas</option>
      <option value="es_ES">Español</option>
      <option value="en_US">Inglés</option>
      <option value="fr_FR">Francés</option>
    </select>
    
    <label>
      <input type="checkbox" v-model="filters.enabled" :true-value="1" :false-value="undefined">
      Solo habilitadas
    </label>
    
    <button @click="applyFilters">Aplicar filtros</button>
    
    <div v-for="template in templates" :key="template.id">
      {{ template.label }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEmailTemplates } from '@/composables/useEmailTemplates'

const { getEmailTemplates } = useEmailTemplates()
const templates = ref([])
const filters = ref({
  type_template: '',
  lang: '',
  enabled: undefined
})

const applyFilters = async () => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== undefined)
  )
  templates.value = await getEmailTemplates(activeFilters)
}
</script>
```

## Tipos de Plantillas Comunes

- `thirdparty` - Terceros/Clientes
- `invoice` - Facturas
- `order` - Pedidos
- `ticket` - Tickets/Soporte
- `proposal` - Presupuestos
- `contract` - Contratos
- `project` - Proyectos
- `user` - Usuarios

## Contextos de Variables Comunes

- `ticket` - Variables de tickets
- `invoice` - Variables de facturas
- `thirdparty` - Variables de terceros
- `user` - Variables de usuario
- `mycompany` - Variables de la empresa
- `global` - Variables globales

## Notas

- El caché se mantiene durante toda la sesión
- Las plantillas y variables se cargan bajo demanda
- El caché se puede limpiar manualmente si es necesario
- Los filtros se combinan con AND (todos deben cumplirse)
- La búsqueda es case-insensitive
