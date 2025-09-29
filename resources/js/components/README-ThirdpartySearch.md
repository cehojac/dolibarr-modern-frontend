# ThirdpartySearchInput Component

Componente Vue reutilizable para buscar terceros/clientes activos en Dolibarr.

## Características

- ✅ **Búsqueda inteligente**: Mínimo 3 caracteres para activar búsqueda
- ✅ **Filtros automáticos**: Solo clientes activos (`client:=:1` y `status:=:1`)
- ✅ **Búsqueda avanzada**: Por nombre (`t.nom`) y alias (`t.name_alias`)
- ✅ **Caché inteligente**: Evita peticiones duplicadas
- ✅ **Debounce**: 300ms de retraso para optimizar peticiones
- ✅ **Temas**: Soporte para modo claro y oscuro
- ✅ **Accesibilidad**: Navegación con teclado y estados visuales

## API Endpoint

```
GET /api/doli/thirdparties
```

### Parámetros utilizados:
- `properties`: `id,idprof1,email,name,alias`
- `sqlfilters`: `(client:=:1) and (status:=:1) and ((t.nom:LIKE:'%término%')or(t.name_alias:LIKE:'%término%'))`
- `limit`: `50` (para mejor rendimiento)

## Uso Básico

```vue
<template>
  <ThirdpartySearchInput
    v-model="selectedThirdparty"
    placeholder="Buscar cliente..."
    @selected="handleThirdpartySelected"
    @cleared="handleThirdpartyCleared"
  />
</template>

<script setup>
import { ref } from 'vue'
import ThirdpartySearchInput from '@/components/ThirdpartySearchInput.vue'

const selectedThirdparty = ref(null)

const handleThirdpartySelected = (thirdparty) => {
  console.log('Cliente seleccionado:', thirdparty)
  // thirdparty contiene: { id, name, alias, email, idprof1 }
}

const handleThirdpartyCleared = () => {
  console.log('Búsqueda limpiada')
}
</script>
```

## Props

| Prop | Tipo | Defecto | Descripción |
|------|------|---------|-------------|
| `modelValue` | Object | `null` | Tercero seleccionado (v-model) |
| `placeholder` | String | `'Buscar cliente...'` | Texto del placeholder |
| `disabled` | Boolean | `false` | Deshabilitar el componente |
| `initialValue` | String | `''` | Valor inicial del input |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:modelValue` | `Object\|null` | Se emite cuando cambia la selección |
| `selected` | `Object` | Se emite cuando se selecciona un tercero |
| `cleared` | - | Se emite cuando se limpia la selección |

## Métodos Expuestos

```vue
<template>
  <ThirdpartySearchInput ref="searchRef" />
</template>

<script setup>
import { ref } from 'vue'

const searchRef = ref()

// Limpiar programáticamente
searchRef.value.clear()

// Establecer valor programáticamente
searchRef.value.setValue(thirdpartyObject)

// Enfocar el input
searchRef.value.focus()
</script>
```

## Estructura de Datos

### Tercero Seleccionado
```javascript
{
  id: "123",
  name: "Empresa S.L.",
  alias: "empresa-sl",
  email: "contacto@empresa.com",
  idprof1: "B12345678"
}
```

## Composable useThirdpartySearch

El componente utiliza internamente el composable `useThirdpartySearch` que también puede usarse independientemente:

```javascript
import { useThirdpartySearch } from '@/composables/useThirdpartySearch'

const {
  searchTerm,
  searchResults,
  isSearching,
  canSearch,
  searchThirdparties,
  clearSearch,
  getDisplayName,
  findThirdpartyById,
  clearCache
} = useThirdpartySearch()
```

## Implementación en Tickets

El componente está integrado en el detalle de tickets para la edición de empresa:

```vue
<!-- En Tickets.vue -->
<ThirdpartySearchInput
  v-model="selectedThirdparty"
  placeholder="Buscar cliente..."
  @selected="handleThirdpartySelected"
  @cleared="handleThirdpartyCleared"
/>
```

## Rendimiento

- **Caché**: Las búsquedas se cachean para evitar peticiones duplicadas
- **Debounce**: 300ms de retraso en la búsqueda
- **Límite**: Máximo 50 resultados por búsqueda
- **Mínimo**: Requiere 3 caracteres para activar búsqueda

## Personalización

El componente respeta automáticamente el tema activo (claro/oscuro) usando `useDark()` de VueUse.

### Estilos personalizados
Los estilos se basan en Tailwind CSS y se adaptan automáticamente al tema:

- **Tema claro**: Fondo blanco, texto negro, bordes grises
- **Tema oscuro**: Fondo gris oscuro, texto blanco, bordes grises oscuros
