# Ejemplo de Migración - Tickets.vue

## 🔄 Cómo migrar Tickets.vue para usar el nuevo composable

### ANTES (Código actual)

```vue
<script setup>
import { ref } from 'vue'
import http from '../utils/http'

// Variables locales
const showModal = ref(false)
const selectedTicket = ref(null)
const ticketDetails = ref(null)
const loadingDetails = ref(false)

// Función para abrir detalles
const viewTicketDetails = async (ticket) => {
  selectedTicket.value = ticket
  ticketDetails.value = null
  showModal.value = true
  loadingDetails.value = true

  try {
    const response = await http.get(`/api/doli/tickets/${ticket.id}`)
    ticketDetails.value = response.data
  } catch (error) {
    console.error('Error cargando detalles:', error)
  } finally {
    loadingDetails.value = false
  }
}

// Función para cerrar
const closeModal = () => {
  showModal.value = false
  selectedTicket.value = null
  ticketDetails.value = null
}
</script>

<template>
  <div>
    <!-- Botón -->
    <button @click="viewTicketDetails(ticket)">Ver detalles</button>

    <!-- Modal (cientos de líneas de código) -->
    <div v-if="showModal" class="fixed inset-0 z-50">
      <!-- Todo el HTML del modal aquí... -->
    </div>
  </div>
</template>
```

---

### DESPUÉS (Con el nuevo composable)

```vue
<script setup>
import { useTicketDetails } from '@/composables/useTicketDetails'
import TicketDetailModal from '@/components/TicketDetailModal.vue'

// ✨ Una sola línea para toda la funcionalidad
const {
  showModal,
  ticketDetails,
  loadingDetails,
  openTicketDetails,
  closeTicketDetails,
  refreshTicketDetails,
  updateTicketStatus
} = useTicketDetails()
</script>

<template>
  <div>
    <!-- Botón -->
    <button @click="openTicketDetails(ticket)">Ver detalles</button>

    <!-- ✨ Una sola línea para el modal -->
    <TicketDetailModal
      :show="showModal"
      :ticket-details="ticketDetails"
      :loading="loadingDetails"
      @close="closeTicketDetails"
    >
      <!-- Slot opcional para acciones personalizadas -->
      <template #actions="{ ticket }">
        <button @click="updateTicketStatus(ticket.id, '7')">
          Marcar resuelto
        </button>
      </template>
    </TicketDetailModal>
  </div>
</template>
```

---

## 📊 Comparación de código

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Líneas de código** | ~2000 líneas | ~20 líneas |
| **Variables reactive** | 4+ declaraciones | 1 composable |
| **Funciones** | 5+ funciones | Métodos del composable |
| **HTML del modal** | Cientos de líneas | 1 componente |
| **Mantenibilidad** | ❌ Difícil | ✅ Fácil |
| **Reutilizable** | ❌ No | ✅ Sí |

---

## 🎯 Beneficios Inmediatos

### 1. **Reducción de código**
- ✅ Elimina ~1800 líneas de HTML del modal
- ✅ Elimina ~200 líneas de lógica JavaScript
- ✅ Código más limpio y mantenible

### 2. **Consistencia**
- ✅ Mismo comportamiento en todas las páginas
- ✅ Un solo lugar para fixes y mejoras
- ✅ Estilos consistentes

### 3. **Facilidad de uso**
- ✅ 3 líneas para agregar a cualquier página
- ✅ No necesitas copiar/pegar código
- ✅ Actualiza automáticamente en toda la app

---

## 🚀 Pasos para migrar Tickets.vue

### Paso 1: Agregar imports

```diff
<script setup>
import { ref } from 'vue'
+ import { useTicketDetails } from '@/composables/useTicketDetails'
+ import TicketDetailModal from '@/components/TicketDetailModal.vue'
```

### Paso 2: Reemplazar variables locales

```diff
- const showModal = ref(false)
- const selectedTicket = ref(null)
- const ticketDetails = ref(null)
- const loadingDetails = ref(false)

+ const {
+   showModal,
+   ticketDetails,
+   loadingDetails,
+   openTicketDetails,
+   closeTicketDetails
+ } = useTicketDetails()
```

### Paso 3: Reemplazar funciones

```diff
- const viewTicketDetails = async (ticket) => {
-   selectedTicket.value = ticket
-   ticketDetails.value = null
-   showModal.value = true
-   loadingDetails.value = true
-   // ... más código
- }

- const closeModal = () => {
-   showModal.value = false
-   selectedTicket.value = null
-   ticketDetails.value = null
- }

+ // Ya no necesitas estas funciones!
+ // Se usan directamente del composable:
+ // openTicketDetails(ticket)
+ // closeTicketDetails()
```

### Paso 4: Actualizar template

```diff
- <button @click="viewTicketDetails(ticket)">
+ <button @click="openTicketDetails(ticket)">
    Ver detalles
  </button>
```

### Paso 5: Reemplazar el modal

```diff
- <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
-   <!-- Cientos de líneas de código HTML del modal... -->
- </div>

+ <TicketDetailModal
+   :show="showModal"
+   :ticket-details="ticketDetails"
+   :loading="loadingDetails"
+   @close="closeTicketDetails"
+ />
```

---

## 💡 Casos de uso adicionales

### Agregar botón de timer en el modal

```vue
<TicketDetailModal
  :show="showModal"
  :ticket-details="ticketDetails"
  :loading="loadingDetails"
  @close="closeTicketDetails"
>
  <template #actions="{ ticket }">
    <TimerButton 
      :entity-id="ticket.id"
      @stopped="handleTimerStopped"
    />
  </template>
</TicketDetailModal>
```

### Actualizar lista después de cambios

```vue
<script setup>
const {
  openTicketDetails,
  closeTicketDetails,
  updateTicketStatus
} = useTicketDetails()

const handleResolve = async (ticketId) => {
  await updateTicketStatus(ticketId, '7')
  closeTicketDetails()
  
  // Recargar lista de tickets
  await loadTickets()
}
</script>
```

---

## ⚠️ Notas Importantes

1. **No elimines el modal todavía** - Guárdalo en un archivo backup por si necesitas referencia
2. **Prueba en dev primero** - Asegúrate de que todo funciona antes de desplegar
3. **Migra página por página** - No intentes migrar todo a la vez
4. **Mantén consistencia** - Usa los mismos nombres de métodos en toda la app

---

## 🔍 Testing

Después de migrar, verifica:

- ✅ El modal se abre correctamente
- ✅ Los detalles se cargan
- ✅ El botón cerrar funciona
- ✅ Las acciones personalizadas funcionan
- ✅ Los estilos se ven correctos
- ✅ Funciona en modo claro y oscuro

---

## 🎉 Resultado Final

Tickets.vue pasará de ser un archivo de ~7000 líneas a ~5000 líneas, con código mucho más limpio y mantenible.

Además, podrás usar el mismo modal en:
- Agenda
- Dashboard  
- Proyectos
- Cualquier otra página

¡Todo con 3 líneas de código! 🚀
