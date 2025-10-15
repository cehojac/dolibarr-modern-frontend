<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Gestión de Tareas</h1>
          <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Administra y supervisa todas las tareas del sistema</p>
        </div>
        <button
          @click="showCreateTaskModal = true"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors shadow-lg"
          :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="font-medium">Crear Tarea</span>
        </button>
      </div>
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
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ activeTasks.length }}</p>
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tareas activas</p>
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
        <option value="bajo">Bajo</option>
        <option value="normal">Normal</option>
        <option value="alto">Alto</option>
        <option value="crítico">Crítico</option>
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

              <!-- Tercero / Proyecto -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <!-- Tercero -->
                  <div v-if="task.tercero_name" class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ task.tercero_name }}
                  </div>
                  <div v-else class="text-sm italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    Sin tercero
                  </div>
                  
                  <!-- Proyecto (segunda línea) -->
                  <div v-if="task.project_name" class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Proyecto: {{ task.project_name }}
                  </div>
                </div>
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
                  <div 
                    v-if="task.assigned_to" 
                    class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110" 
                    :class="isDark ? 'bg-blue-600' : 'bg-blue-500'"
                    :title="task.assigned_to"
                  >
                    <span class="text-xs font-semibold text-white">
                      {{ getUserInitials(task.assigned_to) }}
                    </span>
                  </div>
                  <div 
                    v-else 
                    class="w-8 h-8 rounded-full flex items-center justify-center" 
                    :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
                    title="Sin asignar"
                  >
                    <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      --
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
                    @click="showCompleteTaskModal = true"
                    :disabled="completingTask || taskDetails?.progress >= 100 || taskDetails?.status === 3"
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
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Descripción</h3>
                    </div>
                    <button
                      v-if="!isEditingDescription"
                      @click="startEditDescription"
                      class="p-2 rounded-lg transition-colors"
                      :class="isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'"
                      title="Editar descripción"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- View Mode -->
                  <div v-if="!isEditingDescription" class="prose max-w-none" :class="isDark ? 'prose-invert' : ''">
                    <div 
                      v-if="taskDetails.description" 
                      class="text-sm p-4 rounded-lg" 
                      :class="isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'"
                      v-html="taskDetails.description"
                    ></div>
                    <div 
                      v-else 
                      class="text-sm p-4 rounded-lg italic" 
                      :class="isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'"
                    >
                      Sin descripción
                    </div>
                  </div>
                  
                  <!-- Edit Mode -->
                  <div v-else class="space-y-3">
                    <div class="border rounded-lg" :class="isDark ? 'border-gray-700' : 'border-gray-300'">
                      <!-- Barra de herramientas del editor -->
                      <div class="flex items-center space-x-2 p-2 border-b" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'">
                        <button
                          type="button"
                          @click="formatEditDescription('bold')"
                          class="p-1 rounded hover:bg-opacity-80 transition-colors"
                          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
                          title="Negrita"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 4v12h4.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5C15 2 13 0 10.5 0H6v4zm2-2h2.5C11.3 2 12 2.7 12 3.5S11.3 5 10.5 5H8V2zm0 5h3c.8 0 1.5.7 1.5 1.5S11.8 10 11 10H8V7z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          @click="formatEditDescription('italic')"
                          class="p-1 rounded hover:bg-opacity-80 transition-colors"
                          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
                          title="Cursiva"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 1h6v2H8V1zm2 2h2l-2 12H8l2-12z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          @click="formatEditDescription('underline')"
                          class="p-1 rounded hover:bg-opacity-80 transition-colors"
                          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
                          title="Subrayado"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18H4v-2h12v2H10zM10 2C7.8 2 6 3.8 6 6v4c0 2.2 1.8 4 4 4s4-1.8 4-4V6c0-2.2-1.8-4-4-4z"/>
                          </svg>
                        </button>
                        <div class="w-px h-4" :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"></div>
                        <button
                          type="button"
                          @click="insertEditDescriptionList('ul')"
                          class="p-1 rounded hover:bg-opacity-80 transition-colors"
                          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
                          title="Lista con viñetas"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 100 2 1 1 0 000-2zM6 5h11a1 1 0 110 2H6a1 1 0 110-2zM3 9a1 1 0 100 2 1 1 0 000-2zM6 10h11a1 1 0 110 2H6a1 1 0 110-2zM3 14a1 1 0 100 2 1 1 0 000-2zM6 15h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          @click="insertEditDescriptionList('ol')"
                          class="p-1 rounded hover:bg-opacity-80 transition-colors"
                          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
                          title="Lista numerada"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4h1v1H3V4zM3 7h1v1H3V7zM3 10h1v1H3v-1zM6 5h11a1 1 0 110 2H6a1 1 0 110-2zM6 10h11a1 1 0 110 2H6a1 1 0 110-2zM6 15h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                          </svg>
                        </button>
                      </div>
                      
                      <!-- Área de contenido editable -->
                      <div
                        ref="editDescriptionEditor"
                        contenteditable="true"
                        @input="updateEditDescriptionContent"
                        class="p-4 min-h-[150px] focus:outline-none text-sm"
                        :class="isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
                        style="white-space: pre-wrap;"
                      ></div>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="saveDescription"
                        :disabled="isSavingDescription"
                        class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                      >
                        <svg v-if="isSavingDescription" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isSavingDescription ? 'Guardando...' : 'Guardar' }}
                      </button>
                      <button
                        @click="cancelEditDescription"
                        :disabled="isSavingDescription"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                      >
                        Cancelar
                      </button>
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

                <!-- Time Spent Section -->
                <div v-if="taskDetails?.timespent_lines && taskDetails.timespent_lines.length > 0" class="mb-8">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Tiempo Dedicado</h3>
                  </div>
                  
                  <!-- Time Spent List -->
                  <div class="space-y-3">
                    <div
                      v-for="(line, index) in taskDetails.timespent_lines"
                      :key="index"
                      class="p-4 rounded-lg border"
                      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                          <!-- User Avatar -->
                          <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                            <span class="text-xs font-semibold text-white">
                              {{ getUserNameById(line.timespent_line_fk_user) ? getUserInitials(getUserNameById(line.timespent_line_fk_user)) : 'U' }}
                            </span>
                          </div>
                          <div>
                            <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                              {{ getUserNameById(line.timespent_line_fk_user) || 'Usuario' }}
                            </p>
                            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                              {{ formatDate(line.timespent_line_date) }}
                            </p>
                          </div>
                        </div>
                        <!-- Time Duration -->
                        <div class="text-right">
                          <p class="text-lg font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                            {{ formatDuration(parseInt(line.timespent_line_duration)) }}
                          </p>
                          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            {{ Math.round(parseInt(line.timespent_line_duration) / 3600 * 100) / 100 }}h
                          </p>
                        </div>
                      </div>
                      
                      <!-- Note/Description -->
                      <div v-if="line.timespent_line_note" class="mt-2 pt-2 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          <svg class="w-4 h-4 inline mr-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          {{ line.timespent_line_note }}
                        </p>
                      </div>
                    </div>
                    
                    <!-- Total Time -->
                    <div class="pt-3 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          Tiempo total dedicado:
                        </span>
                        <span class="text-lg font-bold" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                          {{ formatDuration(calculateTotalTimeSpent(taskDetails.timespent_lines)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- No time spent message -->
                <div v-else class="mb-8">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Tiempo Dedicado</h3>
                  </div>
                  <div class="text-sm text-center py-6 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No hay tiempo dedicado registrado para esta tarea</p>
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
                      <!-- Cliente -->
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cliente:</label>
                          <button
                            v-if="!editingTaskClient"
                            @click="startEditTaskClient"
                            class="p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'"
                            title="Editar cliente"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- View Mode -->
                        <div v-if="!editingTaskClient">
                          <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                            {{ taskDetails.tercero_name || 'Sin cliente asignado' }}
                          </p>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div v-else class="space-y-2">
                          <input
                            v-model="thirdpartySearch.searchTerm.value"
                            @input="handleThirdpartySearch"
                            type="text"
                            placeholder="Buscar cliente (min. 3 caracteres)..."
                            class="w-full p-2 border rounded-lg text-sm"
                            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                          />
                          
                          <!-- Results Dropdown -->
                          <div v-if="thirdpartySearch.searchResults.value.length > 0" class="max-h-40 overflow-y-auto border rounded-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                            <button
                              v-for="thirdparty in thirdpartySearch.searchResults.value"
                              :key="thirdparty.id"
                              @click="selectTaskClient(thirdparty)"
                              class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors border-b last:border-0"
                              :class="isDark ? 'hover:bg-gray-600 border-gray-600' : 'hover:bg-gray-100 border-gray-200'"
                            >
                              <div class="font-medium">{{ thirdparty.name }}</div>
                              <div class="text-xs opacity-75">{{ thirdparty.email || 'Sin email' }}</div>
                            </button>
                          </div>
                          
                          <!-- Loading -->
                          <div v-if="thirdpartySearch.isSearching.value" class="text-xs text-center py-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            Buscando...
                          </div>
                          
                          <div class="flex space-x-2">
                            <button
                              @click="saveTaskClient"
                              :disabled="isSavingTaskClient || !selectedTaskClient"
                              class="flex-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              {{ isSavingTaskClient ? 'Guardando...' : 'Guardar' }}
                            </button>
                            <button
                              @click="cancelEditTaskClient"
                              :disabled="isSavingTaskClient"
                              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Proyecto -->
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Proyecto:</label>
                          <button
                            v-if="!editingTaskProject"
                            @click="startEditTaskProject"
                            class="p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'"
                            title="Editar proyecto"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- View Mode -->
                        <div v-if="!editingTaskProject">
                          <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                            {{ taskDetails.project_name || 'Sin proyecto asignado' }}
                          </p>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div v-else class="space-y-2">
                          <div class="relative">
                            <input
                              v-model="taskProjectSearchTerm"
                              @focus="showTaskProjectDropdown = true"
                              @input="filterProjectsForTask"
                              type="text"
                              placeholder="Buscar proyecto..."
                              class="w-full p-2 border rounded-lg text-sm"
                              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                            />
                            
                            <!-- Project Dropdown -->
                            <div v-if="showTaskProjectDropdown && filteredTaskProjects.length > 0" class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                              <button
                                v-for="project in filteredTaskProjects"
                                :key="project.id"
                                @click="selectTaskProject(project)"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors border-b last:border-0"
                                :class="isDark ? 'hover:bg-gray-600 text-white border-gray-600' : 'hover:bg-gray-100 text-gray-900 border-gray-200'"
                              >
                                <div class="font-medium">{{ project.title || project.ref }}</div>
                                <div class="text-xs opacity-75">{{ project.ref }}</div>
                              </button>
                            </div>
                          </div>
                          
                          <div class="flex space-x-2">
                            <button
                              @click="saveTaskProject"
                              :disabled="isSavingTaskProject || !selectedTaskProject"
                              class="flex-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              {{ isSavingTaskProject ? 'Guardando...' : 'Guardar' }}
                            </button>
                            <button
                              @click="cancelEditTaskProject"
                              :disabled="isSavingTaskProject"
                              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Estado -->
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Estado:</label>
                          <button
                            v-if="!editingTaskStatus"
                            @click="startEditTaskStatus"
                            class="p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'"
                            title="Editar estado"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- View Mode -->
                        <div v-if="!editingTaskStatus">
                          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(taskDetails.status)">
                            {{ taskDetails.status_text }}
                          </span>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div v-else class="space-y-2">
                          <select
                            v-model="selectedTaskStatus"
                            class="w-full p-2 border rounded-lg text-sm"
                            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                          >
                            <option value="0">Borrador</option>
                            <option value="1">Validada</option>
                            <option value="2">En curso</option>
                            <option value="3">Terminada</option>
                            <option value="4">Cancelada</option>
                          </select>
                          <div class="flex space-x-2">
                            <button
                              @click="saveTaskStatus"
                              :disabled="isSavingTaskStatus"
                              class="flex-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              {{ isSavingTaskStatus ? 'Guardando...' : 'Guardar' }}
                            </button>
                            <button
                              @click="cancelEditTaskStatus"
                              :disabled="isSavingTaskStatus"
                              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Prioridad -->
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prioridad:</label>
                          <button
                            v-if="!editingTaskPriority"
                            @click="startEditTaskPriority"
                            class="p-1 rounded hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'"
                            title="Editar prioridad"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- View Mode -->
                        <div v-if="!editingTaskPriority">
                          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getPriorityClass(taskDetails.priority)">
                            {{ taskDetails.priority_text }}
                          </span>
                        </div>
                        
                        <!-- Edit Mode -->
                        <div v-else class="space-y-2">
                          <select
                            v-model="selectedTaskPriority"
                            class="w-full p-2 border rounded-lg text-sm"
                            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                          >
                            <option value="Bajo">Bajo</option>
                            <option value="Normal">Normal</option>
                            <option value="Alto">Alto</option>
                            <option value="Crítico">Crítico</option>
                          </select>
                          <div class="flex space-x-2">
                            <button
                              @click="saveTaskPriority"
                              :disabled="isSavingTaskPriority"
                              class="flex-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              {{ isSavingTaskPriority ? 'Guardando...' : 'Guardar' }}
                            </button>
                            <button
                              @click="cancelEditTaskPriority"
                              :disabled="isSavingTaskPriority"
                              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
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
                              @blur="handleTaskCompanyBlur"
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
                              @blur="handleTaskAssignmentBlur"
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
                              :disabled="isSavingTaskAssignment"
                              class="flex-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                            >
                              <span v-if="isSavingTaskAssignment" class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                              </span>
                              <span v-else>Guardar</span>
                            </button>
                            <button 
                              @click="cancelEditTaskAssignment"
                              :disabled="isSavingTaskAssignment"
                              class="px-3 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
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
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Notas Privadas</h3>
                      </div>
                      <button 
                        v-if="!isEditingPrivateNote"
                        @click="isEditingPrivateNote = true"
                        class="p-2 rounded-lg transition-colors"
                        :class="isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- View Mode -->
                    <div v-if="!isEditingPrivateNote" class="p-3 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
                      <p v-if="taskDetails.note_private" class="text-sm whitespace-pre-wrap" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ taskDetails.note_private }}</p>
                      <p v-else class="text-sm italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Sin notas privadas</p>
                    </div>
                    
                    <!-- Edit Mode -->
                    <div v-else class="space-y-3">
                      <textarea
                        v-model="privateNote"
                        placeholder="Agregar nota privada..."
                        rows="3"
                        class="w-full p-3 border rounded-lg text-sm resize-none"
                        :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      ></textarea>
                      <div class="flex space-x-2">
                        <button 
                          @click="savePrivateNote"
                          :disabled="isSavingPrivateNote"
                          class="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                        >
                          <svg v-if="isSavingPrivateNote" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {{ isSavingPrivateNote ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button 
                          @click="isEditingPrivateNote = false"
                          :disabled="isSavingPrivateNote"
                          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Public Notes -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Notas Públicas</h3>
                      </div>
                      <button 
                        v-if="!isEditingPublicNote"
                        @click="isEditingPublicNote = true"
                        class="p-2 rounded-lg transition-colors"
                        :class="isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- View Mode -->
                    <div v-if="!isEditingPublicNote" class="p-3 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
                      <p v-if="taskDetails.note_public" class="text-sm whitespace-pre-wrap" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ taskDetails.note_public }}</p>
                      <p v-else class="text-sm italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Sin notas públicas</p>
                    </div>
                    
                    <!-- Edit Mode -->
                    <div v-else class="space-y-3">
                      <textarea
                        v-model="publicNote"
                        placeholder="Agregar nota pública..."
                        rows="3"
                        class="w-full p-3 border rounded-lg text-sm resize-none"
                        :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      ></textarea>
                      <div class="flex space-x-2">
                        <button 
                          @click="savePublicNote"
                          :disabled="isSavingPublicNote"
                          class="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          :class="isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
                        >
                          <svg v-if="isSavingPublicNote" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {{ isSavingPublicNote ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button 
                          @click="isEditingPublicNote = false"
                          :disabled="isSavingPublicNote"
                          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                        >
                          Cancelar
                        </button>
                      </div>
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
                          @blur="handleFollowerBlur"
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
                      
                      <!-- Uploading Indicator -->
                      <div v-if="uploadingFile" class="flex items-center justify-center p-4 rounded-lg border" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'">
                        <svg class="animate-spin h-5 w-5 mr-2" :class="isDark ? 'text-blue-400' : 'text-blue-500'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Subiendo archivo...</span>
                      </div>
                      
                      <!-- Uploaded Files List -->
                      <div v-if="uploadedFiles.length > 0" class="space-y-2">
                        <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          Archivos subidos ({{ uploadedFiles.length }})
                        </h4>
                        <div 
                          v-for="(file, index) in uploadedFiles" 
                          :key="`${file.name}-${file.date}-${index}`"
                          class="flex items-center justify-between p-3 rounded border"
                          :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                        >
                          <div class="flex items-center space-x-2 flex-1 min-w-0">
                            <svg class="w-5 h-5 flex-shrink-0" :class="isDark ? 'text-blue-400' : 'text-blue-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium truncate" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
                                {{ file.name }}
                              </p>
                              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                                {{ formatFileSize(file.size) }}
                              </p>
                            </div>
                          </div>
                          <div class="flex items-center space-x-1">
                            <button 
                              @click="downloadFile(file)"
                              class="p-1.5 rounded hover:bg-opacity-50 transition-colors"
                              :class="isDark ? 'text-green-400 hover:bg-green-900' : 'text-green-600 hover:bg-green-100'"
                              title="Descargar archivo"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button 
                              @click="removeFile(file)"
                              class="p-1.5 rounded hover:bg-opacity-50 transition-colors"
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
                      <div v-else-if="!uploadingFile" class="text-sm text-center py-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                        No hay archivos adjuntos
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

  <!-- Modal de confirmación para completar tarea -->
  <div v-if="showCompleteTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Completar Tarea
        </h3>
      </div>
      
      <p class="text-sm mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        ¿Estás seguro de que deseas marcar esta tarea como completada? Esta acción cambiará el progreso al 100% y el estado a "Terminada".
      </p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-xs font-medium text-yellow-800">Información importante</p>
            <p class="text-xs text-yellow-700 mt-1">Una vez completada, la tarea se marcará como terminada y ya no aparecerá en la lista de tareas activas.</p>
          </div>
        </div>
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="showCompleteTaskModal = false"
          :disabled="completingTask"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50' : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="markTaskAsComplete"
          :disabled="completingTask"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
        >
          <svg v-if="completingTask" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ completingTask ? 'Completando...' : 'Sí, completar tarea' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de crear tarea -->
  <div v-if="showCreateTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <!-- Header -->
      <div class="sticky top-0 px-6 py-4 border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Crear Nueva Tarea</h3>
              <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Completa la información de la tarea</p>
            </div>
          </div>
          <button
            @click="closeCreateTaskModal"
            class="p-2 rounded-lg transition-colors"
            :class="isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        <!-- Etiqueta -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Etiqueta <span class="text-red-500">*</span>
          </label>
          <input
            v-model="newTask.label"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Nombre de la tarea"
          />
        </div>

        <!-- Proyecto -->
        <div class="relative">
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Proyecto <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="projectSearchTerm"
              @input="filterProjectsForNewTask"
              @focus="showProjectDropdown = true"
              type="text"
              class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              placeholder="Buscar proyecto..."
            />
            <svg class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <!-- Dropdown de proyectos -->
          <div
            v-if="showProjectDropdown && filteredProjectsForNewTask.length > 0"
            class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'"
          >
            <div
              v-for="project in filteredProjectsForNewTask"
              :key="project.id"
              @click="selectProjectForNewTask(project)"
              class="px-3 py-2 cursor-pointer transition-colors"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
            >
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <div>
                  <div class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ project.title || project.ref }}
                  </div>
                  <div v-if="project.ref" class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Ref: {{ project.ref }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensaje cuando no hay resultados -->
          <div
            v-if="showProjectDropdown && projectSearchTerm && filteredProjectsForNewTask.length === 0"
            class="absolute z-10 w-full mt-1 p-3 border rounded-lg shadow-lg"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'"
          >
            <p class="text-sm">No se encontraron proyectos</p>
          </div>
          
          <!-- Instrucciones cuando no se ha escrito nada -->
          <div
            v-if="showProjectDropdown && !projectSearchTerm && projects.length > 0"
            class="absolute z-10 w-full mt-1 p-3 border rounded-lg shadow-lg"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'"
          >
            <p class="text-sm">Escribe para buscar un proyecto...</p>
          </div>
        </div>

        <!-- Fecha de inicio y fin -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Fecha de inicio
            </label>
            <input
              v-model="newTask.date_start"
              type="datetime-local"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Fecha límite
            </label>
            <input
              v-model="newTask.date_end"
              type="datetime-local"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>
        </div>

        <!-- Carga de trabajo y Progreso -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Carga de trabajo prevista (horas)
            </label>
            <input
              v-model.number="newTask.planned_workload"
              type="number"
              step="0.5"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Progreso (%)
            </label>
            <input
              v-model.number="newTask.progress"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Facturable y Presupuesto -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Facturable
            </label>
            <select
              v-model="newTask.billable"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Presupuesto
            </label>
            <input
              v-model.number="newTask.budget_amount"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Prioridad -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Prioridad
          </label>
          <select
            v-model="newTask.priority"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
          >
            <option value="Bajo">Bajo</option>
            <option value="Normal">Normal</option>
            <option value="Alto">Alto</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Descripción
          </label>
          <div class="border rounded-lg" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
            <!-- Barra de herramientas del editor -->
            <div class="flex items-center space-x-2 p-2 border-b" :class="isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'">
              <button
                type="button"
                @click="formatTaskDescription('bold')"
                class="p-1 rounded hover:bg-opacity-80 transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Negrita"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4v12h4.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5C15 2 13 0 10.5 0H6v4zm2-2h2.5C11.3 2 12 2.7 12 3.5S11.3 5 10.5 5H8V2zm0 5h3c.8 0 1.5.7 1.5 1.5S11.8 10 11 10H8V7z"/>
                </svg>
              </button>
              <button
                type="button"
                @click="formatTaskDescription('italic')"
                class="p-1 rounded hover:bg-opacity-80 transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Cursiva"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 1h6v2H8V1zm2 2h2l-2 12H8l2-12z"/>
                </svg>
              </button>
              <button
                type="button"
                @click="formatTaskDescription('underline')"
                class="p-1 rounded hover:bg-opacity-80 transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Subrayado"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18H4v-2h12v2H10zM10 2C7.8 2 6 3.8 6 6v4c0 2.2 1.8 4 4 4s4-1.8 4-4V6c0-2.2-1.8-4-4-4z"/>
                </svg>
              </button>
              <div class="w-px h-4" :class="isDark ? 'bg-gray-600' : 'bg-gray-300'"></div>
              <button
                type="button"
                @click="insertTaskDescriptionList('ul')"
                class="p-1 rounded hover:bg-opacity-80 transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Lista con viñetas"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 100 2 1 1 0 000-2zM6 5h11a1 1 0 110 2H6a1 1 0 110-2zM3 9a1 1 0 100 2 1 1 0 000-2zM6 10h11a1 1 0 110 2H6a1 1 0 110-2zM3 14a1 1 0 100 2 1 1 0 000-2zM6 15h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                </svg>
              </button>
              <button
                type="button"
                @click="insertTaskDescriptionList('ol')"
                class="p-1 rounded hover:bg-opacity-80 transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Lista numerada"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4h1v1H3V4zM3 7h1v1H3V7zM3 10h1v1H3v-1zM6 5h11a1 1 0 110 2H6a1 1 0 110-2zM6 10h11a1 1 0 110 2H6a1 1 0 110-2zM6 15h11a1 1 0 110 2H6a1 1 0 110-2z"/>
                </svg>
              </button>
            </div>
            
            <!-- Área de contenido editable -->
            <div
              ref="taskDescriptionEditor"
              contenteditable="true"
              @input="updateTaskDescriptionContent"
              class="p-3 min-h-[120px] focus:outline-none"
              :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'"
              style="white-space: pre-wrap;"
            ></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 px-6 py-4 border-t flex justify-end space-x-3" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <button
          @click="closeCreateTaskModal"
          :disabled="creatingTask"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="createTask"
          :disabled="creatingTask || !newTask.label || !newTask.fk_project"
          class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'"
        >
          <svg v-if="creatingTask" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ creatingTask ? 'Creando...' : 'Crear Tarea' }}</span>
        </button>
      </div>
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
import { useThirdpartySearch } from '../composables/useThirdpartySearch'
import { useProjects } from '../composables/useProjects'
import TimerButton from '@/components/TimerButton.vue'

