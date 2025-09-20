<template>
  <div class="h-full flex flex-col p-6" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- Header con filtros de estado -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-6">
        <!-- Botón nuevo proyecto -->
        <button 
          @click="showNewProjectModal = true"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
        
        <!-- Filtros de estado tipo badges -->
        <div class="flex items-center space-x-1">
          <button
            @click="setStatusFilter('')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '' 
              ? (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getTotalCount() }} All
          </button>
          
          <button
            @click="setStatusFilter('0')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '0' 
              ? 'bg-gray-500 text-white'
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getStatusCount('0') }} Not Started
          </button>
          
          <button
            @click="setStatusFilter('2')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '2' 
              ? 'bg-blue-500 text-white'
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getStatusCount('2') }} In Progress
          </button>
          
          <button
            @click="setStatusFilter('1')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '1' 
              ? 'bg-orange-500 text-white'
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getStatusCount('1') }} On Hold
          </button>
          
          <button
            @click="setStatusFilter('4')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '4' 
              ? 'bg-red-500 text-white'
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getStatusCount('4') }} Cancelled
          </button>
          
          <button
            @click="setStatusFilter('3')"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors"
            :class="statusFilter === '3' 
              ? 'bg-green-500 text-white'
              : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            "
          >
            {{ getStatusCount('3') }} Finished
          </button>
        </div>
      </div>
      
      <!-- Controles de la derecha -->
      <div class="flex items-center space-x-3">
        <!-- Selector de elementos por página -->
        <select
          v-model="itemsPerPage"
          class="px-3 py-1 text-sm border rounded-lg"
          :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        
        <!-- Botón export -->
        <button class="px-3 py-1 text-sm border rounded-lg transition-colors" :class="isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          Export
        </button>
        
        <!-- Botón filtros -->
        <button 
          @click="showFilters = !showFilters"
          class="px-3 py-1 text-sm border rounded-lg transition-colors"
          :class="isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        >
          <svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>
    </div>

    <!-- Barra de búsqueda y filtros expandidos -->
    <div v-if="showFilters" class="mb-6 p-4 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="flex items-center space-x-4">
        <!-- Búsqueda -->
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          >
          <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabla de proyectos -->
    <div class="flex-1 rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                #
              </th>
              <th @click="sortBy('title')" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-50" :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'">
                <div class="flex items-center space-x-1">
                  <span>Project Name</span>
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Tags
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Start Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Deadline
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Members
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando proyectos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedProjects.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span class="text-sm">No hay proyectos que coincidan con los filtros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(project, index) in paginatedProjects" :key="project.id" class="hover:bg-opacity-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
              <!-- Número de fila -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              
              <!-- Nombre del proyecto -->
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewProjectDetails(project)"
                  class="text-sm font-medium hover:underline transition-colors" 
                  :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                >
                  {{ project.title || project.ref }}
                </button>
              </td>
              
              <!-- Cliente -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ project.thirdparty_name || '-' }}
              </td>
              
              <!-- Tags -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in getProjectTags(project)" 
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getTagClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              
              <!-- Fecha inicio -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(project.date_start || project.datec) }}
              </td>
              
              <!-- Deadline -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(project.date_end) }}
              </td>
              
              <!-- Miembros -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex -space-x-2">
                  <div 
                    v-for="member in getProjectMembers(project)" 
                    :key="member.id"
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-xs font-medium"
                    :class="isDark ? 'ring-gray-800' : 'ring-white'"
                    :title="member.name"
                  >
                    {{ member.initials }}
                  </div>
                  <div 
                    v-if="getProjectMembers(project).length === 0"
                    class="inline-block h-8 w-8 rounded-full ring-2 bg-gray-200 flex items-center justify-center text-xs"
                    :class="isDark ? 'ring-gray-800 bg-gray-600' : 'ring-white bg-gray-200'"
                  >
                    <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(project.fk_statut)">
                  {{ getStatusText(project.fk_statut) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación simple -->
      <div class="px-6 py-3 border-t flex items-center justify-between" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredProjects.length) }} of {{ filteredProjects.length }} entries
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border rounded transition-colors"
            :class="[
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
              isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            ]"
          >
            Previous
          </button>
          
          <span class="px-3 py-1 text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ currentPage }}
          </span>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border rounded transition-colors"
            :class="[
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : '',
              isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            ]"
          >
            Next
          </button>
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
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const projects = ref([])
const loading = ref(false)
const terceros = ref([])

