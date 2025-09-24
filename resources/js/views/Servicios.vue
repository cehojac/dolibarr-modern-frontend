<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Servicios</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Catálogo de servicios disponibles
        </p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-if="loading" class="col-span-full text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Cargando servicios...</div>
      </div>
      
      <div v-else-if="servicios.length === 0" class="col-span-full text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">No hay servicios registrados</div>
      </div>

      <div
        v-else
        v-for="servicio in servicios"
        :key="servicio.id"
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
              {{ servicio.label }}
            </h3>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="servicio.status == 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
              {{ servicio.status == 1 ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ref: {{ servicio.ref }}
          </p>
          <div class="mt-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Precio</div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ formatPrice(servicio.price) }}
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

const servicios = ref([])
const loading = ref(true)

const formatPrice = (price) => {
  if (!price) return '-'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const loadServicios = async () => {
  const notificationStore = useNotificationStore()
  
  try {
    const response = await http.get('/api/doli/services')
    servicios.value = response.data
    if (servicios.value.length === 0) {
      notificationStore.info('No se encontraron servicios registrados')
    }
  } catch (error) {
    console.error('Error loading servicios:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadServicios()
})
</script>
