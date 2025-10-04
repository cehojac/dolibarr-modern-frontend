# Componente y Composable de Detalles de Ticket

## 📋 Descripción

Sistema modular y reutilizable para mostrar detalles de tickets en cualquier página de la aplicación. Incluye un componente Vue (`TicketDetailModal.vue`) y un composable (`useTicketDetails.js`) con toda la lógica necesaria.

---

## 🚀 Uso Básico

### 1. Importar en tu componente

```vue
<script setup>
import { useTicketDetails } from '@/composables/useTicketDetails'
import TicketDetailModal from '@/components/TicketDetailModal.vue'

// Inicializar el composable
const {
  showModal,
  selectedTicket,
  ticketDetails,
  loadingDetails,
  openTicketDetails,
  closeTicketDetails,
  refreshTicketDetails
} = useTicketDetails()
</script>
```

### 2. Agregar el componente al template

```vue
<template>
  <div>
    <!-- Tu contenido -->
    <button @click="openTicketDetails(ticket)">
      Ver detalles
    </button>

    <!-- Modal de detalles -->
    <TicketDetailModal
      :show="showModal"
      :ticket-details="ticketDetails"
      :loading="loadingDetails"
      @close="closeTicketDetails"
    />
  </div>
</template>
```

---

## 📚 API del Composable

### Estado Reactivo

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `showModal` | `Ref<Boolean>` | Controla la visibilidad del modal |
| `selectedTicket` | `Ref<Object>` | Ticket seleccionado actualmente |
| `ticketDetails` | `Ref<Object>` | Detalles completos del ticket |
| `loadingDetails` | `Ref<Boolean>` | Estado de carga de los detalles |

### Métodos

#### `openTicketDetails(ticket)`
Abre el modal y carga los detalles del ticket.

```javascript
// Ejemplo
const ticket = { id: 123, ref: 'TK001', subject: 'Problema...' }
await openTicketDetails(ticket)
```

**Parámetros:**
- `ticket` (Object): Objeto ticket con al menos el campo `id`

**Retorna:** `Promise<void>`

---

#### `closeTicketDetails()`
Cierra el modal y limpia el estado.

```javascript
closeTicketDetails()
```

**Retorna:** `void`

---

#### `refreshTicketDetails()`
Recarga los detalles del ticket actual sin cerrar el modal.

```javascript
await refreshTicketDetails()
```

**Retorna:** `Promise<void>`

---

#### `updateTicketStatus(ticketId, newStatus)`
Actualiza el estado de un ticket.

```javascript
await updateTicketStatus(123, '7') // 7 = Resuelto
```

**Parámetros:**
- `ticketId` (Number|String): ID del ticket
- `newStatus` (Number|String): Nuevo estado del ticket

**Estados disponibles:**
- `0` - No leído
- `1` - Leído
- `2` - Asignado
- `3` - En progreso
- `4` - Necesita más info
- `5` - Necesita más info (cliente)
- `6` - En espera
- `7` - Resuelto
- `8` - Cerrado
- `9` - Cancelado

**Retorna:** `Promise<Object>`

---

#### `updateTicketField(ticketId, data)`
Actualiza cualquier campo del ticket.

```javascript
await updateTicketField(123, {
  fk_user_assign: 5,
  severity_code: 'HIGH',
  subject: 'Nuevo asunto'
})
```

**Parámetros:**
- `ticketId` (Number|String): ID del ticket
- `data` (Object): Campos a actualizar

**Retorna:** `Promise<Object>`

---

## 🎨 Componente TicketDetailModal

### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `show` | Boolean | ✅ | - | Controla la visibilidad del modal |
| `ticketDetails` | Object | ❌ | `null` | Detalles completos del ticket |
| `loading` | Boolean | ❌ | `false` | Estado de carga |

### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `close` | - | Se emite al cerrar el modal |
| `update` | `ticket` | Se emite cuando se actualiza el ticket |

### Slots

#### `actions`
Permite agregar botones de acción personalizados.

```vue
<TicketDetailModal
  :show="showModal"
  :ticket-details="ticketDetails"
  :loading="loadingDetails"
  @close="closeTicketDetails"
>
  <template #actions="{ ticket }">
    <button @click="handleCustomAction(ticket)">
      Acción personalizada
    </button>
  </template>
</TicketDetailModal>
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Uso básico desde una tabla

```vue
<script setup>
import { ref } from 'vue'
import { useTicketDetails } from '@/composables/useTicketDetails'
import TicketDetailModal from '@/components/TicketDetailModal.vue'

const tickets = ref([
  { id: 1, ref: 'TK001', subject: 'Problema 1' },
  { id: 2, ref: 'TK002', subject: 'Problema 2' }
])

