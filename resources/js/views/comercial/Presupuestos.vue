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
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total Presupuestos</div>
      </div>
      
      <!-- Draft Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ draftProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Borrador</div>
      </div>
      
      <!-- Validated Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">{{ validatedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-blue-400' : 'text-blue-600'">Validado</div>
      </div>
      
      <!-- Signed Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ signedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-green-400' : 'text-green-600'">Firmado</div>
      </div>
      
      <!-- Refused Proposals -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-red-400' : 'text-red-600'">{{ refusedProposals }}</div>
        <div class="text-sm" :class="isDark ? 'text-red-400' : 'text-red-600'">Rechazado</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Presupuesto
        </button>
        <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Plantillas
        </button>
      </div>
      
      <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
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
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Exportar</button>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Acciones Masivas</button>
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
          placeholder="Buscar presupuestos..."
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Válido Hasta</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Importe (Sin IVA)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Importe (Con IVA)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-4">
                <div v-for="i in 5" :key="i" class="flex items-center space-x-4 py-2">
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/4" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredProposals.length === 0">
              <td colspan="8" class="px-6 py-16 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm font-medium">No se encontraron presupuestos</p>
                <p class="text-xs mt-1">Prueba a cambiar los filtros de búsqueda</p>
              </td>
            </tr>
            <tr v-else v-for="proposal in paginatedProposals" :key="proposal.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- Ref -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewProposalDetails(proposal)"
                  class="font-medium text-sm transition-colors"
                  :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                >
                  {{ proposal.ref }}
                </button>
              </td>
              
              <!-- Customer -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ proposal.customer_name || 'Cliente desconocido' }}
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
                      :class="getStatusClass(proposal.statut ?? proposal.fk_statut)">
                  {{ getStatusText(proposal.statut ?? proposal.fk_statut) }}
                </span>
              </td>
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewProposalDetails(proposal)"
                    :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                    class="transition-colors"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editProposal(proposal)"
                    :class="isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-800'"
                    class="transition-colors"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="downloadProposal(proposal)"
                    :class="isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'"
                    class="transition-colors"
                    title="Descargar PDF"
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
import { useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import { useDateFormatter } from '../../composables/useDateFormatter'
import http from '../../utils/http'

const router = useRouter()
const { isDark } = useTheme()
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
const draftProposals = computed(() => proposals.value.filter(p => (p.statut ?? p.fk_statut) == 0).length)
const validatedProposals = computed(() => proposals.value.filter(p => (p.statut ?? p.fk_statut) == 1).length)
const signedProposals = computed(() => proposals.value.filter(p => (p.statut ?? p.fk_statut) == 2).length)
const refusedProposals = computed(() => proposals.value.filter(p => (p.statut ?? p.fk_statut) == 3).length)

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
let searchTimeout = null
const loadProposals = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/dolibarrmodernfrontendapi/proposals/enriched')
    proposals.value = response.data || []
  } catch (error) {
    console.warn('Endpoint enriquecido no disponible, usando endpoint estándar...')
    try {
      const response = await http.get('/api/doli/proposals?limit=1000&sortfield=t.ref&sortorder=DESC')
      proposals.value = (response.data || []).map(p => ({
        ...p,
        statut: p.fk_statut ?? p.statut,
        customer_name: p.thirdparty_name || p.socid_name || null,
        project_ref: null,
        project_title: null
      }))
    } catch (err2) {
      console.error('Error loading proposals:', err2)
      proposals.value = []
    }
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
    1: isDark.value ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
    2: isDark.value ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
    3: isDark.value ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
    4: isDark.value ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status] || (isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
}

const getStatusText = (status) => {
  const statusTexts = {
    0: 'Borrador',
    1: 'Validado',
    2: 'Firmado',
    3: 'Rechazado',
    4: 'Facturado'
  }
  return statusTexts[status] || 'Desconocido'
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

const viewProposalDetails = (proposal) => {
  router.push(`/comercial/presupuestos/${proposal.id}`)
}

const editProposal = (proposal) => {
  router.push(`/comercial/presupuestos/${proposal.id}/edit`)
}

const downloadProposal = async (proposal) => {
  try {
    const response = await http.get(`/api/doli/proposals/${proposal.id}/download`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `presupuesto-${proposal.ref}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading proposal:', error)
  }
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
