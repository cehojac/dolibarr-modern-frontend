<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Socios</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de socios comerciales y alianzas estratégicas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <!-- Total Partners -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalPartners }}</div>
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total Socios</div>
      </div>
      
      <!-- Active Partners -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold text-green-600">{{ activePartners }}</div>
        <div class="text-sm text-green-600">Activos</div>
      </div>
      
      <!-- Strategic Partners -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold text-purple-600">{{ strategicPartners }}</div>
        <div class="text-sm text-purple-600">Estratégicos</div>
      </div>
      
      <!-- Joint Projects -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold text-blue-600">{{ jointProjects }}</div>
        <div class="text-sm text-blue-600">Proyectos Conjuntos</div>
      </div>
      
      <!-- Partnership Value -->
      <div class="rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="text-2xl font-bold text-indigo-600">{{ formatCurrency(partnershipValue) }}</div>
        <div class="text-sm text-indigo-600">Valor Alianzas</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="px-4 py-2 rounded-lg text-sm font-medium flex items-center text-white transition-colors" :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Socio
        </button>
        <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Acuerdos
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
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Export</button>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Bulk Actions</button>
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadPartners">
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
          placeholder="Buscar socios..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Socios -->
    <div class="rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50" :class="isDark ? 'bg-gray-700' : ''">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : ''">
                <div class="flex items-center">
                  ID
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Empresa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Contacto Principal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Tipo Alianza</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Inicio Alianza</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando socios...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredPartners.length === 0">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron socios</span>
              </td>
            </tr>
            <tr v-else v-for="partner in paginatedPartners" :key="partner.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- ID -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ partner.id }}
              </td>
              
              <!-- Empresa -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span class="text-xs font-medium text-white">{{ getInitials(partner.name) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div 
                      @click="viewPartner(partner)"
                      class="text-sm font-medium cursor-pointer hover:underline transition-colors" 
                      :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                    >
                      {{ partner.name }}
                    </div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ partner.code_client || 'Sin código' }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Contacto Principal -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getPrimaryContact(partner) }}
              </td>
              
              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                <a v-if="partner.email" :href="`mailto:${partner.email}`" class="transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">
                  {{ partner.email }}
                </a>
                <span v-else>-</span>
              </td>
              
              <!-- Teléfono -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ partner.phone || '-' }}
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :checked="partner.status == 1"
                    class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled
                  >
                  <span class="ml-2 text-sm" :class="partner.status == 1 ? 'text-green-600' : 'text-red-600'">
                    {{ partner.status == 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </label>
              </td>
              
              <!-- Tipo Alianza -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getPartnershipTypeClass(partner)">
                  {{ getPartnershipType(partner) }}
                </span>
              </td>
              
              <!-- Inicio Alianza -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(partner.datec) }}
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewPartner(partner)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editPartner(partner)"
                    class="text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="manageAgreement(partner)"
                    class="text-purple-600 hover:text-purple-800 transition-colors"
                    title="Gestionar Acuerdo"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredPartners.length) }} de {{ filteredPartners.length }} socios
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
const partners = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalPartners = computed(() => partners.value.length)
const activePartners = computed(() => partners.value.filter(p => p.status == 1).length)
const strategicPartners = computed(() => {
  // Simular socios estratégicos
  return partners.value.filter(p => parseInt(p.id) % 4 === 0).length
})
const jointProjects = computed(() => {
  // Simular proyectos conjuntos
  return Math.floor(partners.value.length * 0.6)
})
const partnershipValue = computed(() => {
  // Simular valor de alianzas
  return partners.value.length * 45000
})

// Computed properties
const filteredPartners = computed(() => {
  let filtered = partners.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(partner => 
      (partner.name && partner.name.toLowerCase().includes(query)) ||
      (partner.email && partner.email.toLowerCase().includes(query)) ||
      (partner.code_client && partner.code_client.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredPartners.value.length / itemsPerPage.value))

const paginatedPartners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPartners.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredPartners.value.length))

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
const loadPartners = async () => {
  loading.value = true
  try {
     console.log('🔄 Cargando socios...')
    // Filtrar terceros que son tanto cliente como proveedor (socios)
    const response = await http.get('/api/doli/thirdparties?limit=1000&sqlfilters=(t.client:=:1)AND(t.fournisseur:=:1)AND(t.status:=:1)')
    partners.value = response.data || []
     console.log('✅ Socios cargados:', partners.value.length)
  } catch (error) {
    console.error('❌ Error loading partners:', error)
    partners.value = []
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'S'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getPrimaryContact = (partner) => {
  // Simular contacto principal
  const contacts = ['Director General', 'Gerente Comercial', 'Responsable Alianzas', 'CEO', 'Director Estratégico']
  return contacts[parseInt(partner.id) % contacts.length]
}

const getPartnershipType = (partner) => {
  const types = ['Estratégico', 'Comercial', 'Tecnológico', 'Distribución', 'Joint Venture']
  return types[parseInt(partner.id) % types.length]
}

const getPartnershipTypeClass = (partner) => {
  const type = getPartnershipType(partner)
  const classes = {
    'Estratégico': 'bg-purple-100 text-purple-800',
    'Comercial': 'bg-blue-100 text-blue-800',
    'Tecnológico': 'bg-green-100 text-green-800',
    'Distribución': 'bg-orange-100 text-orange-800',
    'Joint Venture': 'bg-indigo-100 text-indigo-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return dateString
  }
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

const viewPartner = (partner) => {
  router.push(`/terceros/clientes/${partner.id}`)
}

const editPartner = (partner) => {
   console.log('Edit partner:', partner)
}

const manageAgreement = (partner) => {
   console.log('Manage agreement for partner:', partner)
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
  loadPartners()
})
</script>
