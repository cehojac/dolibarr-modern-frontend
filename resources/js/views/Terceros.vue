<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Customers</h1>
          <div class="flex items-center mt-1">
            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">Contacts</button>
            <svg class="w-4 h-4 mx-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <!-- Total Customers -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalCustomers }}</div>
        <div class="text-sm text-gray-500">Total Customers</div>
      </div>
      
      <!-- Active Customers -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-green-600">{{ activeCustomers }}</div>
        <div class="text-sm text-green-600">Active Customers</div>
      </div>
      
      <!-- Inactive Customers -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-red-600">{{ inactiveCustomers }}</div>
        <div class="text-sm text-red-600">Inactive Customers</div>
      </div>
      
      <!-- Active Contacts -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-blue-600">{{ activeContacts }}</div>
        <div class="text-sm text-blue-600">Active Contacts</div>
      </div>
      
      <!-- Inactive Contacts -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-red-600">{{ inactiveContacts }}</div>
        <div class="text-sm text-red-600">Inactive Contacts</div>
      </div>
      
      <!-- Contacts Logged In Today -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ contactsLoggedInToday }}</div>
        <div class="text-sm text-gray-500">Contacts Logged In T...</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Customer
        </button>
        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Import Customers
        </button>
      </div>
      
      <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>
    </div>

    <!-- Controls Bar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <select class="border border-gray-300 rounded px-3 py-1 text-sm" :class="isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'">
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <button class="text-blue-600 hover:text-blue-800 text-sm">Export</button>
        <button class="text-blue-600 hover:text-blue-800 text-sm">Bulk Actions</button>
        <button class="text-gray-500 hover:text-gray-700">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Customers -->
    <div class="bg-white rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50" :class="isDark ? 'bg-gray-700' : ''">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : ''">
                <div class="flex items-center">
                  #
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : ''">
                <div class="flex items-center">
                  Company
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Primary Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Primary Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Active</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Groups</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Date Created</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" :class="isDark ? 'bg-gray-800 divide-gray-700' : ''">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando customers...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredTerceros.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron customers</span>
              </td>
            </tr>
            <tr v-else v-for="(tercero, index) in paginatedTerceros" :key="tercero.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- # -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.id }}
              </td>
              
              <!-- Company -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewTerceroDetails(tercero)"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {{ tercero.name }}
                </button>
              </td>
              
              <!-- Primary Contact -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getPrimaryContact(tercero) }}
              </td>
              
              <!-- Primary Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                <a :href="'mailto:' + tercero.email" class="text-blue-600 hover:text-blue-800">
                  {{ tercero.email || '-' }}
                </a>
              </td>
              
              <!-- Phone -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ tercero.phone || '-' }}
              </td>
              
              <!-- Active -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      :checked="tercero.status == 1"
                      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      :class="tercero.status == 1 ? 'right-0 border-blue-500' : 'border-gray-300'"
                    />
                    <label class="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer"
                           :class="tercero.status == 1 ? 'bg-blue-500' : 'bg-gray-300'">
                    </label>
                  </div>
                </div>
              </td>
              
              <!-- Groups -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span v-for="group in getCustomerGroups(tercero)" :key="group" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getGroupClass(group)">
                    {{ group }}
                  </span>
                </div>
              </td>
              
              <!-- Date Created -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(tercero.datec) }}
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
const statusFilter = ref('') // Show all by default

// Pagination
const currentPage = ref(1)
const itemsPerPage = 25

// Métricas computadas
const totalCustomers = computed(() => terceros.value.length)
const activeCustomers = computed(() => terceros.value.filter(t => t.status == 1).length)
const inactiveCustomers = computed(() => terceros.value.filter(t => t.status == 0).length)
const activeContacts = computed(() => {
  // Simular contactos activos basado en terceros activos
  return Math.floor(activeCustomers.value * 1.2)
})
const inactiveContacts = computed(() => {
  // Simular contactos inactivos
  return Math.floor(inactiveCustomers.value * 0.8)
})
const contactsLoggedInToday = computed(() => {
  // Simular contactos logueados hoy
  return Math.floor(totalCustomers.value * 0.15)
})

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
     console.log('✅ Terceros cargados:', terceros.value.length)
  } catch (error) {
    console.error('❌ Error loading terceros:', error)
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
  statusFilter.value = ''
  currentPage.value = 1
}

// Nuevas funciones para la tabla
const getPrimaryContact = (tercero) => {
  // Simular contacto principal basado en el nombre de la empresa
  const names = ['Connor Cremin', 'Carmel Botsford', 'Deontae Goyette', 'Timmy Beier', 'Sarah Johnson']
  return names[parseInt(tercero.id) % names.length] || 'N/A'
}

const getCustomerGroups = (tercero) => {
  const groups = []
  
  // Agregar grupos basados en el tipo de tercero
  if (tercero.client == 1) groups.push('Wholesaler')
  if (tercero.fournisseur == 1) groups.push('Supplier')
  if (tercero.client == 2) groups.push('Prospect')
  
  // Agregar grupo VIP para algunos terceros
  if (parseInt(tercero.id) % 3 === 0) groups.push('VIP')
  if (parseInt(tercero.id) % 5 === 0) groups.push('High Budget')
  
  return groups
}

const getGroupClass = (group) => {
  const groupClasses = {
    'Wholesaler': 'bg-blue-100 text-blue-800',
    'Supplier': 'bg-green-100 text-green-800',
    'Prospect': 'bg-yellow-100 text-yellow-800',
    'VIP': 'bg-purple-100 text-purple-800',
    'High Budget': 'bg-red-100 text-red-800'
  }
  return groupClasses[group] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
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
