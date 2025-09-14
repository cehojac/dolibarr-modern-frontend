<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Panel Principal</h1>
      <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Resumen de tu gestión empresarial</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div
        v-for="module in modules"
        :key="module.name"
        class="border rounded-xl p-6 transition-colors cursor-pointer" :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        @click="$router.push(module.href)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="module.iconPath" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ module.name }}</p>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ module.count || '-' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- To Do Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="px-6 py-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Lista de Tareas Pendientes</h2>
            <p class="mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tickets y tareas de proyectos que requieren atención</p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Filter by type -->
            <select
              v-model="typeFilter"
              @change="applyFilters"
              class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
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
                class="border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
              >
              <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Tipo</th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Estado</th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Asignado a</th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Etiquetas</th>
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
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Proyecto</th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Progreso</th>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ todo.assigned_to || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ todo.tags || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(todo.date_start) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(todo.date_end) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ todo.project || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
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
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTodos.length) }} de {{ filteredTodos.length }} tareas
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-3 py-2 rounded-lg transition-colors"
            >
              Anterior
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
                class="px-3 py-2 rounded-lg transition-colors"
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
              class="px-3 py-2 rounded-lg transition-colors"
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
const modules = ref([
  { name: 'Terceros', href: '/terceros', iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', count: 0 },
  { name: 'Productos', href: '/productos', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', count: 0 },
  { name: 'Servicios', href: '/servicios', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', count: 0 },
  { name: 'Documentos', href: '/documentos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', count: 0 },
  { name: 'Agenda', href: '/agenda', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', count: 0 },
  { name: 'Tickets', href: '/tickets', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', count: 0 }
])

// To Do table data
const todos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const sortField = ref('date_start')
const sortOrder = ref('desc')

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
    console.log('Loading todos...')
    
    // Load tickets, projects and tasks in parallel
    const [ticketsResponse, projectsResponse, tasksResponse] = await Promise.all([
      axios.get('/api/doli/tickets').catch(err => {
        console.error('Error loading tickets:', err)
        return { data: [] }
      }),
      axios.get('/api/doli/projects').catch(err => {
        console.error('Error loading projects:', err)
        return { data: [] }
      }),
      axios.get('/api/doli/tasks').catch(err => {
        console.error('Error loading tasks:', err)
        return { data: [] }
      })
    ])

    console.log('API Responses:', {
      tickets: ticketsResponse.data,
      projects: projectsResponse.data,
      tasks: tasksResponse.data
    })

    const todoItems = []

    // Process tickets
    if (ticketsResponse.data && Array.isArray(ticketsResponse.data)) {
      console.log(`Processing ${ticketsResponse.data.length} tickets`)
      ticketsResponse.data.forEach(ticket => {
        console.log('Ticket:', ticket)
        // Include all tickets for debugging, remove status filter temporarily
        todoItems.push({
          id: ticket.id,
          type: 'ticket',
          ref: ticket.ref,
          title: ticket.subject || ticket.message || 'Sin título',
          status: ticket.fk_statut,
          assigned_to: ticket.assigned_user_name || ticket.assigned_user || null,
          tags: ticket.category ? [ticket.category] : [],
          date_start: ticket.datec,
          date_end: ticket.date_close,
          project_name: null,
          progress: null
        })
      })
    }

    // Create a map of projects for quick lookup
    const projectsMap = {}
    if (projectsResponse.data && Array.isArray(projectsResponse.data)) {
      console.log(`Processing ${projectsResponse.data.length} projects`)
      projectsResponse.data.forEach(project => {
        projectsMap[project.id] = project
      })
    }

    // Process tasks from Dolibarr tasks endpoint
    if (tasksResponse.data && Array.isArray(tasksResponse.data)) {
      console.log(`Processing ${tasksResponse.data.length} tasks`)
      tasksResponse.data.forEach(task => {
        console.log('Task:', task)
        // Include all tasks for debugging, remove progress filter temporarily
        const project = projectsMap[task.fk_project] || null
        
        todoItems.push({
          id: task.id,
          type: 'task',
          ref: task.ref || `TASK-${task.id}`,
          title: task.label || 'Sin título',
          status: task.progress >= 100 ? 'completed' : (task.progress > 0 ? 'in_progress' : 'pending'),
          assigned_to: task.assigned_user_name || null,
          tags: task.category ? [task.category] : [],
          date_start: task.dateo,
          date_end: task.datee,
          project_name: project ? (project.title || project.ref) : null,
          progress: task.progress || 0
        })
      })
    }

    console.log(`Total todo items: ${todoItems.length}`)
    todos.value = todoItems
  } catch (error) {
    console.error('Error loading todos:', error)
  } finally {
    loading.value = false
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
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

onMounted(() => {
  loadTodos()
})
</script>
