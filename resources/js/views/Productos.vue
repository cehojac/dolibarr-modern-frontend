<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Productos / Servicios</h1>
        <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          Catálogo de {{ activeTab === 'productos' ? 'productos' : 'servicios' }} disponibles
        </p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
        + Crear {{ activeTab === 'productos' ? 'Producto' : 'Servicio' }}
      </button>
    </div>

    <!-- Pestañas -->
    <div class="mb-6">
      <div class="border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'productos'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'productos' 
              ? (isDark ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600')
              : (isDark ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            "
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos ({{ productos.length }})
            </div>
          </button>
          <button
            @click="activeTab = 'servicios'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === 'servicios' 
              ? (isDark ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600')
              : (isDark ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            "
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Servicios ({{ servicios.length }})
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Contenido de Productos -->
    <div v-if="activeTab === 'productos'">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-if="loadingProductos" class="col-span-full text-center py-12">
          <div class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">Cargando productos...</span>
          </div>
        </div>
        
        <div v-else-if="productos.length === 0" class="col-span-full text-center py-12">
          <div class="flex flex-col items-center space-y-4">
            <svg class="w-16 h-16" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">No hay productos registrados</span>
          </div>
        </div>

        <div
          v-else
          v-for="producto in productos"
          :key="producto.id"
          class="rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ producto.label }}
                </h3>
                <p class="mt-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  Ref: {{ producto.ref }}
                </p>
              </div>
              <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                    :class="producto.status == 1 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                {{ producto.status == 1 ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="mt-4 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Precio
                  </div>
                  <div class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ formatPrice(producto.price) }}
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="p-2 rounded-lg transition-colors" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="p-2 rounded-lg transition-colors" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de Servicios -->
    <div v-if="activeTab === 'servicios'">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-if="loadingServicios" class="col-span-full text-center py-12">
          <div class="flex items-center justify-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">Cargando servicios...</span>
          </div>
        </div>
        
        <div v-else-if="servicios.length === 0" class="col-span-full text-center py-12">
          <div class="flex flex-col items-center space-y-4">
            <svg class="w-16 h-16" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">No hay servicios registrados</span>
          </div>
        </div>

        <div
          v-else
          v-for="servicio in servicios"
          :key="servicio.id"
          class="rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ servicio.label }}
                </h3>
                <p class="mt-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  Ref: {{ servicio.ref }}
                </p>
              </div>
              <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                    :class="servicio.status == 1 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                {{ servicio.status == 1 ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="mt-4 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Precio
                  </div>
                  <div class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ formatPrice(servicio.price) }}
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="p-2 rounded-lg transition-colors" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="p-2 rounded-lg transition-colors" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import http from '../utils/http'
import { useNotificationStore } from '../stores/notifications'

const { isDark } = useTheme()

// Estado de pestañas
const activeTab = ref('productos')

// Estado de productos
const productos = ref([])
const loadingProductos = ref(true)

// Estado de servicios
const servicios = ref([])
const loadingServicios = ref(true)

const formatPrice = (price) => {
  if (!price) return '-'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const loadProductos = async () => {
  const notificationStore = useNotificationStore()
  
  try {
     console.log('🔄 Cargando productos...')
    const response = await http.get('/doli/products')
    productos.value = response.data || []
     console.log('✅ Productos cargados:', productos.value.length)
    
    if (productos.value.length === 0) {
      notificationStore.info('No se encontraron productos registrados')
    }
  } catch (error) {
    console.error('❌ Error loading productos:', error)
    notificationStore.error('Error al cargar productos')
  } finally {
    loadingProductos.value = false
  }
}

const loadServicios = async () => {
  const notificationStore = useNotificationStore()
  
  try {
     console.log('🔄 Cargando servicios...')
    const response = await http.get('/doli/services')
    servicios.value = response.data || []
     console.log('✅ Servicios cargados:', servicios.value.length)
    
    if (servicios.value.length === 0) {
      notificationStore.info('No se encontraron servicios registrados')
    }
  } catch (error) {
    console.error('❌ Error loading servicios:', error)
    notificationStore.error('Error al cargar servicios')
  } finally {
    loadingServicios.value = false
  }
}

// Cargar servicios cuando se cambie a la pestaña de servicios
watch(activeTab, (newTab) => {
  if (newTab === 'servicios' && servicios.value.length === 0 && !loadingServicios.value) {
    loadServicios()
  }
})

onMounted(() => {
  // Cargar productos por defecto
  loadProductos()
})
</script>
