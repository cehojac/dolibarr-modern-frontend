<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Gestión de Tareas</h1>
      <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Administra y supervisa todas las tareas del sistema</p>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
      <!-- Search -->
      <div class="relative md:col-span-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar tareas..."
          class="w-full border rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        >
        <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Status Filter -->
      <select
        v-model="statusFilter"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="in_progress">En progreso</option>
        <option value="completed">Completada</option>
      </select>

      <!-- Priority Filter -->
      <select
        v-model="priorityFilter"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
      >
        <option value="">Todas las prioridades</option>
        <option value="LOW">Baja</option>
        <option value="NORMAL">Normal</option>
        <option value="HIGH">Alta</option>
        <option value="URGENT">Urgente</option>
        <option value="CRITICAL">Crítica</option>
      </select>

      <!-- Project Filter -->
      <div class="relative">
        <input
          v-model="projectSearchQuery"
          @focus="showProjectDropdown = true"
          @input="filterProjects"
          type="text"
          placeholder="Buscar proyecto..."
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        >
        <div v-if="showProjectDropdown && filteredProjects.length > 0" 
             class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
             :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            @click="selectProject(project)"
            class="px-3 py-2 cursor-pointer hover:bg-opacity-50"
            :class="isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'"
          >
            {{ project.title || project.ref }}
          </div>
        </div>
      </div>

      <!-- User Filter -->
      <div class="relative">
        <input
          v-model="userSearchQuery"
          @focus="showUserDropdown = true"
          @input="filterUsers"
          type="text"
          placeholder="Buscar usuario..."
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        >
        <div v-if="showUserDropdown && filteredUsers.length > 0" 
             class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
             :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="px-3 py-2 cursor-pointer hover:bg-opacity-50"
            :class="isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'"
          >
            {{ user.firstname }} {{ user.lastname }}
          </div>
        </div>
      </div>

      <!-- Clear Filters -->
      <button
        @click="clearFilters"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      >
        Limpiar
      </button>
    </div>

    <!-- Tasks Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
            <tr>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Ref.</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Título</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Proyecto</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Estado</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Prioridad</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tercero</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Progreso</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Fecha Inicio</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Fecha Fin</th>
              <th scope="col" class="px-8 xl:px-10 2xl:px-12 py-4 xl:py-5 2xl:py-6 text-left text-sm xl:text-base 2xl:text-lg font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Asignado a</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="10" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2 xl:space-x-3 2xl:space-x-4">
                  <div class="animate-spin rounded-full h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 border-b-2 border-blue-500"></div>
                  <span class="text-sm xl:text-base 2xl:text-lg">Cargando tareas...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTasks.length === 0">
              <td colspan="10" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2 xl:space-y-3 2xl:space-y-4">
                  <svg class="w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm xl:text-base 2xl:text-lg">No se encontraron tareas</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="task in paginatedTasks" :key="task.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg font-medium">
                <button 
                  @click="viewTaskDetails(task)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ task.ref }}
                </button>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-sm xl:text-base 2xl:text-lg max-w-xs xl:max-w-sm 2xl:max-w-md truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ task.label }}
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ task.project_name || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full" :class="getStatusClass(task.status)">
                  {{ getStatusText(task.status) }}
                </span>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full" :class="getPriorityClass(task.priority)">
                  {{ getPriorityText(task.priority) }}
                </span>
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ task.tercero_name || '-' }}
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <div class="flex items-center">
                  <div class="w-full rounded-full h-2 xl:h-3 2xl:h-4 mr-2 xl:mr-3 2xl:mr-4" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                    <div class="bg-blue-500 h-2 xl:h-3 2xl:h-4 rounded-full" :style="`width: ${task.progress}%`"></div>
                  </div>
                  <span class="text-xs xl:text-sm 2xl:text-base">{{ task.progress }}%</span>
                </div>
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(task.dateo) }}
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(task.datee) }}
              </td>
              <td class="px-8 xl:px-10 2xl:px-12 py-6 xl:py-7 2xl:py-8 whitespace-nowrap text-base xl:text-lg 2xl:text-xl" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ task.assigned_to || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="flex items-center justify-between">
          <div class="text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTasks.length) }} de {{ filteredTasks.length }} tareas
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import http from '../utils/http'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// Reactive data
const tasks = ref([])
const projects = ref([])
const users = ref([])
const terceros = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const projectSearchQuery = ref('')
const userSearchQuery = ref('')
const selectedProject = ref(null)
const selectedUser = ref(null)

