<template>
  <div :class="[isDark ? 'bg-gray-900' : 'bg-white']">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 :class="['text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Terceros</h1>
        <p :class="['mt-2 text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">
          Gestión de clientes, clientes potenciales y proveedores (solo activos)
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
        >
          Añadir tercero
        </button>
      </div>
    </div>

    <!-- Búsqueda y filtros -->
    <SearchFilter
      placeholder="Buscar por nombre o email..."
      :filters="filterOptions"
      @search="handleSearch"
      @filter-change="handleFilterChange"
    />

    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table :class="['min-w-full divide-y', isDark ? 'divide-gray-600' : 'divide-gray-300']">
              <thead :class="[isDark ? 'bg-gray-700' : 'bg-gray-50']">
                <tr>
                  <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDark ? 'text-gray-300' : 'text-gray-500']">
                    Nombre
                  </th>
                  <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDark ? 'text-gray-300' : 'text-gray-500']">
                    Tipo
                  </th>
                  <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDark ? 'text-gray-300' : 'text-gray-500']">
                    Email
                  </th>
                  <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDark ? 'text-gray-300' : 'text-gray-500']">
                    Estado
                  </th>
                  <th class="relative px-6 py-3">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody :class="['divide-y', isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200']">
                <tr v-if="loading">
                  <td colspan="5" class="p-0">
                    <LoadingSkeleton type="table" :rows="5" />
                  </td>
                </tr>
                <tr v-else-if="total === 0">
                  <td :class="['px-6 py-4 text-center text-sm', isDark ? 'text-gray-400' : 'text-gray-500']" colspan="5">
                    No hay terceros registrados
                  </td>
                </tr>
                <tr v-else v-for="tercero in paginatedData" :key="tercero.id">
                  <td :class="['px-6 py-4 whitespace-nowrap text-sm font-medium', isDark ? 'text-white' : 'text-gray-900']">
                    {{ tercero.name }}
                  </td>
                  <td :class="['px-6 py-4 whitespace-nowrap text-sm', isDark ? 'text-gray-300' : 'text-gray-500']">
                    {{ getTerceroType(tercero) }}
                  </td>
                  <td :class="['px-6 py-4 whitespace-nowrap text-sm', isDark ? 'text-gray-300' : 'text-gray-500']">
                    {{ tercero.email || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="tercero.status == 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                      {{ tercero.status == 1 ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button :class="[isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-900']">
                      Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <Pagination
      v-if="total > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="total"
      :per-page="15"
      @page-changed="goToPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import http from '../utils/http'
import { useNotificationStore } from '../stores/notifications'
import { usePagination } from '../composables/usePagination'
import { useSearch } from '../composables/useSearch'
import { useCache } from '../composables/useCache'
import { useTheme } from '../composables/useTheme'
import Pagination from '../components/Pagination.vue'
import SearchFilter from '../components/SearchFilter.vue'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

const { isDark } = useTheme()
const cache = useCache()
const allTerceros = ref([])
const search = useSearch(allTerceros, ['name', 'email'])
const { filteredData, setSearchTerm, setFilters } = search

const pagination = usePagination(15)
const { currentPage, totalPages, total, paginatedData, loading, goToPage, setData } = pagination

// Update pagination when filtered data changes
const updatePagination = () => {
  setData(filteredData.value)
}

const getTerceroType = (tercero) => {
  const types = []
  
  if (tercero.client == 1) types.push('Cliente')
  if (tercero.client == 2) types.push('Cliente Potencial')
  if (tercero.fournisseur == 1) types.push('Proveedor')
  
  return types.length > 0 ? types.join(' / ') : 'Otro'
}

const fetchTerceros = async () => {
  const cacheKey = 'terceros_active'
  
  try {
    const data = await cache.cachedFetch(cacheKey, async () => {
      loading.value = true
      // Fetch with limit of 1000 and filter for active only (status = 1)
      const response = await http.get('/api/doli/thirdparties?limit=1000&status=1')
      const allData = response.data || []
      
      // Additional client-side filter to ensure only active terceros
      return allData.filter(tercero => tercero.status == 1)
    }, 2 * 60 * 1000) // 2 minutes TTL
    
    allTerceros.value = data
    updatePagination()
  } catch (error) {
    console.error('Error fetching terceros:', error)
  } finally {
    loading.value = false
  }
}

// Filter configuration
const filterOptions = [
  {
    key: 'client',
    placeholder: 'Tipo de tercero',
    options: [
      { value: '1', label: 'Cliente' },
      { value: '2', label: 'Cliente Potencial' },
      { value: '0', label: 'Otro' }
    ]
  },
  {
    key: 'fournisseur',
    placeholder: 'Proveedor',
    options: [
      { value: '1', label: 'Es Proveedor' },
      { value: '0', label: 'No es Proveedor' }
    ]
  }
]

const handleSearch = (term) => {
  setSearchTerm(term)
  updatePagination()
}

const handleFilterChange = (filters) => {
  setFilters(filters)
  updatePagination()
}

onMounted(() => {
  fetchTerceros()
})
</script>
