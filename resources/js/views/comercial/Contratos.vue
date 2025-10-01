<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Contratos</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de contratos y servicios recurrentes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <!-- Total Contracts -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalContracts }}</div>
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total Contracts</div>
      </div>
      
      <!-- Active Contracts -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ activeContracts }}</div>
        <div class="text-sm" :class="isDark ? 'text-green-400' : 'text-green-600'">Active</div>
      </div>
      
      <!-- Expired Contracts -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-red-400' : 'text-red-600'">{{ expiredContracts }}</div>
        <div class="text-sm" :class="isDark ? 'text-red-400' : 'text-red-600'">Expired</div>
      </div>
      
      <!-- Expiring Soon -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">{{ expiringSoon }}</div>
        <div class="text-sm" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">Expiring Soon</div>
      </div>
      
      <!-- Monthly Revenue -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">{{ formatCurrency(monthlyRevenue) }}</div>
        <div class="text-sm" :class="isDark ? 'text-blue-400' : 'text-blue-600'">Monthly Revenue</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Contract
        </button>
        <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Templates
        </button>
      </div>
      
      <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>
    </div>

    <!-- Controls Bar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <select v-model="itemsPerPage" class="border border-gray-300 rounded px-3 py-1 text-sm" :class="isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'">
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Export</button>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Bulk Actions</button>
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadContracts">
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
          placeholder="Search contracts..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Contratos -->
    <div class="rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : ''">
                <div class="flex items-center">
                  Ref
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Start Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">End Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Services</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando contratos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredContracts.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron contratos</span>
              </td>
            </tr>
            <tr v-else v-for="contract in paginatedContracts" :key="contract.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- Ref -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewContractDetails(contract)"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {{ contract.ref }}
                </button>
              </td>
              
              <!-- Customer -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getThirdpartyName(contract.socid) }}
              </td>
              
              <!-- Start Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDoliDate(contract.date_contrat) }}
              </td>
              
              <!-- End Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                <span :class="isExpiringSoon(contract.date_fin_validite) ? 'text-yellow-600 font-medium' : ''">
                  {{ formatDoliDate(contract.date_fin_validite) }}
                </span>
              </td>
              
              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(contract.total_ht) }}
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getStatusClass(contract.statut)">
                  {{ getStatusText(contract.statut) }}
                </span>
              </td>
              
              <!-- Services -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span v-for="service in getContractServices(contract)" :key="service" 
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {{ service }}
                  </span>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewContractDetails(contract)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editContract(contract)"
                    class="text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="renewContract(contract)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Renew"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredContracts.length) }} de {{ filteredContracts.length }} contratos
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-3 py-2 text-sm rounded-lg transition-colors"
            >
              Anterior
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
                class="px-3 py-2 text-sm rounded-lg transition-colors"
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
              class="px-3 py-2 text-sm rounded-lg transition-colors"
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
import { useTheme } from '../../composables/useTheme'
import { useThirdparties } from '../../composables/useThirdparties'
import { useDateFormatter } from '../../composables/useDateFormatter'
import http from '../../utils/http'

const { isDark } = useTheme()
const { loadAllThirdparties, getThirdpartyName } = useThirdparties()
const { formatDate: formatDoliDate } = useDateFormatter()

// Reactive data
const contracts = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalContracts = computed(() => contracts.value.length)
const activeContracts = computed(() => contracts.value.filter(c => c.statut == 1).length)
const expiredContracts = computed(() => {
  const now = new Date()
  return contracts.value.filter(c => {
    if (!c.date_fin_validite) return false
    return new Date(c.date_fin_validite) < now
  }).length
})
const expiringSoon = computed(() => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
  return contracts.value.filter(c => {
    if (!c.date_fin_validite) return false
    const endDate = new Date(c.date_fin_validite)
    return endDate > now && endDate <= thirtyDaysFromNow
  }).length
})
const monthlyRevenue = computed(() => {
  return contracts.value
    .filter(c => c.statut == 1)
    .reduce((sum, c) => sum + (parseFloat(c.total_ht) || 0), 0) / 12
})

// Computed properties
const filteredContracts = computed(() => {
  let filtered = contracts.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contract => 
      (contract.ref && contract.ref.toLowerCase().includes(query)) ||
      (contract.socid_name && contract.socid_name.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredContracts.value.length / itemsPerPage.value))

const paginatedContracts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredContracts.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredContracts.value.length))

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
const loadContracts = async () => {
  loading.value = true
  try {
    // 1. Cargar TODOS los terceros primero (solo una vez)
    await loadAllThirdparties()
    
    // 2. Cargar contratos
    console.log('🔄 Cargando contratos...')
    const response = await http.get('/api/doli/contracts?limit=1000&sortfield=t.ref&sortorder=DESC')
    const contractsData = response.data || []
    console.log('✅ Contratos cargados:', contractsData.length)
    
    // 3. Enriquecer contratos con nombres de terceros (desde caché, instantáneo)
    contracts.value = contractsData.map(contract => {
      if (contract.socid) {
        contract.thirdparty_name = getThirdpartyName(contract.socid)
      }
      return contract
    })
    
    console.log('✅ Contratos enriquecidos con nombres de terceros')
    
  } catch (error) {
    console.error('❌ Error loading contracts:', error)
    contracts.value = []
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: 'bg-gray-100 text-gray-800',     // Draft
    1: 'bg-green-100 text-green-800',  // Active
    2: 'bg-red-100 text-red-800',      // Closed
    3: 'bg-yellow-100 text-yellow-800' // Suspended
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    0: 'Draft',
    1: 'Active',
    2: 'Closed',
    3: 'Suspended'
  }
  return statusTexts[status] || 'Unknown'
}

const getContractServices = (contract) => {
  // Simular servicios del contrato
  const services = ['Hosting', 'Support', 'Maintenance', 'Consulting', 'Development']
  const contractServices = []
  
  // Agregar 1-3 servicios basado en el ID del contrato
  const numServices = (parseInt(contract.id) % 3) + 1
  for (let i = 0; i < numServices; i++) {
    contractServices.push(services[(parseInt(contract.id) + i) % services.length])
  }
  
  return contractServices
}

const isExpiringSoon = (endDate) => {
  if (!endDate) return false
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
  const contractEndDate = new Date(endDate)
  return contractEndDate > now && contractEndDate <= thirtyDaysFromNow
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleSearch = () => {
  currentPage.value = 1
}

const viewContractDetails = (contract) => {
   console.log('View contract:', contract)
}

const editContract = (contract) => {
   console.log('Edit contract:', contract)
}

const renewContract = (contract) => {
   console.log('Renew contract:', contract)
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
  loadContracts()
})
</script>
