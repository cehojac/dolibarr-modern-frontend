<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Agenda</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Calendario de eventos y citas
        </p>
      </div>
    </div>

    <div class="mt-8">
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Cargando eventos...</div>
      </div>
      
      <div v-else-if="eventos.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">No hay eventos programados</div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="evento in eventos"
          :key="evento.id"
          class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ evento.label }}
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(evento.datep) }}
              </span>
            </div>
            <p v-if="evento.note" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ evento.note }}
            </p>
            <div class="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duración: {{ evento.duration || 'No especificada' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../utils/http'
import { useNotificationStore } from '../stores/notifications'

const eventos = ref([])
const loading = ref(true)

const formatDateTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp * 1000).toLocaleString('es-ES')
}

const loadEventos = async () => {
  const notificationStore = useNotificationStore()
  
  try {
    const response = await http.get('/doli/agenda/events')
    eventos.value = response.data
    if (eventos.value.length === 0) {
      notificationStore.info('No hay eventos programados')
    }
  } catch (error) {
    console.error('Error loading eventos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEventos()
})
</script>
