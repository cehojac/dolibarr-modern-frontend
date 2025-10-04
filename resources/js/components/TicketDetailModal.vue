<template>
  <div v-if="show && ticketDetails" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="handleClose"></div>

      <!-- Modal -->
      <div class="relative inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full border" :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'" @click.stop>
        <!-- Header -->
        <div class="px-6 py-4 border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.subject }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Ticket {{ ticketDetails.ref }}</p>
                  <span 
                    v-if="ticketDetails.track_id" 
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                    :class="isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800 border border-blue-200'"
                  >
                    🔗 Track: {{ ticketDetails.track_id }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(ticketDetails.fk_statut)">
                {{ getStatusText(ticketDetails.fk_statut) }}
              </span>
              <button @click="handleClose" class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content - Basic View -->
        <div class="p-6" :class="isDark ? 'bg-gray-900' : 'bg-white'">
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Cargando detalles...</span>
          </div>

          <div v-else class="space-y-6">
            <!-- Description -->
            <div>
              <h4 class="text-lg font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Descripción</h4>
              <div v-if="ticketDetails.message" class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'" v-html="ticketDetails.message"></div>
              <p v-else :class="isDark ? 'text-gray-500' : 'text-gray-400'">Sin descripción</p>
            </div>

            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Estado</p>
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(ticketDetails.fk_statut)">
                  {{ getStatusText(ticketDetails.fk_statut) }}
                </span>
              </div>
              
              <div>
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prioridad</p>
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getPriorityClass(ticketDetails.severity_code)">
                  {{ getPriorityText(ticketDetails.severity_code) }}
                </span>
              </div>
              
              <div>
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Fecha creación</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">{{ formatDate(ticketDetails.datec) }}</p>
              </div>
              
              <div v-if="ticketDetails.thirdparty_name">
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tercero</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.thirdparty_name }}</p>
              </div>

              <div v-if="ticketDetails.fk_user_assign">
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Asignado a</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">Usuario #{{ ticketDetails.fk_user_assign }}</p>
              </div>

              <div v-if="ticketDetails.category_code">
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Categoría</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.category_code }}</p>
              </div>

              <div v-if="ticketDetails.type_code">
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tipo</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.type_code }}</p>
              </div>

              <div v-if="ticketDetails.project_name">
                <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Proyecto</p>
                <p class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.project_name }}</p>
              </div>
            </div>

            <!-- Messages/Notes Section -->
            <div v-if="ticketDetails.messages && ticketDetails.messages.length > 0">
              <h4 class="text-lg font-semibold mb-3" :class="isDark ? 'text-white' : 'text-gray-900'">
                Mensajes ({{ ticketDetails.messages.length }})
              </h4>
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <div 
                  v-for="message in ticketDetails.messages" 
                  :key="message.id"
                  class="p-3 rounded-lg border"
                  :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                      {{ formatDate(message.datec || message.datep) }}
                    </span>
                    <span 
                      v-if="message.private" 
                      class="text-xs px-2 py-1 rounded bg-red-100 text-red-800"
                    >
                      Privado
                    </span>
                  </div>
                  <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'" v-html="message.message || message.note || 'Sin contenido'"></p>
                </div>
              </div>
            </div>

            <!-- Actions Slot -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <slot name="actions" :ticket="ticketDetails"></slot>
              </div>
              
              <!-- Button to see full details -->
              <button
                @click="goToFullDetails"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
                :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400'"
              >
                <span class="text-sm font-medium">Ver detalles completos</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  ticketDetails: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const { isDark } = useTheme()

const handleClose = () => {
  emit('close')
}

const goToFullDetails = () => {
  // Cerrar el modal
  handleClose()
  
  // Navegar a la página de tickets
  router.push('/tickets')
}

// Helper functions
const getStatusClass = (status) => {
  const statusMap = {
    '0': 'bg-red-100 text-red-800',
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-yellow-100 text-yellow-800',
    '3': 'bg-purple-100 text-purple-800',
    '4': 'bg-orange-100 text-orange-800',
    '5': 'bg-pink-100 text-pink-800',
    '6': 'bg-indigo-100 text-indigo-800',
    '7': 'bg-green-100 text-green-800',
    '8': 'bg-gray-100 text-gray-800',
    '9': 'bg-gray-100 text-gray-800',
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusMap = {
    '0': 'No leído',
    '1': 'Leído',
    '2': 'Asignado',
    '3': 'En progreso',
    '4': 'Necesita más info',
    '5': 'Necesita más info',
    '6': 'En espera',
    '7': 'Resuelto',
    '8': 'Cerrado',
    '9': 'Cancelado',
  }
  return statusMap[status] || 'Desconocido'
}

const getPriorityClass = (severity) => {
  const severityMap = {
    'LOW': 'bg-gray-100 text-gray-800',
    'NORMAL': 'bg-blue-100 text-blue-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'BLOCKING': 'bg-red-100 text-red-800',
  }
  return severityMap[severity] || 'bg-gray-100 text-gray-800'
}

const getPriorityText = (severity) => {
  const severityMap = {
    'LOW': 'Baja',
    'NORMAL': 'Normal',
    'HIGH': 'Alta',
    'BLOCKING': 'Bloqueante',
  }
  return severityMap[severity] || 'Normal'
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
