<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Presupuestos</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de propuestas comerciales y presupuestos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <!-- Total Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total Proposals</div>
      </div>
      
      <!-- Draft Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ draftProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Draft</div>
      </div>
      
      <!-- Validated Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">{{ validatedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-blue-400' : 'text-blue-600'">Validated</div>
      </div>
      
      <!-- Signed Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ signedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-green-400' : 'text-green-600'">Signed</div>
      </div>
      
      <!-- Refused Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-red-400' : 'text-red-600'">{{ refusedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-red-400' : 'text-red-600'">Refused</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Proposal
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
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadProposals">
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
          placeholder="Search proposals..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Presupuestos -->
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Valid Until</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Amount (Excl. Tax)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Amount (Incl. Tax)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando presupuestos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredProposals.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron presupuestos</span>
              </td>
            </tr>
            <tr v-else v-for="proposal in paginatedProposals" :key="proposal.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- Ref -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewProposalDetails(proposal)"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {{ proposal.ref }}
                </button>
              </td>
              
              <!-- Customer -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getThirdpartyName(proposal.socid) }}
              </td>
              
              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDoliDate(proposal.date_creation) }}
              </td>
              
              <!-- Valid Until -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDoliDate(proposal.fin_validite) }}
              </td>
              
              <!-- Amount Excl Tax -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(proposal.total_ht) }}
              </td>
              
              <!-- Amount Incl Tax -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(proposal.total_ttc) }}
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getStatusClass(proposal.statut)">
                  {{ getStatusText(proposal.statut) }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewProposalDetails(proposal)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editProposal(proposal)"
                    class="text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="downloadProposal(proposal)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Download PDF"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredProposals.length) }} de {{ filteredProposals.length }} presupuestos
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
import { useProjects } from '../../composables/useProjects'
import { useDateFormatter } from '../../composables/useDateFormatter'
import http from '../../utils/http'

const { isDark } = useTheme()
const { loadAllThirdparties, getThirdpartyName } = useThirdparties()
const { preloadProjectsFromItems, getProjectName } = useProjects()
const { formatDate: formatDoliDate } = useDateFormatter()

// Reactive data
const proposals = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalProposals = computed(() => proposals.value.length)
const draftProposals = computed(() => proposals.value.filter(p => p.statut == 0).length)
const validatedProposals = computed(() => proposals.value.filter(p => p.statut == 1).length)
const signedProposals = computed(() => proposals.value.filter(p => p.statut == 2).length)
const refusedProposals = computed(() => proposals.value.filter(p => p.statut == 3).length)

// Computed properties
const filteredProposals = computed(() => {
  let filtered = proposals.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(proposal => 
      (proposal.ref && proposal.ref.toLowerCase().includes(query)) ||
      (proposal.socid_name && proposal.socid_name.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredProposals.value.length / itemsPerPage.value))

const paginatedProposals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProposals.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredProposals.value.length))

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
const loadProposals = async () => {
  loading.value = true
  try {
    // 1. Cargar TODOS los terceros primero (solo una vez)
    await loadAllThirdparties()
    
    // 2. Cargar presupuestos
    console.log('🔄 Cargando presupuestos...')
    const response = await http.get('/api/doli/proposals?limit=1000&sortfield=t.ref&sortorder=DESC')
    const proposalsData = response.data || []
    console.log('✅ Presupuestos cargados:', proposalsData.length)
    
    // 3. Precargar proyectos en segundo plano
    preloadProjectsFromItems(proposalsData, 'fk_project').then(() => {
      console.log('✅ Proyectos cargados en caché')
    }).catch(error => {
      console.warn('⚠️ Error cargando proyectos:', error)
    })
    
    // 4. Enriquecer presupuestos con nombres de terceros (desde caché, instantáneo)
    proposals.value = proposalsData.map(proposal => {
      if (proposal.socid) {
        proposal.thirdparty_name = getThirdpartyName(proposal.socid)
      }
      return proposal
    })
    
    console.log('✅ Presupuestos enriquecidos con nombres de terceros')
    
  } catch (error) {
    console.error('❌ Error loading proposals:', error)
    proposals.value = []
  } finally {
    loading.value = false
  }
}

const getCustomerName = (proposal) => {
  return proposal.thirdparty_name || proposal.socid_name || 'Cliente desconocido'
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: 'bg-gray-100 text-gray-800',     // Draft
    1: 'bg-blue-100 text-blue-800',    // Validated
    2: 'bg-green-100 text-green-800',  // Signed
    3: 'bg-red-100 text-red-800',      // Refused
    4: 'bg-yellow-100 text-yellow-800' // Billed
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    0: 'Draft',
    1: 'Validated',
    2: 'Signed',
    3: 'Refused',
    4: 'Billed'
  }
  return statusTexts[status] || 'Unknown'
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

const viewProposalDetails = (proposal) => {
   console.log('View proposal:', proposal)
}

const editProposal = (proposal) => {
   console.log('Edit proposal:', proposal)
}

const downloadProposal = (proposal) => {
   console.log('Download proposal:', proposal)
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
  loadProposals()
})
</script>