// UI state
const showFilters = ref(false)
const showNewProjectModal = ref(false)

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Sorting
const sortField = ref('')
const sortDirection = ref('asc')

// Modal state
const showModal = ref(false)
const selectedProject = ref(null)
const projectDetails = ref(null)
const loadingDetails = ref(false)

const fetchProjects = async () => {
  console.log('🔄 fetchProjects called')
  loading.value = true
  try {
    const [projectsResponse, tercerosResponse] = await Promise.all([
      http.get('/api/doli/projects'),
      http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] }))
    ])
    
    const projectsData = projectsResponse.data || []
    terceros.value = tercerosResponse.data || []
    
    console.log('📊 Raw data loaded:', {
      projects: projectsData.length,
      terceros: terceros.value.length
    })
    
    // Debug actual project structure
    console.log('🔍 First project structure:', projectsData[0])
    console.log('🔍 Project keys:', Object.keys(projectsData[0] || {}))
    
    // Create terceros lookup map (same as Dashboard)
    const tercerosMap = {}
    terceros.value.forEach(tercero => {
      // Store with both string and number keys to handle type mismatches
      tercerosMap[tercero.id] = tercero
      tercerosMap[String(tercero.id)] = tercero
      tercerosMap[Number(tercero.id)] = tercero
    })
    
    // Enrich projects with terceros data - check multiple possible field names
    const enrichedProjects = projectsData.map(project => {
      // Try different possible field names for client ID
      const clientId = project.fk_soc || project.socid || project.fk_thirdparty || project.client_id || project.thirdparty_id
      const tercero = tercerosMap[clientId] || tercerosMap[String(clientId)] || tercerosMap[Number(clientId)] || null
      
      return {
        ...project,
        thirdparty_name: tercero ? tercero.name : null,
        client_id: clientId // Store the found client ID for debugging
      }
    })
    
    console.log('✅ Enriched projects sample:', enrichedProjects.slice(0, 3).map(p => ({
      ref: p.ref,
      fk_soc: p.fk_soc,
      client_id: p.client_id,
      thirdparty_name: p.thirdparty_name,
      title: p.title
    })))
    
    // Check if any projects have thirdparty_name
    const withThirdparty = enrichedProjects.filter(p => p.thirdparty_name).length
    console.log(`📈 Projects with thirdparty: ${withThirdparty}/${enrichedProjects.length}`)
    
    // Sample terceros for debugging
    console.log('🏢 Sample terceros:', Object.keys(tercerosMap).slice(0, 5), 'Total:', Object.keys(tercerosMap).length)
    
    // Debug specific project fk_soc values
    console.log('🔍 Project fk_soc values:', projectsData.slice(0, 5).map(p => ({ ref: p.ref, fk_soc: p.fk_soc, type: typeof p.fk_soc })))
    
    // Debug terceros IDs
    console.log('🔍 Terceros IDs:', terceros.value.slice(0, 5).map(t => ({ id: t.id, name: t.name, type: typeof t.id })))
    
    // Debug the actual matching process
    projectsData.slice(0, 3).forEach(project => {
      const directMatch = tercerosMap[project.fk_soc]
      const stringMatch = tercerosMap[String(project.fk_soc)]
      const numberMatch = tercerosMap[Number(project.fk_soc)]
      console.log(`🔍 Project ${project.ref} (fk_soc: ${project.fk_soc}):`, {
        directMatch: !!directMatch,
        stringMatch: !!stringMatch,
        numberMatch: !!numberMatch,
        finalMatch: directMatch || stringMatch || numberMatch,
        fk_soc_value: project.fk_soc,
        fk_soc_is_null: project.fk_soc === null,
        fk_soc_is_zero: project.fk_soc === '0' || project.fk_soc === 0
      })
    })
    
    // Check if projects have null or 0 fk_soc
    const projectsWithoutClient = projectsData.filter(p => !p.fk_soc || p.fk_soc === '0' || p.fk_soc === 0)
    console.log(`📊 Projects without client: ${projectsWithoutClient.length}/${projectsData.length}`)
    
    projects.value = enrichedProjects
    
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
  } finally {
    loading.value = false
    console.log('🏁 fetchProjects completed, projects count:', projects.value.length)
  }
}

