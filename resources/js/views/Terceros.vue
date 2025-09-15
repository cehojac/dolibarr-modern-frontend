<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Terceros</h1>
        <p class="mt-2 text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          Gestión de clientes, clientes potenciales y proveedores
        </p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 xl:px-8 2xl:px-10 py-2 xl:py-3 2xl:py-4 rounded-xl font-medium transition-colors text-sm xl:text-base 2xl:text-lg">
        + Crear Tercero
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="rounded-xl p-6 xl:p-8 2xl:p-10 mb-6 xl:mb-8 2xl:mb-10 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 xl:gap-6 2xl:gap-8">
        <!-- General Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar terceros..."
              class="w-full border rounded-lg px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
            >
            <svg class="absolute right-3 xl:right-4 2xl:right-5 top-2.5 xl:top-3.5 2xl:top-4.5 h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Type Filter -->
        <div>
          <select
            v-model="typeFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todos los tipos</option>
            <option value="client">Cliente</option>
            <option value="prospect">Cliente Potencial</option>
            <option value="supplier">Proveedor</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div>
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todos los estados</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
        
        <!-- Clear Filters -->
        <div>
          <button
            @click="clearFilters"
            class="w-full px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg font-medium rounded-lg transition-colors"
            :class="isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Terceros Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
            <tr>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Nombre</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tipo</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Email</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Teléfono</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Estado</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="6" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2 xl:space-x-3 2xl:space-x-4">
                  <div class="animate-spin rounded-full h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 border-b-2 border-blue-500"></div>
                  <span class="text-sm xl:text-base 2xl:text-lg">Cargando terceros...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredTerceros.length === 0">
              <td colspan="6" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2 xl:space-y-3 2xl:space-y-4">
                  <svg class="w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="text-sm xl:text-base 2xl:text-lg">No se encontraron terceros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="tercero in paginatedTerceros" :key="tercero.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg font-medium">
                <button 
                  @click="viewTerceroDetails(tercero)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ tercero.name }}
                </button>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full" :class="getTerceroTypeClass(tercero)">
                  {{ getTerceroType(tercero) }}
                </span>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-sm xl:text-base 2xl:text-lg max-w-xs xl:max-w-sm 2xl:max-w-md truncate" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ tercero.email || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ tercero.phone || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full" :class="getStatusClass(tercero.status)">
                  {{ tercero.status == 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-right text-sm xl:text-base 2xl:text-lg font-medium">
                <div class="flex items-center justify-end space-x-2 xl:space-x-3 2xl:space-x-4">
                  <button 
                    @click="viewTerceroDetails(tercero)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editTercero(tercero)"
                    class="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <svg class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="flex items-center justify-between">
          <div class="text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTerceros.length) }} de {{ filteredTerceros.length }} terceros
          </div>
          <div class="flex items-center space-x-2 xl:space-x-3 2xl:space-x-4">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-3 xl:px-4 2xl:px-5 py-2 xl:py-3 2xl:py-3 text-sm xl:text-base 2xl:text-lg rounded-lg transition-colors"
            >
              Anterior
            </button>
            
            <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
                class="px-3 xl:px-4 2xl:px-5 py-2 xl:py-3 2xl:py-3 text-sm xl:text-base 2xl:text-lg rounded-lg transition-colors"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-3 xl:px-4 2xl:px-5 py-2 xl:py-3 2xl:py-3 text-sm xl:text-base 2xl:text-lg rounded-lg transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '../utils/http'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// Reactive data
const terceros = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('1') // Default to active only

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

// Computed properties
const filteredTerceros = computed(() => {
  let filtered = terceros.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tercero => 
      tercero.name.toLowerCase().includes(query) ||
      (tercero.email && tercero.email.toLowerCase().includes(query)) ||
      (tercero.phone && tercero.phone.toLowerCase().includes(query))
    )
  }

  // Filter by type
  if (typeFilter.value) {
    filtered = filtered.filter(tercero => {
      switch (typeFilter.value) {
        case 'client': return tercero.client == 1
        case 'prospect': return tercero.client == 2
        case 'supplier': return tercero.fournisseur == 1
        default: return true
      }
    })
  }

  // Filter by status
  if (statusFilter.value !== '') {
    filtered = filtered.filter(tercero => tercero.status == statusFilter.value)
  }

  // Sort by ID in descending order (highest to lowest)
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredTerceros.value.length / itemsPerPage))

const paginatedTerceros = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTerceros.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredTerceros.value.length))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadTerceros = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/thirdparties?limit=1000')
    terceros.value = response.data || []
  } catch (error) {
    console.error('Error loading terceros:', error)
    terceros.value = []
  } finally {
    loading.value = false
  }
}

const getTerceroType = (tercero) => {
  const types = []
  
  if (tercero.client == 1) types.push('Cliente')
  if (tercero.client == 2) types.push('Cliente Potencial')
  if (tercero.fournisseur == 1) types.push('Proveedor')
  
  return types.length > 0 ? types.join(' / ') : 'Otro'
}

const getTerceroTypeClass = (tercero) => {
  if (tercero.client == 1) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (tercero.client == 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (tercero.fournisseur == 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusClass = (status) => {
  return status == 1 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const handleSearch = () => {
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  statusFilter.value = '1' // Reset to active only
  currentPage.value = 1
}

const viewTerceroDetails = (tercero) => {
  // Navigate to tercero details or open modal
  console.log('View tercero:', tercero)
}

const editTercero = (tercero) => {
  // Navigate to edit tercero or open modal
  console.log('Edit tercero:', tercero)
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  loadTerceros()
})
</script>
