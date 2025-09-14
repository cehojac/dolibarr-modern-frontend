<template>
  <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-white">Gestión de Caché</h3>
      <div class="flex space-x-2">
        <button
          @click="refreshStats"
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Actualizar
        </button>
        <button
          @click="clearAllCache"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Limpiar Todo
        </button>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-400">Tasa de Aciertos</p>
            <p class="text-2xl font-bold text-white">{{ clientStats.hitRate }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-400">Entradas en Caché</p>
            <p class="text-2xl font-bold text-white">{{ clientStats.size }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total Peticiones</p>
            <p class="text-2xl font-bold text-white">{{ clientStats.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gestión por módulos -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-white mb-4">Limpiar Caché por Módulo</h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          v-for="module in modules"
          :key="module.key"
          @click="clearModuleCache(module.key)"
          :disabled="loading"
          class="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <component :is="module.icon" class="w-4 h-4" />
          <span>{{ module.name }}</span>
        </button>
      </div>
    </div>

    <!-- Información del servidor -->
    <div v-if="serverStats" class="bg-gray-800 rounded-lg p-4">
      <h4 class="text-lg font-semibold text-white mb-3">Información del Servidor</h4>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">Driver:</span>
          <span class="text-white ml-2">{{ serverStats.stats?.driver || 'N/A' }}</span>
        </div>
        <div>
          <span class="text-gray-400">TTL por defecto:</span>
          <span class="text-white ml-2">{{ serverStats.stats?.default_ttl || 'N/A' }}s</span>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span class="text-white">Procesando...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiCache } from '../composables/useApiCache'
import { useNotificationStore } from '../stores/notifications'

const { getCacheStats, clearCache, serverCache } = useApiCache()
const notifications = useNotificationStore()

const loading = ref(false)
const serverStats = ref(null)

const clientStats = computed(() => getCacheStats.value)

const modules = [
  { key: 'terceros', name: 'Terceros', icon: 'UserGroupIcon' },
  { key: 'productos', name: 'Productos', icon: 'CubeIcon' },
  { key: 'servicios', name: 'Servicios', icon: 'CogIcon' },
  { key: 'documentos', name: 'Documentos', icon: 'DocumentIcon' },
  { key: 'agenda', name: 'Agenda', icon: 'CalendarIcon' },
  { key: 'tickets', name: 'Tickets', icon: 'TicketIcon' }
]

const refreshStats = async () => {
  loading.value = true
  try {
    serverStats.value = await serverCache.getStats()
  } catch (error) {
    console.error('Error refreshing stats:', error)
  } finally {
    loading.value = false
  }
}

const clearModuleCache = async (module) => {
  loading.value = true
  try {
    await serverCache.clearModule(module)
    await refreshStats()
  } catch (error) {
    console.error('Error clearing module cache:', error)
  } finally {
    loading.value = false
  }
}

const clearAllCache = async () => {
  loading.value = true
  try {
    // Limpiar caché del cliente
    clearCache()
    
    // Limpiar caché del servidor
    await serverCache.flush()
    await refreshStats()
  } catch (error) {
    console.error('Error clearing all cache:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshStats()
})
</script>
