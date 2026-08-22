<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Clientes Potenciales</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de clientes potenciales y oportunidades comerciales</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <!-- Total Prospects -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalProspects }}</p>
            <p class="text-sm font-medium text-blue-500">Total Prospectos</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prospectos totales</p>
          </div>
        </div>
      </div>
      
      <!-- Active Prospects -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ activeProspects }}</p>
            <p class="text-sm font-medium text-green-500">Activos</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prospectos activos</p>
          </div>
        </div>
      </div>
      
      <!-- Converted This Month -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ convertedThisMonth }}</p>
            <p class="text-sm font-medium text-blue-500">Convertidos Este Mes</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Convertidos a clientes</p>
          </div>
        </div>
      </div>
      
      <!-- Conversion Rate -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ conversionRate }}%</p>
            <p class="text-sm font-medium text-purple-500">Tasa Conversión</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tasa de conversión</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="px-4 py-2 rounded-lg text-sm font-medium flex items-center text-white" :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Prospecto
        </button>
        <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Importar Prospectos
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
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadProspects">
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
          placeholder="Buscar prospectos..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Clientes Potenciales -->
    <div class="rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center">
                  #
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center">
                  Empresa
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Persona Contacto</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Nivel Prospecto</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha Creación</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-4">
                <div v-for="i in 5" :key="i" class="flex items-center space-x-4 py-2">
                  <div class="w-8 h-8 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 rounded w-1/4" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                    <div class="h-2 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  </div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredProspects.length === 0">
              <td colspan="8" class="px-6 py-16 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p class="text-sm font-medium">No se encontraron clientes potenciales</p>
                <p class="text-xs mt-1">Prueba a cambiar los filtros de búsqueda</p>
              </td>
            </tr>
            <tr v-else v-for="prospect in paginatedProspects" :key="prospect.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- # -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ prospect.id }}
              </td>
              
              <!-- Company -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewProspectDetails(prospect)"
                  class="font-medium text-sm transition-colors"
                  :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                >
                  {{ prospect.name }}
                </button>
              </td>
              
              <!-- Contact Person -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ [prospect.contact_firstname, prospect.contact_lastname].filter(Boolean).join(' ') || '-' }}
              </td>
              
              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                <a v-if="prospect.email" :href="'mailto:' + prospect.email" class="transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                  {{ prospect.email }}
                </a>
                <span v-else>-</span>
              </td>
              
              <!-- Phone -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ prospect.phone || '-' }}
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getStatusClass(prospect.status)">
                  {{ getStatusText(prospect.status) }}
                </span>
              </td>
              
              <!-- Prospect Level -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'">
                  {{ prospect.prospect_level || 'Sin nivel' }}
                </span>
              </td>
              
              <!-- Date Created -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(prospect.datec) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="flex items-center justify-between">
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredProspects.length) }} de {{ filteredProspects.length }} clientes potenciales
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
import http from '../../utils/http'

const router = useRouter()
const { isDark } = useTheme()

// Reactive data
const prospects = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalProspects = computed(() => prospects.value.length)
const activeProspects = computed(() => prospects.value.filter(p => p.status == 1).length)
const convertedThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  return prospects.value.filter(p => {
    if (!p.datec) return false
    const date = new Date(p.datec)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length
})
const conversionRate = computed(() => {
  if (totalProspects.value === 0) return 0
  return Math.round((convertedThisMonth.value / totalProspects.value) * 100)
})

// Computed properties
const filteredProspects = computed(() => {
  let filtered = prospects.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(prospect => 
      prospect.name.toLowerCase().includes(query) ||
      (prospect.email && prospect.email.toLowerCase().includes(query)) ||
      (prospect.phone && prospect.phone.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredProspects.value.length / itemsPerPage.value))

const paginatedProspects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProspects.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredProspects.value.length))

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
const loadProspects = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/dolibarrmodernfrontendapi/prospects/enriched')
    prospects.value = response.data || []
  } catch (error) {
    console.warn('Endpoint enriquecido no disponible, usando endpoint estándar...')
    try {
      const response = await http.get('/api/doli/thirdparties?limit=1000&sqlfilters=(t.client:=:2)')
      prospects.value = (response.data || []).map(p => ({
        ...p,
        prospect_level: null,
        contact_firstname: null,
        contact_lastname: null,
        contact_email: null,
        proposal_count: 0,
        last_activity_date: null
      }))
    } catch (err2) {
      console.error('Error loading prospects:', err2)
      prospects.value = []
    }
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  return status == 1 
    ? (isDark.value ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
    : (isDark.value ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
}

const getStatusText = (status) => {
  return status == 1 ? 'Activo' : 'Inactivo'
}

const getProspectLevelClass = (level) => {
  const levelClasses = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-blue-100 text-blue-800',
    4: 'bg-green-100 text-green-800'
  }
  return levelClasses[level] || 'bg-gray-100 text-gray-800'
}

const getProspectLevelText = (level) => {
  const levelTexts = {
    0: 'None',
    1: 'Cold',
    2: 'Warm',
    3: 'Hot',
    4: 'Qualified'
  }
  return levelTexts[level] || 'Unknown'
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

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

const viewProspectDetails = (prospect) => {
  router.push(`/terceros/clientes/${prospect.id}`)
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
  loadProspects()
})
</script>