const {
  showModal,
  ticketDetails,
  loadingDetails,
  openTicketDetails,
  closeTicketDetails
} = useTicketDetails()
</script>

<template>
  <div>
    <table>
      <tr v-for="ticket in tickets" :key="ticket.id">
        <td>{{ ticket.ref }}</td>
        <td>{{ ticket.subject }}</td>
        <td>
          <button @click="openTicketDetails(ticket)">
            Ver detalles
          </button>
        </td>
      </tr>
    </table>

    <TicketDetailModal
      :show="showModal"
      :ticket-details="ticketDetails"
      :loading="loadingDetails"
      @close="closeTicketDetails"
    />
  </div>
</template>
```

---

### Ejemplo 2: Uso desde Agenda con acciones personalizadas

```vue
<script setup>
import { useTicketDetails } from '@/composables/useTicketDetails'
import TicketDetailModal from '@/components/TicketDetailModal.vue'

const {
  showModal,
  ticketDetails,
  loadingDetails,
  openTicketDetails,
  closeTicketDetails,
  updateTicketStatus
} = useTicketDetails()

const handleResolve = async (ticket) => {
  await updateTicketStatus(ticket.id, '7')
  alert('Ticket resuelto')
}
</script>

<template>
  <div>
    <!-- Evento de agenda vinculado a ticket -->
    <div @click="openTicketDetails(event.linked_ticket)">
      {{ event.title }}
    </div>

    <TicketDetailModal
      :show="showModal"
      :ticket-details="ticketDetails"
      :loading="loadingDetails"
      @close="closeTicketDetails"
    >
      <template #actions="{ ticket }">
        <button @click="handleResolve(ticket)">
          Marcar como resuelto
        </button>
      </template>
    </TicketDetailModal>
  </div>
</template>
```

---

### Ejemplo 3: Actualizar campo específico

```vue
<script setup>
import { useTicketDetails } from '@/composables/useTicketDetails'

const { updateTicketField } = useTicketDetails()

const assignTicket = async (ticketId, userId) => {
  try {
    await updateTicketField(ticketId, {
      fk_user_assign: userId
    })
    alert('Ticket asignado correctamente')
  } catch (error) {
    alert('Error al asignar ticket')
  }
}
</script>
```

---

## 🎯 Páginas donde se puede usar

- ✅ **Tickets** - Ya implementado
- ✅ **Agenda** - Ver tickets vinculados a eventos
- ✅ **Dashboard** - Vista rápida de tickets recientes
- ✅ **Proyectos** - Ver tickets vinculados a proyectos
- ✅ **Terceros** - Ver tickets de un cliente específico
- ✅ **Cualquier página** - Donde se necesite mostrar detalles de tickets

---

## 🔧 Personalización

### Agregar campos adicionales

Puedes extender el componente `TicketDetailModal.vue` para mostrar más información:

```vue
<!-- En TicketDetailModal.vue -->
<div v-if="ticketDetails.custom_field">
  <p class="text-xs font-medium mb-1">Mi campo personalizado</p>
  <p class="text-sm">{{ ticketDetails.custom_field }}</p>
</div>
```

### Agregar métodos personalizados

Puedes extender el composable `useTicketDetails.js`:

```javascript
// En useTicketDetails.js
const assignToMe = async (ticketId) => {
  const currentUserId = authStore.user.id
  return await updateTicketField(ticketId, {
    fk_user_assign: currentUserId
  })
}

return {
  // ... otros métodos
  assignToMe
}
```

---

## 📦 Estructura de archivos

```
resources/js/
├── components/
│   └── TicketDetailModal.vue         # Componente del modal
├── composables/
│   └── useTicketDetails.js           # Lógica reutilizable
└── views/
    ├── Tickets.vue                   # Ejemplo de uso
    └── Agenda.vue                    # Otro lugar de uso
```

---

## ✨ Ventajas

- ✅ **Reutilizable** - Usa en cualquier página
- ✅ **Modular** - Lógica separada de la UI
- ✅ **Mantenible** - Un solo lugar para actualizaciones
- ✅ **Consistente** - Mismo comportamiento en toda la app
- ✅ **Extensible** - Fácil de personalizar con slots
- ✅ **Type-safe** - Con JSDoc para autocompletado

---

## 🐛 Debugging

El composable incluye logs detallados:

```javascript
console.log('🎫 Cargando detalles del ticket:', ticket.id)
console.log('✅ Detalles del ticket cargados:', ticketDetails.value)
console.log('🔄 Actualizando estado del ticket:', ticketId, 'a', newStatus)
console.log('❌ Error cargando detalles del ticket:', error)
```

---

## 🚀 Próximos pasos

1. Implementar en la página de Agenda
2. Agregar funcionalidad de comentarios
3. Agregar historial de cambios
4. Implementar notificaciones en tiempo real

---

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.