const { isDark } = useTheme()
const { currentUser } = useAuth()
const authStore = useAuthStore()

// Composables
const thirdpartySearch = useThirdpartySearch()
const projectsComposable = useProjects()

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
const showCompleteTaskModal = ref(false)

// Create task modal
const showCreateTaskModal = ref(false)
const creatingTask = ref(false)
const taskDescriptionEditor = ref(null)
const projectSearchTerm = ref('')
const filteredProjectsForNewTask = ref([])
const newTask = ref({
  label: '',
  description: '',
  fk_project: null,
  date_start: null,
  date_end: null,
  planned_workload: null,
  progress: 0,
  billable: '1',
  budget_amount: null,
  priority: 'Normal'
})

// Timer time entry modal
const showTimeEntryModal = ref(false)
const timeEntryNote = ref('')
const recordedTime = ref(0)
const isSavingTimeEntry = ref(false)

// Notes and files
const privateNote = ref('')
const publicNote = ref('')
const isEditingPrivateNote = ref(false)
const isEditingPublicNote = ref(false)
const isSavingPrivateNote = ref(false)
const isSavingPublicNote = ref(false)
const uploadedFiles = ref([])
const fileInput = ref(null)
const uploadingFile = ref(false)

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
const isSavingTaskAssignment = ref(false)

