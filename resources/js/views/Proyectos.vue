<template>
  <div class="bg-black min-h-screen p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">Proyectos</h1>
        <p class="text-gray-400 mt-2">Gestión de proyectos</p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
        + Crear Proyecto
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar proyectos..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Status Filter -->
        <div>
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="0">Borrador</option>
            <option value="1">Validado</option>
            <option value="2">En progreso</option>
            <option value="3">Cerrado</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-800">
            <tr>
              <th @click="sortBy('ref')" class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center space-x-1">
                  <span>Ref.</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th @click="sortBy('title')" class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center space-x-1">
                  <span>Título</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th @click="sortBy('datec')" class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center space-x-1">
                  <span>Fecha de creación</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha límite
              </th>
              <th @click="sortBy('fk_statut')" class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors">
                <div class="flex items-center space-x-1">
                  <span>Estado</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-900 divide-y divide-gray-800">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Cargando proyectos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedProjects.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>No hay proyectos que coincidan con los filtros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="project in paginatedProjects" :key="project.id" class="hover:bg-gray-800 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewProjectDetails(project)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ project.ref }}
                </button>
              </td>
              <td class="px-6 py-4 text-sm text-white max-w-xs truncate">
                {{ project.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ project.thirdparty_name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(project.datec) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(project.date_end) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(project.fk_statut)">
                  {{ getStatusText(project.fk_statut) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewProjectDetails(project)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Ver detalles"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="text-green-400 hover:text-green-300 transition-colors" title="Editar">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div class="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-400">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredProjects.length) }} de {{ filteredProjects.length }} proyectos
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'"
              class="px-3 py-2 rounded-lg bg-gray-700 text-white transition-colors"
            >
              Anterior
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                class="px-3 py-2 rounded-lg transition-colors"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'"
              class="px-3 py-2 rounded-lg bg-gray-700 text-white transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del proyecto -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative inline-block align-bottom bg-gray-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-700" @click.stop>
          <!-- Header -->
          <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-white">Detalles del Proyecto</h3>
                <p class="text-gray-400 mt-1">{{ selectedProject?.ref }}</p>
              </div>
              <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="bg-gray-900 px-6 py-6">
            <div v-if="loadingDetails" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span class="ml-3 text-gray-300">Cargando detalles...</span>
            </div>

            <div v-else-if="projectDetails" class="space-y-6">
              <!-- Información básica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Referencia</label>
                    <p class="text-white bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.ref }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getStatusClass(projectDetails.fk_statut)">
                      {{ getStatusText(projectDetails.fk_statut) }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Fecha de creación</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.datec) }}</p>
                  </div>

                  <div v-if="projectDetails.date_start">
                    <label class="block text-sm font-medium text-gray-300 mb-1">Fecha de inicio</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.date_start) }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Cliente</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.thirdparty_name || '-' }}</p>
                  </div>

                  <div v-if="projectDetails.date_end">
                    <label class="block text-sm font-medium text-gray-300 mb-1">Fecha límite</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatDate(projectDetails.date_end) }}</p>
                  </div>

                  <div v-if="projectDetails.budget_amount">
                    <label class="block text-sm font-medium text-gray-300 mb-1">Presupuesto</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ formatCurrency(projectDetails.budget_amount) }}</p>
                  </div>

                  <div v-if="projectDetails.usage_bill_time">
                    <label class="block text-sm font-medium text-gray-300 mb-1">Tiempo facturado</label>
                    <p class="text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">{{ projectDetails.usage_bill_time }}%</p>
                  </div>
                </div>
              </div>

              <!-- Título -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Título</label>
                <p class="text-white bg-gray-800 px-4 py-3 rounded-lg">{{ projectDetails.title }}</p>
              </div>

              <!-- Descripción -->
              <div v-if="projectDetails.description">
                <label class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                <div class="text-gray-300 bg-gray-800 px-4 py-3 rounded-lg max-h-64 overflow-y-auto" v-html="projectDetails.description"></div>
              </div>

              <!-- Información adicional -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div v-if="projectDetails.fk_user_creat_label">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Creado por</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.fk_user_creat_label }}</p>
                </div>
                <div v-if="projectDetails.public">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Público</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.public === '1' ? 'Sí' : 'No' }}</p>
                </div>
                <div v-if="projectDetails.usage_opportunity">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Oportunidad</label>
                  <p class="text-sm text-gray-300">{{ projectDetails.usage_opportunity }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-800 px-6 py-4 border-t border-gray-700">
            <div class="flex justify-end space-x-3">
              <button @click="closeModal" class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                Cerrar
              </button>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Editar Proyecto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import http from '../utils/http'

const projects = ref([])
const loading = ref(false)

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(50)

// Sorting
const sortField = ref('')
const sortDirection = ref('asc')

// Modal state
const showModal = ref(false)
const selectedProject = ref(null)
const projectDetails = ref(null)
const loadingDetails = ref(false)

const fetchProjects = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/projects')
    projects.value = response.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties for filtering and pagination
const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => 
      project.ref?.toLowerCase().includes(query) ||
      project.title?.toLowerCase().includes(query) ||
      project.thirdparty_name?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(project => project.fk_statut === statusFilter.value)
  }

  // Apply sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]

      // Handle date sorting
      if (sortField.value === 'datec' || sortField.value === 'date_end') {
        aVal = new Date(aVal * 1000)
        bVal = new Date(bVal * 1000)
      }

      // Handle numeric sorting
      if (typeof aVal === 'string' && !isNaN(aVal)) {
        aVal = parseFloat(aVal)
        bVal = parseFloat(bVal)
      }

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / itemsPerPage.value))

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProjects.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredProjects.value.length))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
}

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

// Modal methods
const viewProjectDetails = async (project) => {
  selectedProject.value = project
  showModal.value = true
  loadingDetails.value = true
  
  try {
    const response = await http.get(`/api/doli/projects/${project.id}`)
    projectDetails.value = response.data
  } catch (error) {
    console.error('Error fetching project details:', error)
    projectDetails.value = project // Fallback to basic project data
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
  projectDetails.value = null
  loadingDetails.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

const formatCurrency = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getStatusText = (status) => {
  const statuses = {
    '0': 'Borrador',
    '1': 'Validado',
    '2': 'En progreso',
    '3': 'Cerrado'
  }
  return statuses[status] || 'Desconocido'
}

const getStatusClass = (status) => {
  const classes = {
    '0': 'bg-gray-600 text-gray-200',
    '1': 'bg-blue-600 text-blue-100',
    '2': 'bg-green-600 text-green-100',
    '3': 'bg-red-600 text-red-100'
  }
  return classes[status] || 'bg-gray-600 text-gray-200'
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchProjects()
})
</script>
