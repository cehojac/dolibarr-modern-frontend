<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-8 xl:mb-10 2xl:mb-12">
      <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Panel Principal</h1>
      <p class="mt-2 xl:mt-3 2xl:mt-4 text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Resumen de tu gestión empresarial</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 xl:gap-8 2xl:gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-8 xl:mb-10 2xl:mb-12">
      <div
        v-for="module in modules"
        :key="module.name"
        class="border rounded-xl p-6 xl:p-8 2xl:p-10 transition-colors cursor-pointer" :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        @click="$router.push(module.href)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="module.iconPath" />
              </svg>
            </div>
          </div>
          <div class="ml-4 xl:ml-6 2xl:ml-8">
            <p class="text-sm xl:text-base 2xl:text-lg font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ module.name }}</p>
            <p class="text-2xl xl:text-3xl 2xl:text-4xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ module.count !== undefined ? module.count : '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- To Do Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-6 2xl:py-8 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl xl:text-2xl 2xl:text-3xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Lista de Tareas Pendientes</h2>
            <p class="mt-1 xl:mt-2 2xl:mt-3 text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tickets y tareas de proyectos que requieren atención</p>
          </div>
          <div class="flex items-center space-x-3 xl:space-x-4 2xl:space-x-5">
            <!-- Filter by type -->
            <select
              v-model="typeFilter"
              @change="applyFilters"
              class="border rounded-lg px-3 xl:px-4 2xl:px-5 py-2 xl:py-3 2xl:py-3 text-sm xl:text-base 2xl:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
            >
              <option value="">Todos los tipos</option>
              <option value="ticket">Tickets</option>
              <option value="task">Tareas</option>
            </select>
            
            <!-- Search -->
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="applyFilters"
                type="text"
                placeholder="Buscar en tareas..."
                class="border rounded-lg px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-3 pl-10 xl:pl-12 2xl:pl-14 text-sm xl:text-base 2xl:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
              >
              <svg class="absolute left-3 xl:left-4 2xl:left-5 top-2.5 xl:top-3.5 2xl:top-4 h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
            <tr>
              <th @click="sortBy('ref')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Ref.</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th @click="sortBy('title')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Título</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tipo</th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Estado</th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Asignado a</th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Detalles</th>
              <th @click="sortBy('date_start')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Fecha inicio</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th @click="sortBy('date_end')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Fecha fin</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Proyecto</th>
              <th scope="col" class="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Progreso</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="10" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Cargando tareas...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTodos.length === 0">
              <td colspan="10" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>No hay tareas pendientes</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="todo in paginatedTodos" :key="`${todo.type}-${todo.id}`" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDetails(todo)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ todo.ref }}
                </button>
              </td>
              <td class="px-6 py-4 text-sm max-w-xs truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ todo.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="todo.type === 'ticket' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                  {{ todo.type === 'ticket' ? 'Ticket' : 'Tarea' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(todo.status, todo.type)">
                  {{ getStatusText(todo.status, todo.type) }}
                </span>
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ todo.assigned_to || '-' }}
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <div class="space-y-1">
                  <div v-if="todo.type === 'task'">
                    <!-- Task details -->
                    <div v-if="todo.tercero_name" class="text-xs">Tercero: {{ todo.tercero_name }}</div>
                    <div v-if="todo.project_name" class="text-xs">Proyecto: {{ todo.project_name }}</div>
                    <div v-if="todo.project_tags" class="text-xs">Tags: {{ todo.project_tags }}</div>
                  </div>
                  <div v-else>
                    <!-- Ticket details -->
                    <div v-if="todo.tercero_name" class="text-xs">Tercero: {{ todo.tercero_name }}</div>
                    <div v-if="todo.project_category" class="text-xs">Categoría: {{ todo.project_category }}</div>
                    <div v-if="todo.severity" class="text-xs">Gravedad: {{ todo.severity }}</div>
                    <div v-if="todo.tags" class="text-xs">Tags: {{ todo.tags }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(todo.date_start) }}
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(todo.date_end) }}
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ todo.project || '-' }}
              </td>
              <td class="px-8 py-6 whitespace-nowrap text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <div v-if="todo.type === 'task' && todo.progress !== undefined" class="flex items-center">
                  <div class="w-full rounded-full h-2 mr-2" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                    <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${todo.progress}%`"></div>
                  </div>
                  <span class="text-xs">{{ todo.progress }}%</span>
                </div>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="flex items-center justify-between">
          <div class="text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTodos.length) }} de {{ filteredTodos.length }} tareas
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
import { ref, computed, onMounted, watch } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'
import { useTicketsCounter } from '../composables/useTicketsCounter'
import { useTasksCounter } from '../composables/useTasksCounter'
import { useTheme } from '../composables/useTheme'
const { isDark } = useTheme()
const authStore = useAuthStore()
const { assignedTicketsCount: ticketsCountComposable, fetchAssignedTicketsCount } = useTicketsCounter()
const { assignedTasksCount: tasksCountComposable, fetchAssignedTasksCount } = useTasksCounter()

// Reactive data
const modules = computed(() => [
  { name: 'Terceros', href: '/terceros', iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
  { name: 'Productos', href: '/productos', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { name: 'Servicios', href: '/servicios', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Proyectos', href: '/proyectos', iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { name: 'Tickets Asignados', href: '/tickets', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', count: ticketsCountComposable.value },
  { name: 'Tareas Asignadas', href: '/tareas', iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', count: tasksCountComposable.value }
])

// To Do table data
const todos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const sortField = ref('date_start')
const sortOrder = ref('desc')

// Counters
const assignedTicketsCount = ref(0)
const assignedTasksCount = ref(0)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

// Computed properties
const filteredTodos = computed(() => {
  let filtered = todos.value

  // Filter by type
  if (typeFilter.value) {
    filtered = filtered.filter(todo => todo.type === typeFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(todo => 
      todo.ref.toLowerCase().includes(query) ||
      todo.title.toLowerCase().includes(query) ||
      (todo.assigned_to && todo.assigned_to.toLowerCase().includes(query)) ||
      (todo.project_name && todo.project_name.toLowerCase().includes(query))
    )
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (sortField.value === 'date_start' || sortField.value === 'date_end') {
      aVal = new Date(aVal || 0)
      bVal = new Date(bVal || 0)
    }
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / itemsPerPage))

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTodos.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredTodos.value.length))

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
const loadTodos = async () => {
  loading.value = true
  try {
    
    // Load all required data in parallel
    const [ticketsResponse, tasksResponse, tercerosResponse, projectsResponse, usersResponse] = await Promise.all([
      http.get('/api/doli/tickets').catch(() => ({ data: [] })),
      http.get('/api/doli/tasks?limit=500&sqlfilters=(t.progress:<:100)or(t.progress:is:null)').catch(() => ({ data: [] })),
      http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] })),
      http.get('/api/doli/projects?limit=2000').catch(() => ({ data: [] })),
      http.get('/api/doli/users').catch(() => ({ data: [] }))
    ])


    // Create lookup maps for enrichment
    const tercerosMap = {}
    const projectsMap = {}
    const usersMap = {}

    // Build terceros map
    if (tercerosResponse.data && Array.isArray(tercerosResponse.data)) {
      tercerosResponse.data.forEach(tercero => {
        tercerosMap[tercero.id] = tercero
      })
    }

    // Build projects map
    if (projectsResponse.data && Array.isArray(projectsResponse.data)) {
     // console.log('🏗️ Projects loaded:', projectsResponse.data.length)
      projectsResponse.data.forEach(project => {
       // console.log('📋 Project mapping:', { id: project.id, title: project.title, ref: project.ref })
        projectsMap[project.id] = project
      })
    //  console.log('🗺️ Projects map keys:', Object.keys(projectsMap))
    }

    // Build users map
    if (usersResponse.data && Array.isArray(usersResponse.data)) {
      usersResponse.data.forEach(user => {
        usersMap[user.id] = user
      })
    }

    const todoItems = []

    // Process tickets with enrichment and count assigned ones
    let assignedTicketsCounter = 0
    try {
      if (ticketsResponse.data && Array.isArray(ticketsResponse.data)) {
        ticketsResponse.data.forEach(ticket => {
          // Only include non-closed tickets
          if (ticket.fk_statut !== '8') {
            const assignedUser = usersMap[ticket.fk_user_assign] || null
            const tercero = tercerosMap[ticket.fk_soc] || null
            
            // Count tickets assigned to current user
            const currentUserId = authStore.user?.id || authStore.user?.rowid || authStore.user?.user_id
            const currentUserLogin = authStore.user?.login
            const isAssignedById = currentUserId && ticket.fk_user_assign == currentUserId
            const isAssignedByLogin = currentUserLogin && ticket.fk_user_assign_login == currentUserLogin
            if (isAssignedById || isAssignedByLogin) {
              assignedTicketsCounter++
            }
            
            todoItems.push({
              id: ticket.id,
              type: 'ticket',
              ref: ticket.ref,
              title: ticket.subject || 'Sin asunto',
              status: ticket.fk_statut === '0' ? 'pending' : (ticket.fk_statut === '1' ? 'in_progress' : 'pending'),
              assigned_to: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}`.trim() : null,
              tags: ticket.category_code || ticket.category || null,
              date_start: ticket.datec,
              date_end: null,
              project: null,
              progress: null,
              tercero_name: tercero ? tercero.name : null,
              project_name: null,
              project_category: null,
              severity: ticket.severity_code || ticket.severity || 'NORMAL'
            })
          }
        })
      }
    } catch (err) {
      // Silent error handling for tickets
    }
    assignedTicketsCount.value = assignedTicketsCounter
    
    // Process tasks with enrichment and count assigned ones
    let assignedTasksCounter = 0
    if (tasksResponse.data && Array.isArray(tasksResponse.data)) {
      tasksResponse.data.forEach(task => {
        // Only include non-completed tasks
        if (task.progress < 100) {
          const project = projectsMap[task.fk_project] || projectsMap[String(task.fk_project)] || null
          const assignedUser = usersMap[task.fk_user_assign] || null
          const tercero = project ? tercerosMap[project.fk_soc] : null
          
          // Count tasks assigned to current user
          const currentUserId = authStore.user?.id || authStore.user?.rowid || authStore.user?.user_id
          const currentUserLogin = authStore.user?.login
          const isAssignedById = currentUserId && task.fk_user_assign == currentUserId
          const isAssignedByLogin = currentUserLogin && task.fk_user_assign_login == currentUserLogin
          if (isAssignedById || isAssignedByLogin) {
            assignedTasksCounter++
          }
          
       /*   console.log('🔍 Task data for Dashboard:', {
            taskId: task.id,
            projectId: task.fk_project,
            projectIdType: typeof task.fk_project,
            projectsMapHasKey: projectsMap.hasOwnProperty(task.fk_project),
            projectsMapHasStringKey: projectsMap.hasOwnProperty(String(task.fk_project)),
            project: project,
            tercero: tercero,
            tercero_name: tercero ? tercero.name : null,
            project_name: project ? project.title || project.ref : null,
            project_tags: project ? project.category : null
          })
            */
          
          todoItems.push({
            id: task.id,
            type: 'task',
            ref: task.ref || `TASK-${task.id}`,
            title: task.label || 'Sin título',
            status: task.progress >= 100 ? 'completed' : (task.progress > 0 ? 'in_progress' : 'pending'),
            assigned_to: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}`.trim() : null,
            tags: project ? project.category : null,
            date_start: task.dateo,
            date_end: task.datee,
            project: project ? project.ref : null,
            progress: task.progress || 0,
            tercero_name: tercero ? tercero.name : null,
            project_name: project ? project.title || project.ref : null,
            project_category: project ? project.category : null,
            project_tags: project ? project.category : null,
            severity: task.priority || 'NORMAL'
          })
        }
      })
    }
    assignedTasksCount.value = assignedTasksCounter

    todos.value = todoItems
  } catch (error) {
    // Silent error handling
  } finally {
    loading.value = false
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
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

const goToPage = (page) => {
  currentPage.value = page
}

const viewDetails = (todo) => {
  if (todo.type === 'ticket') {
    // Navigate to tickets view with specific ticket
    window.open(`/tickets?id=${todo.id}`, '_blank')
  } else if (todo.type === 'task') {
    // Navigate to projects view
    window.open('/proyectos', '_blank')
  }
}

// Utility functions
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES')
}

const getTypeClass = (type) => {
  return type === 'ticket' 
    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}

const getTypeText = (type) => {
  return type === 'ticket' ? 'Ticket' : 'Tarea'
}

const getStatusClass = (status, type) => {
  if (type === 'ticket') {
    switch (status) {
      case '0': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case '1': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case '3': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '4': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case '5': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case '6': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case '7': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      case '8': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case '9': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  } else {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }
}

const getStatusText = (status, type) => {
  if (type === 'ticket') {
    switch (status) {
      case '0': return 'Borrador'
      case '1': return 'Asignado'
      case '3': return 'Leído'
      case '4': return 'En progreso'
      case '5': return 'Necesita más info'
      case '6': return 'Esperando'
      case '7': return 'En pruebas'
      case '8': return 'Cerrado'
      case '9': return 'Cancelado'
      default: return 'Desconocido'
    }
  } else {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'in_progress': return 'En progreso'
      case 'completed': return 'Completada'
      default: return 'Desconocido'
    }
  }
}

// Watch for user changes and refresh data
watch(() => authStore.user, (newUser, oldUser) => {
  if (newUser && (!oldUser || newUser.id !== oldUser.id || newUser.login !== oldUser.login)) {
    console.log('🔄 User changed in Dashboard, reloading data:', {
      oldUser: oldUser ? { id: oldUser.id, login: oldUser.login } : null,
      newUser: { id: newUser.id, login: newUser.login }
    })
    loadTodos()
  }
}, { immediate: false })

onMounted(async () => {
  await Promise.all([
    fetchAssignedTicketsCount(),
    fetchAssignedTasksCount(),
    loadTodos()
  ])
})
</script>