// Task status and priority editing
const editingTaskStatus = ref(false)
const selectedTaskStatus = ref('')
const isSavingTaskStatus = ref(false)

const editingTaskPriority = ref(false)
const selectedTaskPriority = ref('')
const isSavingTaskPriority = ref(false)

// Task description editing
const isEditingDescription = ref(false)
const taskDescription = ref('')
const isSavingDescription = ref(false)
const editDescriptionEditor = ref(null)

// Task client and project editing
const editingTaskClient = ref(false)
const selectedTaskClient = ref(null)
const isSavingTaskClient = ref(false)

const editingTaskProject = ref(false)
const selectedTaskProject = ref(null)
const taskProjectSearchTerm = ref('')
const showTaskProjectDropdown = ref(false)
const isSavingTaskProject = ref(false)

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

// Filtrar proyectos para edición de tarea
const filteredTaskProjects = computed(() => {
  if (!taskProjectSearchTerm.value) return projects.value.slice(0, 10)
  return projects.value.filter(project => {
    const searchTerm = taskProjectSearchTerm.value.toLowerCase()
    return (
      (project.title && project.title.toLowerCase().includes(searchTerm)) ||
      (project.ref && project.ref.toLowerCase().includes(searchTerm)) ||
      (project.label && project.label.toLowerCase().includes(searchTerm))
    )
  }).slice(0, 10)
})

const filteredTasks = computed(() => {
  let filtered = tasks.value

  // Excluir tareas completadas por defecto (a menos que se filtre específicamente por estado 3)
  if (statusFilter.value !== '3') {
    filtered = filtered.filter(task => {
      const status = parseInt(task.fk_statut || task.status)
      const progress = parseInt(task.progress) || 0
      // Excluir: Estado 3 (Terminada) O progreso 100%
      return status !== 3 && progress !== 100
    })
  }

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
    filtered = filtered.filter(task => {
      const matches = task.fk_user_assign == authStore.user.id || task.isUserAssigned
      return matches
    })
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
    filtered = filtered.filter(task => {
      const taskPriority = typeof task.priority === 'string' ? task.priority.toLowerCase() : ''
      return taskPriority === priorityFilter.value.toLowerCase()
    })
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
    const progress = parseInt(task.progress) || 0
    // 0 = Borrador, 1 = Validada (pendiente de iniciar)
    // Excluir completadas (estado 3 o progreso 100%)
    return (status === 0 || status === 1) && status !== 3 && progress !== 100
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
    const progress = parseInt(task.progress) || 0
    // 3 = Terminada O progreso al 100%
    return status === 3 || progress === 100
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
    
    const status = parseInt(task.fk_statut || task.status)
    const progress = parseInt(task.progress) || 0
    // Vencidas: fecha fin pasada Y no completadas (3 o 100%) ni canceladas (4)
    return endDate < today && status !== 3 && status !== 4 && progress !== 100
  })
})

