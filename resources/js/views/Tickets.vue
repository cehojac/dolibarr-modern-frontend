<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Tickets</h1>
        <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sistema de soporte y tickets</p>
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
        + Crear Ticket
      </button>
    </div>

    <!-- Tickets Overview Metrics -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Tickets Overview</h2>
        <a href="#" class="text-blue-500 hover:text-blue-600 text-sm font-medium">Tickets Overview →</a>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <!-- Open Tickets -->
        <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.open }}</p>
              <p class="text-sm font-medium text-red-500">Open</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">My Tickets: {{ ticketMetrics.myOpen }}</p>
            </div>
          </div>
        </div>

        <!-- In Progress / Assigned -->
        <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.inProgress }}</p>
              <p class="text-sm font-medium text-blue-500">Assigned</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">My Tickets: {{ ticketMetrics.myInProgress }}</p>
            </div>
          </div>
        </div>

        <!-- Pending -->
        <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.pending }}</p>
              <p class="text-sm font-medium text-orange-500">Pending</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">My Tickets: {{ ticketMetrics.myPending }}</p>
            </div>
          </div>
        </div>

        <!-- Awaiting Response -->
        <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.awaiting }}</p>
              <p class="text-sm font-medium text-yellow-500">Awaiting Response</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">My Tickets: {{ ticketMetrics.myAwaiting }}</p>
            </div>
          </div>
        </div>

        <!-- Closed -->
        <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.closed }}</p>
              <p class="text-sm font-medium text-green-500">Closed</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">My Tickets: {{ ticketMetrics.myClosed }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="rounded-xl p-6 mb-6 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- General Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar tickets..."
              class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
            >
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Tercero Search -->
        <div>
          <div class="relative">
            <input
              v-model="terceroSearch"
              @input="searchTerceros"
              @focus="showTerceroDropdown = true"
              type="text"
              placeholder="Buscar tercero..."
              class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
            >
            <!-- Tercero Dropdown -->
            <div v-if="showTerceroDropdown && filteredTerceros.length > 0" 
                 class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
              <div v-for="tercero in filteredTerceros" :key="tercero.id"
                   @click="selectTercero(tercero)"
                   class="px-4 py-2 cursor-pointer transition-colors"
                   :class="isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'">
                <div class="font-medium">{{ tercero.name }}</div>
                <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ tercero.email || 'Sin email' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- User Search -->
        <div>
          <div class="relative">
            <input
              v-model="userSearch"
              @input="searchUsers"
              @focus="showUserDropdown = true"
              type="text"
              placeholder="Buscar usuario..."
              class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'"
            >
            <!-- User Dropdown -->
            <div v-if="showUserDropdown && filteredUsers.length > 0" 
                 class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
              <div v-for="user in filteredUsers" :key="user.id"
                   @click="selectUser(user)"
                   class="px-4 py-2 cursor-pointer transition-colors"
                   :class="isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'">
                <div class="font-medium">{{ user.firstname }} {{ user.lastname }}</div>
                <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ user.login }} - {{ user.email || 'Sin email' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- User Filter -->
        <div>
          <select
            v-model="showOnlyMyTickets"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option :value="true">Mis Tickets</option>
            <option :value="false">Todos los Tickets</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <select
            v-model="statusFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todos los estados</option>
            <option value="1">Abierto</option>
            <option value="4">Asignado</option>
            <option value="5">En progreso</option>
            <option value="8">Cerrado</option>
            <option value="show_all">Mostrar todos (incluye cerrados)</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <select
            v-model="priorityFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todas las prioridades</option>
            <option value="1">Baja</option>
            <option value="2">Normal</option>
            <option value="3">Alta</option>
            <option value="4">Urgente</option>
          </select>
        </div>
        
        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-sm border rounded-lg transition-colors"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
            <tr>
              <th @click="sortBy('ref')" class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
                  <span>Ref.</span>
                  <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th @click="sortBy('subject')" class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
                  <span>Asunto</span>
                  <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Grupo de Ticket
              </th>
              <th @click="sortBy('severity')" class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
                  <span>Gravedad</span>
                  <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Tercero
              </th>
              <th @click="sortBy('datec')" class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
                  <span>Fecha de creación</span>
                  <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Asignada a
              </th>
              <th @click="sortBy('fk_statut')" class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-left text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
                  <span>Estado</span>
                  <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-right text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="9" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2 xl:space-x-3 2xl:space-x-4">
                  <div class="animate-spin rounded-full h-6 w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10 border-b-2 border-blue-500"></div>
                  <span class="text-sm xl:text-base 2xl:text-lg">Cargando tickets...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="9" class="px-6 xl:px-8 2xl:px-10 py-8 xl:py-10 2xl:py-12 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2 xl:space-y-3 2xl:space-y-4">
                  <svg class="w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm xl:text-base 2xl:text-lg">No hay tickets que coincidan con los filtros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="ticket in paginatedTickets" :key="ticket.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg font-medium">
                <button 
                  @click="viewTicketDetails(ticket)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ ticket.ref }}
                </button>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 text-sm xl:text-base 2xl:text-lg max-w-xs xl:max-w-sm 2xl:max-w-md truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ ticket.subject }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.category_code || ticket.category || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full"
                      :class="getPriorityClass(ticket.severity_code || ticket.severity)">
                  {{ getPriorityText(ticket.severity_code || ticket.severity) }}
                </span>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.thirdparty_name || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(ticket.datec) }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.assigned_to || '-' }}
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap">
                <span class="inline-flex px-3 xl:px-4 2xl:px-5 py-1 xl:py-2 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold rounded-full"
                      :class="getStatusClass(ticket.fk_statut, ticket)">
                  {{ getStatusText(ticket.fk_statut, ticket) }}
                </span>
              </td>
              <td class="px-6 xl:px-8 2xl:px-10 py-4 xl:py-5 2xl:py-6 whitespace-nowrap text-right text-sm xl:text-base 2xl:text-lg font-medium">
                <div class="flex items-center justify-end space-x-2 xl:space-x-3 2xl:space-x-4">
                  <button 
                    @click="viewTicketDetails(ticket)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Ver detalles"
                  >
                    <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click.stop="handleTimerClick(ticket)"
                    :class="isTimerRunning(ticket.id) ? 'text-red-500 hover:text-red-400 bg-red-50 hover:bg-red-100' : 'text-green-500 hover:text-green-400 bg-green-50 hover:bg-green-100'"
                    class="transition-colors px-2 py-1 rounded-md border"
                    :title="isTimerRunning(ticket.id) ? 'Parar cronómetro' : 'Iniciar cronómetro'"
                  >
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path v-if="!isTimerRunning(ticket.id)" d="M8 5v14l11-7z"/>
                        <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                      <span v-if="isTimerRunning(ticket.id)" class="text-xs font-mono font-bold">
                        {{ formatElapsedTime(ticket.id) }}
                      </span>
                    </div>
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
          <div class="text-sm xl:text-base 2xl:text-lg" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTickets.length) }} de {{ filteredTickets.length }} tickets
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

    <!-- Modal de detalles del ticket -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full border" :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'" @click.stop>
          <!-- Header -->
          <div class="px-6 py-4 border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails?.subject || 'Cargando...' }}</h3>
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Ticket {{ selectedTicket?.ref }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span v-if="ticketDetails" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(ticketDetails.fk_statut, ticketDetails)">
                  {{ getStatusText(ticketDetails.fk_statut, ticketDetails) }}
                </span>
                <button @click="closeModal" class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content - Two Panel Layout -->
          <div class="flex h-[80vh]" :class="isDark ? 'bg-gray-900' : 'bg-white'">
            <div v-if="loadingDetails" class="flex items-center justify-center w-full py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span class="ml-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Cargando detalles...</span>
            </div>

            <div v-else-if="ticketDetails" class="flex w-full min-h-0">
              <!-- Left Panel - Main Content -->
              <div class="flex-1 p-6 overflow-y-auto min-w-0">
                <!-- Action Buttons -->
                <div class="flex items-center space-x-3 mb-6">
                  <button class="flex items-center space-x-2 px-3 py-2 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Marcar completo</span>
                  </button>
                  
                  <!-- Timer Button in Modal -->
                  <button 
                    @click="handleTimerClick(selectedTicket)"
                    :class="isTimerRunning(selectedTicket?.id) ? 'text-red-500 hover:text-red-400 bg-red-50 hover:bg-red-100 border-red-200' : 'text-green-500 hover:text-green-400 bg-green-50 hover:bg-green-100 border-green-200'"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path v-if="!isTimerRunning(selectedTicket?.id)" d="M8 5v14l11-7z"/>
                      <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                    <span class="text-sm">
                      {{ isTimerRunning(selectedTicket?.id) ? 'Parar Timer' : 'Iniciar Timer' }}
                    </span>
                    <span v-if="isTimerRunning(selectedTicket?.id)" class="text-sm font-mono font-bold bg-red-100 px-2 py-1 rounded">
                      {{ formatElapsedTime(selectedTicket?.id) }}
                    </span>
                  </button>
                  
                  <!-- Manual Intervention Button -->
                  <button 
                    @click="openManualInterventionModal"
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
                    <div v-if="ticketDetails.message" class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                      <!-- Descripción truncada o completa -->
                      <div 
                        v-if="!showFullDescription && ticketDetails.message.length > 300"
                        v-html="ticketDetails.message.substring(0, 300) + '...'"
                        class="mb-2"
                      ></div>
                      <div 
                        v-else
                        v-html="ticketDetails.message"
                        class="mb-2"
                      ></div>
                      
                      <!-- Botón Leer más / Leer menos -->
                      <button 
                        v-if="ticketDetails.message.length > 300"
                        @click="showFullDescription = !showFullDescription"
                        class="inline-flex items-center text-sm font-medium transition-colors"
                        :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'"
                      >
                        <span>{{ showFullDescription ? 'Leer menos' : 'Leer más' }}</span>
                        <svg 
                          class="ml-1 w-4 h-4 transition-transform"
                          :class="showFullDescription ? 'rotate-180' : ''"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <p v-else class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Sin descripción disponible</p>
                  </div>
                </div>

                <!-- Intervenciones del Usuario para este Ticket -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-4">
                    <button 
                      @click="toggleInterventions"
                      class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125 1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                        Mis Intervenciones ({{ userInterventionsForTicket?.length || 0 }})
                      </h3>
                      <svg 
                        class="w-4 h-4 transition-transform duration-200" 
                        :class="[
                          isDark ? 'text-gray-400' : 'text-gray-600',
                          showInterventions ? 'rotate-180' : ''
                        ]" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Intervenciones del usuario para este ticket -->
                  <div v-if="userInterventionsForTicket && userInterventionsForTicket.length > 0" v-show="showInterventions" class="space-y-3">
                    <div 
                      v-for="(intervention, index) in userInterventionsForTicket" 
                      :key="intervention.id"
                      class="flex items-start space-x-3 p-4 rounded-lg border" 
                      :class="isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'"
                    >
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white mt-0.5" 
                           :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                              Intervención {{ intervention.ref }}
                            </span>
                            <span class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full" 
                                  :class="getInterventionStatusClass(intervention.status)">
                              {{ getInterventionStatusText(intervention.status) }}
                            </span>
                          </div>
                          <div class="text-right">
                            <div class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                              {{ formatInterventionDate(intervention.datee) }}
                            </div>
                            <div v-if="intervention.duration" class="text-xs" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                              {{ formatDuration(intervention.duration) }}
                            </div>
                          </div>
                        </div>
                        <div class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          <div v-if="intervention.desc" class="mb-2">
                            <strong>Descripción:</strong> {{ intervention.desc }}
                          </div>
                          <div v-if="intervention.lines && intervention.lines.length > 0" class="space-y-1">
                            <strong>Líneas de intervención:</strong>
                            <ul class="list-disc list-inside ml-2 space-y-1">
                              <li v-for="line in intervention.lines" :key="line.id" class="text-xs">
                                {{ line.desc || 'Sin descripción' }}
                                <span v-if="line.duration" class="text-blue-600 ml-2">({{ formatDuration(Number(line.duration)) }})</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Estado cuando no hay intervenciones del usuario -->
                  <div v-else v-show="showInterventions" class="text-center py-6">
                    <div class="rounded-lg p-4" :class="isDark ? 'bg-gray-800/50' : 'bg-gray-100'">
                      <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">0 intervenciones</p>
                      <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">No tienes intervenciones registradas para este ticket</p>
                    </div>
                  </div>
                </div>

                <!-- Comments Section -->
                <div>
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.126-.276.75.75 0 00-.618.127L8.5 21.5l-1.5-1.5a.75.75 0 00-.618-.127A8.955 8.955 0 014 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Comentarios</h3>
                  </div>

                  <!-- Add Comment Form FIRST -->
                  <div class="mb-6 p-4 rounded-lg border" :class="isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'">
                    <!-- Comment Type Selection -->
                    <div class="mb-3">
                      <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                        Tipo de comentario:
                      </label>
                      <div class="flex space-x-4">
                        <label class="flex items-center">
                          <input
                            v-model="commentType"
                            type="radio"
                            value="message"
                            class="mr-2 text-blue-500 focus:ring-blue-500"
                          >
                          <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Solo mensaje</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="commentType"
                            type="radio"
                            value="email"
                            class="mr-2 text-blue-500 focus:ring-blue-500"
                          >
                          <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Enviar email</span>
                        </label>
                      </div>
                    </div>
                    
                    <!-- Comment Textarea -->
                    <textarea 
                      v-model="newComment"
                      :placeholder="commentType === 'email' ? 'Escribir comentario (se enviará por email)...' : 'Escribir comentario...'"
                      class="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      rows="4"
                      :disabled="sendingComment"
                    ></textarea>
                    
                    <!-- Action Buttons -->
                    <div class="flex justify-between items-center mt-3">
                      <div class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                        <span v-if="commentType === 'email'" class="flex items-center">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                          Se enviará notificación por email
                        </span>
                        <span v-else class="flex items-center">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                          </svg>
                          Solo se guardará como mensaje interno
                        </span>
                      </div>
                      <div class="flex space-x-2">
                        <button 
                          @click="clearComment"
                          :disabled="sendingComment || !newComment.trim()"
                          class="px-3 py-1 text-sm border rounded-lg transition-colors"
                          :class="[
                            sendingComment || !newComment.trim() 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:bg-gray-100',
                            isDark 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          ]"
                        >
                          Limpiar
                        </button>
                        <button 
                          @click="sendComment"
                          :disabled="sendingComment || !newComment.trim()"
                          class="px-4 py-1 text-sm rounded-lg transition-colors flex items-center space-x-1"
                          :class="[
                            sendingComment || !newComment.trim()
                              ? 'bg-gray-400 cursor-not-allowed'
                              : commentType === 'email'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600',
                            'text-white'
                          ]"
                        >
                          <svg v-if="sendingComment" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <svg v-else-if="commentType === 'email'" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                          </svg>
                          <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                          </svg>
                          <span>{{ sendingComment ? 'Enviando...' : (commentType === 'email' ? 'Enviar Email' : 'Comentar') }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Messages List SECOND -->
                  <div v-if="ticketDetails.messages && ticketDetails.messages.length > 0" class="space-y-4" :key="messagesKey">
                    <div class="flex items-center space-x-2 mb-3">
                      <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                        Historial de comentarios ({{ ticketDetails.messages.length }})
                      </h4>
                    </div>
                    <div 
                      v-for="message in ticketDetails.messages" 
                      :key="`${messagesKey}-${message.id}`"
                      class="flex space-x-3"
                    >
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                        <span class="text-xs text-white font-medium">{{ (message.fk_user_author_name || 'U').charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ message.fk_user_author_name || 'Usuario' }}
                          </span>
                          <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                            {{ formatDate(message.datec) }}
                          </span>
                          <span v-if="message.type === 'email'" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg class="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Email
                          </span>
                        </div>
                        <div class="text-sm p-3 rounded-lg" :class="isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'" v-html="message.message || message.content"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Empty State -->
                  <div v-else class="text-center py-6">
                    <div class="rounded-lg p-4" :class="isDark ? 'bg-gray-800/50' : 'bg-gray-100'">
                      <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.126-.276.75.75 0 00-.618.127L8.5 21.5l-1.5-1.5a.75.75 0 00-.618-.127A8.955 8.955 0 014 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8z"/>
                      </svg>
                      <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sin comentarios</p>
                      <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Sé el primero en comentar este ticket</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar - Ticket Info -->
              <div class="w-72 max-w-sm border-l p-4 overflow-y-auto flex-shrink-0" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'">
                <!-- Ticket Info Section -->
                <div class="mb-6">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Ticket Info</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Estado:</label>
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(ticketDetails.fk_statut, ticketDetails)">
                        {{ getStatusText(ticketDetails.fk_statut, ticketDetails) }}
                      </span>
                    </div>
                    
                    <!-- Empresa del ticket -->
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Empresa:</label>
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                        {{ currentCompany?.name || (ticketDetails.fk_soc ? 'Cargando empresa...' : 'Sin empresa asignada') }}
                      </p>
                    </div>
                    
                    <!-- Proyecto del ticket -->
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Proyecto:</label>
                      <div v-if="editingProject" class="space-y-2">
                        <select 
                          v-model="selectedProjectId" 
                          class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        >
                          <option value="">Sin proyecto</option>
                          <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                            {{ project.ref }} - {{ project.title }}
                          </option>
                        </select>
                        <div class="flex space-x-2">
                          <button 
                            @click="saveProject" 
                            class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Guardar
                          </button>
                          <button 
                            @click="cancelEditProject" 
                            class="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                      <div v-else class="flex items-center justify-between">
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          {{ currentProject?.ref ? `${currentProject.ref} - ${currentProject.title}` : 'Sin proyecto asignado' }}
                        </p>
                        <button 
                          @click="startEditProject" 
                          class="ml-2 p-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                          title="Cambiar proyecto"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Fecha de inicio:</label>
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ formatDate(ticketDetails.datec) }}</p>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Fecha de vencimiento:</label>
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ ticketDetails.date_close ? formatDate(ticketDetails.date_close) : 'Sin fecha límite' }}</p>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Prioridad:</label>
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getPriorityClass(ticketDetails.severity)">
                        {{ getPriorityText(ticketDetails.severity) }}
                      </span>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tiempo registrado:</label>
                      <p class="text-sm font-medium" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                        {{ totalRegisteredTime }}
                      </p>
                      <p v-if="ticketInterventions.length > 0" class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                        {{ ticketInterventions.length }} intervención{{ ticketInterventions.length !== 1 ? 'es' : '' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Recordatorios Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 002 7v10a1 1 0 00.293.707l.707.707A3 3 0 005.5 19H15v1H5.5a4 4 0 01-2.828-1.172l-.707-.707A2 2 0 011 17V7a2 2 0 01.586-1.414l.707-.707A4 4 0 014.828 4.828zM21 3a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V4a1 1 0 011-1h5z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                        Recordatorios
                      </h3>
                    </div>
                    <button 
                      @click="showReminderModal = true"
                      class="p-1 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                      title="Agregar recordatorio"
                    >
                      <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="space-y-2">
                    <!-- Lista de recordatorios -->
                    <div v-if="ticketReminders.length > 0" class="space-y-2">
                      <div 
                        v-for="reminder in ticketReminders" 
                        :key="reminder.id"
                        class="p-3 rounded-lg border" 
                        :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'"
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex items-start space-x-3 flex-1">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-orange-600' : 'bg-orange-500'">
                              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z" />
                              </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                                {{ reminder.title }}
                              </p>
                              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                                📅 {{ formatDate(reminder.date) }}
                              </p>
                              <p class="text-xs mt-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                                👤 {{ reminder.assignedTo }}
                              </p>
                              <p v-if="reminder.description" class="text-xs mt-1 truncate" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                                {{ reminder.description }}
                              </p>
                            </div>
                          </div>
                          <button 
                            @click="deleteReminder(reminder.id)"
                            class="p-1 text-red-500 hover:text-red-700 transition-colors ml-2"
                            title="Eliminar recordatorio"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Estado vacío -->
                    <div v-else class="text-center py-6">
                      <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 002 7v10a1 1 0 00.293.707l.707.707A3 3 0 005.5 19H15v1H5.5a4 4 0 01-2.828-1.172l-.707-.707A2 2 0 011 17V7a2 2 0 01.586-1.414l.707-.707A4 4 0 014.828 4.828z" />
                      </svg>
                      <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sin recordatorios</p>
                      <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Agrega recordatorios para este ticket</p>
                    </div>
                  </div>
                </div>

                <!-- Assignees Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Asignado</h3>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <!-- Edit mode with Search -->
                    <div v-if="editingAssignment" class="space-y-2">
                      <div class="relative">
                        <input
                          v-model="assignmentSearchTerm"
                          @focus="showAssignmentDropdown = true"
                          @blur="setTimeout(() => showAssignmentDropdown = false, 200)"
                          type="text"
                          placeholder="Buscar usuario..."
                          class="w-full p-2 border rounded-lg text-sm pr-8"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                        />
                        <svg class="absolute right-2 top-2 w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <!-- Assignment Dropdown -->
                        <div v-if="showAssignmentDropdown" class="absolute z-10 w-full mt-1 max-h-60 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                          <!-- Sin asignar option -->
                          <button
                            @click="selectAssignedUser('', 'Sin asignar')"
                            class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors border-b"
                            :class="isDark ? 'text-white hover:bg-gray-600 border-gray-600' : 'text-gray-900 hover:bg-gray-100 border-gray-200'"
                          >
                            Sin asignar
                          </button>
                          
                          <!-- Filtered users -->
                          <button
                            v-for="user in filteredAssignmentUsers"
                            :key="user.id"
                            @click="selectAssignedUser(user.id, `${user.firstname} ${user.lastname} (${user.login})`)"
                            class="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors"
                            :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                          >
                            {{ user.firstname }} {{ user.lastname }} ({{ user.login }})
                          </button>
                          
                          <!-- No results -->
                          <div v-if="filteredAssignmentUsers.length === 0 && assignmentSearchTerm" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            No se encontraron usuarios
                          </div>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button 
                          @click="saveAssignment"
                          class="px-3 py-1 text-xs rounded-lg transition-colors"
                          :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                        >
                          Guardar
                        </button>
                        <button 
                          @click="cancelEditAssignment"
                          class="px-3 py-1 text-xs rounded-lg transition-colors"
                          :class="isDark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                    
                    <!-- Display mode -->
                    <div v-else class="flex items-center justify-between">
                      <div v-if="currentAssignedUser" class="flex items-center space-x-3 p-2 rounded-lg flex-1" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                          <span class="text-xs text-white font-medium">
                            {{ (currentAssignedUser.firstname || 'U').charAt(0).toUpperCase() }}
                          </span>
                        </div>
                        <div class="flex-1">
                          <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ currentAssignedUser.firstname }} {{ currentAssignedUser.lastname }}
                          </p>
                          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                            {{ currentAssignedUser.login }}
                          </p>
                        </div>
                      </div>
                      <div v-else class="flex items-center justify-between flex-1">
                        <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          Sin asignar
                        </p>
                      </div>
                      <button 
                        @click="startEditAssignment" 
                        class="ml-2 p-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                        title="Cambiar asignación"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Followers Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                        Seguidores ({{ ticketFollowers.length }})
                      </h3>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <!-- Add Follower Selector with Search -->
                    <div class="flex flex-col space-y-2">
                      <div class="relative">
                        <input
                          v-model="followersSearchTerm"
                          @focus="showFollowersDropdown = true"
                          @blur="setTimeout(() => showFollowersDropdown = false, 200)"
                          type="text"
                          placeholder="Buscar seguidor..."
                          class="w-full p-2 border rounded-lg text-xs pr-8"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                          :disabled="loadingFollowers"
                        />
                        <svg class="absolute right-2 top-2 w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <!-- Dropdown -->
                        <div v-if="showFollowersDropdown" class="absolute z-10 w-full mt-1 max-h-60 overflow-auto border rounded-lg shadow-lg" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'">
                          <!-- Usuarios de Dolibarr -->
                          <div v-if="filteredFollowers.users.length > 0">
                            <div class="px-3 py-2 text-xs font-medium border-b" :class="isDark ? 'text-gray-300 border-gray-600 bg-gray-800' : 'text-gray-600 border-gray-200 bg-gray-50'">
                              Usuarios de Dolibarr
                            </div>
                            <button
                              v-for="user in filteredFollowers.users"
                              :key="`user:${user.id}`"
                              @click="selectFollower(`user:${user.id}`, `👤 ${user.firstname} ${user.lastname}`)"
                              class="w-full text-left px-3 py-2 text-xs hover:bg-opacity-50 transition-colors"
                              :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                            >
                              👤 {{ user.firstname }} {{ user.lastname }}
                            </button>
                          </div>
                          
                          <!-- Contactos del cliente -->
                          <div v-if="filteredFollowers.contacts.length > 0">
                            <div class="px-3 py-2 text-xs font-medium border-b" :class="isDark ? 'text-gray-300 border-gray-600 bg-gray-800' : 'text-gray-600 border-gray-200 bg-gray-50'">
                              Contactos del cliente
                            </div>
                            <button
                              v-for="contact in filteredFollowers.contacts"
                              :key="`contact:${contact.id}`"
                              @click="selectFollower(`contact:${contact.id}`, `📧 ${contact.firstname} ${contact.lastname}`)"
                              class="w-full text-left px-3 py-2 text-xs hover:bg-opacity-50 transition-colors"
                              :class="isDark ? 'text-white hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'"
                            >
                              📧 {{ contact.firstname }} {{ contact.lastname }}
                            </button>
                          </div>
                          
                          <!-- No results -->
                          <div v-if="filteredFollowers.users.length === 0 && filteredFollowers.contacts.length === 0" class="px-3 py-2 text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            No se encontraron resultados
                          </div>
                        </div>
                      </div>
                      
                      <button
                        @click="addFollower"
                        :disabled="!selectedFollower || loadingFollowers"
                        class="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg v-if="loadingFollowers" class="w-3 h-3 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span v-if="loadingFollowers">Agregando...</span>
                        <span v-else>+ Agregar Seguidor</span>
                      </button>
                    </div>
                    
                    <!-- Current Followers List -->
                    <div v-if="ticketFollowers.length > 0" class="space-y-2">
                      <div 
                        v-for="follower in ticketFollowers" 
                        :key="follower.id"
                        class="flex items-center justify-between p-2 rounded-lg border" 
                        :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                      >
                        <div class="flex items-center space-x-2 min-w-0 flex-1">
                          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" 
                               :class="follower.type === 'user' ? (isDark ? 'bg-blue-600' : 'bg-blue-500') : (isDark ? 'bg-green-600' : 'bg-green-500')">
                            <span v-if="follower.type === 'user'">👤</span>
                            <span v-else>📧</span>
                          </div>
                          <div class="min-w-0 flex-1">
                            <p class="text-xs font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                              {{ follower.firstname }} {{ follower.lastname }}
                            </p>
                            <p class="text-xs truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                              {{ follower.type === 'user' ? 'Usuario' : 'Contacto' }}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          @click="removeFollower(follower.id, follower.type)"
                          :disabled="loadingFollowers"
                          class="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Eliminar seguidor"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-else class="text-center py-4">
                      <div class="rounded-lg p-4" :class="isDark ? 'bg-gray-800/50' : 'bg-gray-100'">
                        <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sin seguidores</p>
                        <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Agrega usuarios o contactos para seguir este ticket</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- File Upload Section -->
                <div>
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Archivos</h3>
                  </div>
                  
                  <!-- Documents List FIRST -->
                  <div v-if="ticketDocuments.length > 0" class="mb-4 space-y-2">
                    <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                      Archivos adjuntos ({{ ticketDocuments.length }})
                    </h4>
                    <div class="space-y-1">
                      <div 
                        v-for="doc in ticketDocuments" 
                        :key="doc.id || doc.name"
                        class="flex items-center justify-between p-2 rounded-lg text-sm"
                        :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
                      >
                        <div class="flex items-center space-x-2">
                          <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span :class="isDark ? 'text-white' : 'text-gray-900'">
                            {{ doc.name || doc.filename || 'Archivo sin nombre' }}
                          </span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                            {{ doc.size ? formatFileSize(doc.size) : '' }}
                          </span>
                          <button 
                            v-if="doc.download_url || doc.url"
                            @click="downloadDocument(doc)"
                            class="text-blue-500 hover:text-blue-600 transition-colors"
                            title="Descargar"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- File Upload Area SECOND -->
                  <div 
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                    @click="openFileDialog"
                    class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                    :class="[
                      isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400',
                      isDragOver ? (isDark ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50') : '',
                      uploadingFiles ? 'pointer-events-none' : ''
                    ]"
                  >
                    <!-- Upload Progress -->
                    <div v-if="uploadingFiles" class="space-y-3">
                      <div class="animate-spin w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                        Subiendo archivos... {{ uploadProgress }}%
                      </p>
                      <div class="w-full bg-gray-200 rounded-full h-2" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
                        <div 
                          class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          :style="{ width: uploadProgress + '%' }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Default State -->
                    <div v-else class="space-y-3">
                      <svg class="w-8 h-8 mx-auto" :class="isDragOver ? 'text-blue-500' : (isDark ? 'text-gray-500' : 'text-gray-400')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <p class="text-sm font-medium" :class="isDragOver ? 'text-blue-500' : (isDark ? 'text-gray-300' : 'text-gray-700')">
                          {{ isDragOver ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí para subir' }}
                        </p>
                        <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                          o haz clic para seleccionar archivos
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Hidden File Input -->
                  <input
                    ref="fileInputRef"
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleFileSelect"
                    accept="*/*"
                  >
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
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          Nota (opcional)
        </label>
        <textarea
          v-model="timeEntryNote"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          rows="3"
          placeholder="Describe el trabajo realizado..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="cancelTimeEntry"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors border"
          :class="isDark ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 border-gray-600' : 'text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-300'"
        >
          Cancelar
        </button>
        <button
          @click="saveTimeEntry"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>

  <!-- Modal para agregar intervención manual -->
  <div v-if="showManualInterventionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        Add timesheet
      </h3>
      
      <div class="space-y-4">
        <!-- Start Time / End Time or Duration -->
        <div v-if="!manualIntervention.useDuration" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Start Time
            </label>
            <input
              v-model="manualIntervention.startTime"
              type="datetime-local"
              class="w-full p-2 border rounded-lg text-sm"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              End Time
            </label>
            <input
              v-model="manualIntervention.endTime"
              type="datetime-local"
              class="w-full p-2 border rounded-lg text-sm"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
          </div>
        </div>
        
        <!-- Duration Mode -->
        <div v-else>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Duration (minutes)
          </label>
          <input
            v-model.number="manualIntervention.duration"
            type="number"
            min="0"
            step="1"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Enter duration in minutes"
          >
        </div>
        
        <!-- Toggle Duration Mode -->
        <div>
          <button
            @click="toggleDurationMode"
            class="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            {{ manualIntervention.useDuration ? 'Use start/end times instead' : 'Enter time duration instead' }}
          </button>
        </div>
        
        <!-- Member Selection -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Member
          </label>
          <select
            v-model="manualIntervention.member"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
          >
            <option :value="authStore.user?.id">{{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</option>
            <!-- Add more users here if needed -->
          </select>
        </div>
        
        <!-- Note -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Note
          </label>
          <textarea
            v-model="manualIntervention.note"
            rows="3"
            class="w-full p-2 border rounded-lg text-sm resize-none"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
            placeholder="Add a note about this intervention..."
          ></textarea>
        </div>
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="closeManualInterventionModal"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
        >
          Cancel
        </button>
        <button
          @click="saveManualIntervention"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>

  <!-- Modal para agregar recordatorio -->
  <div v-if="showReminderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        Crear Recordatorio
      </h3>
      
      <div class="space-y-4">
        <!-- Fecha de notificación -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            * Fecha de notificación
          </label>
          <input
            v-model="newReminder.date"
            type="datetime-local"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            required
          />
        </div>
        
        <!-- Asignar recordatorio a -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            * Asignar recordatorio a
          </label>
          <select
            v-model="newReminder.assignedTo"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            required
          >
            <option value="">Seleccionar usuario...</option>
            <option 
              v-for="user in availableUsers" 
              :key="user.id" 
              :value="`${user.firstname} ${user.lastname}`"
            >
              {{ user.firstname }} {{ user.lastname }}
            </option>
          </select>
        </div>
        
        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            * Descripción
          </label>
          <textarea
            v-model="newReminder.description"
            rows="4"
            class="w-full p-2 border rounded-lg text-sm resize-none"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
            placeholder="Describe el recordatorio..."
            required
          ></textarea>
        </div>
        
        <!-- Enviar también email -->
        <div class="flex items-center">
          <input
            v-model="newReminder.sendEmail"
            type="checkbox"
            id="sendEmail"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="sendEmail" class="ml-2 text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Enviar también un email para este recordatorio
          </label>
        </div>
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="closeReminderModal"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
        >
          Cancelar
        </button>
        <button
          @click="createReminder"
          :disabled="!newReminder.date || !newReminder.assignedTo || !newReminder.description"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          Crear Recordatorio
        </button>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useTheme } from '../composables/useTheme'
import http from '../utils/http'
import axios from 'axios'
import { useTicketsCounter } from '../composables/useTicketsCounter'
import { useInterventions } from '@/composables/useInterventions'
import { useTicketTimer } from '@/composables/useTicketTimer'
import { useAuthStore } from '../stores/auth'

const { isDark } = useTheme()
const authStore = useAuthStore()

// Debug: Check if useInterventions is working
console.log('=== IMPORTING INTERVENTIONS ===')
const interventionsComposable = useInterventions()
console.log('Interventions composable:', interventionsComposable)
const { fetchUserInterventions, getInterventionsForTicket } = interventionsComposable

// Timer functionality
const { startTimer, stopTimer, isTimerRunning, formatElapsedTime } = useTicketTimer()

// Timer state
const showTimeEntryModal = ref(false)
const timeEntryNote = ref('')
const recordedTime = ref(0)
const showFullDescription = ref(false)

// Manual intervention state
const showManualInterventionModal = ref(false)
const manualIntervention = ref({
  startTime: '',
  endTime: '',
  member: '',
  note: '',
  useDuration: false,
  duration: 0
})

// Comments state
const newComment = ref('')
const commentType = ref('message') // 'message' or 'email'
const sendingComment = ref(false)
const messagesKey = ref(0) // Key to force re-render of messages
const showInterventions = ref(false) // Control visibility of interventions list

// Followers state (internally intervinientes/contacts)
const ticketFollowers = ref([])
const availableUsers = ref([])
const availableContacts = ref([])
const selectedFollower = ref('')
const loadingFollowers = ref(false)
const showFollowersDropdown = ref(false)
const followersSearchTerm = ref('')

// Reminders state
const ticketReminders = ref([])
const showReminderModal = ref(false)
const newReminder = ref({
  title: '',
  date: '',
  assignedTo: '',
  description: '',
  sendEmail: false
})

// Timer methods
const handleTimerClick = (ticket) => {
  console.log('Timer click for ticket:', ticket.id)
  console.log('Is timer running?', isTimerRunning(ticket.id))
  
  if (isTimerRunning(ticket.id)) {
    // Stop timer and show save modal
    const elapsedSeconds = stopTimer(ticket.id)
    recordedTime.value = elapsedSeconds
    selectedTicket.value = ticket
    showTimeEntryModal.value = true
    console.log('Timer stopped, elapsed seconds:', elapsedSeconds)
  } else {
    // Start timer
    startTimer(ticket.id)
    console.log('Timer started for ticket:', ticket.id)
  }
}

const saveTimeEntry = async () => {
  let interventionId = null
  
  try {
    console.log('🚀 INICIANDO PROCESO DE CREACIÓN DE INTERVENCIÓN')
    console.log('='.repeat(60))
    
    // PASO 1: Crear intervención en BORRADOR
    console.log('📝 PASO 1: Creando intervención en borrador...')
    const interventionData = {
      socid: selectedTicket.value.fk_soc || ticketDetails.value?.fk_soc,
      datei: Math.floor(Date.now() / 1000),
      datee: Math.floor(Date.now() / 1000),
      description: timeEntryNote.value || 'Tiempo registrado desde cronómetro',
      duration: recordedTime.value || 0,
      fk_user_author: authStore.user?.id
      // Sin estado - crear en borrador por defecto
    }
    
    // Asignar proyecto - obligatorio para intervenciones
    if (selectedTicket.value.fk_project || ticketDetails.value?.fk_project) {
      interventionData.fk_project = selectedTicket.value.fk_project || ticketDetails.value.fk_project
    } else {
      // Si no hay proyecto en el ticket, usar proyecto por defecto (ID 1) o crear sin proyecto
      console.warn('⚠️ Ticket sin proyecto asignado, usando proyecto por defecto')
      interventionData.fk_project = 1 // Cambiar por el ID del proyecto por defecto de tu sistema
    }

    console.log('📋 Datos de intervención:', interventionData)
    
    let response
    try {
      response = await http.post('/api/doli/interventions', interventionData)
      console.log('📊 RESPUESTA COMPLETA DEL SERVIDOR:')
      console.log('   Response status:', response.status)
      console.log('   Response data:', response.data)
      console.log('   Response data type:', typeof response.data)
      console.log('   Response data keys:', response.data ? Object.keys(response.data) : 'No data')
      console.log('   Response headers:', response.headers)
    } catch (createError) {
      console.error('❌ ERROR AL CREAR INTERVENCIÓN:')
      console.error('   Error status:', createError.response?.status)
      console.error('   Error data:', createError.response?.data)
      console.error('   Error message:', createError.message)
      
      // Si falla por falta de proyecto, intentar sin proyecto
      if (createError.response?.data?.error?.message?.includes('fk_project')) {
        console.log('🔄 Reintentando sin proyecto...')
        try {
          const interventionDataNoProject = { ...interventionData }
          delete interventionDataNoProject.fk_project
          
          response = await http.post('/api/doli/interventions', interventionDataNoProject)
          console.log('✅ Intervención creada sin proyecto')
        } catch (secondError) {
          console.error('❌ También falló sin proyecto:', secondError.response?.data)
          throw createError // Lanzar el error original
        }
      } else {
        throw createError
      }
    }
    
    // Intentar extraer ID de diferentes formas
    interventionId = response.data?.id || response.data?.rowid || response.data
    
    console.log('✅ PASO 1 COMPLETADO - Intervención creada:')
    console.log('   ID extraído:', interventionId)
    console.log('   Tipo de ID:', typeof interventionId)
    console.log('   Ref:', response.data?.ref)
    console.log('   Status:', response.data?.statut || response.data?.status)
    console.log('-'.repeat(60))
    
    if (!interventionId || interventionId === null || interventionId === undefined) {
      console.error('❌ NO SE PUDO EXTRAER ID DE LA RESPUESTA')
      console.error('   Estructura de response.data:', Object.keys(response.data || {}))
      throw new Error('No se obtuvo ID de la intervención creada')
    }

    console.log('-'.repeat(60))

    // PASO 2: Agregar línea con nota y tiempo
    console.log('📋 PASO 2: Agregando línea a la intervención...')
    const startTime = Math.floor(Date.now() / 1000) - recordedTime.value
    const endTime = Math.floor(Date.now() / 1000)
    
    // Usar la estructura que funciona (alternativa 1)
    const lineData = {
      description: timeEntryNote.value || 'Tiempo registrado desde cronómetro',
      duration: recordedTime.value,
      date: startTime
    }
    
    console.log('📋 Datos de línea:', lineData)
    console.log('🕐 Hora inicio:', new Date(startTime * 1000).toLocaleString())
    console.log('🕐 Hora fin:', new Date(endTime * 1000).toLocaleString())
    console.log('⏱️ Duración:', recordedTime.value, 'segundos')
    
    try {
      const lineResponse = await http.post(`/api/doli/interventions/${interventionId}/lines`, lineData)
      console.log('✅ PASO 2 COMPLETADO - Línea agregada:')
      console.log('   Line ID:', lineResponse.data)
      console.log('   Descripción:', lineData.description)
      console.log('   Duración:', lineData.duration)
    } catch (lineError) {
      console.error('❌ PASO 2 FALLÓ - Error agregando línea:')
      console.error('   Error status:', lineError.response?.status)
      console.error('   Error data:', lineError.response?.data)
      console.error('   Error message:', lineError.message)
      throw lineError
    }
    console.log('-'.repeat(60))

    // PASO 3: Vincular intervención al ticket
    console.log('🔗 PASO 3: Vinculando intervención al ticket...')
    
    try {
      // ALTERNATIVA 1: Usar API nativa de Dolibarr objectlinks
      console.log('🔗 ALTERNATIVA 1: Intentando con API nativa objectlinks...')
      
      const objectLinksData = {
        fk_source: selectedTicket.value.id.toString(),
        sourcetype: "ticket",
        fk_target: interventionId.toString(),
        targettype: "fichinter"
      }
      
      console.log('🔗 Datos objectlinks:', objectLinksData)
      const linkResponse = await http.post(`/api/doli/objectlinks`, objectLinksData)
      console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con API nativa')
      console.log('   Link result:', linkResponse.data)
      
    } catch (objectLinksError) {
      console.warn('❌ ALTERNATIVA 1 FALLÓ - Intentando módulo personalizado...')
      console.warn('   ObjectLinks error status:', objectLinksError.response?.status)
      console.warn('   ObjectLinks error data:', objectLinksError.response?.data)
      
      // ALTERNATIVA 2: Usar módulo personalizado a través del proxy
      try {
        console.log('🔗 ALTERNATIVA 2: Usando módulo personalizado a través del proxy...')
        
        const customLinkResponse = await http.post(`/api/doli/dolibarmodernfrontendapi/link/${selectedTicket.value.id}/${interventionId}`)
        console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con módulo personalizado')
        console.log('   Custom link result:', customLinkResponse.data)
        
      } catch (customError) {
        console.error('❌ ALTERNATIVA 2 TAMBIÉN FALLÓ')
        console.error('   Custom error status:', customError.response?.status)
        console.error('   Custom error data:', customError.response?.data)
        console.error('   Custom error message:', customError.message)
        
        // ALTERNATIVA 3: Nota privada como último recurso
        try {
          console.log('🔗 ALTERNATIVA 3: Usando nota privada como último recurso...')
          
          const referenceData = {
            note_private: `[TICKET_LINK]\nTicket: ${selectedTicket.value.ref} (ID: ${selectedTicket.value.id})\nFecha: ${new Date().toLocaleString('es-ES')}\nDuración: ${Math.floor(recordedTime.value / 60)}m ${recordedTime.value % 60}s\nEstado: Vinculado automáticamente desde cronómetro\n[/TICKET_LINK]`
          }
          
          console.log('📋 Datos de referencia:', referenceData)
          const referenceResponse = await http.put(`/api/doli/interventions/${interventionId}`, referenceData)
          console.log('✅ PASO 3 COMPLETADO - Referencia añadida en nota privada')
          console.log('   Reference result:', referenceResponse.data)
          
        } catch (referenceError) {
          console.error('❌ TODAS LAS ALTERNATIVAS FALLARON')
          console.error('   Reference error:', referenceError.response?.data)
          throw new Error('Todas las alternativas de vinculación fallaron')
        }
      }
    }
    console.log('-'.repeat(60))

    // PASO 4: Validar la intervención
    console.log('🔍 PASO 4: Validando intervención...')
    
    const validateData = {
      notrigger: 1
    }
    
    console.log('🔍 Datos de validación:', validateData)
    
    try {
      const validateResponse = await http.post(`/api/doli/interventions/${interventionId}/validate`, validateData)
      console.log('✅ PASO 4 COMPLETADO - Intervención validada')
      console.log('   Validate result:', validateResponse.data)
    } catch (validateError) {
      console.warn('⚠️ PASO 4 FALLÓ - Error validando intervención')
      console.warn('   Validate error status:', validateError.response?.status)
      console.warn('   Validate error data:', validateError.response?.data)
      console.warn('   Validate error message:', validateError.message)
      console.log('💡 La intervención se creó y vinculó, pero no se pudo validar')
    }
    console.log('-'.repeat(60))
    
    // Reset modal state
    showTimeEntryModal.value = false
    timeEntryNote.value = ''
    recordedTime.value = 0
    
    // Refresh interventions
    if (authStore.user?.id) {
      await fetchUserInterventions(true)
    }
    
    console.log('🎉 PROCESO COMPLETADO EXITOSAMENTE')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('💥 ERROR GENERAL EN EL PROCESO:')
    console.error('   Intervention ID:', interventionId)
    console.error('   Error:', error.message)
    console.error('   Details:', error.response?.data)
    console.error('='.repeat(60))
    
    alert('Error al guardar la intervención: ' + (error.response?.data?.message || error.message))
  }
}

const cancelTimeEntry = () => {
  showTimeEntryModal.value = false
  timeEntryNote.value = ''
  recordedTime.value = 0
}

// Manual intervention methods
const openManualInterventionModal = () => {
  // Reset form
  manualIntervention.value = {
    startTime: '',
    endTime: '',
    member: authStore.user?.id || '',
    note: '',
    useDuration: false,
    duration: 0
  }
  showManualInterventionModal.value = true
}

const closeManualInterventionModal = () => {
  showManualInterventionModal.value = false
}

const toggleDurationMode = () => {
  manualIntervention.value.useDuration = !manualIntervention.value.useDuration
  if (manualIntervention.value.useDuration) {
    manualIntervention.value.startTime = ''
    manualIntervention.value.endTime = ''
  } else {
    manualIntervention.value.duration = 0
  }
}

const saveManualIntervention = async () => {
  let interventionId = null
  
  try {
    console.log('🚀 INICIANDO PROCESO DE CREACIÓN DE INTERVENCIÓN MANUAL')
    console.log('='.repeat(60))
    
    // PASO 1: Crear intervención en BORRADOR
    console.log('📝 PASO 1: Creando intervención manual en borrador...')
    
    let interventionData = {
      socid: selectedTicket.value.fk_soc || ticketDetails.value?.fk_soc,
      description: manualIntervention.value.note || 'Intervención manual',
      fk_user_author: manualIntervention.value.member || authStore.user?.id
      // Sin estado - crear en borrador por defecto
    }
    
    // Calculate duration and dates based on mode
    if (manualIntervention.value.useDuration) {
      // Use direct duration (convert minutes to seconds)
      interventionData.duration = manualIntervention.value.duration * 60
      interventionData.datei = Math.floor(Date.now() / 1000)
      interventionData.datee = Math.floor(Date.now() / 1000)
    } else {
      // Use start/end times
      const startTime = new Date(manualIntervention.value.startTime).getTime() / 1000
      const endTime = new Date(manualIntervention.value.endTime).getTime() / 1000
      interventionData.datei = startTime
      interventionData.datee = endTime
      interventionData.duration = endTime - startTime
    }
    
    // Asignar proyecto - obligatorio para intervenciones
    if (selectedTicket.value.fk_project || ticketDetails.value?.fk_project) {
      interventionData.fk_project = selectedTicket.value.fk_project || ticketDetails.value.fk_project
    } else {
      // Si no hay proyecto en el ticket, usar proyecto por defecto (ID 1) o crear sin proyecto
      console.warn('⚠️ Ticket sin proyecto asignado, usando proyecto por defecto')
      interventionData.fk_project = 1 // Cambiar por el ID del proyecto por defecto de tu sistema
    }

    console.log('📋 Datos de intervención manual:', interventionData)
    
    let response
    try {
      response = await http.post('/api/doli/interventions', interventionData)
      console.log('📊 RESPUESTA COMPLETA DEL SERVIDOR:')
      console.log('   Response status:', response.status)
      console.log('   Response data:', response.data)
      console.log('   Response data type:', typeof response.data)
      console.log('   Response data keys:', response.data ? Object.keys(response.data) : 'No data')
      console.log('   Response headers:', response.headers)
    } catch (createError) {
      console.error('❌ ERROR AL CREAR INTERVENCIÓN MANUAL:')
      console.error('   Error status:', createError.response?.status)
      console.error('   Error data:', createError.response?.data)
      console.error('   Error message:', createError.message)
      
      // Si falla por falta de proyecto, intentar sin proyecto
      if (createError.response?.data?.error?.message?.includes('fk_project')) {
        console.log('🔄 Reintentando sin proyecto...')
        try {
          const interventionDataNoProject = { ...interventionData }
          delete interventionDataNoProject.fk_project
          
          response = await http.post('/api/doli/interventions', interventionDataNoProject)
          console.log('✅ Intervención creada sin proyecto')
        } catch (retryError) {
          console.error('❌ Error en reintento:', retryError)
          throw retryError
        }
      } else {
        throw createError
      }
    }

    // Extraer ID de la respuesta
    if (response.data) {
      if (typeof response.data === 'string') {
        interventionId = response.data
      } else if (response.data.id) {
        interventionId = response.data.id
      } else if (typeof response.data === 'number') {
        interventionId = response.data
      }
    }

    console.log('🆔 ID de intervención extraído:', interventionId)

    if (!interventionId) {
      throw new Error('No se pudo obtener el ID de la intervención creada')
    }

    console.log('-'.repeat(60))

    // PASO 2: Agregar línea con nota y tiempo
    console.log('📋 PASO 2: Agregando línea a la intervención...')
    
    let startTime, endTime, duration
    
    if (manualIntervention.value.useDuration) {
      // Use direct duration (convert minutes to seconds)
      duration = manualIntervention.value.duration * 60
      endTime = Math.floor(Date.now() / 1000)
      startTime = endTime - duration
    } else {
      // Use start/end times
      startTime = Math.floor(new Date(manualIntervention.value.startTime).getTime() / 1000)
      endTime = Math.floor(new Date(manualIntervention.value.endTime).getTime() / 1000)
      duration = endTime - startTime
    }
    
    const lineData = {
      description: manualIntervention.value.note || 'Intervención manual',
      duration: duration,
      date: startTime
    }
    
    console.log('📋 Datos de línea:', lineData)
    console.log('🕐 Hora inicio:', new Date(startTime * 1000).toLocaleString())
    console.log('🕐 Hora fin:', new Date(endTime * 1000).toLocaleString())
    console.log('⏱️ Duración:', duration, 'segundos')
    
    try {
      const lineResponse = await http.post(`/api/doli/interventions/${interventionId}/lines`, lineData)
      console.log('✅ PASO 2 COMPLETADO - Línea agregada:')
      console.log('   Line ID:', lineResponse.data)
      console.log('   Descripción:', lineData.description)
      console.log('   Duración:', lineData.duration)
    } catch (lineError) {
      console.error('❌ PASO 2 FALLÓ - Error agregando línea:')
      console.error('   Error status:', lineError.response?.status)
      console.error('   Error data:', lineError.response?.data)
      console.error('   Error message:', lineError.message)
      throw lineError
    }
    console.log('-'.repeat(60))

    // PASO 3: Vincular intervención al ticket (igual que el timer)
    console.log('🔗 PASO 3: Vinculando intervención al ticket...')
    
    try {
      // ALTERNATIVA 1: Usar API nativa de Dolibarr objectlinks
      console.log('🔗 ALTERNATIVA 1: Intentando con API nativa objectlinks...')
      
      const objectLinksData = {
        fk_source: (selectedTicket.value.id || ticketDetails.value.id).toString(),
        sourcetype: "ticket",
        fk_target: interventionId.toString(),
        targettype: "fichinter"
      }
      
      console.log('🔗 Datos objectlinks:', objectLinksData)
      const linkResponse = await http.post(`/api/doli/objectlinks`, objectLinksData)
      console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con API nativa')
      console.log('   Link result:', linkResponse.data)
      
    } catch (objectLinksError) {
      console.warn('❌ ALTERNATIVA 1 FALLÓ - Intentando módulo personalizado...')
      console.warn('   ObjectLinks error status:', objectLinksError.response?.status)
      console.warn('   ObjectLinks error data:', objectLinksError.response?.data)
      
      // ALTERNATIVA 2: Usar módulo personalizado a través del proxy
      try {
        console.log('🔗 ALTERNATIVA 2: Usando módulo personalizado a través del proxy...')
        
        const ticketId = selectedTicket.value.id || ticketDetails.value.id
        const customLinkResponse = await http.post(`/api/doli/dolibarmodernfrontendapi/link/${ticketId}/${interventionId}`)
        console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con módulo personalizado')
        console.log('   Custom link result:', customLinkResponse.data)
        
      } catch (customError) {
        console.error('❌ ALTERNATIVA 2 TAMBIÉN FALLÓ')
        console.error('   Custom error status:', customError.response?.status)
        console.error('   Custom error data:', customError.response?.data)
        console.error('   Custom error message:', customError.message)
        
        // ALTERNATIVA 3: Nota privada como último recurso
        try {
          console.log('🔗 ALTERNATIVA 3: Usando nota privada como último recurso...')
          
          const referenceData = {
            note_private: `[TICKET_LINK]\nTicket: ${selectedTicket.value.ref || ticketDetails.value.ref} (ID: ${selectedTicket.value.id || ticketDetails.value.id})\nFecha: ${new Date().toLocaleString('es-ES')}\nTipo: Intervención manual\nEstado: Vinculado automáticamente desde formulario manual\n[/TICKET_LINK]`
          }
          
          console.log('📋 Datos de referencia:', referenceData)
          const referenceResponse = await http.put(`/api/doli/interventions/${interventionId}`, referenceData)
          console.log('✅ PASO 3 COMPLETADO - Referencia añadida en nota privada')
          console.log('   Reference result:', referenceResponse.data)
          
        } catch (referenceError) {
          console.error('❌ TODAS LAS ALTERNATIVAS FALLARON')
          console.error('   Reference error:', referenceError.response?.data)
          console.warn('⚠️ La intervención se creó pero no se pudo vincular al ticket')
        }
      }
    }
    console.log('-'.repeat(60))

    // PASO 4: Validar la intervención
    console.log('🔍 PASO 4: Validando intervención...')
    
    const validateData = {
      notrigger: 1
    }
    
    console.log('🔍 Datos de validación:', validateData)
    
    try {
      const validateResponse = await http.post(`/api/doli/interventions/${interventionId}/validate`, validateData)
      console.log('✅ PASO 4 COMPLETADO - Intervención validada')
      console.log('   Validate result:', validateResponse.data)
    } catch (validateError) {
      console.warn('⚠️ PASO 4 FALLÓ - Error validando intervención')
      console.warn('   Validate error status:', validateError.response?.status)
      console.warn('   Validate error data:', validateError.response?.data)
      console.warn('   Validate error message:', validateError.message)
      console.log('💡 La intervención se creó y vinculó, pero no se pudo validar')
    }
    console.log('-'.repeat(60))

    // PASO 5: Cerrar modal y actualizar datos
    console.log('🔄 PASO 5: Actualizando interfaz...')
    closeManualInterventionModal()

    // Refrescar intervenciones del usuario (igual que el timer)
    if (authStore.user?.id) {
      try {
        await fetchUserInterventions(true)
        console.log('✅ Intervenciones del usuario refrescadas')
      } catch (error) {
        console.warn('Error al refrescar intervenciones del usuario:', error)
      }
    }
    
    // Forzar actualización de las intervenciones del ticket actual
    try {
      console.log('🔄 Forzando actualización de intervenciones para el ticket actual...')
      // Trigger reactivity by accessing the computed property
      const currentInterventions = userInterventionsForTicket.value
      console.log('📋 Intervenciones actuales del ticket:', currentInterventions.length)
    } catch (error) {
      console.warn('Error al actualizar intervenciones del ticket:', error)
    }

    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ ERROR GENERAL EN CREACIÓN DE INTERVENCIÓN MANUAL:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    
    alert('Error al crear la intervención manual: ' + (error.response?.data?.message || error.message))
  }
}

// Comments methods
const clearComment = () => {
  newComment.value = ''
}

const toggleInterventions = () => {
  showInterventions.value = !showInterventions.value
}

// Reminders methods
const closeReminderModal = () => {
  showReminderModal.value = false
  newReminder.value = {
    title: '',
    date: '',
    assignedTo: '',
    description: '',
    sendEmail: false
  }
}

const createReminder = async () => {
  try {
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    
    const reminderData = {
      ticket_id: ticketId,
      title: newReminder.value.description.substring(0, 50) + '...', // Título basado en descripción
      date: newReminder.value.date,
      assigned_to: newReminder.value.assignedTo,
      description: newReminder.value.description,
      send_email: newReminder.value.sendEmail
    }
    
    console.log('📝 Creando recordatorio:', reminderData)
    
    // Aquí iría la llamada a la API para crear el recordatorio
    // const response = await http.post('/api/doli/reminders', reminderData)
    
    // Por ahora, agregamos el recordatorio localmente
    const newReminderItem = {
      id: Date.now(), // ID temporal
      title: reminderData.description.substring(0, 50) + (reminderData.description.length > 50 ? '...' : ''),
      date: reminderData.date,
      assignedTo: reminderData.assigned_to,
      description: reminderData.description,
      status: 'active'
    }
    
    ticketReminders.value.push(newReminderItem)
    
    console.log('✅ Recordatorio creado exitosamente')
    closeReminderModal()
    
  } catch (error) {
    console.error('❌ Error creando recordatorio:', error)
    alert('Error al crear recordatorio: ' + (error.response?.data?.message || error.message))
  }
}

const deleteReminder = async (reminderId) => {
  try {
    console.log('🗑️ Eliminando recordatorio:', reminderId)
    
    // Aquí iría la llamada a la API para eliminar el recordatorio
    // await http.delete(`/api/doli/reminders/${reminderId}`)
    
    // Por ahora, eliminamos localmente
    ticketReminders.value = ticketReminders.value.filter(reminder => reminder.id !== reminderId)
    
    console.log('✅ Recordatorio eliminado exitosamente')
    
  } catch (error) {
    console.error('❌ Error eliminando recordatorio:', error)
    alert('Error al eliminar recordatorio: ' + (error.response?.data?.message || error.message))
  }
}

// Followers search methods
const selectFollower = (value, displayText) => {
  selectedFollower.value = value
  followersSearchTerm.value = displayText
  showFollowersDropdown.value = false
}

// Assignment search methods
const selectAssignedUser = (userId, displayText) => {
  selectedAssignedUserId.value = userId
  assignmentSearchTerm.value = displayText
  showAssignmentDropdown.value = false
}

// Followers methods (internally fetches intervinientes/contacts)
const fetchTicketFollowers = async (ticketId) => {
  try {
    console.log('🔍 Obteniendo intervinientes del ticket con endpoint personalizado:', ticketId)
    const response = await http.get(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/contacts`)
    ticketFollowers.value = response.data || []
    console.log('✅ Intervinientes obtenidos del endpoint personalizado:', ticketFollowers.value.length)
    if (ticketFollowers.value.length > 0) {
      console.log('📋 Primer interviniente:', ticketFollowers.value[0])
    }
  } catch (error) {
    console.warn('⚠️ Error obteniendo intervinientes del endpoint personalizado:', error)
    console.warn('⚠️ Error details:', error.response?.data)
    ticketFollowers.value = []
  }
}

const fetchAvailableUsers = async () => {
  try {
    console.log('🔍 Obteniendo usuarios activos de Dolibarr...')
    const response = await http.get('/api/doli/users?limit=100&active=1')
    availableUsers.value = response.data || []
    console.log('✅ Usuarios activos obtenidos:', availableUsers.value.length)
    if (availableUsers.value.length > 0) {
      console.log('📋 Primer usuario:', availableUsers.value[0])
    }
  } catch (error) {
    console.warn('⚠️ Error obteniendo usuarios:', error)
    availableUsers.value = []
  }
}

const fetchAvailableContacts = async (socid) => {
  if (!socid) {
    availableContacts.value = []
    return
  }
  
  try {
    console.log('🔍 Obteniendo contactos del tercero con filtro SQL:', socid)
    console.log('📤 URL:', `/api/doli/contacts?sqlfilters=(fk_soc:=:${socid})&limit=100`)
    const response = await http.get(`/api/doli/contacts?sqlfilters=(fk_soc:=:${socid})&limit=100`)
    availableContacts.value = response.data || []
    console.log('✅ Contactos obtenidos con filtro SQL:', availableContacts.value.length)
    if (availableContacts.value.length > 0) {
      console.log('📋 Primer contacto:', availableContacts.value[0])
    }
  } catch (error) {
    console.warn('⚠️ Error obteniendo contactos:', error)
    console.warn('⚠️ Error details:', error.response?.data)
    availableContacts.value = []
  }
}

const addFollower = async () => {
  if (!selectedFollower.value || loadingFollowers.value) return
  
  loadingFollowers.value = true
  
  try {
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    const [type, id] = selectedFollower.value.split(':')
    
    console.log('➕ Agregando seguidor:', { type, id, ticketId })
    
    const response = await http.post(`/api/doli/tickets/${ticketId}/contacts`, {
      contactid: id,
      type: type // 'user' or 'contact'
    })
    
    console.log('✅ Seguidor agregado:', response.data)
    
    // Refresh followers list
    await fetchTicketFollowers(ticketId)
    
    // Reset selection
    selectedFollower.value = ''
    followersSearchTerm.value = ''
    
  } catch (error) {
    console.error('❌ Error agregando seguidor:', error)
    alert('Error al agregar seguidor: ' + (error.response?.data?.message || error.message))
  } finally {
    loadingFollowers.value = false
  }
}

const removeFollower = async (followerId, followerType) => {
  if (loadingFollowers.value) return
  
  loadingFollowers.value = true
  
  try {
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    
    console.log('➖ Eliminando seguidor:', { followerId, followerType, ticketId })
    
    await http.delete(`/api/doli/tickets/${ticketId}/contacts/${followerId}`)
    
    console.log('✅ Seguidor eliminado')
    
    // Refresh followers list
    await fetchTicketFollowers(ticketId)
    
  } catch (error) {
    console.error('❌ Error eliminando seguidor:', error)
    alert('Error al eliminar seguidor: ' + (error.response?.data?.message || error.message))
  } finally {
    loadingFollowers.value = false
  }
}

// Company methods
const fetchCompanyInfo = async (socid) => {
  if (!socid) {
    currentCompany.value = null
    return
  }
  
  try {
    console.log('🔍 Obteniendo información de la empresa:', socid)
    const response = await http.get(`/api/doli/thirdparties/${socid}`)
    currentCompany.value = response.data
    console.log('✅ Empresa obtenida:', currentCompany.value?.name)
  } catch (error) {
    console.warn('⚠️ Error obteniendo empresa:', error)
    currentCompany.value = null
  }
}

const sendComment = async () => {
  if (!newComment.value.trim() || sendingComment.value) {
    return
  }

  sendingComment.value = true

  try {
    // Obtener el track_id del ticket
    const trackId = selectedTicket.value?.track_id || ticketDetails.value?.track_id
    
    if (!trackId) {
      throw new Error('No se encontró el track_id del ticket')
    }

    console.log('💬 Enviando comentario:', {
      type: commentType.value,
      message: newComment.value,
      track_id: trackId
    })

    // Preparar datos según el endpoint de Dolibarr
    const commentData = {
      track_id: trackId,
      message: newComment.value.trim(),
      private: commentType.value === 'email' ? 0 : 1  // 0 = email, 1 = mensaje interno
    }

    console.log('📤 Endpoint: /api/doli/tickets/newmessage')
    console.log('📋 Datos del comentario:', commentData)

    const response = await http.post('/api/doli/tickets/newmessage', commentData)
    console.log('✅ Comentario enviado:', response.data)

    // Limpiar formulario
    newComment.value = ''
    
    // Refrescar detalles del ticket para mostrar el nuevo comentario
    try {
      const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
      if (ticketId) {
        console.log('🔄 Refrescando detalles del ticket...')
        const response = await http.get(`/api/doli/tickets/${ticketId}`)
        ticketDetails.value = response.data
        
        // Intentar obtener mensajes actualizados
        console.log('🔄 Refrescando mensajes del ticket...')
        console.log('📋 Estructura del ticket response:', Object.keys(response.data))
        console.log('📋 Mensajes en response.data.messages:', response.data.messages)
        
        let messages = []
        
        // Method 1: Check if messages are in the ticket response
        if (response.data.messages && Array.isArray(response.data.messages)) {
          messages = response.data.messages
          console.log('✅ Mensajes obtenidos del ticket response:', messages.length)
          console.log('📋 Primer mensaje:', messages[0])
        } else {
          console.log('⚠️ No hay mensajes en response.data.messages')
        }
        
        // Method 2: Los mensajes ya están en el ticket response, no hay endpoint GET separado
        console.log('ℹ️ Usando solo mensajes del ticket response (no hay endpoint GET para mensajes)')
        
        // Method 3: Force refresh - try agendaevents
        try {
          console.log('🔄 Intentando endpoint agendaevents...')
          const agendaResponse = await http.get(`/api/doli/agendaevents?elementtype=ticket&elementid=${ticketId}`)
          console.log('📋 Agenda events response:', agendaResponse.data)
          
          if (agendaResponse.data && Array.isArray(agendaResponse.data) && agendaResponse.data.length > 0) {
            console.log('📋 Eventos de agenda encontrados:', agendaResponse.data.length)
            // If we have agenda events, they might be the messages
            if (messages.length === 0) {
              messages = agendaResponse.data
              console.log('✅ Usando eventos de agenda como mensajes')
            }
          }
        } catch (agendaErr) {
          console.warn('⚠️ Agenda events endpoint failed:', agendaErr)
        }
        
        // Update messages in ticketDetails
        console.log('🔄 Actualizando ticketDetails.messages...')
        console.log('📋 Mensajes antes:', ticketDetails.value?.messages?.length || 0)
        
        if (ticketDetails.value) {
          // Simple update - just update messages and force re-render of comments section
          console.log('🔄 Actualizando solo la sección de comentarios...')
          
          // Update messages directly
          ticketDetails.value.messages = [...messages]
          
          console.log('📋 Mensajes después:', ticketDetails.value.messages?.length || 0)
          
          // Log the last few messages to verify they're there
          const lastMessages = ticketDetails.value.messages.slice(-3)
          console.log('📋 Últimos 3 mensajes:', lastMessages.map(m => ({ id: m.id, message: m.message })))
          
          // Force re-render ONLY of the comments section by updating key
          messagesKey.value++
          console.log('🔄 Actualizando messagesKey a:', messagesKey.value, '(solo sección comentarios)')
          
          await nextTick()
          console.log('✅ Sección de comentarios actualizada')
        }
        
        console.log('✅ Detalles del ticket refrescados con', messages.length, 'mensajes')
      }
    } catch (refreshError) {
      console.warn('⚠️ Error al refrescar detalles del ticket:', refreshError)
      // No lanzar error, el comentario ya se envió correctamente
    }

    console.log(`✅ Comentario ${commentType.value === 'email' ? 'enviado por email' : 'guardado como mensaje interno'} correctamente`)

  } catch (error) {
    console.error('❌ Error enviando comentario:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    console.error('❌ Error message:', error.message)
    
    let errorMessage = 'Error al enviar el comentario'
    
    // Manejo específico de errores
    if (error.message === 'No se encontró el track_id del ticket') {
      errorMessage = 'Error: No se pudo obtener el identificador del ticket. Intenta recargar la página.'
    } else if (error.response?.status === 404) {
      errorMessage = 'Error: Endpoint no encontrado. Verifica la configuración de la API.'
    } else if (error.response?.status === 400) {
      errorMessage = 'Error: Datos inválidos. Verifica el track_id del ticket.'
    } else if (error.response?.data?.message) {
      errorMessage += ': ' + error.response.data.message
    } else if (error.message) {
      errorMessage += ': ' + error.message
    }
    
    alert(errorMessage)
  } finally {
    sendingComment.value = false
  }
}
console.log('fetchUserInterventions:', fetchUserInterventions)
console.log('getInterventionsForTicket:', getInterventionsForTicket)

const tickets = ref([])
const loading = ref(false)

// Ticket metrics
const ticketMetrics = ref({
  open: 0,
  inProgress: 0,
  pending: 0,
  awaiting: 0,
  closed: 0,
  myOpen: 0,
  myInProgress: 0,
  myPending: 0,
  myAwaiting: 0,
  myClosed: 0
})

// User filter - show only user's tickets by default
const showOnlyMyTickets = ref(true)

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Terceros and Users search
const terceros = ref([])
const users = ref([])
const terceroSearch = ref('')
const userSearch = ref('')
const selectedTercero = ref(null)
const selectedUser = ref(null)
const showTerceroDropdown = ref(false)
const showUserDropdown = ref(false)
const filteredTerceros = ref([])
const filteredUsers = ref([])

// Project management
const editingProject = ref(false)
const selectedProjectId = ref('')
const availableProjects = ref([])
const currentProject = ref(null)

// Company management
const currentCompany = ref(null)

// User assignment management
const editingAssignment = ref(false)
const selectedAssignedUserId = ref('')
const currentAssignedUser = ref(null)
const showAssignmentDropdown = ref(false)
const assignmentSearchTerm = ref('')

// File upload management
const isDragOver = ref(false)
const uploadingFiles = ref(false)
const uploadProgress = ref(0)
const ticketDocuments = ref([])
const fileInputRef = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(50)

// Sorting
const sortField = ref('')
const sortDirection = ref('asc')

// Modal state
const showModal = ref(false)
const selectedTicket = ref(null)
const ticketDetails = ref(null)

// Computed property for available followers (users + contacts)
const availableFollowersCount = computed(() => {
  const usersCount = availableUsers.value?.length || 0
  const contactsCount = availableContacts.value?.length || 0
  return { users: usersCount, contacts: contactsCount, total: usersCount + contactsCount }
})

// Computed property for filtered followers
const filteredFollowers = computed(() => {
  const searchTerm = followersSearchTerm.value.toLowerCase()
  
  const filteredUsers = availableUsers.value.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase()
    return fullName.includes(searchTerm)
  })
  
  const filteredContacts = availableContacts.value.filter(contact => {
    const fullName = `${contact.firstname} ${contact.lastname}`.toLowerCase()
    return fullName.includes(searchTerm)
  })
  
  return { users: filteredUsers, contacts: filteredContacts }
})

// Computed property for filtered assignment users
const filteredAssignmentUsers = computed(() => {
  const searchTerm = assignmentSearchTerm.value.toLowerCase()
  
  return availableUsers.value.filter(user => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase()
    return fullName.includes(searchTerm)
  })
})

// Computed property for user interventions for the selected ticket
const userInterventionsForTicket = computed(() => {
  if (!selectedTicket.value?.id) {
    return []
  }
  
  const interventions = getInterventionsForTicket(selectedTicket.value.id)
  return interventions
})

const loadingDetails = ref(false)

const fetchTickets = async () => {
  console.log('🎫 Fetching tickets...')
  loading.value = true
  try {
    const response = await http.get('/api/doli/tickets')
    console.log('✅ Tickets loaded:', response.data?.length || 0, 'tickets')
    const ticketsData = response.data || []
    
    // Enrich tickets with tercero names and assigned user names using cached data
    tickets.value = ticketsData.map(ticket => {
      // Enrich with tercero name
      if (ticket.fk_soc && terceros.value.length > 0) {
        const tercero = terceros.value.find(t => t.id == ticket.fk_soc)
        if (tercero) {
          ticket.thirdparty_name = tercero.name
        }
      }
      
      // Enrich with assigned user name
      if (ticket.fk_user_assign && users.value.length > 0) {
        const user = users.value.find(u => u.id == ticket.fk_user_assign)
        if (user) {
          ticket.assigned_to = `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.login
        }
      }
      
      return ticket
    })
    
    // Calculate metrics after loading tickets
    calculateTicketMetrics()
    console.log('✅ Tickets and metrics updated successfully')
  } catch (error) {
    console.error('❌ Error fetching tickets:', error)
    console.error('❌ Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

// Function to calculate ticket metrics
const calculateTicketMetrics = () => {
  const currentUserId = authStore.user?.id
  
  // Reset metrics
  ticketMetrics.value = {
    open: 0,
    inProgress: 0,
    pending: 0,
    awaiting: 0,
    closed: 0,
    myOpen: 0,
    myInProgress: 0,
    myPending: 0,
    myAwaiting: 0,
    myClosed: 0
  }
  
  tickets.value.forEach(ticket => {
    const status = parseInt(ticket.fk_statut) || 0
    const isMyTicket = ticket.fk_user_assign == currentUserId
    const hasAssignedUser = ticket.fk_user_assign && ticket.fk_user_assign != '0'
    
    // Map Dolibarr ticket statuses to our categories
    switch (status) {
      case 0: // Not read
      case 1: // Read
        // Si tiene usuario asignado, considerarlo "In Progress" (Asignado)
        if (hasAssignedUser) {
          ticketMetrics.value.inProgress++
          if (isMyTicket) ticketMetrics.value.myInProgress++
        } else {
          ticketMetrics.value.open++
          if (isMyTicket) ticketMetrics.value.myOpen++
        }
        break
      case 2: // Assigned
      case 3: // In progress
        ticketMetrics.value.inProgress++
        if (isMyTicket) ticketMetrics.value.myInProgress++
        break
      case 4: // Need more info
      case 5: // Need more info (customer)
        ticketMetrics.value.pending++
        if (isMyTicket) ticketMetrics.value.myPending++
        break
      case 6: // Waiting
        ticketMetrics.value.awaiting++
        if (isMyTicket) ticketMetrics.value.myAwaiting++
        break
      case 7: // Solved
      case 8: // Closed
      case 9: // Cancelled
        ticketMetrics.value.closed++
        if (isMyTicket) ticketMetrics.value.myClosed++
        break
      default:
        // Estado desconocido: si tiene usuario asignado → "Asignado", sino → "Open"
        if (hasAssignedUser) {
          ticketMetrics.value.inProgress++
          if (isMyTicket) ticketMetrics.value.myInProgress++
        } else {
          ticketMetrics.value.open++
          if (isMyTicket) ticketMetrics.value.myOpen++
        }
    }
  })
}

const fetchTerceros = async () => {
  try {
    const response = await http.get('/api/doli/thirdparties?limit=1000&status=1')
    terceros.value = response.data || []
  } catch (error) {
    console.error('Error fetching terceros:', error)
  }
}

const fetchUsers = async () => {
  try {
    console.log('🔍 Fetching ticket details for ID:', ticket.id)
    const response = await http.get(`/api/doli/tickets/${ticket.id}`)
    console.log('✅ Ticket details response:', response)
    ticketDetails.value = response.data
  } catch (error) {
    console.error('❌ Error fetching ticket details:', error)
    console.error('Error details:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error config:', error.config)
  } finally {
    loadingDetails.value = false
  }
}

const searchTerceros = () => {
  if (terceroSearch.value.length < 2) {
    filteredTerceros.value = []
    return
  }
  
  const query = terceroSearch.value.toLowerCase()
  filteredTerceros.value = terceros.value.filter(tercero => 
    tercero.name?.toLowerCase().includes(query) ||
    tercero.email?.toLowerCase().includes(query)
  ).slice(0, 10)
}

const searchUsers = () => {
  if (userSearch.value.length < 2) {
    filteredUsers.value = []
    return
  }
  
  const query = userSearch.value.toLowerCase()
  filteredUsers.value = users.value.filter(user => 
    user.firstname?.toLowerCase().includes(query) ||
    user.lastname?.toLowerCase().includes(query) ||
    user.login?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  ).slice(0, 10)
}

const selectTercero = (tercero) => {
  selectedTercero.value = tercero
  terceroSearch.value = tercero.name
  showTerceroDropdown.value = false
  applyFilters()
}

const selectUser = (user) => {
  selectedUser.value = user
  userSearch.value = `${user.firstname} ${user.lastname}`
  showUserDropdown.value = false
  applyFilters()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  terceroSearch.value = ''
  userSearch.value = ''
  selectedTercero.value = null
  selectedUser.value = null
  showTerceroDropdown.value = false
  showUserDropdown.value = false
  filteredTerceros.value = []
  filteredUsers.value = []
  // Keep showOnlyMyTickets as true by default
  showOnlyMyTickets.value = true
  applyFilters()
}

// Computed properties for filtering and pagination
const filteredTickets = computed(() => {
  let filtered = [...tickets.value]

  // Filter by user assignment - show only tickets assigned to current user
  if (showOnlyMyTickets.value && authStore.user) {
    filtered = filtered.filter(ticket => 
      ticket.fk_user_assign == authStore.user.id
    )
  }

  // Filtrar tickets cerrados por defecto (a menos que se especifique mostrar todos)
  if (statusFilter.value !== 'show_all' && statusFilter.value !== '8') {
    filtered = filtered.filter(ticket => ticket.fk_statut !== '8')
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ticket => 
      ticket.ref?.toLowerCase().includes(query) ||
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.thirdparty_name?.toLowerCase().includes(query)
    )
  }
  
  // Apply tercero filter
  if (selectedTercero.value) {
    filtered = filtered.filter(ticket => 
      ticket.fk_soc == selectedTercero.value.id
    )
  }
  
  // Apply user filter
  if (selectedUser.value) {
    filtered = filtered.filter(ticket => 
      ticket.fk_user_assign == selectedUser.value.id
    )
  }

  // Apply status filter
  if (statusFilter.value && statusFilter.value !== 'show_all') {
    filtered = filtered.filter(ticket => ticket.fk_statut === statusFilter.value)
  }

  // Apply priority filter
  if (priorityFilter.value) {
    filtered = filtered.filter(ticket => ticket.severity === priorityFilter.value)
  }

  // Apply sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]

      // Handle date sorting
      if (sortField.value === 'datec') {
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

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage.value))

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTickets.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredTickets.value.length))

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

// Computed property for total registered time
const totalRegisteredTime = computed(() => {
  if (!ticketInterventions.value || ticketInterventions.value.length === 0) {
    return '0h 0m'
  }
  
  const totalSeconds = ticketInterventions.value.reduce((total, intervention) => {
    // Sumar duración de todas las líneas de la intervención
    if (intervention.lines && Array.isArray(intervention.lines)) {
      return total + intervention.lines.reduce((lineTotal, line) => {
        return lineTotal + (parseInt(line.duration) || 0)
      }, 0)
    }
    return total + (parseInt(intervention.duration) || 0)
  }, 0)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
})

// Computed property for ticket interventions
const ticketInterventions = computed(() => {
  if (!selectedTicket.value?.id) {
    return []
  }
  return getInterventionsForTicket(selectedTicket.value.id)
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
const viewTicketDetails = async (ticket) => {
  selectedTicket.value = ticket
  ticketDetails.value = null
  loading.value = true
  showModal.value = true
  showFullDescription.value = false // Reset description state
  
  // Refrescar intervenciones del usuario si es necesario
  if (authStore.user && authStore.user.id) {
    try {
      await refreshIfNeeded(authStore.user.id)
    } catch (error) {
      console.warn('Error al refrescar intervenciones del usuario:', error)
    }
  }
  
  try {
    console.log('🔍 Fetching ticket details for ID:', ticket.id)
    // Fetch detailed ticket information
    const response = await http.get(`/api/doli/tickets/${ticket.id}`)
    console.log('✅ Ticket details response:', response)
    ticketDetails.value = response.data
    
    // Load followers, users/contacts, and company info
    await Promise.all([
      fetchTicketFollowers(ticket.id),
      fetchAvailableUsers(),
      fetchAvailableContacts(response.data.fk_soc),
      fetchCompanyInfo(response.data.fk_soc)
    ])
    
    // Log summary of loaded data
    console.log('📊 Resumen de datos cargados para intervinientes:')
    console.log(`   - Usuarios activos: ${availableUsers.value.length}`)
    console.log(`   - Contactos de empresa (${response.data.fk_soc}): ${availableContacts.value.length}`)
    console.log(`   - Intervinientes actuales: ${ticketFollowers.value.length}`)
    console.log(`   - Empresa: ${currentCompany.value?.name || 'No encontrada'}`)
    
    // Try multiple methods to get interventions/messages for this ticket
    let interventions = []
    
    // Method 1: Check if messages are in the ticket response
    if (response.data.messages && Array.isArray(response.data.messages)) {
      interventions = response.data.messages
    }
    
    // Method 2: Try the messages endpoint
    if (interventions.length === 0) {
      try {
        const messagesResponse = await http.get(`/api/doli/tickets/${ticket.id}/messages`)
        if (messagesResponse.data && Array.isArray(messagesResponse.data)) {
          interventions = messagesResponse.data
        }
      } catch (err) {
        console.warn('Messages endpoint failed:', err)
      }
    }
    
    // Method 3: Try using objectlinks to find related interventions
    if (interventions.length === 0) {
      try {
        const objectlinksResponse = await http.get(`/api/doli/tickets/${ticket.id}/objectlinks`)
        
        // Look for linked interventions or actioncomm objects
        if (objectlinksResponse.data && Array.isArray(objectlinksResponse.data)) {
          const interventionLinks = objectlinksResponse.data.filter(link => 
            link.objecttype === 'actioncomm' || link.objecttype === 'intervention'
          )
          
          // Fetch each intervention
          for (const link of interventionLinks) {
            try {
              const interventionResponse = await http.get(`/api/doli/agendaevents/${link.objectid}`)
              if (interventionResponse.data) {
                interventions.push(interventionResponse.data)
              }
            } catch (interventionErr) {
              console.warn(`Failed to fetch intervention ${link.objectid}:`, interventionErr)
            }
          }
        }
      } catch (err) {
        console.warn('Objectlinks endpoint failed:', err)
      }
    }
    
    // Method 4: Try agendaevents with ticket filter
    if (interventions.length === 0) {
      try {
        const agendaResponse = await http.get(`/api/doli/agendaevents?elementtype=ticket&elementid=${ticket.id}`)
        if (agendaResponse.data && Array.isArray(agendaResponse.data)) {
          interventions = agendaResponse.data
        }
      } catch (err) {
        console.warn('Agenda events endpoint failed:', err)
      }
    }
    
    // Method 5: Try fichinter (interventions) and filter client-side by linkedObjectsIds
    if (interventions.length === 0) {
      try {
        // Get all recent interventions and filter client-side
        const interventionsResponse = await http.get(`/api/doli/fichinter?limit=100&sortfield=datec&sortorder=DESC`)
        if (interventionsResponse.data && Array.isArray(interventionsResponse.data)) {
          // Filter client-side for interventions linked to this ticket
          const linkedInterventions = interventionsResponse.data.filter(intervention => {
            return intervention.linkedObjectsIds && 
                   intervention.linkedObjectsIds.ticket && 
                   Object.values(intervention.linkedObjectsIds.ticket).includes(ticket.id.toString())
          })
          interventions = linkedInterventions
        }
      } catch (err) {
        console.warn('Fichinter endpoint failed:', err)
      }
    }
    
    ticketDetails.value.messages = interventions
    
    // Fetch third party information if fk_soc exists
    if (ticketDetails.value.fk_soc) {
      try {
        const thirdPartyResponse = await http.get(`/api/doli/thirdparties/${ticketDetails.value.fk_soc}`)
        ticketDetails.value.thirdparty_info = thirdPartyResponse.data
      } catch (thirdPartyError) {
        console.error('Error fetching third party details:', thirdPartyError)
        ticketDetails.value.thirdparty_info = null
      }
    }
  } catch (error) {
    console.error('❌ Error fetching ticket details:', error)
    console.error('Error status:', error.response?.status)
    console.error('Error data:', error.response?.data)
    console.error('Request URL:', error.config?.url)
    ticketDetails.value = ticket // Fallback to basic ticket data
    ticketDetails.value.messages = []
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = async () => {
  try {
    console.log('🔒 Closing ticket modal...')
    showModal.value = false
    selectedTicket.value = null
    ticketDetails.value = null
    loadingDetails.value = false
    
    // Force refresh tickets after closing modal
    console.log('🔄 Refreshing tickets after modal close...')
    await nextTick() // Wait for DOM updates
    await fetchTickets()
    console.log('✅ Modal closed and tickets refreshed successfully')
  } catch (error) {
    console.error('❌ Error closing modal:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

const getStatusText = (status, ticket = null) => {
  const statuses = {
    '0': 'Borrador',
    '1': 'Abierto',
    '4': 'Asignado',
    '5': 'En progreso',
    '8': 'Cerrado',
    '9': 'Cancelado'
  }
  
  // Si el estado no está definido pero tiene usuario asignado, mostrar "Asignado"
  if (!statuses[status] && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'Asignado'
  }
  
  // Para estados 0 y 1, si tiene usuario asignado, mostrar "Asignado"
  if ((status === '0' || status === '1') && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'Asignado'
  }
  
  return statuses[status] || 'Desconocido'
}

const getStatusClass = (status, ticket = null) => {
  const classes = {
    '0': 'bg-gray-600 text-gray-200',
    '1': 'bg-blue-600 text-blue-100',
    '4': 'bg-yellow-600 text-yellow-100',
    '5': 'bg-purple-600 text-purple-100',
    '8': 'bg-green-600 text-green-100',
    '9': 'bg-red-600 text-red-100'
  }
  
  // Si el estado no está definido pero tiene usuario asignado, usar estilo de "Asignado"
  if (!classes[status] && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'bg-yellow-600 text-yellow-100' // Mismo estilo que "Asignado"
  }
  
  // Para estados 0 y 1, si tiene usuario asignado, usar estilo de "Asignado"
  if ((status === '0' || status === '1') && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'bg-yellow-600 text-yellow-100' // Mismo estilo que "Asignado"
  }
  
  return classes[status] || 'bg-gray-600 text-gray-200'
}

const getPriorityText = (priority) => {
  if (!priority) return 'Normal'
  
  const priorityStr = String(priority).toUpperCase()
  
  const priorityMap = {
    '0': 'Baja',
    '1': 'Normal', 
    '2': 'Alta',
    '3': 'Urgente',
    '4': 'Inmediata',
    '5': 'Bloqueante',
    'LOW': 'Baja',
    'NORMAL': 'Normal',
    'HIGH': 'Alta', 
    'URGENT': 'Urgente',
    'IMMEDIATE': 'Inmediata',
    'BLOCKING': 'Bloqueante'
  }
  
  return priorityMap[priorityStr] || 'Normal'
}

const getPriorityClass = (priority) => {
  const classes = {
    '1': 'bg-green-600 text-green-100',
    '2': 'bg-blue-600 text-blue-100',
    '3': 'bg-yellow-600 text-yellow-100',
    '4': 'bg-red-600 text-red-100',
    // Add common severity codes
    'LOW': 'bg-green-600 text-green-100',
    'NORMAL': 'bg-blue-600 text-blue-100',
    'HIGH': 'bg-yellow-600 text-yellow-100',
    'URGENT': 'bg-red-600 text-red-100',
    'CRITICAL': 'bg-red-800 text-red-100',
    'BLOCKING': 'bg-red-900 text-red-100'
  }
  return classes[priority] || classes[String(priority)] || 'bg-blue-600 text-blue-100'
}

// Funciones para manejar intervenciones
const getInterventionStatusText = (status) => {
  const statuses = {
    '0': 'Borrador',
    '1': 'Validada',
    '2': 'Facturada',
    '3': 'Cerrada'
  }
  return statuses[status] || 'Desconocido'
}

const getInterventionStatusClass = (status) => {
  const classes = {
    '0': 'bg-gray-100 text-gray-800',
    '1': 'bg-green-100 text-green-800',
    '2': 'bg-blue-100 text-blue-800',
    '3': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatInterventionDate = (dateString) => {
  if (!dateString) return '-'
  // Si es timestamp, convertir
  if (typeof dateString === 'number' || /^\d+$/.test(dateString)) {
    return new Date(dateString * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  // Si es fecha ISO
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (duration) => {
  if (!duration) return '0h'
  
  // Convertir a número si es string
  const numDuration = typeof duration === 'string' ? parseInt(duration) : duration
  
  // Si la duración está en segundos
  if (typeof numDuration === 'number' && !isNaN(numDuration)) {
    const hours = Math.floor(numDuration / 3600)
    const minutes = Math.floor((numDuration % 3600) / 60)
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return minutes > 0 ? `${minutes}m` : '< 1m'
  }
  
  // Si ya está formateado
  return duration
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, priorityFilter], () => {
  currentPage.value = 1
})

// Close dropdowns when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.relative')) {
    showTerceroDropdown.value = false
    showUserDropdown.value = false
  }
}

onMounted(async () => {
  try {
    await fetchTickets()
  } catch (error) {
    console.error('❌ Error loading tickets:', error)
  }
  
  // Fetch user interventions when component mounts
  if (authStore.user && authStore.user.id) {
    try {
      await fetchUserInterventions(true) // Force refresh
    } catch (error) {
      console.warn('⚠️ Error al obtener intervenciones del usuario:', error)
    }
  }
})

// Project management functions
const startEditProject = async () => {
  editingProject.value = true
  selectedProjectId.value = ticketDetails.value?.fk_project || ''
  
  console.log('🔍 Starting project edit for ticket:', {
    ticketId: ticketDetails.value?.id,
    currentProject: ticketDetails.value?.fk_project,
    clientId: ticketDetails.value?.fk_soc
  })
  
  let projects = []
  
  // First, if there's a current project, always include it
  if (ticketDetails.value?.fk_project && currentProject.value) {
    projects.push(currentProject.value)
    console.log('✅ Added current project:', currentProject.value.ref)
  }
  
  // Then fetch available projects for the client
  if (ticketDetails.value?.fk_soc) {
    try {
      console.log('🔍 Fetching projects for client:', ticketDetails.value.fk_soc)
      
      // Try different API endpoints to get projects
      let response
      try {
        // Method 1: Use sqlfilters to filter by client ID
        const sqlfilter = `(fk_soc:=:${ticketDetails.value.fk_soc})`
        console.log('🔍 Using sqlfilter:', sqlfilter)
        response = await http.get(`/api/doli/projects?sqlfilters=${encodeURIComponent(sqlfilter)}&limit=100`)
        console.log('✅ Method 1 (sqlfilters) succeeded')
      } catch (error1) {
        console.warn('Method 1 (sqlfilters) failed, trying method 2...', error1.message)
        try {
          // Method 2: Filter by fk_soc parameter
          response = await http.get(`/api/doli/projects?fk_soc=${ticketDetails.value.fk_soc}&limit=100`)
          console.log('✅ Method 2 (fk_soc param) succeeded')
        } catch (error2) {
          console.warn('Method 2 failed, trying method 3...', error2.message)
          // Method 3: Get all projects and filter client-side
          response = await http.get(`/api/doli/projects?limit=100`)
          console.log('✅ Method 3 (get all) succeeded')
        }
      }
      
      console.log('📋 Projects API response:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        // Debug: Check the structure of the first few projects
        console.log('🔍 Sample project structure:', response.data.slice(0, 3).map(p => ({
          id: p.id,
          ref: p.ref,
          fk_soc: p.fk_soc,
          socid: p.socid,
          client_id: p.client_id,
          thirdparty_id: p.thirdparty_id
        })))
        
        console.log('🎯 Looking for client ID:', ticketDetails.value.fk_soc, '(type:', typeof ticketDetails.value.fk_soc, ')')
        
        // Filter projects to ensure they belong to the correct client
        const clientProjects = response.data.filter(project => {
          const matches = project.fk_soc == ticketDetails.value.fk_soc || 
                         project.socid == ticketDetails.value.fk_soc ||
                         project.client_id == ticketDetails.value.fk_soc ||
                         project.thirdparty_id == ticketDetails.value.fk_soc
          
          if (matches) {
            console.log('✅ Found matching project:', project.ref, 'with client field:', {
              fk_soc: project.fk_soc,
              socid: project.socid,
              client_id: project.client_id,
              thirdparty_id: project.thirdparty_id
            })
          }
          
          return matches
        })
        
        console.log('🎯 Client projects found:', clientProjects.length)
        
        // Add client projects that aren't already in the list
        clientProjects.forEach(project => {
          if (!projects.find(p => p.id === project.id)) {
            projects.push(project)
          }
        })
      }
      
      availableProjects.value = projects
      console.log('✅ Final projects list:', projects.length, 'projects:', projects.map(p => p.ref))
      
    } catch (error) {
      console.error('Error fetching projects:', error)
      // If API fails, at least keep the current project
      availableProjects.value = projects
    }
  } else {
    console.warn('⚠️ No client ID (fk_soc) found in ticket details')
    availableProjects.value = projects
  }
}

const cancelEditProject = () => {
  editingProject.value = false
  selectedProjectId.value = ''
}

const saveProject = async () => {
  try {
    const updateData = {
      fk_project: selectedProjectId.value || null
    }
    
    console.log('💾 Saving project for ticket:', {
      ticketId: ticketDetails.value.id,
      currentProject: ticketDetails.value.fk_project,
      newProject: selectedProjectId.value,
      updateData: updateData
    })
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    console.log('✅ Project update response:', response.data)
    console.log('✅ Response status:', response.status)
    console.log('✅ Response headers:', response.headers)
    
    // Update local data
    ticketDetails.value.fk_project = selectedProjectId.value
    
    // Fetch updated project info if project was assigned
    if (selectedProjectId.value) {
      try {
        const projectResponse = await http.get(`/api/doli/projects/${selectedProjectId.value}`)
        currentProject.value = projectResponse.data
      } catch (error) {
        console.warn('Error fetching project details:', error)
      }
    } else {
      currentProject.value = null
    }
    
    editingProject.value = false
    console.log('✅ Proyecto actualizado correctamente')
    
  } catch (error) {
    console.error('❌ Error updating project:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    console.error('❌ Error headers:', error.response?.headers)
    console.error('❌ Error config:', error.config)
    
    // Show detailed error information
    if (error.response?.data) {
      console.error('❌ Server error details:', error.response.data)
    }
    
    // Show error message to user
    alert('Error al actualizar el proyecto: ' + (error.response?.data?.message || error.message))
  }
}

// User assignment management functions
const startEditAssignment = async () => {
  editingAssignment.value = true
  selectedAssignedUserId.value = ticketDetails.value?.fk_user_assign || ''
  
  console.log('🔍 Starting user assignment edit for ticket:', {
    ticketId: ticketDetails.value?.id,
    currentAssignedUser: ticketDetails.value?.fk_user_assign
  })
  
  try {
    console.log('🔍 Fetching active users...')
    const response = await http.get('/api/doli/users?status=1&limit=100')
    console.log('✅ Users API response:', response.data)
    
    if (response.data && Array.isArray(response.data)) {
      availableUsers.value = response.data.filter(user => user.statut == 1) // Only active users
      console.log('✅ Active users found:', availableUsers.value.length)
    } else {
      availableUsers.value = []
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    availableUsers.value = []
  }
}

const cancelEditAssignment = () => {
  editingAssignment.value = false
  selectedAssignedUserId.value = ''
  assignmentSearchTerm.value = ''
  showAssignmentDropdown.value = false
}

const saveAssignment = async () => {
  try {
    const updateData = {
      fk_user_assign: selectedAssignedUserId.value || null
    }
    
    console.log('💾 Saving assignment for ticket:', {
      ticketId: ticketDetails.value.id,
      currentAssignment: ticketDetails.value.fk_user_assign,
      newAssignment: selectedAssignedUserId.value,
      updateData: updateData
    })
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    console.log('✅ Assignment update response:', response.data)
    
    // Update local data
    ticketDetails.value.fk_user_assign = selectedAssignedUserId.value
    
    // Fetch updated user info if user was assigned
    if (selectedAssignedUserId.value) {
      try {
        const userResponse = await http.get(`/api/doli/users/${selectedAssignedUserId.value}`)
        currentAssignedUser.value = userResponse.data
      } catch (error) {
        console.warn('Error fetching user details:', error)
      }
    } else {
      currentAssignedUser.value = null
    }
    
    editingAssignment.value = false
    assignmentSearchTerm.value = ''
    showAssignmentDropdown.value = false
    console.log('✅ Asignación actualizada correctamente')
    
  } catch (error) {
    console.error('❌ Error updating assignment:', error)
    console.error('❌ Error response:', error.response?.data)
    console.error('❌ Error status:', error.response?.status)
    
    // Show detailed error information
    if (error.response?.data) {
      console.error('❌ Server error details:', error.response.data)
    }
    
    // Show error message to user
    alert('Error al actualizar la asignación: ' + (error.response?.data?.message || error.message))
  }
}

// File upload management functions
const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  const files = Array.from(e.dataTransfer.files)
  uploadFiles(files)
}

const openFileDialog = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  uploadFiles(files)
  // Reset input
  e.target.value = ''
}

const uploadFiles = async (files) => {
  if (!files.length || !ticketDetails.value?.id) return
  
  uploadingFiles.value = true
  uploadProgress.value = 0
  
  console.log('🚀 Starting file upload process for', files.length, 'files')
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`📁 Processing file ${i + 1}/${files.length}:`, file.name)
      
      await uploadSingleFile(file)
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    }
    
    console.log('✅ All files uploaded successfully')
    // Refresh documents list using custom module
    await fetchTicketDocuments()
    
  } catch (error) {
    console.error('❌ Error uploading files:', error)
    alert('Error al subir archivos: ' + (error.message || 'Error desconocido'))
  } finally {
    uploadingFiles.value = false
    uploadProgress.value = 0
  }
}

const uploadSingleFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const fileContent = e.target.result.split(',')[1] // Remove data:type;base64, prefix
        
        console.log('📤 Uploading file:', {
          filename: file.name,
          size: file.size,
          type: file.type
        })
        
        // Step 1: Upload document using custom module
        const uploadData = {
          filename: file.name,
          file_content: fileContent
        }
        
        console.log('📋 Upload data (custom module):', uploadData)
        
        const uploadUrl = `/api/doli/dolibarmodernfrontendapi/ticket/${ticketDetails.value.id}/documents`
        console.log('📤 Upload URL (custom module):', uploadUrl)
        
        const uploadResponse = await http.post(uploadUrl, uploadData)
        console.log('✅ Document uploaded via custom module:', uploadResponse.data)
        
        resolve(uploadResponse.data)
        
      } catch (error) {
        console.error('❌ Error in uploadSingleFile:', error)
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsDataURL(file)
  })
}

const linkDocumentToTicket = async (documentId) => {
  try {
    console.log('🔗 Linking document', documentId, 'to ticket', ticketDetails.value.id)
    
    const linkData = {
      source: 'ticket',
      sourceid: ticketDetails.value.id,
      target: 'document', 
      targetid: documentId
    }
    
    console.log('📋 Link data:', linkData)
    
    const linkResponse = await http.post('/api/doli/objectlinks', linkData)
    console.log('✅ Document linked successfully:', linkResponse.data)
    
  } catch (error) {
    console.error('❌ Error linking document:', error)
    console.error('❌ Error response:', error.response?.data)
    throw error
  }
}


const fetchTicketDocuments = async () => {
  if (!ticketDetails.value?.id) {
    console.log('📋 No ticket ID, skipping document fetch')
    return
  }
  
  try {
    console.log('📋 Fetching documents for ticket:', ticketDetails.value.id)
    
    // Use custom module to get documents
    const response = await http.get(`/api/doli/dolibarmodernfrontendapi/ticket/${ticketDetails.value.id}/documents`)
    
    console.log('📋 Raw response from custom module:', response)
    console.log('📋 Response data:', response.data)
    console.log('📋 Response data type:', typeof response.data)
    console.log('📋 Response data keys:', response.data ? Object.keys(response.data) : 'No data')
    
    // Handle different response structures
    let documents = []
    if (Array.isArray(response.data)) {
      documents = response.data
    } else if (response.data && response.data.documents) {
      documents = response.data.documents
    } else if (response.data && response.data.data) {
      documents = response.data.data
    } else if (response.data) {
      documents = [response.data] // Single document
    }
    
    ticketDocuments.value = documents
    
    console.log('✅ Documents processed:', ticketDocuments.value.length)
    console.log('📋 Documents structure:', ticketDocuments.value)
    
    // Log individual document structure for debugging
    if (ticketDocuments.value.length > 0) {
      console.log('📋 First document structure:', ticketDocuments.value[0])
      console.log('📋 First document keys:', Object.keys(ticketDocuments.value[0]))
    }
    
  } catch (error) {
    console.warn('⚠️ Error fetching ticket documents:', error)
    console.error('⚠️ Error response:', error.response?.data)
    ticketDocuments.value = []
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadDocument = (doc) => {
  const downloadUrl = doc.download_url || doc.url
  if (downloadUrl) {
    window.open(downloadUrl, '_blank')
  } else {
    console.warn('No download URL available for document:', doc)
  }
}

// Watch for ticket details changes to load project and user info
watch(ticketDetails, async (newDetails) => {
  // Solo ejecutar si hay detalles del ticket (no null)
  if (!newDetails) {
    // Limpiar datos cuando se cierra el modal
    currentProject.value = null
    currentAssignedUser.value = null
    return
  }
  
  // Load project info
  if (newDetails.fk_project) {
    try {
      const projectResponse = await http.get(`/api/doli/projects/${newDetails.fk_project}`)
      currentProject.value = projectResponse.data
    } catch (error) {
      console.warn('Error fetching project details:', error)
      currentProject.value = null
    }
  } else {
    currentProject.value = null
  }
  
  // Load assigned user info
  if (newDetails.fk_user_assign) {
    try {
      const userResponse = await http.get(`/api/doli/users/${newDetails.fk_user_assign}`)
      currentAssignedUser.value = userResponse.data
    } catch (error) {
      console.warn('Error fetching assigned user details:', error)
      currentAssignedUser.value = null
    }
  } else {
    currentAssignedUser.value = null
  }
  
  // Load ticket documents using custom module
  if (newDetails.id) {
    await fetchTicketDocuments()
  }
})

// Clean up event listener
const cleanup = () => {
  document.removeEventListener('click', closeDropdowns)
}

// Add cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(cleanup)
</script>
