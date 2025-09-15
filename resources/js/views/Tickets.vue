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
                      :class="getStatusClass(ticket.fk_statut)">
                  {{ getStatusText(ticket.fk_statut) }}
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
                  <button class="text-green-400 hover:text-green-300 transition-colors" title="Editar">
                    <svg class="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <span v-if="ticketDetails" class="inline-flex px-3 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(ticketDetails.fk_statut)">
                  {{ getStatusText(ticketDetails.fk_statut) }}
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

            <div v-else-if="ticketDetails" class="flex w-full">
              <!-- Left Panel - Main Content -->
              <div class="flex-1 p-6 overflow-y-auto">
                <!-- Action Buttons -->
                <div class="flex items-center space-x-3 mb-6">
                  <button class="flex items-center space-x-2 px-3 py-2 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">Marcar completo</span>
                  </button>
                  <button class="flex items-center space-x-2 px-3 py-2 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="text-sm">Iniciar Timer</span>
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
                    <div v-if="ticketDetails.message" v-html="ticketDetails.message" class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'"></div>
                    <p v-else class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Sin descripción disponible</p>
                  </div>
                </div>

                <!-- Intervenciones del Ticket -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Intervenciones</h3>
                    </div>
                    <span v-if="ticketDetails.messages" class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                      {{ ticketDetails.messages.length }} intervención(es)
                    </span>
                  </div>
                  
                  <!-- Intervenciones del ticket -->
                  <div v-if="ticketDetails.messages && ticketDetails.messages.length > 0" class="space-y-3">
                    <div 
                      v-for="(message, index) in ticketDetails.messages" 
                      :key="message.id"
                      class="flex items-start space-x-3 p-3 rounded-lg border" 
                      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
                    >
                      <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white mt-0.5" 
                           :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                        {{ index + 1 }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                              {{ message.fk_user_author_name || 'Usuario' }}
                            </span>
                            <span v-if="message.private" class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Privado
                            </span>
                          </div>
                          <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                            {{ formatDate(message.datec) }}
                          </span>
                        </div>
                        <div class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          <div v-if="message.message || message.content" v-html="message.message || message.content" class="prose prose-sm max-w-none" :class="isDark ? 'prose-invert' : ''"></div>
                          <p v-else class="italic" :class="isDark ? 'text-gray-500' : 'text-gray-500'">Sin contenido</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Estado cuando no hay intervenciones -->
                  <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto mb-4" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <p class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-500'">No hay intervenciones registradas para este ticket</p>
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

                  <!-- Messages -->
                  <div v-if="ticketDetails.messages && ticketDetails.messages.length > 0" class="space-y-4 mb-4">
                    <div 
                      v-for="message in ticketDetails.messages" 
                      :key="message.id"
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
                        </div>
                        <div class="text-sm p-3 rounded-lg" :class="isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'" v-html="message.message || message.content"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Comment -->
                  <div class="border-t pt-4" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                    <textarea 
                      placeholder="Añadir un comentario..."
                      class="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      rows="3"
                    ></textarea>
                    <div class="flex justify-end mt-2">
                      <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar - Ticket Info -->
              <div class="w-80 border-l p-6 overflow-y-auto" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'">
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
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(ticketDetails.fk_statut)">
                        {{ getStatusText(ticketDetails.fk_statut) }}
                      </span>
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
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">00:00</p>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Tiempo total registrado:</label>
                      <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">00:01</p>
                    </div>
                  </div>
                </div>

                <!-- Reminders Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Recordatorios</h3>
                    </div>
                    <button class="text-blue-500 hover:text-blue-600">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="space-y-3">
                    <div class="p-3 rounded-lg border" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'">
                      <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                          <span class="text-xs text-white font-medium">A</span>
                        </div>
                        <div class="flex-1">
                          <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">Recordatorio para Admin</p>
                          <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">24-09-2025 16:00:00</p>
                          <p class="text-xs mt-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Seguimiento del ticket</p>
                        </div>
                      </div>
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
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Asignados</h3>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <div class="relative">
                      <select class="w-full p-2 border rounded-lg text-sm" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'">
                        <option>Asignar ticket a</option>
                      </select>
                    </div>
                    
                    <div v-if="ticketDetails.assigned_to" class="flex items-center space-x-3 p-2 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-blue-600' : 'bg-blue-500'">
                        <span class="text-xs text-white font-medium">{{ (ticketDetails.assigned_to || 'U').charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails.assigned_to }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Followers Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Seguidores</h3>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <div class="relative">
                      <select class="w-full p-2 border rounded-lg text-sm" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'">
                        <option>Añadir Seguidores</option>
                      </select>
                    </div>
                    
                    <div class="flex items-center space-x-3 p-2 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isDark ? 'bg-green-600' : 'bg-green-500'">
                        <span class="text-xs text-white font-medium">A</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">Admin</p>
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
                  
                  <div class="border-2 border-dashed rounded-lg p-8 text-center" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
                    <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-500' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Arrastra archivos aquí para subir</p>
                    <button class="mt-2 text-xs text-blue-500 hover:text-blue-600">Elegir desde Dropbox</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import http from '../utils/http'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const tickets = ref([])
const loading = ref(false)

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
const loadingDetails = ref(false)

const fetchTickets = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/tickets')
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
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    loading.value = false
  }
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
    const response = await http.get('/api/doli/users')
    users.value = response.data || []
  } catch (error) {
    console.error('Error fetching users:', error)
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
  applyFilters()
}

// Computed properties for filtering and pagination
const filteredTickets = computed(() => {
  let filtered = [...tickets.value]

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
  showModal.value = true
  loadingDetails.value = true
  
  try {
    // Get the ticket details
    const ticketResponse = await http.get(`/api/doli/tickets/${ticket.id}`)
    ticketDetails.value = ticketResponse.data
    
    // Try multiple approaches to get ticket interventions
    let interventions = []
    
    // Method 1: Check if messages are in the ticket response
    if (ticketResponse.data.messages && Array.isArray(ticketResponse.data.messages)) {
      interventions = ticketResponse.data.messages
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
    console.error('Error fetching ticket details:', error)
    ticketDetails.value = ticket // Fallback to basic ticket data
    ticketDetails.value.messages = []
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedTicket.value = null
  ticketDetails.value = null
  loadingDetails.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

const getStatusText = (status) => {
  const statuses = {
    '0': 'Borrador',
    '1': 'Abierto',
    '4': 'Asignado',
    '5': 'En progreso',
    '8': 'Cerrado',
    '9': 'Cancelado'
  }
  return statuses[status] || 'Desconocido'
}

const getStatusClass = (status) => {
  const classes = {
    '0': 'bg-gray-600 text-gray-200',
    '1': 'bg-blue-600 text-blue-100',
    '4': 'bg-yellow-600 text-yellow-100',
    '5': 'bg-purple-600 text-purple-100',
    '8': 'bg-green-600 text-green-100',
    '9': 'bg-red-600 text-red-100'
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
  // First fetch terceros and users, then tickets to enrich with tercero names
  await Promise.all([
    fetchTerceros(),
    fetchUsers()
  ])
  
  // Then fetch tickets and enrich with tercero data
  await fetchTickets()
  
  // Add click outside listener
  document.addEventListener('click', closeDropdowns)
})

// Clean up event listener
const cleanup = () => {
  document.removeEventListener('click', closeDropdowns)
}

// Add cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(cleanup)
</script>