// Computed properties for filtering and pagination
const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  // Hide projects with status = 2
  filtered = filtered.filter(project => project.fk_statut !== '2')

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

// Funciones para filtros de estado
const setStatusFilter = (status) => {
  statusFilter.value = status
  currentPage.value = 1
}

const getTotalCount = () => {
  return projects.value.length
}

const getStatusCount = (status) => {
  return projects.value.filter(project => project.fk_statut === status).length
}

// Funciones para tags y miembros
const getProjectTags = (project) => {
  const tags = []
  
  // Agregar tags basados en el tipo de proyecto o características
  if (project.title?.toLowerCase().includes('website') || project.title?.toLowerCase().includes('web')) {
    tags.push('wordpress')
  }
  if (project.title?.toLowerCase().includes('seo')) {
    tags.push('wordpress')
  }
  if (project.title?.toLowerCase().includes('review') || project.title?.toLowerCase().includes('redesign')) {
    tags.push('review')
  }
  
  return tags
}

const getTagClass = (tag) => {
  const tagClasses = {
    'wordpress': 'bg-blue-100 text-blue-800',
    'review': 'bg-orange-100 text-orange-800',
    'design': 'bg-purple-100 text-purple-800'
  }
  return tagClasses[tag] || 'bg-gray-100 text-gray-800'
}

const getProjectMembers = (project) => {
  // Simular miembros del proyecto
  const members = [
    { id: 1, name: 'John Doe', initials: 'JD' },
    { id: 2, name: 'Jane Smith', initials: 'JS' },
    { id: 3, name: 'Mike Johnson', initials: 'MJ' }
  ]
  
  // Retornar algunos miembros aleatorios basados en el ID del proyecto
  const memberCount = (parseInt(project.id) % 3) + 1
  return members.slice(0, memberCount)
}

const getStatusText = (status) => {
  const statuses = {
    '0': 'Not Started',
    '1': 'On Hold', 
    '2': 'In Progress',
    '3': 'Finished',
    '4': 'Cancelled'
  }
  return statuses[status] || 'Unknown'
}

const getStatusClass = (status) => {
  const classes = {
    '0': 'bg-gray-600 text-gray-200',
    '1': 'bg-orange-600 text-orange-100',
    '2': 'bg-blue-600 text-blue-100',
    '3': 'bg-green-600 text-green-100',
    '4': 'bg-red-600 text-red-100'
  }
  return classes[status] || 'bg-gray-600 text-gray-200'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    '0': 'bg-gray-100 text-gray-800',
    '1': 'bg-orange-100 text-orange-800',
    '2': 'bg-blue-100 text-blue-800', 
    '3': 'bg-green-100 text-green-800',
    '4': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// Debug watcher to monitor projects data changes
watch(projects, (newProjects, oldProjects) => {
  console.log('🔍 Projects data changed:', {
    oldCount: oldProjects?.length || 0,
    newCount: newProjects?.length || 0,
    sampleNew: newProjects?.slice(0, 2)?.map(p => ({
      ref: p.ref,
      thirdparty_name: p.thirdparty_name
    }))
  })
}, { deep: true })

onMounted(() => {
  console.log('🚀 Component mounted, calling fetchProjects')
  fetchProjects()
})
</script>