const highPriorityTasks = computed(() => {
  return tasks.value.filter(task => {
    const status = parseInt(task.fk_statut || task.status)
    const progress = parseInt(task.progress) || 0
    const priority = typeof task.priority === 'string' ? task.priority.toLowerCase() : ''
    // Prioridades "alto" y "crítico" se consideran de alta prioridad
    // Excluir completadas (estado 3 o progreso 100%)
    return (priority === 'alto' || priority === 'crítico' || priority === 'critico') && status !== 3 && progress !== 100
  })
})

// Total de tareas activas (sin completadas)
const activeTasks = computed(() => {
  return tasks.value.filter(task => {
    const status = parseInt(task.fk_statut || task.status)
    const progress = parseInt(task.progress) || 0
    // Excluir completadas (estado 3 o progreso 100%)
    return status !== 3 && progress !== 100
  })
})

// Cache configuration
const CACHE_KEY = 'dolibarr_tasks_cache'
const CACHE_TIMESTAMP_KEY = 'dolibarr_tasks_cache_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos

// Methods
const loadTasks = async (forceRefresh = false) => {
  loading.value = true
  try {
    // console.log('⚡ PASO 1: Verificando caché de tareas...')
    
    // Verificar si hay datos en caché y son válidos
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(CACHE_KEY)
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (cachedData && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp)
        if (age < CACHE_DURATION) {
          // console.log('✅ Usando tareas desde caché (edad:', Math.floor(age / 1000), 'segundos)')
          const parsedData = JSON.parse(cachedData)
          
          // Procesar tareas básicas desde caché con enriquecimiento de usuario
          const basicTasks = parsedData.map(task => {
            const isMyTask = task.fk_user_assign && authStore.user && task.fk_user_assign == authStore.user.id
            
            // Usar status si fk_statut es null
            const taskStatus = task.fk_statut !== null && task.fk_statut !== undefined 
              ? parseInt(task.fk_statut) 
              : parseInt(task.status || 0)
            
            return {
              ...task,
              status: taskStatus,
              assigned_to: task.assigned_to || null,
              project_name: task.project_name || null,
              tercero_name: task.tercero_name || null,
              priority: task.array_options?.options_prioridad || task.priority || 'Normal',
              isUserAssigned: isMyTask
            }
          })
          
          tasks.value = basicTasks
          loading.value = false
          // console.log('📋 Tareas desde caché:', basicTasks.length)
          
          // Cargar datos adicionales en background
          loadAdditionalDataInBackground()
          return
        } else {
          // console.log('⏱️ Caché expirada, recargando...')
        }
      }
    }
    
    // PASO 1: Cargar TODAS las tareas (sin filtro de progreso, límite 1000)
    // console.log('📡 Llamando API de tareas (límite 1000)...')
    const tasksResponse = await http.get('/api/doli/tasks?limit=1000')
    
    if (!tasksResponse.data || !Array.isArray(tasksResponse.data)) {
      tasks.value = []
      loading.value = false
      return
    }
    
    // console.log('✅ Tareas cargadas desde API:', tasksResponse.data.length)
    
    // Guardar en caché
    localStorage.setItem(CACHE_KEY, JSON.stringify(tasksResponse.data))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    // console.log('💾 Tareas guardadas en caché')
    
    
    // PASO 2: Procesar tareas básicas CON enriquecimiento básico de usuario
    const basicTasks = tasksResponse.data.map(task => {
      // Verificar si la tarea está asignada al usuario actual (pre-enriquecimiento básico)
      const isMyTask = task.fk_user_assign && authStore.user && task.fk_user_assign == authStore.user.id
      
      // Usar status si fk_statut es null
      const taskStatus = task.fk_statut !== null && task.fk_statut !== undefined 
        ? parseInt(task.fk_statut) 
        : parseInt(task.status || 0)
      
      return {
        ...task,
        status: taskStatus, // Usar el estado real de Dolibarr
        assigned_to: null, // Se enriquecerá después
        project_name: null, // Se enriquecerá después
        tercero_name: null, // Se enriquecerá después
        priority: task.array_options?.options_prioridad || task.priority || 'Normal',
        isUserAssigned: isMyTask
      }
    })
    
    // PASO 3: Mostrar datos básicos inmediatamente
    tasks.value = basicTasks
    loading.value = false
    // console.log('⚡ Datos básicos mostrados -', basicTasks.length, 'tareas cargadas')
    
    // PASO 4: Enriquecer en background
    await loadAdditionalDataInBackground()
    
  } catch (error) {
    // console.error('Error loading tasks:', error)
    tasks.value = []
    loading.value = false
  }
}

// FUNCIÓN ELIMINADA: loadTaskRoles()
// Ya no es necesaria porque:
// 1. Causaba exceso de peticiones (1 por cada tarea)
// 2. La API de Dolibarr deniega acceso por rate limiting
// 3. Ahora usamos /api/doli/dolibarmodernfrontendapi/task/{id}/contacts
//    solo cuando se abre el detalle de una tarea específica
// 4. El campo fk_user_assign ya nos indica si hay usuario asignado

