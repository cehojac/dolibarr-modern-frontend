<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Gestión de Tareas</h1>
      <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Administra y supervisa todas las tareas del sistema</p>
    </div>

    <!-- Tareas Overview -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Tareas Overview</h2>
        <a href="#" class="text-blue-500 hover:text-blue-600 text-sm font-medium">Ver todas →</a>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <!-- Tareas Pendientes -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all duration-200" 
          :class="pendingTasks.length > 0 
            ? (isDark ? 'bg-yellow-900/20 border-yellow-700 hover:bg-yellow-900/30' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100')
            : (isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50')
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" 
                 :class="pendingTasks.length > 0 
                   ? (isDark ? 'text-yellow-300' : 'text-yellow-700')
                   : (isDark ? 'text-white' : 'text-gray-900')
                 ">
                {{ pendingTasks.length }}
              </p>
              <p class="text-sm font-medium" 
                 :class="pendingTasks.length > 0 ? 'text-yellow-500' : 'text-orange-500'">
                Pendientes
              </p>
              <p class="text-xs" 
                 :class="pendingTasks.length > 0 
                   ? (isDark ? 'text-yellow-400' : 'text-yellow-600')
                   : (isDark ? 'text-gray-400' : 'text-gray-600')
                 ">
                Por iniciar
              </p>
            </div>
            <!-- Icono de alerta cuando hay tareas pendientes -->
            <div v-if="pendingTasks.length > 0" class="ml-2">
              <svg class="w-6 h-6" :class="isDark ? 'text-yellow-400' : 'text-yellow-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tareas En Progreso -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ inProgressTasks.length }}</p>
              <p class="text-sm font-medium text-blue-500">En Progreso</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Actualmente trabajando</p>
            </div>
          </div>
        </div>

        <!-- Tareas Completadas -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ completedTasks.length }}</p>
              <p class="text-sm font-medium text-green-500">Completadas</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Finalizadas</p>
            </div>
          </div>
        </div>

        <!-- Tareas Vencidas -->
        <div 
          @click="filterByOverdue"
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all duration-200" 
          :class="overdueTasks.length > 0 
            ? (isDark ? 'bg-red-900/20 border-red-700 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100')
            : (isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50')
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" 
                 :class="overdueTasks.length > 0 
                   ? (isDark ? 'text-red-300' : 'text-red-700')
                   : (isDark ? 'text-white' : 'text-gray-900')
                 ">
                {{ overdueTasks.length }}
              </p>
              <p class="text-sm font-medium" 
                 :class="overdueTasks.length > 0 ? 'text-red-500' : 'text-orange-500'">
                Vencidas
              </p>
              <p class="text-xs" 
                 :class="overdueTasks.length > 0 
                   ? (isDark ? 'text-red-400' : 'text-red-600')
                   : (isDark ? 'text-gray-400' : 'text-gray-600')
                 ">
                Fecha límite pasada
              </p>
            </div>
            <!-- Icono de alerta cuando hay tareas vencidas -->
            <div v-if="overdueTasks.length > 0" class="ml-2">
              <svg class="w-6 h-6" :class="isDark ? 'text-red-400' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tareas de Alta Prioridad -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all duration-200" 
          :class="highPriorityTasks.length > 0 
            ? (isDark ? 'bg-purple-900/20 border-purple-700 hover:bg-purple-900/30' : 'bg-purple-50 border-purple-200 hover:bg-purple-100')
            : (isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50')
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" 
                 :class="highPriorityTasks.length > 0 
                   ? (isDark ? 'text-purple-300' : 'text-purple-700')
                   : (isDark ? 'text-white' : 'text-gray-900')
                 ">
                {{ highPriorityTasks.length }}
              </p>
              <p class="text-sm font-medium" 
                 :class="highPriorityTasks.length > 0 ? 'text-purple-500' : 'text-gray-500'">
                Alta Prioridad
              </p>
              <p class="text-xs" 
                 :class="highPriorityTasks.length > 0 
                   ? (isDark ? 'text-purple-400' : 'text-purple-600')
                   : (isDark ? 'text-gray-400' : 'text-gray-600')
                 ">
                Urgentes/Críticas
              </p>
            </div>
            <!-- Icono de prioridad cuando hay tareas de alta prioridad -->
            <div v-if="highPriorityTasks.length > 0" class="ml-2">
              <svg class="w-6 h-6" :class="isDark ? 'text-purple-400' : 'text-purple-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total de Tareas -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ tasks.length }}</p>
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Todas las tareas</p>
            </div>
          </div>
        </div>
      </div>
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

      <!-- User Filter -->
      <select
        v-model="showOnlyMyTasks"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
      >
        <option :value="true">Mis Tareas</option>
        <option :value="false">Todas las Tareas</option>
      </select>

      <!-- Status Filter -->
      <select
        v-model="statusFilter"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
      >
        <option value="">Todos los estados</option>
        <option value="0">Borrador</option>
        <option value="1">Validada</option>
        <option value="2">En curso</option>
        <option value="3">Terminada</option>
        <option value="4">Cancelada</option>
      </select>

      <!-- Priority Filter -->
      <select
        v-model="priorityFilter"
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'"
      >
        <option value="">Todas las prioridades</option>
        <option value="0">Baja</option>
        <option value="1">Media</option>
        <option value="2">Alta</option>
        <option value="3">Muy alta</option>
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
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-50'">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tarea</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Prioridad</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tercero</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Progreso</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Fechas</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Asignado</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Timer</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando tareas...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTasks.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm">No se encontraron tareas</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="task in paginatedTasks" :key="task.id" class="hover:bg-opacity-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
              <!-- Tarea (Ref + Título + Proyecto) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <button 
                    @click="viewTaskDetails(task)"
                    class="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors text-left"
                  >
                    {{ task.ref }}
                  </button>
                  <div class="text-sm max-w-xs truncate" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                    {{ task.label }}
                  </div>
                  <div v-if="task.project_name" class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    📁 {{ task.project_name }}
                  </div>
                </div>
              </td>

              <!-- Prioridad -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getPriorityClass(task.priority)">
                  {{ getPriorityText(task.priority) }}
                </span>
              </td>

              <!-- Tercero -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.tercero_name" class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :class="isDark ? 'bg-green-600' : 'bg-green-500'">
                    <span class="text-xs font-medium text-white">
                      {{ task.tercero_name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                      {{ task.tercero_name }}
                    </div>
                    <div class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      Cliente
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-400">Sin tercero</div>
              </td>

              <!-- Progreso -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2 mr-2" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                    <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${task.progress || 0}%`"></div>
                  </div>
                  <span class="text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-600'">{{ task.progress || 0 }}%</span>
                </div>
              </td>

              <!-- Fechas -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  <div v-if="task.date_start">Inicio: {{ formatDate(task.date_start) }}</div>
                  <div v-if="task.date_end" class="mt-1">Fin: {{ formatDate(task.date_end) }}</div>
                  <div v-if="!task.date_start && !task.date_end" class="text-gray-400">-</div>
                </div>
              </td>

              <!-- Asignado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-center">
                  <div v-if="task.assigned_to" class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                    <span class="text-xs font-medium text-white">
                      {{ task.assigned_to.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Timer -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-center">
                  <TimerButton 
                    :entity-id="task.id"
                    size="md"
                    variant="table"
                    :show-time="true"
                    :custom-is-running="(taskId) => taskTimers[taskId]?.isRunning || false"
                    :custom-format-time="(taskId) => formatTime(taskTimers[taskId]?.elapsed || 0)"
                    @started="handleTaskTimerStarted"
                    @stopped="handleTaskTimerStopped"
                  />
                </div>
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

    <!-- Task Detail Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeTaskModal"></div>

        <!-- Modal -->
        <div class="relative inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full border" :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'" @click.stop>
          <!-- Header -->
          <div class="px-6 py-4 border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-purple-600' : 'bg-purple-500'">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ taskDetails?.label || selectedTask?.label || 'Cargando...' }}</h3>
                  <div class="flex items-center space-x-2 mt-1">
                    <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tarea {{ selectedTask?.ref }}</p>
                    <span v-if="selectedTask?.project_name" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full" :class="isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800 border border-blue-200'">
                      📁 {{ selectedTask.project_name }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span v-if="taskDetails" class="inline-flex px-3 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(taskDetails.status)">
                  {{ taskDetails.status_text }}
                </span>
                <button @click="closeTaskModal" class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex h-[70vh]" :class="isDark ? 'bg-gray-900' : 'bg-white'">
            <div v-if="loadingTaskDetails" class="flex items-center justify-center w-full py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span class="ml-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Cargando detalles...</span>
            </div>

            <div v-else-if="taskDetails" class="flex w-full min-h-0">
              <!-- Left Panel - Main Content -->
              <div class="flex-1 p-6 overflow-y-auto min-w-0">
                <!-- Action Buttons -->
                <div class="flex items-center space-x-3 mb-6">
                  <!-- Botón Marcar completo -->
                  <button 
                    @click="markTaskAsComplete"
                    :disabled="completingTask || taskDetails?.progress >= 100"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors" 
                    :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">{{ completingTask ? 'Completando...' : 'Marcar completo' }}</span>
                  </button>
                  
                  <!-- Timer Button in Modal -->
                  <TimerButton 
                    v-if="selectedTask?.id"
                    :entity-id="selectedTask.id"
                    size="lg"
                    variant="modal"
                    :custom-is-running="(taskId) => taskTimers[taskId]?.isRunning || false"
                    :custom-format-time="(taskId) => formatTime(taskTimers[taskId]?.elapsed || 0)"
                    @started="handleTaskTimerStarted"
                    @stopped="handleTaskTimerStopped"
                  />
                  
                  <!-- Manual Timesheet Button -->
                  <button 
                    @click="openManualTimesheetModal"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors text-blue-500 hover:text-blue-400 bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span class="text-sm">Add Timesheet</span>
                  </button>
                </div>

                <!-- Description Section -->
                <div class="mb-8">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Descripción</h3>
                  </div>
                  <div class="prose max-w-none" :class="isDark ? 'prose-invert' : ''">
                    <div class="text-sm p-4 rounded-lg" :class="isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'">
                      {{ taskDetails.description }}
                    </div>
                  </div>
                </div>

                <!-- Progress Section -->
                <div class="mb-8">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Progreso</h3>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 bg-gray-200 rounded-full h-3" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                      <div class="bg-blue-500 h-3 rounded-full transition-all duration-300" :style="`width: ${taskDetails.progress || 0}%`"></div>
                    </div>
                    <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                      {{ taskDetails.progress || 0 }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right Panel - Task Info -->
              <div class="w-80 max-w-sm border-l p-6 overflow-y-auto" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
                <div class="space-y-6">
                  <!-- Task Info -->
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Información</h3>
                    </div>
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Estado:</label>
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(taskDetails.status)">
                          {{ taskDetails.status_text }}
                        </span>
                      </div>
                      
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prioridad:</label>
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getPriorityClass(taskDetails.priority)">
                          {{ taskDetails.priority_text }}
                        </span>
                      </div>
                      
                      <div v-if="taskDetails.created_date">
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Fecha de inicio:</label>
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ formatDate(taskDetails.created_date) }}</p>
                      </div>
                      
                      <div v-if="taskDetails.due_date">
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Fecha de vencimiento:</label>
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ formatDate(taskDetails.due_date) }}</p>
                      </div>
                      
                      <!-- Company/Tercero Section -->
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cliente:</label>
                        
                        <!-- Edit mode -->
                        <div v-if="editingTaskCompany" class="space-y-2">
                          <div class="relative">
                            <input
                              v-model="taskCompanySearchTerm"
                              @focus="showTaskCompanyDropdown = true"
                              @blur="setTimeout(() => showTaskCompanyDropdown = false, 200)"
                              type="text"
                              placeholder="Buscar empresa..."
                              class="w-full p-2 border rounded-lg text-sm"
                              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                            />
                            <svg class="absolute right-2 top-2 w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            
                            <!-- Company Dropdown -->
                            <div v-if="showTaskCompanyDropdown" class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                              <!-- Sin empresa option -->
                              <button
                                @click="selectTaskCompany('', 'Sin empresa')"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors border-b"
                                :class="isDark ? 'text-white hover:bg-gray-600 border-gray-600' : 'text-gray-900 hover:bg-gray-100 border-gray-200'"
                              >
                                Sin empresa
                              </button>
                              
                              <!-- Filtered companies -->
                              <button
                                v-for="company in filteredTaskCompanies"
                                :key="company.id"
                                @click="selectTaskCompany(company.id, company.name)"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors"
                                :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                              >
                                {{ company.name }}
                              </button>
                              
                              <!-- No results -->
                              <div v-if="filteredTaskCompanies.length === 0 && taskCompanySearchTerm" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                                No se encontraron empresas
                              </div>
                            </div>
                          </div>
                          <div class="flex space-x-2">
                            <button 
                              @click="saveTaskCompany"
                              class="px-3 py-1 text-xs rounded-lg transition-colors"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              Guardar
                            </button>
                            <button 
                              @click="cancelEditTaskCompany"
                              class="px-3 py-1 text-xs rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                        
                        <!-- Display mode -->
                        <div v-else class="flex items-center justify-between">
                          <div v-if="currentTaskCompany" class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-green-600' : 'bg-green-500'">
                              <span class="text-xs font-medium text-white">
                                {{ currentTaskCompany.name.charAt(0).toUpperCase() }}
                              </span>
                            </div>
                            <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ currentTaskCompany.name }}</p>
                          </div>
                          <div v-else>
                            <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Sin empresa asignada</p>
                          </div>
                          <button 
                            @click="startEditTaskCompany"
                            class="ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
                            title="Editar empresa"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Assigned User Section -->
                      <div>
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Asignado a:</label>
                        
                        <!-- Edit mode -->
                        <div v-if="editingTaskAssignment" class="space-y-2">
                          <div class="relative">
                            <input
                              v-model="taskAssignmentSearchTerm"
                              @focus="showTaskAssignmentDropdown = true"
                              @blur="setTimeout(() => showTaskAssignmentDropdown = false, 200)"
                              type="text"
                              placeholder="Buscar usuario..."
                              class="w-full p-2 border rounded-lg text-sm"
                              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                            />
                            <svg class="absolute right-2 top-2 w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            
                            <!-- Assignment Dropdown -->
                            <div v-if="showTaskAssignmentDropdown" class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                              <!-- Sin asignar option -->
                              <button
                                @click="selectTaskAssignedUser('', 'Sin asignar')"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors border-b"
                                :class="isDark ? 'text-white hover:bg-gray-600 border-gray-600' : 'text-gray-900 hover:bg-gray-100 border-gray-200'"
                              >
                                Sin asignar
                              </button>
                              
                              <!-- Filtered users -->
                              <button
                                v-for="user in filteredTaskAssignmentUsers"
                                :key="user.id"
                                @click="selectTaskAssignedUser(user.id, `${user.firstname} ${user.lastname}`)"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors"
                                :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                              >
                                {{ user.firstname }} {{ user.lastname }} ({{ user.login }})
                              </button>
                              
                              <!-- No results -->
                              <div v-if="filteredTaskAssignmentUsers.length === 0 && taskAssignmentSearchTerm" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                                No se encontraron usuarios
                              </div>
                            </div>
                          </div>
                          <div class="flex space-x-2">
                            <button 
                              @click="saveTaskAssignment"
                              class="px-3 py-1 text-xs rounded-lg transition-colors"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              Guardar
                            </button>
                            <button 
                              @click="cancelEditTaskAssignment"
                              class="px-3 py-1 text-xs rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                        
                        <!-- Display mode -->
                        <div v-else class="flex items-center justify-between">
                          <div v-if="currentTaskAssignedUser" class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                              <span class="text-xs font-medium text-white">
                                {{ currentTaskAssignedUser.firstname.charAt(0).toUpperCase() }}
                              </span>
                            </div>
                            <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                              {{ currentTaskAssignedUser.firstname }} {{ currentTaskAssignedUser.lastname }}
                            </p>
                          </div>
                          <div v-else>
                            <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Sin asignar</p>
                          </div>
                          <button 
                            @click="startEditTaskAssignment"
                            class="ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
                            title="Editar asignación"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div v-if="taskDetails.total_time > 0">
                        <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tiempo total:</label>
                        <p class="text-sm font-mono" :class="isDark ? 'text-green-400' : 'text-green-600'">{{ formatTime(taskDetails.total_time) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Private Notes -->
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Notas Privadas</h3>
                    </div>
                    
                    <div class="space-y-3">
                      <textarea
                        v-model="privateNote"
                        placeholder="Agregar nota privada..."
                        rows="3"
                        class="w-full p-3 border rounded-lg text-sm resize-none"
                        :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      ></textarea>
                      <button 
                        @click="savePrivateNote"
                        :disabled="!privateNote.trim()"
                        class="w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'"
                      >
                        Guardar Nota Privada
                      </button>
                    </div>
                  </div>

                  <!-- Public Notes -->
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Notas Públicas</h3>
                    </div>
                    
                    <div class="space-y-3">
                      <textarea
                        v-model="publicNote"
                        placeholder="Agregar nota pública..."
                        rows="3"
                        class="w-full p-3 border rounded-lg text-sm resize-none"
                        :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      ></textarea>
                      <button 
                        @click="savePublicNote"
                        :disabled="!publicNote.trim()"
                        class="w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isDark ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600' : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300'"
                      >
                        Guardar Nota Pública
                      </button>
                    </div>
                  </div>

                  <!-- File Upload -->
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Archivos</h3>
                    </div>
                    
                    <div class="space-y-3">
                      <!-- File Drop Zone -->
                      <div 
                        @drop="handleFileDrop"
                        @dragover.prevent
                        @dragenter.prevent
                        class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
                        :class="isDark ? 'border-gray-600 hover:border-gray-500 bg-gray-800' : 'border-gray-300 hover:border-gray-400 bg-gray-50'"
                        @click="$refs.fileInput?.click()"
                      >
                        <svg class="mx-auto h-8 w-8 mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-400'" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                          Arrastra archivos aquí o haz click para seleccionar
                        </p>
                        <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                          PNG, JPG, PDF hasta 10MB
                        </p>
                      </div>
                      
                      <!-- Hidden File Input -->
                      <input
                        ref="fileInput"
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        @change="handleFileSelect"
                        class="hidden"
                      />
                      
                      <!-- Uploaded Files List -->
                      <div v-if="uploadedFiles.length > 0" class="space-y-2">
                        <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          Archivos subidos ({{ uploadedFiles.length }})
                        </h4>
                        <div 
                          v-for="file in uploadedFiles" 
                          :key="file.id"
                          class="flex items-center justify-between p-2 rounded border"
                          :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                        >
                          <div class="flex items-center space-x-2 flex-1 min-w-0">
                            <svg class="w-4 h-4 flex-shrink-0" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span class="text-sm truncate" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                              {{ file.name }}
                            </span>
                          </div>
                          <button 
                            @click="removeFile(file.id)"
                            class="ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'"
                            title="Eliminar archivo"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Reminders -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Recordatorios</h3>
                      </div>
                      <button 
                        @click="showAddReminder = !showAddReminder"
                        class="p-1 rounded hover:bg-opacity-50 transition-colors"
                        :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
                        title="Agregar recordatorio"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Add Reminder Form -->
                    <div v-if="showAddReminder" class="space-y-3 mb-4 p-3 rounded-lg" :class="isDark ? 'bg-gray-800' : 'bg-gray-50'">
                      <div class="grid grid-cols-2 gap-2">
                        <input
                          v-model="newReminderDate"
                          type="date"
                          class="p-2 border rounded text-xs"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        />
                        <input
                          v-model="newReminderTime"
                          type="time"
                          class="p-2 border rounded text-xs"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        />
                      </div>
                      <input
                        v-model="newReminderNote"
                        type="text"
                        placeholder="Nota del recordatorio (opcional)"
                        class="w-full p-2 border rounded text-xs"
                        :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      />
                      <div class="flex space-x-2">
                        <button 
                          @click="addReminder"
                          :disabled="!newReminderDate || !newReminderTime"
                          class="px-3 py-1 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'"
                        >
                          Agregar
                        </button>
                        <button 
                          @click="showAddReminder = false"
                          class="px-3 py-1 text-xs rounded transition-colors"
                          :class="isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                    
                    <!-- Reminders List -->
                    <div v-if="taskReminders.length > 0" class="space-y-2">
                      <div 
                        v-for="reminder in taskReminders" 
                        :key="reminder.id"
                        class="flex items-center justify-between p-2 rounded border"
                        :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center space-x-2">
                            <svg class="w-3 h-3 flex-shrink-0" :class="isDark ? 'text-yellow-400' : 'text-yellow-500'" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span class="text-xs font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                              {{ reminder.date }} {{ reminder.time }}
                            </span>
                          </div>
                          <p v-if="reminder.note" class="text-xs mt-1 truncate" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                            {{ reminder.note }}
                          </p>
                        </div>
                        <button 
                          @click="removeReminder(reminder.id)"
                          class="ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                          :class="isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'"
                          title="Eliminar recordatorio"
                        >
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else class="text-xs text-center py-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      No hay recordatorios para esta tarea
                    </div>
                  </div>

                  <!-- Followers -->
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Seguidores</h3>
                    </div>
                    
                    <!-- Add Follower -->
                    <div v-if="availableContacts.length > 0" class="space-y-3 mb-4">
                      <div class="relative">
                        <input
                          v-model="followerSearchTerm"
                          @focus="showFollowerDropdown = true"
                          @blur="setTimeout(() => showFollowerDropdown = false, 200)"
                          type="text"
                          placeholder="Buscar contacto para agregar..."
                          class="w-full p-2 border rounded-lg text-sm"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                        />
                        <svg class="absolute right-2 top-2 w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <!-- Follower Dropdown -->
                        <div v-if="showFollowerDropdown && followerSearchTerm" class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                          <button
                            v-for="contact in filteredFollowerContacts"
                            :key="contact.id"
                            @click="addFollower(contact)"
                            class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                          >
                            <div class="flex items-center space-x-2">
                              <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-purple-600' : 'bg-purple-500'">
                                <span class="text-xs font-medium text-white">
                                  {{ contact.firstname.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                              <div>
                                <div class="font-medium">{{ contact.firstname }} {{ contact.lastname }}</div>
                                <div class="text-xs opacity-75">{{ contact.email }}</div>
                              </div>
                            </div>
                          </button>
                          
                          <!-- No results -->
                          <div v-if="filteredFollowerContacts.length === 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            No se encontraron contactos
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Followers List -->
                    <div v-if="taskFollowers.length > 0" class="space-y-2">
                      <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                        Contactos siguiendo ({{ taskFollowers.length }})
                      </h4>
                      <div 
                        v-for="follower in taskFollowers" 
                        :key="follower.id"
                        class="flex items-center justify-between p-2 rounded border"
                        :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                      >
                        <div class="flex items-center space-x-2 flex-1 min-w-0">
                          <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-purple-600' : 'bg-purple-500'">
                            <span class="text-xs font-medium text-white">
                              {{ follower.firstname.charAt(0).toUpperCase() }}
                            </span>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                              {{ follower.firstname }} {{ follower.lastname }}
                            </p>
                            <p class="text-xs truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                              {{ follower.email }}
                            </p>
                          </div>
                        </div>
                        <button 
                          @click="removeFollower(follower.id)"
                          class="ml-2 p-1 rounded hover:bg-opacity-50 transition-colors"
                          :class="isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-100'"
                          title="Eliminar seguidor"
                        >
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else class="text-xs text-center py-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      {{ availableContacts.length > 0 ? 'No hay seguidores para esta tarea' : 'Selecciona una empresa para ver contactos disponibles' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para guardar tiempo registrado -->
  <div v-if="showTimeEntryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        Guardar Tiempo Registrado
      </h3>
      
      <div class="mb-4">
        <p class="text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          Tiempo registrado: <span class="font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ formatDuration(recordedTime) }}</span>
        </p>
        <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          ({{ recordedTime }} segundos)
        </p>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          Nota (opcional)
        </label>
        <textarea
          v-model="timeEntryNote"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          rows="3"
          placeholder="Descripción del tiempo trabajado..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="cancelTimeEntry"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Cancelar
        </button>
        <button
          @click="saveTimeEntry"
          :disabled="isSavingTimeEntry"
          class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center"
          :class="isSavingTimeEntry ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
        >
          <svg v-if="isSavingTimeEntry" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSavingTimeEntry ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import http from '../utils/http'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useAuthStore } from '../stores/auth'
import TimerButton from '@/components/TimerButton.vue'

const { isDark } = useTheme()
const { currentUser } = useAuth()
const authStore = useAuthStore()

// Reactive data
const tasks = ref([])
const projects = ref([])
const users = ref([])
const terceros = ref([])
const loading = ref(false)

// User filter - show only user's tasks by default
const showOnlyMyTasks = ref(true)

// Special filters
const filterOnlyOverdue = ref(false)

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

// Timer functionality
const taskTimers = ref({})
const timerIntervals = ref({})

// Task detail modal
const showTaskModal = ref(false)
const selectedTask = ref(null)
const taskDetails = ref(null)
const loadingTaskDetails = ref(false)
const completingTask = ref(false)

// Timer time entry modal
const showTimeEntryModal = ref(false)
const timeEntryNote = ref('')
const recordedTime = ref(0)
const isSavingTimeEntry = ref(false)

// Notes and files
const privateNote = ref('')
const publicNote = ref('')
const uploadedFiles = ref([])
const fileInput = ref(null)

// Task editing functionality
const editingTaskCompany = ref(false)
const selectedTaskCompanyId = ref('')
const taskCompanySearchTerm = ref('')
const showTaskCompanyDropdown = ref(false)
const currentTaskCompany = ref(null)

const editingTaskAssignment = ref(false)
const selectedTaskAssignedUserId = ref('')
const taskAssignmentSearchTerm = ref('')
const showTaskAssignmentDropdown = ref(false)
const currentTaskAssignedUser = ref(null)

// Reminders and followers
const taskReminders = ref([])
const newReminderDate = ref('')
const newReminderTime = ref('')
const newReminderNote = ref('')
const showAddReminder = ref(false)

const taskFollowers = ref([])
const followerSearchTerm = ref('')
const showFollowerDropdown = ref(false)
const availableContacts = ref([])

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

const filteredTaskCompanies = computed(() => {
  if (!taskCompanySearchTerm.value) return terceros.value.slice(0, 10)
  return terceros.value.filter(company => 
    company.name.toLowerCase().includes(taskCompanySearchTerm.value.toLowerCase())
  ).slice(0, 10)
})

const filteredTaskAssignmentUsers = computed(() => {
  if (!taskAssignmentSearchTerm.value) return users.value.slice(0, 10)
  return users.value.filter(user => 
    `${user.firstname} ${user.lastname} ${user.login}`.toLowerCase().includes(taskAssignmentSearchTerm.value.toLowerCase())
  ).slice(0, 10)
})

const filteredFollowerContacts = computed(() => {
  if (!followerSearchTerm.value) return availableContacts.value.slice(0, 10)
  return availableContacts.value.filter(contact => 
    `${contact.firstname} ${contact.lastname} ${contact.email}`.toLowerCase().includes(followerSearchTerm.value.toLowerCase())
  ).slice(0, 10)
})

const filteredTasks = computed(() => {
  let filtered = tasks.value

  // Filter by overdue status if active
  if (filterOnlyOverdue.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    filtered = filtered.filter(task => {
      if (!task.date_end) return false
      
      // Convertir timestamp Unix a Date
      let endDate
      if (typeof task.date_end === 'number' || !isNaN(task.date_end)) {
        const timestamp = parseInt(task.date_end)
        const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp
        endDate = new Date(milliseconds)
      } else {
        endDate = new Date(task.date_end)
      }
      endDate.setHours(0, 0, 0, 0)
      
      const status = parseInt(task.fk_statut || task.status)
      return endDate < today && status !== 3 && status !== 4
    })
  }

  // Filter by user assignment - show only tasks assigned to current user
  if (showOnlyMyTasks.value && authStore.user) {
    filtered = filtered.filter(task => 
      task.fk_user_assign == authStore.user.id || task.isUserAssigned
    )
  }

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
  if (statusFilter.value !== '') {
    filtered = filtered.filter(task => {
      const taskStatus = parseInt(task.fk_statut || task.status)
      return taskStatus === parseInt(statusFilter.value)
    })
  }

  // Filter by priority
  if (priorityFilter.value !== '') {
    filtered = filtered.filter(task => parseInt(task.priority) === parseInt(priorityFilter.value))
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

// Métricas de tareas - SIEMPRE sobre el total de tareas (no filtradas por usuario)
const pendingTasks = computed(() => {
  return tasks.value.filter(task => {
    const status = parseInt(task.fk_statut || task.status)
    // 0 = Borrador, 1 = Validada (ambas son "pendientes" de iniciar)
    return status === 0 || status === 1
  })
})

const inProgressTasks = computed(() => {
  return tasks.value.filter(task => {
    const status = parseInt(task.fk_statut || task.status)
    // 2 = En curso
    return status === 2
  })
})

const completedTasks = computed(() => {
  return tasks.value.filter(task => {
    const status = parseInt(task.fk_statut || task.status)
    // 3 = Terminada
    return status === 3
  })
})

const overdueTasks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return tasks.value.filter(task => {
    if (!task.date_end) return false // Sin fecha de fin
    
    // Convertir timestamp Unix a Date
    let endDate
    if (typeof task.date_end === 'number' || !isNaN(task.date_end)) {
      const timestamp = parseInt(task.date_end)
      const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp
      endDate = new Date(milliseconds)
    } else {
      endDate = new Date(task.date_end)
    }
    endDate.setHours(0, 0, 0, 0)
    
    // Vencida si la fecha de fin es anterior a hoy y no está terminada
    const status = parseInt(task.fk_statut || task.status)
    return endDate < today && status !== 3 && status !== 4
  })
})

const highPriorityTasks = computed(() => {
  return tasks.value.filter(task => {
    const priority = parseInt(task.priority)
    // Prioridades 2 (Alta) y 3 (Muy alta) se consideran de alta prioridad
    return priority === 2 || priority === 3
  })
})

// Methods
const loadTasks = async () => {
  loading.value = true
  try {
    console.log('⚡ PASO 1: Cargando tareas primero...')
    
    // PASO 1: Cargar solo tareas (lo más importante)
    const tasksResponse = await http.get('/api/doli/tasks?limit=500&sqlfilters=(t.progress:<:100)or(t.progress:is:null)')
    
    if (!tasksResponse.data || !Array.isArray(tasksResponse.data)) {
      tasks.value = []
      loading.value = false
      return
    }
    
    console.log('✅ Tareas cargadas:', tasksResponse.data.length)
    
    // Debug: Ver los campos de fecha disponibles en la primera tarea
    if (tasksResponse.data.length > 0) {
      const firstTask = tasksResponse.data[0]
      console.log('📅 Campos de fecha en tarea:', {
        dateo: firstTask.dateo,
        datec: firstTask.datec,
        date_start: firstTask.date_start,
        date_creation: firstTask.date_creation,
        datee: firstTask.datee,
        date_end: firstTask.date_end,
        date_valid: firstTask.date_valid
      })
      console.log('🔍 Tipos de campos:', {
        datec_type: typeof firstTask.datec,
        datec_value: firstTask.datec,
        datee_type: typeof firstTask.datee,
        datee_value: firstTask.datee
      })
    }
    
    // PASO 2: Procesar tareas básicas SIN ENRIQUECIMIENTO para mostrar rápido
    const basicTasks = tasksResponse.data.map(task => ({
      ...task,
      status: task.fk_statut || 0, // Usar el estado real de Dolibarr
      assigned_to: null, // Se enriquecerá después
      project_name: null, // Se enriquecerá después
      tercero_name: null, // Se enriquecerá después
      priority: task.priority || 1,
      isUserAssigned: false
    }))
    
    // PASO 3: Mostrar datos básicos inmediatamente
    tasks.value = basicTasks
    loading.value = false
    console.log('⚡ Datos básicos mostrados, cargando enriquecimiento...')
    
    // PASO 4: Cargar datos adicionales para enriquecimiento en background
    try {
      const [projectsResponse, usersResponse, tercerosResponse] = await Promise.all([
        http.get('/api/doli/projects?limit=1000').catch(() => ({ data: [] })),
        http.get('/api/doli/users').catch(() => ({ data: [] })),
        http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] }))
      ])
      
      console.log('✅ Datos adicionales cargados:', {
        projects: projectsResponse.data?.length || 0,
        users: usersResponse.data?.length || 0,
        terceros: tercerosResponse.data?.length || 0
      })
      
      // Debug: Mostrar algunos usuarios para verificar que Joel Huamán esté
      if (usersResponse.data?.length > 0) {
        console.log('👥 Primeros 5 usuarios cargados:', usersResponse.data.slice(0, 5).map(u => ({
          id: u.id,
          firstname: u.firstname,
          lastname: u.lastname,
          login: u.login
        })))
        
        // Buscar específicamente a Joel Huamán
        const joelUser = usersResponse.data.find(u => 
          (u.firstname && u.firstname.toLowerCase().includes('joel')) ||
          (u.lastname && u.lastname.toLowerCase().includes('huaman')) ||
          (u.login && u.login.toLowerCase().includes('joel'))
        )
        if (joelUser) {
          console.log('✅ Joel Huamán encontrado:', {
            id: joelUser.id,
            rowid: joelUser.rowid,
            firstname: joelUser.firstname,
            lastname: joelUser.lastname,
            login: joelUser.login
          })
        } else {
          console.log('❌ Joel Huamán NO encontrado en la lista de usuarios')
        }
      }

      // PASO 5: Store reference data
      projects.value = projectsResponse.data || []
      users.value = usersResponse.data || []
      terceros.value = tercerosResponse.data || []

      // Crear mapas de búsqueda con múltiples tipos de claves
      const projectsMap = {}
      const usersMap = {}
      const tercerosMap = {}

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

      console.log('📊 Mapas creados - Projects:', Object.keys(projectsMap).length, 'Users:', Object.keys(usersMap).length, 'Terceros:', Object.keys(tercerosMap).length)

      // PASO 6: Enriquecer las tareas ya mostradas
      const enrichedTasks = await Promise.all(tasks.value.map(async (task, index) => {
        // Try multiple possible project ID fields
        let project = null
        const projectIds = [task.fk_project, task.fk_projet, task.project_id, task.projectid]
        
        for (const projectId of projectIds) {
          if (projectId && projectsMap[projectId]) {
            project = projectsMap[projectId]
            break
          }
        }

        // Check if current user has a role in this task
        let assignedUser = null
        let isUserAssigned = false
        
        if (task.id && currentUser.value?.id) {
          try {
            const roleResponse = await http.get(`/api/doli/tasks/${task.id}/roles?userid=${currentUser.value.id}`)
            if (roleResponse.data && roleResponse.data.length > 0) {
              isUserAssigned = true
              assignedUser = currentUser.value
            }
          } catch (error) {
            // No role found, continue with fallback
          }
        }

        // Fallback: Try multiple possible user ID fields if no role found
        if (!assignedUser) {
          const userIds = [task.fk_user_assign, task.fk_user, task.user_id, task.userid]
          
          // Debug para primera tarea con asignación
          if (index === 0 && task.fk_user_assign) {
            console.log('🔍 DEBUG Tarea con asignación:', {
              taskId: task.id,
              taskRef: task.ref,
              fk_user_assign: task.fk_user_assign,
              fk_user_assign_type: typeof task.fk_user_assign,
              userIds: userIds,
              usersMapKeys: Object.keys(usersMap).slice(0, 10),
              foundInMap: usersMap[task.fk_user_assign],
              usersAvailable: users.value.length
            })
          }
          
          for (const userId of userIds) {
            if (userId && usersMap[userId]) {
              assignedUser = usersMap[userId]
              if (index === 0) {
                console.log('✅ Usuario encontrado:', {
                  userId: userId,
                  user: assignedUser
                })
              }
              break
            }
          }
          
          if (!assignedUser && task.fk_user_assign && index === 0) {
            console.log('❌ No se encontró usuario con ID:', task.fk_user_assign, 'en mapa de', Object.keys(usersMap).length, 'usuarios')
          }
        }

        // Try to get tercero from project or task directly
        let tercero = null
        
        if (project) {
          const terceroIds = [project.fk_soc, project.fk_societe, project.socid, project.client_id, project.fk_thirdparty]
          for (const terceroId of terceroIds) {
            if (terceroId && tercerosMap[terceroId]) {
              tercero = tercerosMap[terceroId]
              break
            }
          }
        }
        
        // If no tercero from project, try task direct fields
        if (!tercero) {
          const taskTerceroIds = [task.fk_soc, task.fk_societe, task.socid, task.client_id, task.fk_thirdparty]
          for (const terceroId of taskTerceroIds) {
            if (terceroId && tercerosMap[terceroId]) {
              tercero = tercerosMap[terceroId]
              break
            }
          }
        }
        
        return {
          ...task,
          status: task.fk_statut || 0, // Usar el estado real de Dolibarr
          assigned_to: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}`.trim() : null,
          project_name: project ? (project.title || project.ref) : null,
          tercero_name: tercero ? tercero.name : null,
          priority: task.priority || 1,
          isUserAssigned: isUserAssigned
        }
      }))

      tasks.value = enrichedTasks
      console.log('✅ Datos enriquecidos')
    } catch (err) {
      console.error('❌ Error al enriquecer tareas:', err)
      // Mantener las tareas básicas aunque falle el enriquecimiento
    }
  } catch (error) {
    console.error('❌ Error al cargar tareas:', error)
    tasks.value = []
  } finally {
    // loading ya se puso en false en el paso 3
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

const filterByOverdue = () => {
  // Limpiar otros filtros
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  selectedProject.value = null
  selectedUser.value = null
  
  // Activar filtro de vencidas y mostrar todas las tareas (no solo las del usuario)
  filterOnlyOverdue.value = true
  showOnlyMyTasks.value = false
  
  currentPage.value = 1
  
  console.log('🔴 Filtrando por tareas vencidas de todos los usuarios')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  projectSearchQuery.value = ''
  userSearchQuery.value = ''
  selectedProject.value = null
  selectedUser.value = null
  filterOnlyOverdue.value = false
  // Keep showOnlyMyTasks as true by default
  showOnlyMyTasks.value = true
  currentPage.value = 1
}

const viewTaskDetails = async (task) => {
  selectedTask.value = task
  taskDetails.value = null
  showTaskModal.value = true
  loadingTaskDetails.value = true
  
  try {
    // Simulate loading task details (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For now, use the task data we already have
    taskDetails.value = {
      ...task,
      description: task.note || 'Sin descripción disponible',
      created_by: task.assigned_to || 'Sistema',
      created_date: task.date_start || task.date_creation || new Date().toISOString(),
      due_date: task.date_end,
      priority_text: getPriorityText(task.priority),
      status_text: getStatusText(task.status),
      total_time: taskTimers.value[task.id]?.elapsed || 0
    }
    
    // Initialize current company and user
    if (task.tercero_name) {
      currentTaskCompany.value = terceros.value.find(t => t.name === task.tercero_name) || { name: task.tercero_name }
      if (currentTaskCompany.value?.id) {
        loadContactsForCompany(currentTaskCompany.value.id)
      }
    }
    
    if (task.assigned_to) {
      currentTaskAssignedUser.value = users.value.find(u => 
        `${u.firstname} ${u.lastname}` === task.assigned_to
      ) || { firstname: task.assigned_to.split(' ')[0], lastname: task.assigned_to.split(' ').slice(1).join(' ') }
    }
  } catch (error) {
    console.error('Error loading task details:', error)
  } finally {
    loadingTaskDetails.value = false
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
  taskDetails.value = null
  completingTask.value = false
  // Clear notes and files
  privateNote.value = ''
  publicNote.value = ''
  uploadedFiles.value = []
  // Clear editing states
  editingTaskCompany.value = false
  editingTaskAssignment.value = false
  selectedTaskCompanyId.value = ''
  selectedTaskAssignedUserId.value = ''
  taskCompanySearchTerm.value = ''
  taskAssignmentSearchTerm.value = ''
  showTaskCompanyDropdown.value = false
  showTaskAssignmentDropdown.value = false
  currentTaskCompany.value = null
  currentTaskAssignedUser.value = null
  // Clear reminders and followers
  taskReminders.value = []
  taskFollowers.value = []
  newReminderDate.value = ''
  newReminderTime.value = ''
  newReminderNote.value = ''
  showAddReminder.value = false
  followerSearchTerm.value = ''
  showFollowerDropdown.value = false
  availableContacts.value = []
}

// Marcar tarea como completa
const markTaskAsComplete = async () => {
  if (!taskDetails.value?.id) return
  
  completingTask.value = true
  try {
    console.log('🎯 Marcando tarea como completa:', taskDetails.value.id)
    
    // Actualizar progreso a 100%
    const updateData = {
      progress: 100
    }
    
    const response = await http.put(`/api/doli/task/${taskDetails.value.id}`, updateData)
    console.log('✅ Tarea completada:', response.data)
    
    // Actualizar el taskDetails localmente
    taskDetails.value.progress = 100
    
    // Recargar la lista de tareas
    await loadTasks()
    
    alert('Tarea marcada como completa')
  } catch (error) {
    console.error('❌ Error al completar tarea:', error)
    alert('Error al marcar la tarea como completa')
  } finally {
    completingTask.value = false
  }
}

// Abrir modal de timesheet manual
const openManualTimesheetModal = () => {
  console.log('📋 Abriendo modal de timesheet manual para tarea:', taskDetails.value?.id)
  // TODO: Implementar modal de timesheet manual
  alert('Función de Add Timesheet manual próximamente disponible')
}

// Notes functions
const savePrivateNote = async () => {
  if (!privateNote.value.trim()) return
  
  try {
    console.log('Saving private note:', privateNote.value)
    console.log('Task ID:', taskDetails.value.id)
    console.log('Full URL:', `/api/doli/task/${taskDetails.value.id}`)
    
    // Prepare data for API
    const updateData = {
      note_private: privateNote.value.trim()
    }
    
    console.log('Update data:', updateData)
    
    // API call to update task using http.put like in tickets
    const response = await http.put(`/api/doli/task/${taskDetails.value.id}`, updateData)
    console.log('✅ Private note update response:', response.data)
    
    // Update local data
    taskDetails.value.note_private = privateNote.value.trim()
    
    // Clear the note after saving
    privateNote.value = ''
    
    console.log('Private note saved successfully')
  } catch (error) {
    console.error('Error saving private note:', error)
    alert('Error al guardar la nota privada')
  }
}

const savePublicNote = async () => {
  if (!publicNote.value.trim()) return
  
  try {
    console.log('💾 Saving public note for task:', selectedTask.value.id, publicNote.value)
    
    // Prepare data for API
    const updateData = {
      note_public: publicNote.value.trim()
    }
    
    // API call to update task using http.put like in tickets
    const response = await http.put(`/api/doli/task/${taskDetails.value.id}`, updateData)
    console.log('✅ Public note update response:', response.data)
    
    // Update local data
    taskDetails.value.note_public = publicNote.value.trim()
    
    // Clear the note after saving
    publicNote.value = ''
    
    console.log('✅ Public note saved successfully')
  } catch (error) {
    console.error('❌ Error saving public note:', error)
    alert('Error al guardar la nota pública')
  }
}

// File functions
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleFileDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.warn('⚠️ File too large:', file.name)
      return
    }
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      console.warn('⚠️ File type not allowed:', file.name)
      return
    }
    
    // Add file to list
    const fileObj = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }
    
    uploadedFiles.value.push(fileObj)
    console.log('📎 File added:', file.name)
  })
  
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (fileId) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
  console.log('🗑️ File removed')
}

// Task company editing functions
const startEditTaskCompany = () => {
  editingTaskCompany.value = true
  selectedTaskCompanyId.value = taskDetails.value?.fk_soc || ''
  taskCompanySearchTerm.value = currentTaskCompany.value?.name || ''
}

const cancelEditTaskCompany = () => {
  editingTaskCompany.value = false
  selectedTaskCompanyId.value = ''
  taskCompanySearchTerm.value = ''
  showTaskCompanyDropdown.value = false
}

const selectTaskCompany = (companyId, companyName) => {
  selectedTaskCompanyId.value = companyId
  taskCompanySearchTerm.value = companyName
  showTaskCompanyDropdown.value = false
}

const saveTaskCompany = async () => {
  try {
    console.log('Saving task company:', selectedTaskCompanyId.value)
    
    const selectedCompany = terceros.value.find(t => t.id === selectedTaskCompanyId.value)
    
    // Prepare data for API
    const updateData = {
      socid: selectedTaskCompanyId.value || null,
      thirdparty_id: selectedTaskCompanyId.value || null,
      thirdparty_name: selectedCompany?.name || null
    }
    
    // API call to update task using http.put like in tickets
    const response = await http.put(`/api/doli/task/${taskDetails.value.id}`, updateData)
    console.log('✅ Company update response:', response.data)
    
    // Update local data
    if (selectedCompany) {
      taskDetails.value.tercero_name = selectedCompany.name
      taskDetails.value.socid = selectedCompany.id
      taskDetails.value.thirdparty_id = selectedCompany.id
      taskDetails.value.thirdparty_name = selectedCompany.name
      currentTaskCompany.value = selectedCompany
      
      // Load contacts for the new company
      loadContactsForCompany(selectedCompany.id)
    } else {
      taskDetails.value.tercero_name = null
      taskDetails.value.socid = null
      taskDetails.value.thirdparty_id = null
      taskDetails.value.thirdparty_name = null
      currentTaskCompany.value = null
    }
    
    editingTaskCompany.value = false
    selectedTaskCompanyId.value = ''
    taskCompanySearchTerm.value = ''
    showTaskCompanyDropdown.value = false
    
    console.log('Task company updated successfully')
  } catch (error) {
    console.error('Error saving task company:', error)
    alert('Error al actualizar la empresa de la tarea')
  }
}

const startEditTaskAssignment = () => {
  editingTaskAssignment.value = true
  selectedTaskAssignedUserId.value = taskDetails.value?.fk_user_assign || ''
  taskAssignmentSearchTerm.value = currentTaskAssignedUser.value ? 
    `${currentTaskAssignedUser.value.firstname} ${currentTaskAssignedUser.value.lastname}` : ''
}

const cancelEditTaskAssignment = () => {
  editingTaskAssignment.value = false
  selectedTaskAssignedUserId.value = ''
  taskAssignmentSearchTerm.value = ''
  showTaskAssignmentDropdown.value = false
}

const selectTaskAssignedUser = (userId, displayText) => {
  selectedTaskAssignedUserId.value = userId
  taskAssignmentSearchTerm.value = displayText
  showTaskAssignmentDropdown.value = false
}

const saveTaskAssignment = async () => {
  try {
    console.log('💾 Saving task assignment:', {
      taskId: selectedTask.value.id,
      userId: selectedTaskAssignedUserId.value
    })
    
    const selectedUser = selectedTaskAssignedUserId.value ? 
      users.value.find(u => u.id == selectedTaskAssignedUserId.value) : null
    
    // Prepare data for API
    const updateData = {
      fk_user_assign: selectedTaskAssignedUserId.value || null
    }
    
    // API call to update task using http.put like in tickets
    const response = await http.put(`/api/doli/task/${taskDetails.value.id}`, updateData)
    console.log('✅ Assignment update response:', response.data)
    
    // Update local data
    if (selectedUser) {
      currentTaskAssignedUser.value = selectedUser
      taskDetails.value.assigned_to = `${selectedUser.firstname} ${selectedUser.lastname}`
      taskDetails.value.fk_user_assign = selectedUser.id
    } else {
      currentTaskAssignedUser.value = null
      taskDetails.value.assigned_to = null
      taskDetails.value.fk_user_assign = null
    }
    
    cancelEditTaskAssignment()
    console.log('✅ Task assignment updated successfully')
  } catch (error) {
    console.error('❌ Error updating task assignment:', error)
    alert('Error al actualizar el usuario asignado')
  }
}

// Load contacts for company
const loadContactsForCompany = async (companyId) => {
  try {
    console.log('📞 Loading contacts for company:', companyId)
    
    // Simulate API call to load contacts
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock contacts data
    availableContacts.value = [
      { id: 1, firstname: 'Juan', lastname: 'Pérez', email: 'juan@empresa.com', fk_soc: companyId },
      { id: 2, firstname: 'María', lastname: 'García', email: 'maria@empresa.com', fk_soc: companyId },
      { id: 3, firstname: 'Carlos', lastname: 'López', email: 'carlos@empresa.com', fk_soc: companyId }
    ]
    
    console.log('✅ Contacts loaded:', availableContacts.value.length)
  } catch (error) {
    console.error('❌ Error loading contacts:', error)
  }
}

// Reminder functions
const addReminder = () => {
  if (!newReminderDate.value || !newReminderTime.value) return
  
  const reminder = {
    id: Date.now(),
    date: newReminderDate.value,
    time: newReminderTime.value,
    note: newReminderNote.value || 'Recordatorio de tarea',
    created_at: new Date().toISOString()
  }
  
  taskReminders.value.push(reminder)
  
  // Clear form
  newReminderDate.value = ''
  newReminderTime.value = ''
  newReminderNote.value = ''
  showAddReminder.value = false
  
  console.log('⏰ Reminder added:', reminder)
}

const removeReminder = (reminderId) => {
  taskReminders.value = taskReminders.value.filter(r => r.id !== reminderId)
  console.log('🗑️ Reminder removed')
}

// Follower functions
const addFollower = (contact) => {
  if (taskFollowers.value.find(f => f.id === contact.id)) return
  
  taskFollowers.value.push(contact)
  followerSearchTerm.value = ''
  showFollowerDropdown.value = false
  
  console.log('👥 Follower added:', contact)
}

const removeFollower = (contactId) => {
  taskFollowers.value = taskFollowers.value.filter(f => f.id !== contactId)
  console.log('🗑️ Follower removed')
}

// Timer functions (legacy - mantener para compatibilidad con modal)
const toggleTimer = (taskId) => {
  if (!taskTimers.value[taskId]) {
    taskTimers.value[taskId] = {
      isRunning: false,
      elapsed: 0,
      startTime: null
    }
  }

  const timer = taskTimers.value[taskId]
  
  if (timer.isRunning) {
    // Pause timer
    timer.isRunning = false
    if (timerIntervals.value[taskId]) {
      clearInterval(timerIntervals.value[taskId])
      delete timerIntervals.value[taskId]
    }
  } else {
    // Start timer
    timer.isRunning = true
    timer.startTime = Date.now() - timer.elapsed
    
    timerIntervals.value[taskId] = setInterval(() => {
      timer.elapsed = Date.now() - timer.startTime
    }, 1000)
  }
}

// New timer handlers for TimerButton component
const handleTaskTimerStarted = ({ entityId }) => {
  // Use the existing toggleTimer logic to start
  if (!taskTimers.value[entityId]) {
    taskTimers.value[entityId] = {
      isRunning: false,
      elapsed: 0,
      startTime: null
    }
  }
  
  const timer = taskTimers.value[entityId]
  if (!timer.isRunning) {
    timer.isRunning = true
    timer.startTime = Date.now() - timer.elapsed
    
    timerIntervals.value[entityId] = setInterval(() => {
      timer.elapsed = Date.now() - timer.startTime
    }, 1000)
  }
  
  console.log(`▶️ Timer started for task ${entityId}`)
}

const handleTaskTimerStopped = ({ entityId, elapsedSeconds }) => {
  // Find the task by ID
  const task = filteredTasks.value.find(t => t.id == entityId)
  if (!task) return
  
  // Obtener el tiempo transcurrido del timer local
  const timer = taskTimers.value[entityId]
  let timeInSeconds = elapsedSeconds
  
  // Si no viene elapsedSeconds (cuando usa custom functions), calcularlo del timer
  if (!timeInSeconds && timer && timer.elapsed) {
    timeInSeconds = Math.floor(timer.elapsed / 1000)
  }
  
  console.log('⏱️ Timer stopped for task', entityId)
  console.log('   elapsedSeconds param:', elapsedSeconds)
  console.log('   timer.elapsed:', timer?.elapsed)
  console.log('   calculated seconds:', timeInSeconds)
  
  // Detener el timer localmente
  if (timer && timer.isRunning) {
    timer.isRunning = false
    if (timerIntervals.value[entityId]) {
      clearInterval(timerIntervals.value[entityId])
      delete timerIntervals.value[entityId]
    }
  }
  
  // Set up the time entry modal
  recordedTime.value = timeInSeconds
  selectedTask.value = task
  showTimeEntryModal.value = true
}

const saveTimeEntry = async () => {
  if (isSavingTimeEntry.value) return // Prevenir doble click
  
  isSavingTimeEntry.value = true
  
  try {
    console.log('🚀 GUARDANDO TIEMPO EN TAREA')
    console.log('='.repeat(60))
    
    const taskId = selectedTask.value?.id || taskDetails.value?.id
    if (!taskId) {
      throw new Error('No se encontró ID de tarea')
    }
    
    // Validar que hay tiempo registrado
    if (!recordedTime.value || recordedTime.value <= 0) {
      throw new Error('No hay tiempo registrado para guardar')
    }
    
    // Si el tiempo es menor a 1 minuto, redondear a 1 minuto
    let durationInSeconds = parseInt(recordedTime.value)
    if (durationInSeconds < 60) {
      console.log(`⏱️ Tiempo menor a 1 minuto (${durationInSeconds}s), redondeando a 60s`)
      durationInSeconds = 60
    }
    
    // Preparar datos para el endpoint /tasks/{id}/addtimespent
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 19).replace('T', ' ') // Formato: "YYYY-MM-DD HH:MI:SS"
    
    const timeSpentData = {
      date: dateStr,
      duration: durationInSeconds, // Asegurar que sea número entero (mínimo 60s)
      user_id: parseInt(authStore.user?.id) || 0, // 0 para usuario conectado
      note: timeEntryNote.value || 'Tiempo registrado desde cronómetro'
    }
    
    console.log('📋 Datos de tiempo:', timeSpentData)
    console.log('🕐 Fecha:', dateStr)
    console.log('⏱️ Duración:', recordedTime.value, 'segundos (tipo:', typeof recordedTime.value, ')')
    console.log('👤 Usuario:', authStore.user?.id)
    console.log('📝 Nota:', timeSpentData.note)
    console.log('📦 Payload completo:', JSON.stringify(timeSpentData, null, 2))
    
    // Llamar al endpoint POST /tasks/{id}/addtimespent
    const response = await http.post(`/api/doli/tasks/${taskId}/addtimespent`, timeSpentData)
    
    console.log('✅ TIEMPO GUARDADO EXITOSAMENTE')
    console.log('📊 Respuesta:', response.data)
    console.log('='.repeat(60))
    
    // Reset modal state
    showTimeEntryModal.value = false
    timeEntryNote.value = ''
    recordedTime.value = 0
    
    // Refresh tasks
    await loadTasks()
    
    alert('✅ Tiempo guardado exitosamente')
  } catch (error) {
    console.error('❌ ERROR AL GUARDAR TIEMPO:', error)
    console.error('Detalles:', error.response?.data)
    
    alert('Error al guardar el tiempo: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTimeEntry.value = false
  }
}

const cancelTimeEntry = () => {
  showTimeEntryModal.value = false
  timeEntryNote.value = ''
  recordedTime.value = 0
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

// Utility functions
const formatDate = (date) => {
  if (!date) return '-'
  
  // Si es un timestamp Unix (número), convertir a milisegundos
  if (typeof date === 'number' || !isNaN(date)) {
    const timestamp = parseInt(date)
    // Si es menor a 10000000000, es timestamp en segundos, convertir a milisegundos
    const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp
    return new Date(milliseconds).toLocaleDateString('es-ES')
  }
  
  // Si es string o Date, usar directamente
  return new Date(date).toLocaleDateString('es-ES')
}

const getStatusClass = (status) => {
  const statusNum = parseInt(status)
  switch (statusNum) {
    case 0: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' // Borrador
    case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' // Validada
    case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' // En curso
    case 3: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' // Terminada
    case 4: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' // Cancelada
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusText = (status) => {
  const statusNum = parseInt(status)
  switch (statusNum) {
    case 0: return 'Borrador'
    case 1: return 'Validada'
    case 2: return 'En curso'
    case 3: return 'Terminada'
    case 4: return 'Cancelada'
    default: return 'Desconocido'
  }
}

const getPriorityText = (priority) => {
  const priorityNum = parseInt(priority)
  const priorities = {
    0: 'Baja',
    1: 'Media',
    2: 'Alta',
    3: 'Muy alta'
  }
  return priorities[priorityNum] !== undefined ? priorities[priorityNum] : 'Media'
}

const getPriorityClass = (priority) => {
  const priorityNum = parseInt(priority)
  const classes = {
    0: 'bg-green-600 text-green-100',    // Baja
    1: 'bg-blue-600 text-blue-100',      // Media
    2: 'bg-orange-600 text-orange-100',  // Alta
    3: 'bg-red-600 text-red-100'         // Muy alta
  }
  return classes[priorityNum] !== undefined ? classes[priorityNum] : 'bg-blue-600 text-blue-100'
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
watch([searchQuery, statusFilter, priorityFilter, filterOnlyOverdue], () => {
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
  
  // Clear all timers
  Object.values(timerIntervals.value).forEach(interval => {
    clearInterval(interval)
  })
  timerIntervals.value = {}
})
</script>