// Dropdowns
const showProjectDropdown = ref(false)
const showUserDropdown = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

// Computed properties
const filteredProjects = computed(() => {
  if (!projectSearchQuery.value) return projects.value.slice(0, 10)
  return projects.value.filter(project => 
    (project.title && project.title.toLowerCase().includes(projectSearchQuery.value.toLowerCase())) ||
    (project.ref && project.ref.toLowerCase().includes(projectSearchQuery.value.toLowerCase()))
  ).slice(0, 10)
})

const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return users.value.slice(0, 10)
  return users.value.filter(user => 
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  ).slice(0, 10)
})

const filteredTasks = computed(() => {
  let filtered = tasks.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.ref.toLowerCase().includes(query) ||
      task.label.toLowerCase().includes(query) ||
      (task.project_name && task.project_name.toLowerCase().includes(query)) ||
      (task.assigned_to && task.assigned_to.toLowerCase().includes(query))
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(task => task.status === statusFilter.value)
  }

  // Filter by priority
  if (priorityFilter.value) {
    filtered = filtered.filter(task => task.priority === priorityFilter.value)
  }

  // Filter by selected project
  if (selectedProject.value) {
    filtered = filtered.filter(task => task.fk_project === selectedProject.value.id)
  }

  // Filter by selected user
  if (selectedUser.value) {
    filtered = filtered.filter(task => task.fk_user_assign === selectedUser.value.id)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTasks.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredTasks.value.length))

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
const loadTasks = async () => {
  loading.value = true
  try {
    const enrichedTasks = []
    
    // Try to load tasks first
    try {
      const tasksResponse = await http.get('/api/doli/tasks?limit=500&sqlfilters=(t.progress:<:100)or(t.progress:is:null)')
      
      if (tasksResponse.data && Array.isArray(tasksResponse.data)) {
        // Load supporting data only if tasks loaded successfully
        const [projectsResponse, usersResponse, tercerosResponse] = await Promise.all([
          http.get('/api/doli/projects?limit=1000').catch(() => ({ data: [] })),
          http.get('/api/doli/users').catch(() => ({ data: [] })),
          http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] }))
        ])

        // Store reference data
        projects.value = projectsResponse.data || []
        users.value = usersResponse.data || []
        terceros.value = tercerosResponse.data || []

        // Create lookup maps for enrichment with multiple key types
        const projectsMap = {}
        const usersMap = {}
        const tercerosMap = {}

        // Store projects with multiple key types for flexible matching
        projects.value.forEach(project => {
          if (project.id) {
            projectsMap[project.id] = project
            projectsMap[String(project.id)] = project
          }
          if (project.rowid && project.rowid !== project.id) {
            projectsMap[project.rowid] = project
            projectsMap[String(project.rowid)] = project
          }
        })

        // Store users with multiple key types
        users.value.forEach(user => {
          if (user.id) {
            usersMap[user.id] = user
            usersMap[String(user.id)] = user
          }
          if (user.rowid && user.rowid !== user.id) {
            usersMap[user.rowid] = user
            usersMap[String(user.rowid)] = user
          }
        })

        // Store terceros with multiple key types for flexible matching
        terceros.value.forEach(tercero => {
          if (tercero.id) {
            tercerosMap[tercero.id] = tercero
            tercerosMap[String(tercero.id)] = tercero
          }
          if (tercero.rowid && tercero.rowid !== tercero.id) {
            tercerosMap[tercero.rowid] = tercero
            tercerosMap[String(tercero.rowid)] = tercero
          }
        })

        console.log('Tareas - Projects loaded:', projects.value.length)
        console.log('Tareas - Terceros loaded:', terceros.value.length)
        console.log('Tareas - Users loaded:', users.value.length)
        console.log('Tareas - Sample project:', projects.value[0])
        console.log('Tareas - Sample tercero:', terceros.value[0])
        console.log('Tareas - Projects map keys:', Object.keys(projectsMap).slice(0, 10))
        console.log('Tareas - Terceros map keys:', Object.keys(tercerosMap).slice(0, 10))
        console.log('Tareas - Users map keys:', Object.keys(usersMap).slice(0, 10))

        // Process tasks with enrichment
        tasksResponse.data.forEach((task, index) => {
          if (index < 3) {
            console.log(`Sample task ${index}:`, task)
          }
          
          // Try multiple possible project ID fields
          let project = null
          const projectIds = [task.fk_project, task.fk_projet, task.project_id, task.projectid]
          
          if (index < 3) {
            console.log(`Task ${task.ref} project IDs to try:`, projectIds)
            console.log(`Looking for project ID '${projectIds[0]}' in map:`, !!projectsMap[projectIds[0]])
            if (projectIds[0]) {
              console.log(`Available project IDs near '${projectIds[0]}':`, Object.keys(projectsMap).filter(key => key.includes(projectIds[0].toString().slice(-2))))
            }
          }
          
          for (const projectId of projectIds) {
            if (projectId && projectsMap[projectId]) {
              project = projectsMap[projectId]
              if (index < 3) {
                console.log(`Found project for task ${task.ref}:`, project)
              }
              break
            }
          }

          // Try multiple possible user ID fields
          let assignedUser = null
          const userIds = [task.fk_user_assign, task.fk_user, task.user_id, task.userid]
          for (const userId of userIds) {
            if (userId && usersMap[userId]) {
              assignedUser = usersMap[userId]
              break
            }
          }

          // Try to get tercero from project or task directly
          let tercero = null
          if (project) {
            // Try multiple possible tercero ID fields from project
            const terceroIds = [project.fk_soc, project.fk_societe, project.socid, project.client_id]
            for (const terceroId of terceroIds) {
              if (terceroId && tercerosMap[terceroId]) {
                tercero = tercerosMap[terceroId]
                break
              }
            }
          }
          
          // If no tercero from project, try task direct fields
          if (!tercero) {
            const taskTerceroIds = [task.fk_soc, task.fk_societe, task.socid, task.client_id]
            for (const terceroId of taskTerceroIds) {
              if (terceroId && tercerosMap[terceroId]) {
                tercero = tercerosMap[terceroId]
                break
              }
            }
          }

          console.log(`Task ${task.ref}: project=${project?.title || project?.ref || 'none'}, tercero=${tercero?.name || 'none'}`)
          
          enrichedTasks.push({
            ...task,
            status: task.progress >= 100 ? 'completed' : (task.progress > 0 ? 'in_progress' : 'pending'),
            assigned_to: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}`.trim() : null,
            project_name: project ? (project.title || project.ref) : null,
            tercero_name: tercero ? tercero.name : null,
            priority: task.priority || 'NORMAL'
          })
        })
      }
    } catch (err) {
      // Tasks API failed, show empty state
      projects.value = []
      users.value = []
      terceros.value = []
    }

    tasks.value = enrichedTasks
  } catch (error) {
    // Silent error handling - show empty state
  } finally {
    loading.value = false
  }
}

const selectProject = (project) => {
  selectedProject.value = project
  projectSearchQuery.value = project.title || project.ref
  showProjectDropdown.value = false
}

const selectUser = (user) => {
  selectedUser.value = user
  userSearchQuery.value = `${user.firstname} ${user.lastname}`
  showUserDropdown.value = false
}

const filterProjects = () => {
  if (!projectSearchQuery.value) {
    selectedProject.value = null
  }
}

const filterUsers = () => {
  if (!userSearchQuery.value) {
    selectedUser.value = null
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  projectSearchQuery.value = ''
  userSearchQuery.value = ''
  selectedProject.value = null
  selectedUser.value = null
  currentPage.value = 1
}

const viewTaskDetails = (task) => {
  // Navigate to projects view or task details
  window.open('/proyectos', '_blank')
}

// Utility functions
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'in_progress': return 'En progreso'
    case 'completed': return 'Completada'
    default: return 'Desconocido'
  }
}

const getPriorityText = (priority) => {
  const priorities = {
    'LOW': 'Baja',
    'NORMAL': 'Normal',
    'HIGH': 'Alta',
    'URGENT': 'Urgente',
    'CRITICAL': 'Crítica'
  }
  return priorities[priority] || 'Normal'
}

const getPriorityClass = (priority) => {
  const classes = {
    'LOW': 'bg-green-600 text-green-100',
    'NORMAL': 'bg-blue-600 text-blue-100',
    'HIGH': 'bg-yellow-600 text-yellow-100',
    'URGENT': 'bg-red-600 text-red-100',
    'CRITICAL': 'bg-red-800 text-red-100'
  }
  return classes[priority] || 'bg-blue-600 text-blue-100'
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

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, priorityFilter], () => {
  currentPage.value = 1
})

// Close dropdowns when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.relative')) {
    showProjectDropdown.value = false
    showUserDropdown.value = false
  }
}

onMounted(() => {
  loadTasks()
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>