// Función para cargar y enriquecer datos adicionales
const loadAdditionalDataInBackground = async () => {
  try {
    // console.log('🔄 Cargando datos adicionales...')
    
    // Cargar datos adicionales para enriquecimiento en background
    const [projectsResponse, usersResponse, tercerosResponse] = await Promise.all([
      http.get('/api/doli/projects?limit=1000').catch(() => ({ data: [] })),
      http.get('/api/doli/users').catch(() => ({ data: [] })),
      http.get('/api/doli/thirdparties?limit=1000&status=1').catch(() => ({ data: [] }))
    ])
    
    // console.log('✅ Datos adicionales cargados:', {
    //   projects: projectsResponse.data?.length || 0,
    //   users: usersResponse.data?.length || 0,
    //   terceros: tercerosResponse.data?.length || 0
    // })
    
    // PASO 2: Store reference data
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

    // console.log('📊 Mapas creados - Projects:', Object.keys(projectsMap).length, 'Users:', Object.keys(usersMap).length, 'Terceros:', Object.keys(tercerosMap).length)

    // PASO 3: Enriquecer las tareas ya mostradas (SÍNCRONO como Tickets)
    const enrichedTasks = tasks.value.map((task) => {
        // Try multiple possible project ID fields
        let project = null
        const projectIds = [task.fk_project, task.fk_projet, task.project_id, task.projectid]
        
        for (const projectId of projectIds) {
          if (projectId && projectsMap[projectId]) {
            project = projectsMap[projectId]
            break
          }
        }

        // Try multiple possible user ID fields - SIMPLE como Tickets
        let assignedUser = null
        let isUserAssigned = false
        const userIds = [task.fk_user_assign, task.fk_user, task.user_id, task.userid]
        
        for (const userId of userIds) {
          if (userId && usersMap[userId]) {
            assignedUser = usersMap[userId]
            // Check if is current user
            if (currentUser.value && userId == currentUser.value.id) {
              isUserAssigned = true
            }
            break
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
        
        // Usar status si fk_statut es null
        const taskStatus = task.fk_statut !== null && task.fk_statut !== undefined 
          ? parseInt(task.fk_statut) 
          : parseInt(task.status || 0)
        
        return {
          ...task,
          status: taskStatus, // Usar el estado real de Dolibarr
          assigned_to: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}`.trim() : null,
          project_name: project ? (project.title || project.ref) : null,
          tercero_name: tercero ? tercero.name : null,
          priority: task.array_options?.options_prioridad || task.priority || 'Normal',
          isUserAssigned: isUserAssigned
        }
    })

    tasks.value = enrichedTasks
    // console.log('✅ Datos enriquecidos:', enrichedTasks.length, 'tareas')
    
    // Ya no cargamos roles aquí para evitar exceso de peticiones
    // Los roles se cargan individualmente cuando se abre el detalle de la tarea
  } catch (err) {
    // console.error('❌ Error al enriquecer tareas:', err)
    // Mantener las tareas básicas aunque falle el enriquecimiento
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
  
  // console.log('🔴 Filtrando por tareas vencidas de todos los usuarios')
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
  
  // Reset edit modes
  isEditingPrivateNote.value = false
  isEditingPublicNote.value = false
  
  try {
    // Llamada real a la API para obtener detalles completos de la tarea con tiempo dedicado
    // console.log('🔍 Cargando detalles de tarea:', task.id)
    const response = await http.get(`/api/doli/tasks/${task.id}?includetimespent=2`)
    
    if (!response.data) {
      throw new Error('No se recibieron datos de la tarea')
    }
    
    const taskData = response.data
    // console.log('✅ Detalles de tarea cargados:', taskData)
    
    // Usar status si fk_statut es null o undefined
    const taskStatus = taskData.fk_statut !== null && taskData.fk_statut !== undefined 
      ? parseInt(taskData.fk_statut) 
      : parseInt(taskData.status || 0)
    
    // Procesar líneas de tiempo dedicado si existen
    const timeSpentLines = taskData.lines || []
    // console.log('⏱️ Líneas de tiempo dedicado:', timeSpentLines.length)
    
    // Obtener nombre del proyecto si existe
    let projectName = task.project_name || null
    if (taskData.fk_project) {
      try {
        const project = await projectsComposable.getProjectById(taskData.fk_project)
        if (project) {
          projectName = project.title || project.ref || project.name
          // console.log('📁 Nombre del proyecto:', projectName)
        }
      } catch (error) {
        // console.warn('⚠️ Error obteniendo nombre del proyecto:', error)
      }
    }
    
    // Obtener nombre del tercero si existe
    let terceroName = task.tercero_name || null
    if (taskData.socid || taskData.fk_soc) {
      const terceroId = taskData.socid || taskData.fk_soc
      const tercero = terceros.value.find(t => t.id == terceroId)
      if (tercero) {
        terceroName = tercero.name
      }
    }
    
    taskDetails.value = {
      ...taskData,
      status: taskStatus, // Usar el estado real de Dolibarr
      description: taskData.note || taskData.description || 'Sin descripción disponible',
      created_by: task.assigned_to || 'Sistema',
      created_date: taskData.date_start || taskData.date_creation || new Date().toISOString(),
      due_date: taskData.date_end,
      priority: taskData.array_options?.options_prioridad || taskData.priority || 'Normal',
      priority_text: getPriorityText(taskData.array_options?.options_prioridad || taskData.priority || 'Normal'),
      status_text: getStatusText(taskStatus),
      total_time: taskTimers.value[task.id]?.elapsed || 0,
      timespent_lines: timeSpentLines, // Guardar las líneas de tiempo dedicado
      project_name: projectName, // Nombre del proyecto
      tercero_name: terceroName // Nombre del tercero
    }
    
    // Initialize current company and user
    if (task.tercero_name) {
      currentTaskCompany.value = terceros.value.find(t => t.name === task.tercero_name) || { name: task.tercero_name }
      if (currentTaskCompany.value?.id) {
        loadContactsForCompany(currentTaskCompany.value.id)
      }
    }
    
    // Fetch assigned user from custom API endpoint
    try {
      console.log('🔍 Fetching task contacts from API:', task.id)
      const contactsResponse = await http.get(`/api/doli/dolibarmodernfrontendapi/task/${task.id}/contacts`)
      
      if (contactsResponse.data && contactsResponse.data.contacts) {
        console.log('📞 Task contacts received:', contactsResponse.data)
        
        // Find the TASKEXECUTIVE contact (assigned user)
        const executiveContact = contactsResponse.data.contacts.find(
          contact => contact.contact_type_code === 'TASKEXECUTIVE'
        )
        
        if (executiveContact) {
          console.log('👤 Found TASKEXECUTIVE contact:', executiveContact)
          // Set the assigned user from the contact data
          currentTaskAssignedUser.value = {
            id: executiveContact.user_id,
            firstname: executiveContact.firstname,
            lastname: executiveContact.lastname,
            email: executiveContact.email,
            phone_mobile: executiveContact.phone_mobile
          }
          // Update taskDetails with the assigned user ID
          taskDetails.value.fk_user_assign = executiveContact.user_id
          console.log('✅ Assigned user set:', currentTaskAssignedUser.value)
        } else {
          currentTaskAssignedUser.value = null
          console.log('👤 No TASKEXECUTIVE contact found')
        }
      }
    } catch (error) {
      console.error('❌ Error fetching task contacts:', error)
      // Fallback to old method if API fails
      if (taskData.fk_user_assign) {
        currentTaskAssignedUser.value = users.value.find(u => u.id == taskData.fk_user_assign)
      } else {
        currentTaskAssignedUser.value = null
      }
    }
    
    // Initialize notes and description with existing values
    privateNote.value = taskDetails.value.note_private || ''
    publicNote.value = taskDetails.value.note_public || ''
    taskDescription.value = taskDetails.value.description || ''
    
    // Load task files from Dolibarr
    await loadTaskFiles()
    
    // Reset edit modes
    isEditingDescription.value = false
  } catch (error) {
    // console.error('Error loading task details:', error)
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
  isEditingPrivateNote.value = false
  isEditingPublicNote.value = false
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
    // console.log('🎯 Marcando tarea como completa (100% y estado Terminada):', taskDetails.value.id)
    
    // Actualizar progreso a 100% y estado a 3 (Terminada)
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      progress: 100,
      status: 3  // Estado 3 = Terminada
    }
    
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Tarea completada:', response.data)
    
    // Actualizar el taskDetails localmente
    taskDetails.value.progress = 100
    taskDetails.value.status = 3
    taskDetails.value.fk_statut = 3
    taskDetails.value.status_text = getStatusText(3)
    
    // Actualizar en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      taskInList.progress = 100
      taskInList.status = 3
      taskInList.fk_statut = 3
    }
    
    // Cerrar modal de confirmación
    showCompleteTaskModal.value = false
    
    // Cerrar modal del ticket
    closeTaskModal()
    
    // Recargar la lista de tareas
    await loadTasks()
    
    // console.log('✅ Tarea marcada como completa exitosamente')
  } catch (error) {
    // console.error('❌ Error al completar tarea:', error)
    alert('Error al marcar la tarea como completa: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    completingTask.value = false
  }
}

// Abrir modal de timesheet manual
const openManualTimesheetModal = () => {
  // console.log('📋 Abriendo modal de timesheet manual para tarea:', taskDetails.value?.id)
  // TODO: Implementar modal de timesheet manual
  alert('Función de Add Timesheet manual próximamente disponible')
}

// Notes functions
const savePrivateNote = async () => {
  if (!privateNote.value.trim() || isSavingPrivateNote.value) return
  
  isSavingPrivateNote.value = true
  
  try {
    // console.log('Saving private note:', privateNote.value)
    // console.log('Task ID:', taskDetails.value.id)
    
    // Prepare data for API - Incluir campos obligatorios
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      priority: taskDetails.value.priority || selectedTask.value.priority || 1,
      note_private: privateNote.value.trim()
    }
    
    // console.log('Update data:', updateData)
    
    // API call to update task using http.put
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Private note update response:', response.data)
    
    // Update local data
    taskDetails.value.note_private = privateNote.value.trim()
    
    // Close edit mode
    isEditingPrivateNote.value = false
    
    // console.log('Private note saved successfully')
  } catch (error) {
    // console.error('Error saving private note:', error)
    // console.error('Error details:', error.response?.data)
    alert('Error al guardar la nota privada: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingPrivateNote.value = false
  }
}

const savePublicNote = async () => {
  if (!publicNote.value.trim() || isSavingPublicNote.value) return
  
  isSavingPublicNote.value = true
  
  try {
    // console.log('💾 Saving public note for task:', selectedTask.value.id, publicNote.value)
    
    // Prepare data for API - Incluir campos obligatorios
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      priority: taskDetails.value.priority || selectedTask.value.priority || 1,
      note_public: publicNote.value.trim()
    }
    
    // console.log('Update data:', updateData)
    
    // API call to update task using http.put
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Public note update response:', response.data)
    
    // Update local data
    taskDetails.value.note_public = publicNote.value.trim()
    
    // Close edit mode
    isEditingPublicNote.value = false
    
    // console.log('✅ Public note saved successfully')
  } catch (error) {
    // console.error('❌ Error saving public note:', error)
    // console.error('Error details:', error.response?.data)
    alert('Error al guardar la nota pública: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingPublicNote.value = false
  }
}

// File functions
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  await processFiles(files)
  event.target.value = '' // Reset input
}

const handleFileDrop = async (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  await processFiles(files)
}

const processFiles = async (files) => {
  for (const file of files) {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert(`⚠️ El archivo "${file.name}" es demasiado grande. Máximo 10MB.`)
      continue
    }
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert(`⚠️ El tipo de archivo "${file.name}" no está permitido.`)
      continue
    }
    
    await uploadFileToDolibarr(file)
  }
}

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Upload file to Dolibarr
const uploadFileToDolibarr = async (file) => {
  uploadingFile.value = true
  
  try {
    // console.log('📤 Subiendo archivo:', file.name)
    // console.log('📊 Tamaño:', file.size, 'bytes')
    // console.log('📄 Tipo:', file.type)
    // console.log('🏷️ Tarea ID:', selectedTask.value.id)
    
    // Convert file to base64
    const base64Content = await fileToBase64(file)
    const base64Data = base64Content.split(',')[1] // Remove data:xxx;base64, prefix
    
    // Upload to Dolibarr using custom module endpoint
    const response = await http.post(`/api/doli/dolibarmodernfrontendapi/task/${selectedTask.value.id}/documents`, {
      filename: file.name,
      filecontent: base64Data,
      fileencoding: 'base64'
    })
    
    // console.log('✅ Archivo subido exitosamente:', file.name, response.data)
    
    // Pequeño delay para asegurar que el archivo esté disponible en el servidor
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Limpiar y recargar archivos para forzar reactividad
    // console.log('🔄 Recargando lista de archivos...')
    uploadedFiles.value = []
    await loadTaskFiles()
    
    // console.log('✅ Lista actualizada. Total archivos:', uploadedFiles.value.length)
    
  } catch (error) {
    // console.error('❌ Error al subir archivo:', error)
    // console.error('Error details:', error.response?.data)
    alert(`Error al subir ${file.name}: ${error.response?.data?.error?.message || error.message}`)
  } finally {
    uploadingFile.value = false
  }
}

// Load task files from Dolibarr
const loadTaskFiles = async () => {
  if (!selectedTask.value?.id) {
    // console.warn('⚠️ No se puede cargar archivos: selectedTask.value.id no está definido')
    return
  }
  
  try {
    // console.log('📂 Cargando archivos de la tarea:', selectedTask.value.id, selectedTask.value.ref)
    
    const response = await http.get(`/api/doli/dolibarmodernfrontendapi/task/${selectedTask.value.id}/documents`)
    
    // console.log('📦 Respuesta completa del API:', response.data)
    
    // El array de documentos está en response.data.documents
    const documents = response.data?.documents || []
    // console.log('📄 Documentos encontrados:', documents.length)
    
    // Asignar con spread para forzar reactividad
    uploadedFiles.value = [...documents]
    
    // console.log('📎 Archivos cargados en uploadedFiles.value:', uploadedFiles.value.length)
    
    if (uploadedFiles.value.length > 0) {
      // console.log('🗂️ Primer archivo:', uploadedFiles.value[0])
    } else {
      // console.log('ℹ️ No hay archivos para esta tarea')
    }
    
  } catch (error) {
    // console.error('❌ Error al cargar archivos:', error)
    // console.error('Error details:', error.response?.data)
    uploadedFiles.value = []
  }
}

// Download file from Dolibarr
const downloadFile = async (file) => {
  try {
    // console.log('📥 Descargando archivo:', file.name)
    // console.log('📄 Download URL:', file.download_url)
    // console.log('📁 Relative path:', file.relativepath)
    
    // Usar el download_url proporcionado por el API
    const downloadUrl = `/api/doli${file.download_url}`
    
    const response = await http.get(downloadUrl, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    // console.log('✅ Archivo descargado:', file.name)
    
  } catch (error) {
    // console.error('❌ Error al descargar archivo:', error)
    // console.error('Download URL:', file.download_url)
    alert(`Error al descargar ${file.name}`)
  }
}

// Remove file from Dolibarr
const removeFile = async (file) => {
  if (!confirm(`¿Eliminar el archivo "${file.name}"?`)) return
  
  try {
    // console.log('🗑️ Eliminando archivo:', file.name)
    // console.log('📁 Relative path:', file.relativepath)
    
    await http.delete('/api/doli/documents/delete', {
      params: {
        modulepart: 'project_task',
        original_file: file.relativepath
      }
    })
    
    // console.log('✅ Archivo eliminado:', file.name)
    
    // Reload task files
    await loadTaskFiles()
    
  } catch (error) {
    // console.error('❌ Error al eliminar archivo:', error)
    // console.error('Error details:', error.response?.data)
    alert(`Error al eliminar ${file.name}`)
  }
}

// Format file size
const formatFileSize = (bytes) => {
  // Manejar cuando size viene como string vacío o null
  if (!bytes || bytes === '' || bytes === '0') return 'Tamaño desconocido'
  
  const numBytes = parseInt(bytes)
  if (isNaN(numBytes)) return 'Tamaño desconocido'
  
  if (numBytes < 1024) return numBytes + ' B'
  if (numBytes < 1024 * 1024) return (numBytes / 1024).toFixed(1) + ' KB'
  return (numBytes / (1024 * 1024)).toFixed(1) + ' MB'
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

const handleTaskCompanyBlur = () => {
  setTimeout(() => {
    showTaskCompanyDropdown.value = false
  }, 200)
}

const selectTaskCompany = (companyId, companyName) => {
  selectedTaskCompanyId.value = companyId
  taskCompanySearchTerm.value = companyName
  showTaskCompanyDropdown.value = false
}

const saveTaskCompany = async () => {
  try {
    // console.log('Saving task company:', selectedTaskCompanyId.value)
    
    const selectedCompany = terceros.value.find(t => t.id === selectedTaskCompanyId.value)
    
    // Prepare data for API
    const updateData = {
      socid: selectedTaskCompanyId.value || null,
      thirdparty_id: selectedTaskCompanyId.value || null,
      thirdparty_name: selectedCompany?.name || null
    }
    
    // API call to update task using http.put like in tickets
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Company update response:', response.data)
    
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
    
    // console.log('Task company updated successfully')
  } catch (error) {
    // console.error('Error saving task company:', error)
    alert('Error al actualizar la empresa de la tarea')
  }
}

const startEditTaskAssignment = () => {
  editingTaskAssignment.value = true
  selectedTaskAssignedUserId.value = taskDetails.value?.fk_user_assign || ''
  // Dejar el campo de búsqueda vacío para mostrar todos los usuarios
  taskAssignmentSearchTerm.value = ''
  // Abrir el dropdown automáticamente
  showTaskAssignmentDropdown.value = true
}

const cancelEditTaskAssignment = () => {
  editingTaskAssignment.value = false
  selectedTaskAssignedUserId.value = ''
  taskAssignmentSearchTerm.value = ''
  showTaskAssignmentDropdown.value = false
}

const handleTaskAssignmentBlur = () => {
  setTimeout(() => {
    showTaskAssignmentDropdown.value = false
  }, 200)
}

const selectTaskAssignedUser = (userId, displayText) => {
  selectedTaskAssignedUserId.value = userId
  taskAssignmentSearchTerm.value = displayText
  showTaskAssignmentDropdown.value = false
}

const saveTaskAssignment = async () => {
  if (isSavingTaskAssignment.value) return
  
  isSavingTaskAssignment.value = true
  
  try {
    console.log('💾 Saving task assignment:', {
      taskId: taskDetails.value.id,
      userId: selectedTaskAssignedUserId.value
    })
    
    const selectedUser = selectedTaskAssignedUserId.value ? 
      users.value.find(u => u.id == selectedTaskAssignedUserId.value) : null
    
    console.log('👤 Selected user:', selectedUser)
    
    if (!selectedTaskAssignedUserId.value) {
      alert('Por favor selecciona un usuario para asignar')
      isSavingTaskAssignment.value = false
      return
    }
    
    // Prepare data for custom API endpoint
    const assignData = {
      user_id: parseInt(selectedTaskAssignedUserId.value),
      role: 'TASKEXECUTIVE'
    }
    
    console.log('📤 Sending assignment data:', assignData)
    
    // API call to assign user using custom endpoint
    const response = await http.post(
      `/api/doli/dolibarmodernfrontendapi/task/${taskDetails.value.id}/assign`,
      assignData
    )
    console.log('✅ Assignment response:', response.data)
    
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
    
    // Actualizar también la tarea en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      if (selectedUser) {
        taskInList.assigned_to = `${selectedUser.firstname} ${selectedUser.lastname}`
        taskInList.fk_user_assign = selectedUser.id
      } else {
        taskInList.assigned_to = null
        taskInList.fk_user_assign = null
      }
    }
    
    cancelEditTaskAssignment()
    console.log('✅ Task assignment updated successfully')
  } catch (error) {
    console.error('❌ Error updating task assignment:', error)
    console.error('Error details:', error.response?.data)
    alert('Error al actualizar el usuario asignado: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTaskAssignment.value = false
  }
}

// Task status editing functions
const startEditTaskStatus = () => {
  editingTaskStatus.value = true
  selectedTaskStatus.value = String(taskDetails.value?.status || taskDetails.value?.fk_statut || 0)
}

const cancelEditTaskStatus = () => {
  editingTaskStatus.value = false
  selectedTaskStatus.value = ''
}

const saveTaskStatus = async () => {
  if (isSavingTaskStatus.value) return
  
  isSavingTaskStatus.value = true
  
  try {
    // console.log('💾 Guardando estado de tarea:', {
    //   taskId: selectedTask.value.id,
    //   newStatus: selectedTaskStatus.value
    // })
    
    // Prepare data for API
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      status: parseInt(selectedTaskStatus.value)
    }
    
    // API call to update task
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Estado actualizado:', response.data)
    
    // Update local data
    const newStatus = parseInt(selectedTaskStatus.value)
    taskDetails.value.status = newStatus
    taskDetails.value.fk_statut = newStatus
    taskDetails.value.status_text = getStatusText(newStatus)
    
    // Actualizar también la tarea en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      taskInList.status = newStatus
      taskInList.fk_statut = newStatus
    }
    
    cancelEditTaskStatus()
    // console.log('✅ Estado de tarea actualizado exitosamente')
  } catch (error) {
    // console.error('❌ Error al actualizar estado:', error)
    alert('Error al actualizar el estado: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTaskStatus.value = false
  }
}

// Task description editing functions
const startEditDescription = () => {
  isEditingDescription.value = true
  taskDescription.value = taskDetails.value?.description || ''
  
  // Cargar el contenido HTML en el editor después de que el DOM se actualice
  setTimeout(() => {
    if (editDescriptionEditor.value) {
      editDescriptionEditor.value.innerHTML = taskDescription.value
    }
  }, 0)
}

const cancelEditDescription = () => {
  isEditingDescription.value = false
  taskDescription.value = taskDetails.value?.description || ''
  if (editDescriptionEditor.value) {
    editDescriptionEditor.value.innerHTML = ''
  }
}

// Funciones del editor WYSIWYG para edición de descripción
const formatEditDescription = (command) => {
  document.execCommand(command, false, null)
  editDescriptionEditor.value?.focus()
}

const insertEditDescriptionList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
  editDescriptionEditor.value?.focus()
}

const updateEditDescriptionContent = () => {
  if (editDescriptionEditor.value) {
    taskDescription.value = editDescriptionEditor.value.innerHTML
  }
}

const saveDescription = async () => {
  if (isSavingDescription.value) return
  
  isSavingDescription.value = true
  
  try {
    // console.log('💾 Guardando descripción de tarea:', {
    //   taskId: selectedTask.value.id,
    //   description: taskDescription.value
    // })
    
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      description: taskDescription.value
    }
    
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Descripción actualizada:', response.data)
    
    // Update local data
    taskDetails.value.description = taskDescription.value
    
    // Actualizar en la lista si es necesario
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      taskInList.description = taskDescription.value
      taskInList.note = taskDescription.value
    }
    
    isEditingDescription.value = false
    // console.log('✅ Descripción de tarea actualizada exitosamente')
  } catch (error) {
    // console.error('❌ Error al actualizar descripción:', error)
    alert('Error al actualizar la descripción: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingDescription.value = false
  }
}

// Task client editing functions
const startEditTaskClient = () => {
  editingTaskClient.value = true
  thirdpartySearch.clearSearch()
  selectedTaskClient.value = null
}

const cancelEditTaskClient = () => {
  editingTaskClient.value = false
  thirdpartySearch.clearSearch()
  selectedTaskClient.value = null
}

const handleThirdpartySearch = async () => {
  if (thirdpartySearch.canSearch.value) {
    await thirdpartySearch.searchThirdparties()
  }
}

const selectTaskClient = (thirdparty) => {
  selectedTaskClient.value = thirdparty
  thirdpartySearch.searchTerm.value = thirdparty.name
}

const saveTaskClient = async () => {
  if (isSavingTaskClient.value || !selectedTaskClient.value) return
  
  isSavingTaskClient.value = true
  
  try {
    // console.log('💾 Guardando cliente de tarea:', {
    //   taskId: selectedTask.value.id,
    //   clientId: selectedTaskClient.value.id
    // })
    
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      socid: selectedTaskClient.value.id
    }
    
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Cliente actualizado:', response.data)
    
    // Update local data
    taskDetails.value.fk_soc = selectedTaskClient.value.id
    taskDetails.value.tercero_name = selectedTaskClient.value.name
    
    // Actualizar en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      taskInList.fk_soc = selectedTaskClient.value.id
      taskInList.tercero_name = selectedTaskClient.value.name
    }
    
    cancelEditTaskClient()
    // console.log('✅ Cliente de tarea actualizado exitosamente')
  } catch (error) {
    // console.error('❌ Error al actualizar cliente:', error)
    alert('Error al actualizar el cliente: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTaskClient.value = false
  }
}

// Task project editing functions
const startEditTaskProject = () => {
  editingTaskProject.value = true
  taskProjectSearchTerm.value = taskDetails.value?.project_name || ''
  selectedTaskProject.value = null
}

const cancelEditTaskProject = () => {
  editingTaskProject.value = false
  taskProjectSearchTerm.value = ''
  selectedTaskProject.value = null
  showTaskProjectDropdown.value = false
}

const filterProjectsForTask = () => {
  // El computed filteredTaskProjects se encargará del filtrado
}

const selectTaskProject = (project) => {
  selectedTaskProject.value = project
  taskProjectSearchTerm.value = project.title || project.ref
  showTaskProjectDropdown.value = false
}

const saveTaskProject = async () => {
  if (isSavingTaskProject.value || !selectedTaskProject.value) return
  
  isSavingTaskProject.value = true
  
  try {
    // console.log('💾 Guardando proyecto de tarea:', {
    //   taskId: selectedTask.value.id,
    //   projectId: selectedTaskProject.value.id
    // })
    
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      fk_project: selectedTaskProject.value.id
    }
    
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Proyecto actualizado:', response.data)
    
    // Update local data
    taskDetails.value.fk_project = selectedTaskProject.value.id
    taskDetails.value.project_name = selectedTaskProject.value.title || selectedTaskProject.value.ref
    
    // Actualizar en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      taskInList.fk_project = selectedTaskProject.value.id
      taskInList.project_name = selectedTaskProject.value.title || selectedTaskProject.value.ref
    }
    
    cancelEditTaskProject()
    // console.log('✅ Proyecto de tarea actualizado exitosamente')
  } catch (error) {
    // console.error('❌ Error al actualizar proyecto:', error)
    alert('Error al actualizar el proyecto: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTaskProject.value = false
  }
}

// Task priority editing functions
const startEditTaskPriority = () => {
  editingTaskPriority.value = true
  // Obtener prioridad desde array_options o usar el valor directo
  const priority = taskDetails.value?.array_options?.options_prioridad || taskDetails.value?.priority || 'Normal'
  selectedTaskPriority.value = getPriorityText(priority)
}

const cancelEditTaskPriority = () => {
  editingTaskPriority.value = false
  selectedTaskPriority.value = ''
}

const saveTaskPriority = async () => {
  if (isSavingTaskPriority.value) return
  
  isSavingTaskPriority.value = true
  
  try {
    // console.log('💾 Guardando prioridad de tarea:', {
    //   taskId: selectedTask.value.id,
    //   newPriority: selectedTaskPriority.value
    // })
    
    // Prepare data for API - La prioridad se guarda en array_options
    const updateData = {
      label: taskDetails.value.label || selectedTask.value.label,
      array_options: {
        options_prioridad: selectedTaskPriority.value.toLowerCase()
      }
    }
    
    // API call to update task
    const response = await http.put(`/api/doli/tasks/${taskDetails.value.id}`, updateData)
    // console.log('✅ Prioridad actualizada:', response.data)
    
    // Update local data
    const newPriority = selectedTaskPriority.value.toLowerCase()
    if (!taskDetails.value.array_options) {
      taskDetails.value.array_options = {}
    }
    taskDetails.value.array_options.options_prioridad = newPriority
    taskDetails.value.priority = newPriority
    taskDetails.value.priority_text = getPriorityText(newPriority)
    
    // Actualizar también la tarea en la lista
    const taskInList = tasks.value.find(t => t.id === taskDetails.value.id)
    if (taskInList) {
      if (!taskInList.array_options) {
        taskInList.array_options = {}
      }
      taskInList.array_options.options_prioridad = newPriority
      taskInList.priority = newPriority
    }
    
    cancelEditTaskPriority()
    // console.log('✅ Prioridad de tarea actualizada exitosamente')
  } catch (error) {
    // console.error('❌ Error al actualizar prioridad:', error)
    alert('Error al actualizar la prioridad: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    isSavingTaskPriority.value = false
  }
}

// Load contacts for company
const loadContactsForCompany = async (companyId) => {
  try {
    // console.log('📞 Loading contacts for company:', companyId)
    
    // Simulate API call to load contacts
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock contacts data
    availableContacts.value = [
      { id: 1, firstname: 'Juan', lastname: 'Pérez', email: 'juan@empresa.com', fk_soc: companyId },
      { id: 2, firstname: 'María', lastname: 'García', email: 'maria@empresa.com', fk_soc: companyId },
      { id: 3, firstname: 'Carlos', lastname: 'López', email: 'carlos@empresa.com', fk_soc: companyId }
    ]
    
    // console.log('✅ Contacts loaded:', availableContacts.value.length)
  } catch (error) {
    // console.error('❌ Error loading contacts:', error)
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
  
  // console.log('⏰ Reminder added:', reminder)
}

const removeReminder = (reminderId) => {
  taskReminders.value = taskReminders.value.filter(r => r.id !== reminderId)
  // console.log('🗑️ Reminder removed')
}

// Follower functions
const handleFollowerBlur = () => {
  setTimeout(() => {
    showFollowerDropdown.value = false
  }, 200)
}

const addFollower = (contact) => {
  if (taskFollowers.value.find(f => f.id === contact.id)) return
  
  taskFollowers.value.push(contact)
  followerSearchTerm.value = ''
  showFollowerDropdown.value = false
  
  // console.log('👥 Follower added:', contact)
}

const removeFollower = (contactId) => {
  taskFollowers.value = taskFollowers.value.filter(f => f.id !== contactId)
  // console.log('🗑️ Follower removed')
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
  
  // console.log(`▶️ Timer started for task ${entityId}`)
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
  
  // console.log('⏱️ Timer stopped for task', entityId)
  // console.log('   elapsedSeconds param:', elapsedSeconds)
  // console.log('   timer.elapsed:', timer?.elapsed)
  // console.log('   calculated seconds:', timeInSeconds)
  
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
    // console.log('🚀 GUARDANDO TIEMPO EN TAREA')
    // console.log('='.repeat(60))
    
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
      // console.log(`⏱️ Tiempo menor a 1 minuto (${durationInSeconds}s), redondeando a 60s`)
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
    
    // console.log('📋 Datos de tiempo:', timeSpentData)
    // console.log('🕐 Fecha:', dateStr)
    // console.log('⏱️ Duración:', recordedTime.value, 'segundos (tipo:', typeof recordedTime.value, ')')
    // console.log('👤 Usuario:', authStore.user?.id)
    // console.log('📝 Nota:', timeSpentData.note)
    // console.log('📦 Payload completo:', JSON.stringify(timeSpentData, null, 2))
    
    // Llamar al endpoint POST /tasks/{id}/addtimespent
    const response = await http.post(`/api/doli/tasks/${taskId}/addtimespent`, timeSpentData)
    
    // console.log('✅ TIEMPO GUARDADO EXITOSAMENTE')
    // console.log('📊 Respuesta:', response.data)
    // console.log('='.repeat(60))
    
    // Reset modal state
    showTimeEntryModal.value = false
    timeEntryNote.value = ''
    recordedTime.value = 0
    
    // Refresh tasks
    await loadTasks()
    
    alert('✅ Tiempo guardado exitosamente')
  } catch (error) {
    // console.error('❌ ERROR AL GUARDAR TIEMPO:', error)
    // console.error('Detalles:', error.response?.data)
    
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

// Calcular tiempo total dedicado de todas las líneas
const calculateTotalTimeSpent = (lines) => {
  if (!lines || lines.length === 0) return 0
  return lines.reduce((total, line) => total + (parseInt(line.timespent_line_duration) || 0), 0)
}

// Obtener nombre de usuario por ID
const getUserNameById = (userId) => {
  if (!userId || !users.value) return null
  const user = users.value.find(u => u.id == userId || u.rowid == userId)
  if (!user) return null
  return `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.login || 'Usuario'
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

const getUserInitials = (fullName) => {
  if (!fullName) return '--'
  
  const names = fullName.trim().split(' ')
  if (names.length === 1) {
    // Solo un nombre, tomar las primeras 2 letras
    return names[0].substring(0, 2).toUpperCase()
  }
  
  // Tomar primera letra del nombre y primera letra del apellido
  const firstName = names[0]
  const lastName = names[names.length - 1]
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

const getPriorityText = (priority) => {
  // Si ya es un string de texto, devolverlo directamente
  if (typeof priority === 'string') {
    const normalized = priority.toLowerCase()
    if (normalized === 'bajo') return 'Bajo'
    if (normalized === 'normal') return 'Normal'
    if (normalized === 'alto') return 'Alto'
    if (normalized === 'crítico' || normalized === 'critico') return 'Crítico'
    return priority // Devolver el original si no coincide
  }
  
  // Si es número (legacy), convertir a texto
  const priorityNum = parseInt(priority)
  const priorities = {
    0: 'Bajo',
    1: 'Normal',
    2: 'Alto',
    3: 'Crítico'
  }
  return priorities[priorityNum] !== undefined ? priorities[priorityNum] : 'Normal'
}

const getPriorityClass = (priority) => {
  // Normalizar el string
  const priorityStr = typeof priority === 'string' ? priority.toLowerCase() : ''
  
  const classes = {
    'bajo': 'bg-green-600 text-green-100',
    'normal': 'bg-blue-600 text-blue-100',
    'alto': 'bg-orange-600 text-orange-100',
    'crítico': 'bg-red-600 text-red-100',
    'critico': 'bg-red-600 text-red-100'
  }
  
  // Si es número (legacy), convertir
  if (!isNaN(priority)) {
    const priorityNum = parseInt(priority)
    const numClasses = {
      0: 'bg-green-600 text-green-100',
      1: 'bg-blue-600 text-blue-100',
      2: 'bg-orange-600 text-orange-100',
      3: 'bg-red-600 text-red-100'
    }
    return numClasses[priorityNum] || 'bg-blue-600 text-blue-100'
  }
  
  return classes[priorityStr] || 'bg-blue-600 text-blue-100'
}

// Create task functions
const generateTaskRef = async () => {
  try {
    const now = new Date()
    const year = String(now.getFullYear()).slice(-2) // Últimos 2 dígitos del año
    const month = String(now.getMonth() + 1).padStart(2, '0') // Mes con padding
    const prefix = `TK${year}${month}-`
    
    // console.log('🔢 Generando referencia con prefijo:', prefix)
    
    // Obtener todas las tareas del mes actual
    const response = await http.get('/api/doli/tasks', {
      params: {
        limit: 1000,
        sortfield: 't.ref',
        sortorder: 'DESC'
      }
    })
    
    // Filtrar tareas que coincidan con el prefijo del mes actual
    const tasksThisMonth = response.data.filter(task => 
      task.ref && task.ref.startsWith(prefix)
    )
    
    // console.log('📋 Tareas encontradas del mes actual:', tasksThisMonth.length)
    
    // Obtener el último número
    let lastNumber = 0
    if (tasksThisMonth.length > 0) {
      // Extraer el número de la última referencia
      const lastRef = tasksThisMonth[0].ref
      const numberPart = lastRef.split('-')[1]
      lastNumber = parseInt(numberPart) || 0
      // console.log('🔢 Última referencia:', lastRef, 'Número:', lastNumber)
    }
    
    // Generar nueva referencia
    const newNumber = lastNumber + 1
    const newRef = `${prefix}${String(newNumber).padStart(4, '0')}`
    
    // console.log('✅ Nueva referencia generada:', newRef)
    return newRef
    
  } catch (error) {
    // console.error('❌ Error al generar referencia:', error)
    // Fallback: usar timestamp
    const timestamp = Date.now().toString().slice(-4)
    return `TK-${timestamp}`
  }
}

const filterProjectsForNewTask = () => {
  if (!projectSearchTerm.value) {
    filteredProjectsForNewTask.value = []
    return
  }
  
  const searchTerm = projectSearchTerm.value.toLowerCase()
  filteredProjectsForNewTask.value = projects.value.filter(project => {
    const title = (project.title || '').toLowerCase()
    const ref = (project.ref || '').toLowerCase()
    return title.includes(searchTerm) || ref.includes(searchTerm)
  }).slice(0, 20) // Limitar a 20 resultados
}

const selectProjectForNewTask = (project) => {
  newTask.value.fk_project = project.id
  projectSearchTerm.value = project.title || project.ref
  showProjectDropdown.value = false
}

const closeCreateTaskModal = () => {
  showCreateTaskModal.value = false
  // Reset form
  newTask.value = {
    label: '',
    description: '',
    fk_project: null,
    date_start: null,
    date_end: null,
    planned_workload: null,
    progress: 0,
    billable: '1',
    budget_amount: null,
    priority: 'Normal'
  }
  // Limpiar buscador de proyectos
  projectSearchTerm.value = ''
  filteredProjectsForNewTask.value = []
  showProjectDropdown.value = false
  // Limpiar editor WYSIWYG
  if (taskDescriptionEditor.value) {
    taskDescriptionEditor.value.innerHTML = ''
  }
}

// Funciones del editor WYSIWYG para descripción de tarea
const formatTaskDescription = (command) => {
  document.execCommand(command, false, null)
  taskDescriptionEditor.value?.focus()
}

const insertTaskDescriptionList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
  taskDescriptionEditor.value?.focus()
}

const updateTaskDescriptionContent = () => {
  if (taskDescriptionEditor.value) {
    newTask.value.description = taskDescriptionEditor.value.innerHTML
  }
}

const createTask = async () => {
  if (!newTask.value.label || !newTask.value.fk_project) {
    alert('Por favor completa los campos obligatorios: Etiqueta y Proyecto')
    return
  }
  
  creatingTask.value = true
  
  try {
    // console.log('📝 Creando nueva tarea:', newTask.value)
    
    // Generar referencia automática
    const taskRef = await generateTaskRef()
    // console.log('🏷️ Referencia generada:', taskRef)
    
    // Convertir fechas a timestamp Unix si existen
    const dateStart = newTask.value.date_start ? Math.floor(new Date(newTask.value.date_start).getTime() / 1000) : null
    const dateEnd = newTask.value.date_end ? Math.floor(new Date(newTask.value.date_end).getTime() / 1000) : null
    
    // Preparar datos para la API
    const taskData = {
      ref: taskRef, // Referencia generada automáticamente (ej: TK2510-0010)
      label: newTask.value.label,
      description: newTask.value.description || '',
      fk_project: parseInt(newTask.value.fk_project),
      date_start: dateStart,
      date_end: dateEnd,
      planned_workload: newTask.value.planned_workload ? parseFloat(newTask.value.planned_workload) * 3600 : null, // Convertir horas a segundos
      progress: newTask.value.progress || 0,
      billable: newTask.value.billable,
      budget_amount: newTask.value.budget_amount || null,
      status: 1, // Estado 1 = Validada
      array_options: {
        options_prioridad: newTask.value.priority.toLowerCase()
      }
    }
    
    // console.log('📤 Datos a enviar:', taskData)
    // console.log('📤 JSON stringified:', JSON.stringify(taskData, null, 2))
    // console.log('📤 Ref field value:', taskData.ref, 'Type:', typeof taskData.ref)
    
    // Verificar que ref existe antes de enviar
    if (!('ref' in taskData)) {
      // console.error('❌ Campo ref NO existe en taskData!')
      taskData.ref = ''
    }
    
    // Llamada al API
    const response = await http.post('/api/doli/tasks', taskData)
    // console.log('✅ Tarea creada:', response.data)
    
    // Cerrar modal
    closeCreateTaskModal()
    
    // Recargar lista de tareas
    await loadTasks()
    
    // Mensaje de éxito
    alert('✅ Tarea creada exitosamente')
    
  } catch (error) {
    // console.error('❌ Error al crear tarea:', error)
    // console.error('❌ Error details:', error.response?.data)
    alert('Error al crear la tarea: ' + (error.response?.data?.error?.message || error.message))
  } finally {
    creatingTask.value = false
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

<style scoped>
/* Estilos para el editor WYSIWYG */
[contenteditable="true"]:empty:before {
  content: "Escribe la descripción de la tarea aquí...";
  color: #9CA3AF;
  font-style: italic;
}

[contenteditable="true"]:focus {
  outline: none;
}

/* Estilos para el contenido del editor */
[contenteditable="true"] p {
  margin: 0.5rem 0;
}

[contenteditable="true"] ul,
[contenteditable="true"] ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

[contenteditable="true"] strong {
  font-weight: bold;
}

[contenteditable="true"] em {
  font-style: italic;
}

[contenteditable="true"] u {
  text-decoration: underline;
}

/* Estilos para el contenido HTML renderizado en la descripción */
.prose p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.prose ul,
.prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose a {
  color: #3B82F6;
  text-decoration: underline;
}

.prose a:hover {
  color: #2563EB;
}

.prose span[style*="font-size"] {
  line-height: 1.4;
}
</style>
