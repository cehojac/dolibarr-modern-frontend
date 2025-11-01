<template>
  <div class="min-h-screen p-6" :class="isDark ? 'bg-black' : 'bg-gray-50'">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Tickets</h1>
        <p class="mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Sistema de soporte y tickets</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Selector de Vista -->
        <div class="flex rounded-lg border" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
          <button
            @click="currentView = 'table'"
            class="px-4 py-2 text-sm font-medium transition-colors rounded-l-lg"
            :class="currentView === 'table' 
              ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
            "
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            @click="currentView = 'kanban'"
            class="px-4 py-2 text-sm font-medium transition-colors rounded-r-lg"
            :class="currentView === 'kanban' 
              ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
            "
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>

        <!-- Selector de Columnas Kanban (solo visible en vista Kanban) -->
        <div v-if="currentView === 'kanban'" class="relative">
          <button
            @click="showColumnSelector = !showColumnSelector"
            class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center space-x-2"
            :class="isDark ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Columnas</span>
          </button>

          <!-- Dropdown de columnas -->
          <div
            v-if="showColumnSelector"
            class="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
          >
            <div class="p-3">
              <div class="text-xs font-semibold mb-2 uppercase" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Mostrar/Ocultar Columnas
              </div>
              <div class="space-y-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.notRead" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">No leído</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.read" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Leído</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.assigned" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Asignado</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.inProgress" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">En progreso</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.needMoreInfo" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Necesita más info</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.waiting" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">En espera</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.closed" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Cerrado</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="visibleKanbanColumns.canceled" class="rounded">
                  <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Cancelado</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button 
          @click="openCreateTicketModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          + Crear Ticket
        </button>
      </div>
    </div>

    <!-- Tickets Overview Metrics -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Tickets Overview</h2>
        <a href="#" class="text-blue-500 hover:text-blue-600 text-sm font-medium">Tickets Overview →</a>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <!-- Sin Asignar Tickets -->
        <div 
          @click="filterByUnassigned"
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all duration-200" 
          :class="ticketMetrics.unassigned > 0 
            ? (isDark ? 'bg-red-900/20 border-red-700 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100')
            : (isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50')
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" 
                 :class="ticketMetrics.unassigned > 0 
                   ? (isDark ? 'text-red-300' : 'text-red-700')
                   : (isDark ? 'text-white' : 'text-gray-900')
                 ">
                {{ ticketMetrics.unassigned }}
              </p>
              <p class="text-sm font-medium" 
                 :class="ticketMetrics.unassigned > 0 ? 'text-red-500' : 'text-orange-500'">
                Sin Asignar
              </p>
              <p class="text-xs" 
                 :class="ticketMetrics.unassigned > 0 
                   ? (isDark ? 'text-red-400' : 'text-red-600')
                   : (isDark ? 'text-gray-400' : 'text-gray-600')
                 ">
                Total: {{ ticketMetrics.unassigned }}
              </p>
            </div>
            <!-- Icono de alerta cuando hay tickets sin asignar -->
            <div v-if="ticketMetrics.unassigned > 0" class="ml-2">
              <svg class="w-6 h-6" :class="isDark ? 'text-red-400' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- In Progress / Assigned -->
        <div 
          @click="filterByAssigned"
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketMetrics.inProgress }}</p>
              <p class="text-sm font-medium text-blue-500">Assigned</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Total: {{ ticketMetrics.inProgress }}</p>
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
            <div v-if="showTerceroDropdown && filteredTercerosForFilters.length > 0" 
                 class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
              <div v-for="tercero in filteredTercerosForFilters" :key="tercero.id"
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
            <div v-if="showUserDropdown && filteredUsersForFilters.length > 0" 
                 class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'">
              <div v-for="user in filteredUsersForFilters" :key="user.id"
                   @click="selectUserFilter(user)"
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
            <option v-for="(status, key) in TICKET_STATUSES" :key="key" :value="key">
              {{ status.label }}
            </option>
            <option value="show_all">Mostrar todos (incluye cerrados)</option>
          </select>
        </div>

        <!-- Priority/Severity Filter -->
        <div>
          <select
            v-model="priorityFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todas las gravedades</option>
            <option v-for="severity in ticketSeverities" :key="severity.id" :value="severity.code || severity.id">
              {{ severity.label || severity.name }}
            </option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <select
            v-model="categoryFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in ticketCategories" :key="category.id" :value="category.code || category.id">
              {{ category.label || category.name }}
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <select
            v-model="typeFilter"
            @change="applyFilters"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'"
          >
            <option value="">Todos los tipos</option>
            <option v-for="type in ticketTypes" :key="type.id" :value="type.code || type.id">
              {{ type.label || type.name }}
            </option>
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

    <!-- Vista Kanban -->
    <div v-if="currentView === 'kanban'" class="flex gap-4 overflow-x-auto pb-4 kanban-container">
      <!-- Columna: No leído -->
      <div v-if="visibleKanbanColumns.notRead" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-red-300' : 'text-red-700'">
            No leído
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-red-800 text-red-200' : 'bg-red-200 text-red-800'">
            {{ kanbanColumns.notRead.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 0)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.notRead"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Tercero -->
            <div class="flex items-center space-x-2 mb-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'"
                :title="ticket.thirdparty_name || 'Sin tercero'"
              >
                {{ getKanbanThirdpartyInitials(ticket) }}
              </div>
            </div>
            
            <!-- Referencia -->
            <div class="text-xs font-mono mb-1" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Grupo -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: Leído -->
      <div v-if="visibleKanbanColumns.read" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Leído
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.read.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 1)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.read"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: Asignado -->
      <div v-if="visibleKanbanColumns.assigned" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-yellow-300' : 'text-yellow-700'">
            Asignado
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-200 text-yellow-800'">
            {{ kanbanColumns.assigned.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 2)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.assigned"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: En progreso -->
      <div v-if="visibleKanbanColumns.inProgress" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            En progreso
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.inProgress.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 3)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.inProgress"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: Necesita más info -->
      <div v-if="visibleKanbanColumns.needMoreInfo" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Necesita más info
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.needMoreInfo.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 5)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.needMoreInfo"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: En espera -->
      <div v-if="visibleKanbanColumns.waiting" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            En espera
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.waiting.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 7)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.waiting"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: Cerrado -->
      <div v-if="visibleKanbanColumns.closed" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Cerrado
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.closed.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 8)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.closed"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna: Cancelado -->
      <div v-if="visibleKanbanColumns.canceled" class="w-[75vw] md:w-[calc(25vw-1rem)] flex-shrink-0 rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Cancelado
          </h3>
          <span class="text-xs px-2 py-1 rounded-full" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'">
            {{ kanbanColumns.canceled.length }}
          </span>
        </div>
        <div 
          class="space-y-3 min-h-[200px]"
          @drop="handleKanbanDrop($event, 9)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="ticket in kanbanColumns.canceled"
            :key="ticket.id"
            draggable="true"
            @dragstart="handleKanbanDragStart($event, ticket)"
            @dragend="handleKanbanDragEnd"
            @click="viewTicketDetails(ticket)"
            class="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            :class="isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'"
          >
            <!-- Referencia -->
            <div class="text-xs font-mono mb-2" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
              {{ ticket.ref }}
            </div>
            
            <!-- Título -->
            <div class="text-sm font-medium mb-2 line-clamp-2" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ ticket.subject }}
            </div>
            
            <!-- Tercero -->
            <div v-if="ticket.thirdparty_name" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-green-400' : 'text-green-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ ticket.thirdparty_name }}</span>
            </div>
            
            <!-- Grupo/Categoría -->
            <div v-if="ticket.category_code || ticket.type_code" class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ ticket.category_code || ticket.type_code || 'General' }}</span>
            </div>
            
            <!-- Fecha de creación -->
            <div class="text-xs mb-2 flex items-center space-x-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatKanbanDate(ticket.datec) }}</span>
            </div>
            
            <!-- Usuario asignado -->
            <div class="flex items-center">
              <div 
                v-if="ticket.fk_user_assign && ticket.fk_user_assign != '0'"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'"
                :title="getKanbanUserName(ticket.fk_user_assign)"
              >
                {{ getKanbanUserInitials(ticket.fk_user_assign) }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="currentView === 'table'" class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto min-w-0">
        <table class="min-w-full table-auto">
          <thead :class="isDark ? 'bg-gray-800' : 'bg-gray-100'">
            <tr>
              <th @click="sortBy('ref')" class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors w-20 sm:w-24" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span class="hidden sm:inline">Ref.</span>
                  <span class="sm:hidden">ID</span>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th @click="sortBy('subject')" class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Asunto</span>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="hidden lg:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Grupo
              </th>
              <th @click="sortBy('severity')" class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors w-16 sm:w-20" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span class="hidden sm:inline">Gravedad</span>
                  <span class="sm:hidden">Grav.</span>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="hidden md:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Tercero
              </th>
              <th @click="sortBy('datec')" class="hidden lg:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Fecha</span>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="hidden sm:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Asignado
              </th>
              <th @click="sortBy('fk_statut')" class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Estado</span>
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right text-xs font-medium uppercase tracking-wider w-16" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-4 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando tickets...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="8" class="px-4 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-3">
                  <svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm">No hay tickets que coincidan con los filtros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="ticket in paginatedTickets" :key="ticket.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium">
                <button 
                  @click="viewTicketDetails(ticket)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ ticket.ref }}
                </button>
              </td>
              <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm max-w-xs truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ ticket.subject }}
              </td>
              <td class="hidden lg:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ getCategoryName(ticket.category_code || ticket.category) || '-' }}
              </td>
              <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap">
                <span class="inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-lg"
                      :class="getPriorityClass(ticket.severity_code || ticket.severity)">
                  <span class="hidden sm:inline">{{ getPriorityText(ticket.severity_code || ticket.severity) }}</span>
                  <span class="sm:hidden">{{ getPriorityText(ticket.severity_code || ticket.severity).charAt(0) }}</span>
                </span>
              </td>
              <td class="hidden md:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm max-w-32 truncate" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.thirdparty_name || '-' }}
              </td>
              <td class="hidden lg:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(ticket.datec) }}
              </td>
              <td class="hidden sm:table-cell px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap">
                <div v-if="ticket.assigned_to" class="flex items-center justify-center">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium" 
                       :class="getUserAvatarColor(ticket.assigned_to)"
                       :title="ticket.assigned_to">
                    {{ getUserInitials(ticket.assigned_to) }}
                  </div>
                </div>
                <span v-else class="text-xs sm:text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">-</span>
              </td>
              <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap">
                <span class="inline-flex px-1 sm:px-2 py-1 text-xs font-medium rounded-lg"
                      :class="getStatusClass(ticket.fk_statut, ticket)">
                  <span class="hidden sm:inline">{{ getStatusText(ticket.fk_statut, ticket) }}</span>
                  <span class="sm:hidden">{{ getStatusText(ticket.fk_statut, ticket).charAt(0) }}</span>
                </span>
              </td>
              <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                <TimerButton 
                  :entity-id="ticket.id"
                  size="md"
                  variant="table"
                  @stopped="handleTimerStopped"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'">
        <div class="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div class="text-xs sm:text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            <span class="hidden sm:inline">Mostrando</span> {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredTickets.length) }} <span class="hidden sm:inline">de</span> {{ filteredTickets.length }}
          </div>
          <div class="flex items-center space-x-1 sm:space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-md transition-colors"
            >
              <span class="hidden sm:inline">Anterior</span>
              <span class="sm:hidden">‹</span>
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
                class="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-md transition-colors min-w-[32px] sm:min-w-[36px]"
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
              class="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-md transition-colors"
            >
              <span class="hidden sm:inline">Siguiente</span>
              <span class="sm:hidden">›</span>
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
                <div class="flex-1">
                  <!-- Subject editing mode -->
                  <div v-if="editingSubject" class="space-y-2">
                    <input
                      v-model="editedSubject"
                      type="text"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                      placeholder="Título del ticket"
                    />
                    <div class="flex items-center space-x-2">
                      <button
                        @click="saveSubject"
                        class="px-3 py-1 text-sm font-medium rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Guardar
                      </button>
                      <button
                        @click="cancelEditSubject"
                        class="px-3 py-1 text-sm font-medium rounded-lg transition-colors"
                        :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                  
                  <!-- Subject view mode -->
                  <div v-else>
                    <div class="flex items-center space-x-2">
                      <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ticketDetails?.subject || 'Cargando...' }}</h3>
                      <button
                        @click="startEditSubject"
                        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Editar título"
                      >
                        <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Ticket {{ selectedTicket?.ref }}</p>
                      <span 
                        v-if="ticketDetails?.track_id" 
                        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                        :class="isDark ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' : 'bg-blue-100 text-blue-800 border border-blue-200'"
                      >
                        🔗 Track: {{ ticketDetails.track_id }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span v-if="ticketDetails" class="inline-flex px-3 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(ticketDetails.fk_statut, ticketDetails)">
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
                  <button 
                    @click="showCompleteModal = true"
                    :disabled="completingTicket"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors" 
                    :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm">{{ completingTicket ? 'Cerrando...' : 'Marcar completo' }}</span>
                  </button>
                  
                  <!-- Timer Button in Modal -->
                  <TimerButton 
                    v-if="selectedTicket?.id"
                    :entity-id="selectedTicket.id"
                    size="lg"
                    variant="modal"
                    @stopped="handleTimerStopped"
                  />
                  
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
                  
                  <!-- Delete Button - Less prominent -->
                  <button 
                    @click="showDeleteModal = true"
                    :disabled="deletingTicket"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ml-auto" 
                    :class="isDark ? 'border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed'"
                    title="Eliminar ticket"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="text-sm">Eliminar</span>
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
                      v-if="!editingDescription"
                      @click="startEditDescription"
                      class="flex items-center space-x-1 px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Editar</span>
                    </button>
                  </div>
                  
                  <!-- Description editing mode -->
                  <div v-if="editingDescription" class="space-y-3">
                    <!-- Editor WYSIWYG -->
                    <div class="border rounded-lg overflow-hidden" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
                      <!-- Barra de herramientas -->
                      <div class="flex items-center space-x-1 p-2 border-b" :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'">
                        <button @click="formatDescriptionText('bold')" type="button" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Negrita">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M12.5 4h-5v12h5a4 4 0 000-8 4 4 0 000-8zm-2 6V6h2a2 2 0 110 4h-2zm0 2h2a2 2 0 110 4h-2v-4z"/></svg>
                        </button>
                        <button @click="formatDescriptionText('italic')" type="button" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Cursiva">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 4h6v2h-2l-4 8h2v2H6v-2h2l4-8H10V4z"/></svg>
                        </button>
                        <button @click="formatDescriptionText('underline')" type="button" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Subrayado">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v4a6 6 0 0012 0V8a6 6 0 00-6-6zM4 8a4 4 0 118 0v4a4 4 0 11-8 0V8zm0 10h12v2H4v-2z"/></svg>
                        </button>
                        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button @click="formatDescriptionText('insertUnorderedList')" type="button" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Lista">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
                        </button>
                        <button @click="formatDescriptionText('insertOrderedList')" type="button" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Lista numerada">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h14v2H3v-2zm0 4h14v2H3v-2z"/></svg>
                        </button>
                      </div>
                      
                      <!-- Área de contenido editable -->
                      <div
                        ref="descriptionEditor"
                        contenteditable="true"
                        @input="updateDescriptionContent"
                        class="p-3 min-h-[200px] focus:outline-none"
                        :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'"
                        placeholder="Descripción del ticket"
                      ></div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <button
                        @click="saveDescription"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Guardar
                      </button>
                      <button
                        @click="cancelEditDescription"
                        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                  
                  <!-- Description view mode -->
                  <div v-else class="prose max-w-none" :class="isDark ? 'prose-invert' : ''">
                    <div v-if="ticketDetails.message" class="text-sm">
                      <!-- Descripción truncada o completa -->
                      <div 
                        v-if="!showFullDescription && ticketDetails.message.length > 300"
                        v-html="ticketDetails.message.substring(0, 300) + '...'"
                        class="mb-2 whitespace-pre-wrap ticket-description-content"
                        :class="isDark ? '' : 'light-theme'"
                      ></div>
                      <div 
                        v-else
                        v-html="ticketDetails.message"
                        class="mb-2 whitespace-pre-wrap ticket-description-content"
                        :class="isDark ? '' : 'light-theme'"
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
                        Todas las Intervenciones ({{ allTicketInterventions?.length || 0 }})
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
                  
                  <!-- Loading state -->
                  <div v-if="loadingAllInterventions" v-show="showInterventions" class="text-center py-6">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando intervenciones...</p>
                  </div>

                  <!-- Todas las intervenciones del ticket -->
                  <div v-else-if="allTicketInterventions && allTicketInterventions.length > 0" v-show="showInterventions" class="space-y-3">
                    <div 
                      v-for="(intervention, index) in allTicketInterventions" 
                      :key="intervention.id"
                      class="flex items-start space-x-3 p-4 rounded-lg border" 
                      :class="isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'"
                    >
                      <!-- Círculo con iniciales del usuario -->
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white mt-0.5" 
                           :class="intervention.fk_user_author == authStore.user?.id 
                             ? (isDark ? 'bg-blue-600' : 'bg-blue-500')
                             : (isDark ? 'bg-gray-600' : 'bg-gray-500')
                           ">
                        {{ getUserInitials(intervention.user_author || intervention) }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                              Intervención {{ intervention.ref }}
                            </span>
                            <span class="inline-flex px-2 py-0.5 text-xs font-medium rounded-lg" 
                                  :class="getInterventionStatusClass(intervention.status)">
                              {{ getInterventionStatusText(intervention.status) }}
                            </span>
                            <!-- Autor de la intervención -->
                            <span class="text-xs px-2 py-1 rounded-full" 
                                  :class="intervention.fk_user_author == authStore.user?.id 
                                    ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
                                    : (isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')
                                  ">
                              {{ getUserDisplayName(intervention) }}
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
                  
                  <!-- Estado cuando no hay intervenciones -->
                  <div v-else v-show="showInterventions" class="text-center py-6">
                    <div class="rounded-lg p-4" :class="isDark ? 'bg-gray-800/50' : 'bg-gray-100'">
                      <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <p class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">0 intervenciones</p>
                      <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">No hay intervenciones registradas para este ticket</p>
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
                    
                    <!-- Comment Editor -->
                    <div v-if="commentType === 'email'">
                      <!-- Selector de Plantillas de Email -->
                      <div class="mb-4">
                        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Plantilla de Email
                        </label>
                        <div class="flex space-x-2">
                          <select 
                            v-model="selectedTemplate" 
                            @change="applyEmailTemplate"
                            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                            style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 4 5&quot;><path fill=&quot;%23666&quot; d=&quot;M2 0L0 2h4zm0 5L0 3h4z&quot;/></svg>'); background-position: right 0.7rem center; background-size: 0.65rem auto;"
                            :disabled="loadingTemplates"
                          >
                            <option value="">{{ loadingTemplates ? 'Cargando plantillas...' : 'Seleccionar plantilla...' }}</option>
                            <option 
                              v-for="(template, index) in emailTemplates" 
                              :key="template.id || index" 
                              :value="template.id || index"
                            >
                              {{ template.label || template.name || template.topic || template.title || template.subject || template.libelle || template.description || (template.id ? `Plantilla ID: ${template.id}` : `Plantilla ${index + 1}`) }}
                            </option>
                          </select>
                          <button
                            v-if="selectedTemplate"
                            @click="selectedTemplate = ''"
                            type="button"
                            class="px-3 py-2 border rounded-lg transition-colors"
                            :class="isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
                            title="Limpiar selección"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                          Las variables como __TICKET_REF__, __TICKET_SUBJECT__, etc. serán reemplazadas automáticamente
                        </p>
                      </div>
                      
                      <!-- Editor WYSIWYG para Email -->
                      <div class="border rounded-lg" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
                        <!-- Barra de herramientas del editor -->
                        <div class="flex items-center space-x-2 p-2 border-b" :class="isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'">
                          <button
                            type="button"
                            @click="formatCommentText('bold')"
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
                            @click="formatCommentText('italic')"
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
                            @click="formatCommentText('underline')"
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
                            @click="insertCommentList('ul')"
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
                            @click="insertCommentList('ol')"
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
                          ref="commentEditor"
                          contenteditable="true"
                          @input="updateCommentContent"
                          class="p-3 min-h-[100px] focus:outline-none"
                          :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'"
                          style="white-space: pre-wrap;"
                          placeholder="Escribir comentario (se enviará por email)..."
                          :disabled="sendingComment"
                        ></div>
                      </div>
                      
                      <!-- Adjuntar Archivos para Email -->
                      <div class="mt-4">
                        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                          Adjuntar Archivos
                        </label>
                        <div class="border-2 border-dashed rounded-lg p-4 text-center transition-colors"
                             :class="isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'"
                             @dragover.prevent="$event.currentTarget.classList.add('drag-over')"
                             @dragleave.prevent="$event.currentTarget.classList.remove('drag-over')"
                             @drop.prevent="handleCommentFileDrop($event); $event.currentTarget.classList.remove('drag-over')">
                          <input
                            ref="commentFileInput"
                            type="file"
                            multiple
                            @change="handleCommentFileSelect"
                            class="hidden"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                          >
                          <svg class="w-6 h-6 mx-auto mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                            Arrastra archivos aquí o 
                            <button
                              type="button"
                              @click="commentFileInput?.click()"
                              class="text-blue-500 hover:text-blue-600 underline"
                            >
                              haz clic para seleccionar
                            </button>
                          </p>
                          <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                            PDF, DOC, TXT, JPG, PNG (máx. 10MB por archivo)
                          </p>
                        </div>
                        
                        <!-- Lista de archivos adjuntos del comentario -->
                        <div v-if="commentAttachments && commentAttachments.length > 0" class="mt-3 space-y-2">
                          <div
                            v-for="(file, index) in commentAttachments"
                            :key="index"
                            class="flex items-center justify-between p-2 rounded border"
                            :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
                          >
                            <div class="flex items-center space-x-2">
                              <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span class="text-sm truncate" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                                {{ file.name }}
                              </span>
                              <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                                ({{ formatEmailFileSize(file.size) }})
                              </span>
                            </div>
                            <button
                              type="button"
                              @click="removeCommentAttachment(index)"
                              class="text-red-500 hover:text-red-600 transition-colors"
                              title="Eliminar archivo"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Comment Textarea (solo para mensaje) -->
                    <textarea 
                      v-else
                      v-model="newComment"
                      placeholder="Escribir comentario..."
                      class="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                      rows="4"
                      :disabled="sendingComment"
                    ></textarea>
                    
                    <!-- Action Buttons -->
                    <div class="flex justify-between items-center mt-3">
                      <div class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                        <div v-if="commentType === 'email'" class="space-y-2">
                          <div class="flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Se enviará notificación por email a:
                          </div>
                          
                          <!-- Lista de destinatarios -->
                          <div class="ml-4 space-y-1">
                            <div 
                              v-for="recipient in emailRecipientsPreview" 
                              :key="recipient.email"
                              class="flex items-center space-x-2"
                            >
                              <span 
                                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                                :class="recipient.type === 'internal' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-blue-100 text-blue-700 border border-blue-200'"
                              >
                                {{ recipient.type === 'internal' ? 'INT' : 'EXT' }}
                              </span>
                              <span class="font-medium">{{ recipient.name }}</span>
                              <span class="text-gray-400">({{ recipient.email }})</span>
                            </div>
                            
                            <!-- Mensaje si no hay destinatarios -->
                            <div v-if="emailRecipientsPreview.length === 0" class="text-gray-400 italic">
                              No se encontraron destinatarios
                            </div>
                          </div>
                        </div>
                        
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
              <div class="w-80 max-w-sm border-l p-4 overflow-y-auto flex-shrink-0" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'">
                <!-- Ticket Info Section -->
                <div class="mb-6">
                  <div class="flex items-center space-x-2 mb-4">
                    <svg class="w-5 h-5" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Ticket Info</h3>
                  </div>
                  
                  <div class="space-y-4">
                    <!-- Estado del ticket (editable) -->
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Estado:</label>
                      <div v-if="editingStatus" class="space-y-2">
                        <select
                          v-model="selectedStatus"
                          class="w-full px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                        >
                          <option v-for="(status, key) in TICKET_STATUSES" :key="key" :value="key">
                            {{ status.label }}
                          </option>
                        </select>
                        <div class="flex space-x-2">
                          <button 
                            @click="saveStatus" 
                            class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Guardar
                          </button>
                          <button 
                            @click="cancelEditStatus" 
                            class="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                      <div v-else class="flex items-center justify-between">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getStatusClass(ticketDetails.fk_statut, ticketDetails)">
                          {{ getStatusText(ticketDetails.fk_statut, ticketDetails) }}
                        </span>
                        <button 
                          @click="startEditStatus" 
                          class="ml-2 p-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                          title="Cambiar estado"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Empresa del ticket -->
                    <div>
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Empresa:</label>
                      <div v-if="editingCompany" class="space-y-2">
                        <ThirdpartySearchInput
                          v-model="selectedThirdparty"
                          placeholder="Buscar cliente..."
                          @selected="handleThirdpartySelected"
                          @cleared="handleThirdpartyCleared"
                        />
                        <div class="flex space-x-2">
                          <button 
                            @click="saveCompany" 
                            class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Guardar
                          </button>
                          <button 
                            @click="cancelEditCompany" 
                            class="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                      <div v-else class="flex items-center justify-between">
                        <div class="flex items-center">
                          <div class="w-6 h-6 rounded-full flex items-center justify-center mr-2" :class="isDark ? 'bg-green-600' : 'bg-green-500'">
                            <span class="text-xs font-medium text-white">
                              {{ currentCompany?.name ? currentCompany.name.charAt(0).toUpperCase() : 'E' }}
                            </span>
                          </div>
                          <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                            {{ currentCompany?.name || (ticketDetails.fk_soc ? 'Cargando empresa...' : 'Sin empresa asignada') }}
                          </p>
                        </div>
                        <button 
                          @click="startEditCompany" 
                          class="ml-2 p-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                          title="Cambiar empresa"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
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
                      <label class="block text-xs font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Gravedad:</label>
                      <span class="inline-flex px-2 py-1 text-xs font-medium rounded-lg" :class="getPriorityClass(ticketDetails.severity_code || ticketDetails.severity)">
                        {{ getPriorityText(ticketDetails.severity_code || ticketDetails.severity) }}
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
                      @click="openReminderModal"
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
                            <!-- Checkbox para marcar como completado -->
                            <div class="flex items-center pt-1">
                              <input
                                type="checkbox"
                                :id="`reminder-${reminder.id}`"
                                @change="toggleReminderComplete(reminder.id, $event.target.checked)"
                                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
                                title="Marcar como completado"
                              />
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium break-words" :class="isDark ? 'text-white' : 'text-gray-900'">
                                {{ reminder.title }}
                              </p>
                              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                                📅 {{ reminder.date }}
                              </p>
                              <p class="text-xs mt-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                                👤 {{ reminder.assignedTo }}
                              </p>
                              <p v-if="reminder.description" class="text-xs mt-1 break-words" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                                {{ reminder.description }}
                              </p>
                            </div>
                          </div>
                          <div class="flex items-center space-x-1">
                            <button 
                              @click="deleteReminder(reminder.id)"
                              class="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar recordatorio"
                            >
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
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
                          @blur="() => window.setTimeout(() => showAssignmentDropdown = false, 200)"
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
                      <div class="flex items-center space-x-4 text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                        <span>👥 Internos: {{ internalFollowers.length }}</span>
                        <span>📧 Externos: {{ externalFollowers.length }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <!-- Add Follower Selector with Search -->
                    <div class="flex flex-col space-y-2">
                      <div class="relative">
                        <input
                          v-model="followersSearchTerm"
                          @focus="showFollowersDropdown = true"
                          @blur="() => window.setTimeout(() => showFollowersDropdown = false, 200)"
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
                    <div v-if="ticketFollowers.length > 0" class="space-y-4">
                      <!-- Seguidores Internos -->
                      <div v-if="internalFollowers.length > 0">
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                            <span class="text-white text-xs">👥</span>
                          </div>
                          <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                            Seguidores Internos ({{ internalFollowers.length }})
                          </h4>
                        </div>
                        <div class="space-y-2 ml-6">
                          <div 
                            v-for="follower in internalFollowers" 
                            :key="`internal-${follower.contact_id}`"
                            class="flex items-center justify-between p-2 rounded-lg border" 
                            :class="isDark ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'"
                          >
                            <div class="flex items-center space-x-2">
                              <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                                {{ getUserInitials(follower.fullname || `${follower.firstname || ''} ${follower.lastname || ''}`.trim()) }}
                              </div>
                              <div>
                                <div class="text-xs font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                                  {{ follower.fullname || `${follower.firstname || ''} ${follower.lastname || ''}`.trim() }}
                                </div>
                                <div class="text-xs text-blue-600">
                                  Usuario interno • {{ follower.email || `ID: ${follower.user_id}` }}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              @click="removeFollower(follower.contact_id, 'user')"
                              :disabled="loadingFollowers"
                              class="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Eliminar seguidor"
                            >
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Seguidores Externos -->
                      <div v-if="externalFollowers.length > 0">
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                            <span class="text-white text-xs">📧</span>
                          </div>
                          <h4 class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                            Seguidores Externos ({{ externalFollowers.length }})
                          </h4>
                        </div>
                        <div class="space-y-2 ml-6">
                          <div 
                            v-for="follower in externalFollowers" 
                            :key="`external-${follower.contact_id}`"
                            class="flex items-center justify-between p-2 rounded-lg border" 
                            :class="isDark ? 'bg-green-900/20 border-green-700/30' : 'bg-green-50 border-green-200'"
                          >
                            <div class="flex items-center space-x-2">
                              <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-medium text-white">
                                {{ getUserInitials(follower.fullname || `${follower.firstname || ''} ${follower.lastname || ''}`.trim()) }}
                              </div>
                              <div>
                                <div class="text-xs font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                                  {{ follower.fullname || `${follower.firstname || ''} ${follower.lastname || ''}`.trim() }}
                                </div>
                                <div class="text-xs text-green-600">
                                  {{ follower.company_name }} • {{ follower.email || follower.phone || follower.phone_mobile || 'Sin contacto' }}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              @click="removeFollower(follower.contact_id, 'contact')"
                              :disabled="loadingFollowers"
                              class="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Eliminar seguidor"
                            >
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
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

  <!-- Modal para agregar intervención manual -->
  <div v-if="showManualInterventionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto" 
         :class="[
           isDark ? 'bg-gray-800' : 'bg-white',
           manualIntervention.type === 'email' ? 'max-w-4xl' : 'max-w-lg'
         ]">
      <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ manualIntervention.type === 'email' ? '📧 Agregar Email' : '📝 Add timesheet' }}
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
        
        <!-- Tipo de Intervención -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Tipo de Intervención
          </label>
          <select
            v-model="manualIntervention.type"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
          >
            <option value="message">📝 Mensaje</option>
            <option value="email">📧 Email</option>
          </select>
        </div>
        
        <!-- Campos específicos para Email -->
        <div v-if="manualIntervention.type === 'email'" class="space-y-4">
          <!-- Asunto del Email -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Asunto
            </label>
            <input
              v-model="manualIntervention.emailSubject"
              type="text"
              class="w-full p-2 border rounded-lg text-sm"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              placeholder="Asunto del email..."
            >
          </div>
          
          <!-- Destinatario -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Para (Email)
            </label>
            <input
              v-model="manualIntervention.emailTo"
              type="email"
              class="w-full p-2 border rounded-lg text-sm"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              placeholder="destinatario@ejemplo.com"
            >
          </div>
          
          <!-- Editor WYSIWYG para Email -->
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Contenido del Email
            </label>
            <div class="border rounded-lg" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
              <!-- Barra de herramientas del editor -->
              <div class="flex items-center space-x-2 p-2 border-b" :class="isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'">
                <button
                  type="button"
                  @click="formatText('bold')"
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
                  @click="formatText('italic')"
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
                  @click="formatText('underline')"
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
                  @click="insertList('ul')"
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
                  @click="insertList('ol')"
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
                ref="emailEditor"
                contenteditable="true"
                @input="updateEmailContent"
                class="p-3 min-h-[120px] focus:outline-none"
                :class="isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'"
                style="white-space: pre-wrap;"
                placeholder="Escribe el contenido del email aquí..."
              ></div>
            </div>
          </div>
          
          <!-- Adjuntar Archivos -->
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Adjuntar Archivos
            </label>
            <div class="border-2 border-dashed rounded-lg p-4 text-center transition-colors"
                 :class="isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'"
                 @dragover.prevent="$event.currentTarget.classList.add('drag-over')"
                 @dragleave.prevent="$event.currentTarget.classList.remove('drag-over')"
                 @drop.prevent="handleEmailFileDrop($event); $event.currentTarget.classList.remove('drag-over')">
              <input
                ref="emailFileInput"
                type="file"
                multiple
                @change="handleEmailFileSelect"
                class="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              >
              <svg class="w-8 h-8 mx-auto mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Arrastra archivos aquí o 
                <button
                  type="button"
                  @click="emailFileInput?.click()"
                  class="text-blue-500 hover:text-blue-600 underline"
                >
                  haz clic para seleccionar
                </button>
              </p>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                PDF, DOC, TXT, JPG, PNG (máx. 10MB por archivo)
              </p>
            </div>
            
            <!-- Lista de archivos adjuntos -->
            <div v-if="manualIntervention.emailAttachments && manualIntervention.emailAttachments.length > 0" class="mt-3 space-y-2">
              <div
                v-for="(file, index) in manualIntervention.emailAttachments"
                :key="index"
                class="flex items-center justify-between p-2 rounded border"
                :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm truncate" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                    {{ file.name }}
                  </span>
                  <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
                    ({{ formatEmailFileSize(file.size) }})
                  </span>
                </div>
                <button
                  type="button"
                  @click="removeEmailAttachment(index)"
                  class="text-red-500 hover:text-red-600 transition-colors"
                  title="Eliminar archivo"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Note (solo para mensaje) -->
        <div v-else>
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
          :disabled="isSavingIntervention"
          class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2"
          :class="isSavingIntervention 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'"
        >
          <svg v-if="isSavingIntervention" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSavingIntervention ? 'Saving...' : 'Save' }}</span>
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
        
        <!-- Tipo de recordatorio -->
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            * Tipo de recordatorio
          </label>
          <select
            v-model="newReminder.actionCode"
            class="w-full p-2 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            required
          >
            <option value="AC_RDV">Cita</option>
            <option value="AC_TEL">Llamada telefónica</option>
            <option value="AC_INT">Intervención in situ</option>
            <option value="AC_OTH">Otra</option>
            <option value="AC_EO_ONLINECONF">Online/Virtual conference</option>
            <option value="AC_EO_INDOORCONF">Indoor conference</option>
            <option value="AC_EO_ONLINEBOOTH">Online/Virtual booth</option>
            <option value="AC_EO_INDOORBOOTH">Indoor booth</option>
          </select>
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
            <!-- Usuario actual como primera opción -->
            <option 
              v-if="authStore.user"
              :value="`${authStore.user.firstname || ''} ${authStore.user.lastname || ''}`.trim()"
            >
              {{ `${authStore.user.firstname || ''} ${authStore.user.lastname || ''}`.trim() }} (Yo)
            </option>
            <!-- Otros usuarios disponibles -->
            <option 
              v-for="user in availableUsers" 
              :key="user.id" 
              :value="`${user.firstname || ''} ${user.lastname || ''}`.trim()"
            >
              {{ `${user.firstname || ''} ${user.lastname || ''}`.trim() }}
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
          :disabled="!newReminder.date || !newReminder.assignedTo || !newReminder.description || !newReminder.actionCode"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          Crear Recordatorio
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para completar ticket -->
  <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Completar Ticket
        </h3>
      </div>
      
      <p class="text-sm mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        ¿Estás seguro de que deseas marcar este ticket como completado? Esta acción cambiará el estado del ticket a "Cerrado".
      </p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-xs font-medium text-yellow-800">Información importante</p>
            <p class="text-xs text-yellow-700 mt-1">Una vez cerrado, el ticket no podrá recibir nuevas actualizaciones sin ser reabierto.</p>
          </div>
        </div>
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="showCompleteModal = false"
          :disabled="completingTicket"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50' : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="completeTicket"
          :disabled="completingTicket"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
        >
          <svg v-if="completingTicket" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ completingTicket ? 'Cerrando...' : 'Sí, completar ticket' }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para eliminar ticket -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showDeleteModal = false">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'" @click.stop>
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Eliminar Ticket
        </h3>
      </div>
      
      <p class="text-sm mb-4" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        Esta acción es <strong class="text-red-600">permanente</strong> y no se puede deshacer. Se eliminarán todos los datos asociados al ticket, incluyendo comentarios, archivos adjuntos e intervenciones.
      </p>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6" :class="isDark ? 'bg-red-900/20 border-red-800' : ''">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-xs font-medium" :class="isDark ? 'text-red-400' : 'text-red-800'">¡Advertencia!</p>
            <p class="text-xs mt-1" :class="isDark ? 'text-red-300' : 'text-red-700'">
              Para confirmar, escribe el nombre del cliente: <strong>{{ currentCompany?.name || 'N/A' }}</strong>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Input de confirmación -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          Nombre del cliente
        </label>
        <input
          v-model="deleteConfirmationText"
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          :placeholder="`Escribe: ${currentCompany?.name || 'N/A'}`"
          @keyup.enter="deleteTicket"
        />
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteModal = false; deleteConfirmationText = ''"
          :disabled="deletingTicket"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50' : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="deleteTicket"
          :disabled="deletingTicket || deleteConfirmationText.trim() !== (currentCompany?.name || '')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
        >
          <svg v-if="deletingTicket" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ deletingTicket ? 'Eliminando...' : 'Sí, eliminar ticket' }}</span>
        </button>
      </div>
    </div>
  </div>


  <!-- Modal de crear ticket -->
  <div v-if="showCreateTicketModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Crear Nuevo Ticket
          </h3>
        </div>
        <button @click="closeCreateTicketModal" class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="createTicket" class="space-y-6">
          <!-- Row 1: Ref, Tipo, Grupo -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Ref -->
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Ref.
              </label>
              <input
                v-model="newTicket.ref"
                type="text"
                placeholder="TS2509-0295"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              />
            </div>

            <!-- Tipo de solicitud -->
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Tipo de solicitud
              </label>
              <select 
                v-model="newTicket.type" 
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 4 5&quot;><path fill=&quot;%23666&quot; d=&quot;M2 0L0 2h4zm0 5L0 3h4z&quot;/></svg>'); background-position: right 0.7rem center; background-size: 0.65rem auto;"
              >
                <option v-for="type in ticketTypesOptions" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Grupo de Ticket -->
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Grupo de Ticket
              </label>
              <select 
                v-model="newTicket.group" 
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 4 5&quot;><path fill=&quot;%23666&quot; d=&quot;M2 0L0 2h4zm0 5L0 3h4z&quot;/></svg>'); background-position: right 0.7rem center; background-size: 0.65rem auto;"
              >
                <option v-for="group in ticketGroups" :key="group.value" :value="group.value">
                  {{ group.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Row 2: Gravedad, Asunto -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Gravedad -->
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Gravedad
              </label>
              <select
                v-model="newTicket.severity"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-10"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 4 5&quot;><path fill=&quot;%23666&quot; d=&quot;M2 0L0 2h4zm0 5L0 3h4z&quot;/></svg>'); background-position: right 0.7rem center; background-size: 0.65rem auto;"
              >
                <option v-for="severity in severityLevels" :key="severity.value" :value="severity.value">
                  {{ severity.label }}
                </option>
              </select>
            </div>

            <!-- Asunto -->
            <div class="md:col-span-3">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Asunto *
              </label>
              <input
                v-model="newTicket.subject"
                type="text"
                placeholder="Describe brevemente el problema..."
                required
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
              />
            </div>
          </div>

          <!-- Mensaje (WYSIWYG Editor) -->
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Mensaje
            </label>
            <div class="border rounded-lg" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
              <!-- Editor Toolbar -->
              <div class="flex items-center space-x-2 p-3 border-b" :class="isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'">
                <button type="button" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Negrita">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3v14h5.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.7-2.8-1.8-3.5C14.3 8.2 15 6.9 15 5.5 15 3 13 1 10.5 1H5v2zm2 2h3.5c1.4 0 2.5 1.1 2.5 2.5S11.9 10 10.5 10H7V5zm0 7h4c1.7 0 3 1.3 3 3s-1.3 3-3 3H7v-6z"/>
                  </svg>
                </button>
                <button type="button" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Cursiva">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 1h8v2h-2.5L9.8 17H12v2H4v-2h2.5L10.2 3H8V1z"/>
                  </svg>
                </button>
                <button type="button" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Subrayado">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 18h12v2H4v-2zM10 2C7.8 2 6 3.8 6 6v6c0 2.2 1.8 4 4 4s4-1.8 4-4V6c0-2.2-1.8-4-4-4zm2 10c0 1.1-.9 2-2 2s-2-.9-2-2V6c0-1.1.9-2 2-2s2 .9 2 2v6z"/>
                  </svg>
                </button>
                <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <button type="button" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Lista">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zm4-10h10v2H7V4zm0 5h10v2H7V9zm0 5h10v2H7v-2z"/>
                  </svg>
                </button>
                <button type="button" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Enlace">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
                  </svg>
                </button>
              </div>
              <!-- Editor Content -->
              <textarea
                v-model="newTicket.message"
                rows="8"
                placeholder="Describe detalladamente el problema o solicitud..."
                class="w-full p-3 resize-none focus:outline-none rounded-b-lg"
                :class="isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'"
              ></textarea>
            </div>
          </div>

          <!-- Row 3: Tercero y Contacto -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tercero -->
            <div class="relative">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Tercero
              </label>
              <div class="relative">
                <input
                  v-model="thirdpartySearch"
                  @focus="showThirdpartyDropdown = true"
                  @blur="() => window.setTimeout(() => showThirdpartyDropdown = false, 200)"
                  type="text"
                  placeholder="Buscar tercero..."
                  class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <!-- Dropdown -->
                <div v-if="showThirdpartyDropdown" class="absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'">
                  <div v-if="filteredTerceros.length === 0 && thirdpartySearch.length > 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    No se encontraron terceros
                  </div>
                  <div v-if="filteredTerceros.length === 0 && thirdpartySearch.length === 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Escribe para buscar terceros...
                  </div>
                  <div 
                    v-for="tercero in filteredTerceros" 
                    :key="tercero.id"
                    @click="selectThirdparty(tercero)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ tercero.name }}</div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      {{ tercero.email || 'Sin email' }}
                      <span v-if="tercero.phone" class="ml-2">• {{ tercero.phone }}</span>
                    </div>
                    <div v-if="tercero.town || tercero.country_code" class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ tercero.town }}{{ tercero.town && tercero.country_code ? ', ' : '' }}{{ tercero.country_code }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contacto/Dirección -->
            <div class="relative">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Contacto/Dirección
              </label>
              <div class="relative">
                <input
                  v-model="contactSearch"
                  @focus="showContactDropdown = true"
                  @blur="() => window.setTimeout(() => showContactDropdown = false, 200)"
                  type="text"
                  placeholder="Buscar contacto..."
                  class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <!-- Dropdown -->
                <div v-if="showContactDropdown" class="absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'">
                  <div 
                    v-for="contact in filteredContacts" 
                    :key="contact.id"
                    @click="selectContact(contact)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ contact.firstname }} {{ contact.lastname }}</div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ contact.email }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notificar a los terceros -->
          <div class="flex items-center justify-between p-4 rounded-lg border" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'">
            <div>
              <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Notificar a los terceros en la creación
              </label>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Enviar email de notificación al tercero y contactos seleccionados
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="newTicket.notifyThirdparty" 
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <!-- Row 4: Asignada a, Proyecto, Contrato -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Asignada a -->
            <div class="relative">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Asignada a
              </label>
              <div class="relative">
                <input
                  v-model="userSearch"
                  @focus="showUserDropdown = true"
                  @blur="() => window.setTimeout(() => showUserDropdown = false, 200)"
                  type="text"
                  placeholder="Buscar usuario..."
                  class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <!-- Dropdown -->
                <div v-if="showUserDropdown" class="absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'">
                  <div v-if="filteredUsers.length === 0 && userSearch.length > 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    No se encontraron usuarios
                  </div>
                  <div v-if="filteredUsers.length === 0 && userSearch.length === 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Escribe para buscar usuarios...
                  </div>
                  <div 
                    v-for="user in filteredUsers" 
                    :key="user.id"
                    @click="selectUser(user)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ user.firstname }} {{ user.lastname }}</div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      {{ user.login }}
                      <span v-if="user.email" class="ml-2">• {{ user.email }}</span>
                    </div>
                    <div v-if="user.job || user.office_phone" class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      <span v-if="user.job">{{ user.job }}</span>
                      <span v-if="user.job && user.office_phone"> • </span>
                      <span v-if="user.office_phone">{{ user.office_phone }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Proyecto -->
            <div class="relative">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Proyecto
              </label>
              <div class="relative">
                <input
                  v-model="projectSearch"
                  @focus="showProjectDropdown = true"
                  @blur="() => window.setTimeout(() => showProjectDropdown = false, 200)"
                  type="text"
                  placeholder="Buscar proyecto..."
                  :disabled="!newTicket.thirdparty"
                  class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <!-- Dropdown -->
                <div v-if="showProjectDropdown && newTicket.thirdparty" class="absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'">
                  <!-- Búsqueda sin resultados -->
                  <div v-if="filteredProjects.length === 0 && projectSearch.length > 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    No se encontraron proyectos para "{{ projectSearch }}"
                  </div>
                  
                  <!-- Tercero sin proyectos -->
                  <div v-if="filteredProjects.length === 0 && projectSearch.length === 0 && availableProjectsForTicket.length === 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {{ newTicket.thirdparty.name }} no tiene proyectos
                    </div>
                  </div>
                  
                  <!-- Instrucción de búsqueda -->
                  <div v-if="filteredProjects.length === 0 && projectSearch.length === 0 && availableProjectsForTicket.length > 0" class="px-3 py-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    Escribe para buscar entre {{ availableProjectsForTicket.length }} proyecto(s)...
                  </div>
                  
                  <!-- Lista de proyectos -->
                  <div 
                    v-for="project in filteredProjects" 
                    :key="project.id"
                    @click="selectProject(project)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div class="font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">{{ project.title || project.ref }}</div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      Ref: {{ project.ref }}
                      <span v-if="project.date_start" class="ml-2">• Inicio: {{ formatDate(project.date_start) }}</span>
                    </div>
                    <div v-if="project.description" class="text-xs mt-1 truncate" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                      {{ project.description }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!newTicket.thirdparty" class="text-xs mt-1" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                Selecciona un tercero primero
              </div>
            </div>

            <!-- Contrato -->
            <div class="relative">
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Contrato
              </label>
              <div class="relative">
                <input
                  v-model="contractSearch"
                  @focus="showContractDropdown = true"
                  @blur="() => window.setTimeout(() => showContractDropdown = false, 200)"
                  type="text"
                  placeholder="Buscar contrato..."
                  class="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button
              type="button"
              @click="closeCreateTicketModal"
              class="px-6 py-2 text-sm font-medium border rounded-lg transition-colors"
              :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!newTicket.subject || creatingTicket"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg v-if="creatingTicket" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ creatingTicket ? 'Creando...' : 'Crear Ticket' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Sistema de Notificaciones -->
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="min-w-80 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in"
      :class="{
        'bg-green-500 text-white': notification.type === 'success',
        'bg-red-500 text-white': notification.type === 'error',
        'bg-yellow-500 text-white': notification.type === 'warning',
        'bg-blue-500 text-white': notification.type === 'info'
      }"
    >
      <!-- Icono -->
      <svg v-if="notification.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else-if="notification.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg v-else-if="notification.type === 'warning'" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <!-- Mensaje -->
      <span class="flex-1 text-sm font-medium">{{ notification.message }}</span>
    </div>
  </div>

  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useProjects } from '../composables/useProjects'
import http from '../utils/http'
import axios from 'axios'
import { useTicketsCounter } from '../composables/useTicketsCounter'
import { useInterventions } from '@/composables/useInterventions'
import { useTicketTimer } from '@/composables/useTicketTimer'
import { useAuthStore } from '../stores/auth'
import { useTicketReferences } from '@/composables/useTicketReferences'
import { useTicketDetails } from '@/composables/useTicketDetails'
import { useEmailTemplates } from '@/composables/useEmailTemplates'
import TimerButton from '@/components/TimerButton.vue'
import ThirdpartySearchInput from '@/components/ThirdpartySearchInput.vue'
import TicketDetailModal from '@/components/TicketDetailModal.vue'

const { isDark } = useTheme()
const authStore = useAuthStore()

// Usar composable de detalles de ticket
const {
  showModal,
  selectedTicket,
  ticketDetails,
  loadingDetails,
  openTicketDetails,
  closeTicketDetails,
  refreshTicketDetails,
  updateTicketStatus,
  updateTicketField
} = useTicketDetails()
const { refreshCounter: updateTicketsCounter } = useTicketsCounter()
const { getProjectName, preloadProjectsFromItems } = useProjects()

// Inicializar composable de referencias de tickets
const {
  ticketCategories,
  ticketSeverities,
  ticketTypes,
  fetchAllTicketReferences,
  getCategoryName,
  getSeverityName,
  getTypeName
} = useTicketReferences()

// Debug: Check if useInterventions is working
//  console.log('=== IMPORTING INTERVENTIONS ===')
const interventionsComposable = useInterventions()
//  console.log('Interventions composable:', interventionsComposable)
const { fetchUserInterventions, getInterventionsForTicket } = interventionsComposable

// Timer functionality (solo para el modal de guardado)
const { stopTimer } = useTicketTimer()

// Timer state
const showTimeEntryModal = ref(false)
const timeEntryNote = ref('')
const recordedTime = ref(0)
const isSavingTimeEntry = ref(false)
const showFullDescription = ref(false)

// Manual intervention state
const showManualInterventionModal = ref(false)
const isSavingIntervention = ref(false)
const manualIntervention = ref({
  startTime: '',
  endTime: '',
  member: '',
  note: '',
  useDuration: false,
  duration: 0,
  type: 'message', // 'message' o 'email'
  emailSubject: '',
  emailTo: '',
  emailContent: '',
  emailAttachments: []
})

// Comments state
const newComment = ref('')
const commentType = ref('message') // 'message' or 'email'
const sendingComment = ref(false)
const messagesKey = ref(0) // Key to force re-render of messages
const commentAttachments = ref([]) // Archivos adjuntos para comentarios por email
const showInterventions = ref(false) // Control visibility of interventions list

// Email templates state
const { loading: loadingTemplates, getEmailTemplates, getSubstitutionVariables } = useEmailTemplates()
const emailTemplates = ref([])
const selectedTemplate = ref('')
const substitutionVariables = ref([])
const loadingVariables = ref(false)

// Watch commentType para debugging
watch(commentType, (newValue) => {
  console.log('📝 Tipo de comentario cambiado a:', newValue)
  console.log('📧 Plantillas disponibles:', emailTemplates.value.length)
  console.log('🔄 Loading templates:', loadingTemplates.value)
})

// Followers state (internally intervinientes/contacts)
const ticketFollowers = ref([])
const internalFollowers = ref([]) // Usuarios internos de Dolibarr
const externalFollowers = ref([]) // Contactos externos del cliente
const availableUsers = ref([])
const availableContacts = ref([])
const selectedFollower = ref('')
const loadingFollowers = ref(false)
const showFollowersDropdown = ref(false)
const followersSearchTerm = ref('')

// Reminders state
const ticketReminders = ref([])
const showReminderModal = ref(false)

// Complete ticket state
const showCompleteModal = ref(false)
const completingTicket = ref(false)

// Delete ticket state
const showDeleteModal = ref(false)
const deletingTicket = ref(false)
const deleteConfirmationText = ref('')

// Email state (no modal needed, shown inline)
// emailRecipientsPreview computed property handles the display

// Create ticket modal state
const showCreateTicketModal = ref(false)
const creatingTicket = ref(false)
const newTicket = ref({
  ref: '',
  type: '',
  group: '',
  severity: 'NORMAL',
  subject: '',
  message: '',
  thirdparty: null,
  contact: null,
  assignedTo: null,
  project: null,
  contract: null,
  notifyThirdparty: false
})

// Options for selectors (valores reales de Dolibarr)
// Computed property para tipos de tickets desde referencias de Dolibarr
const ticketTypesOptions = computed(() => {
  if (ticketTypes.value && ticketTypes.value.length > 0) {
    return [
      { value: '', label: 'Seleccionar tipo...' },
      ...ticketTypes.value.map(type => ({
        value: type.code || type.id,
        label: type.label || type.name || type.code
      }))
    ]
  }
  
  // Fallback si no se han cargado las referencias
  return [
    { value: '', label: 'Seleccionar tipo...' },
    { value: 'COM', label: 'Pregunta comercial' },
    { value: 'HELP', label: 'Solicitud de ayuda funcional' },
    { value: 'ISSUE', label: 'Problema o error' },
    { value: 'REQUEST', label: 'Solicitud de cambio o mejora' },
    { value: 'OTHER', label: 'Otro' }
  ]
})

// Computed property para categorías de tickets desde referencias de Dolibarr
const ticketGroups = computed(() => {
  if (ticketCategories.value && ticketCategories.value.length > 0) {
    return [
      { value: '', label: 'Seleccionar categoría...' },
      ...ticketCategories.value.map(category => ({
        value: category.code || category.id,
        label: category.label || category.name || category.code
      }))
    ]
  }
  
  // Fallback si no se han cargado las referencias
  return [
    { value: '', label: 'Seleccionar grupo...' },
    { value: 'PLUGIN', label: 'Plugin' },
    { value: 'HOSTING', label: 'Hosting' },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
    { value: 'PROGRAMACION', label: 'Programación' },
    { value: 'KIT-DIGITAL', label: 'Kit Digital' },
    { value: 'OTHER', label: 'Otro' }
  ]
})

// Computed property para niveles de gravedad desde referencias de Dolibarr
const severityLevels = computed(() => {
  if (ticketSeverities.value && ticketSeverities.value.length > 0) {
    return [
      { value: '', label: 'Seleccionar gravedad...' },
      ...ticketSeverities.value.map(severity => ({
        value: severity.code || severity.id,
        label: severity.label || severity.name || severity.code
      }))
    ]
  }
  
  // Fallback si no se han cargado las referencias
  return [
    { value: '', label: 'Seleccionar gravedad...' },
    { value: 'LOW', label: 'Bajo' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'HIGH', label: 'Alto' },
    { value: 'BLOCKING', label: 'Crítico, Bloqueo' }
  ]
})

// Search states for selectors
const thirdpartySearch = ref('')
const contactSearch = ref('')
const userSearch = ref('')
const projectSearch = ref('')
const contractSearch = ref('')

// Dropdown states
const showThirdpartyDropdown = ref(false)
const showContactDropdown = ref(false)
const showUserDropdown = ref(false)
const showProjectDropdown = ref(false)
const showContractDropdown = ref(false)

// Data for selectors
const availableProjectsForTicket = ref([])
const availableUsersForTicket = ref([])
const newReminder = ref({
  title: '',
  date: '',
  assignedTo: '',
  description: '',
  sendEmail: false,
  actionCode: 'AC_RDV' // Tipo de recordatorio por defecto
})

// Función para inicializar el formulario de recordatorio
const initializeReminderForm = () => {
  const currentUser = authStore.user
  const defaultAssignedTo = currentUser ? `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim() : ''
  
  newReminder.value = {
    title: '',
    date: '',
    assignedTo: defaultAssignedTo, // Asignar al usuario actual por defecto
    description: '',
    sendEmail: false,
    actionCode: 'AC_RDV'
  }
}

// Timer methods
const handleTimerStopped = ({ entityId, elapsedSeconds }) => {
  // Find the ticket by ID
  const ticket = filteredTickets.value.find(t => t.id == entityId)
  if (!ticket) return
  
  // Set up the time entry modal
  recordedTime.value = elapsedSeconds
  selectedTicket.value = ticket
  showTimeEntryModal.value = true
  //  console.log('Timer stopped, elapsed seconds:', elapsedSeconds)
}

const saveTimeEntry = async () => {
  if (isSavingTimeEntry.value) return // Prevenir doble click
  
  isSavingTimeEntry.value = true
  let interventionId = null
  
  try {
    //  console.log('🚀 INICIANDO PROCESO DE CREACIÓN DE INTERVENCIÓN')
    //  console.log('='.repeat(60))
    
    // PASO 1: Crear intervención en BORRADOR
    //  console.log('📝 PASO 1: Creando intervención en borrador...')
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
      // console.warn('⚠️ Ticket sin proyecto asignado, usando proyecto por defecto')
      interventionData.fk_project = 1 // Cambiar por el ID del proyecto por defecto de tu sistema
    }

    //  console.log('📋 Datos de intervención:', interventionData)
    
    let response
    try {
      response = await http.post('/api/doli/interventions', interventionData)
      //  console.log('📊 RESPUESTA COMPLETA DEL SERVIDOR:')
      //  console.log('   Response status:', response.status)
      //  console.log('   Response data:', response.data)
      //  console.log('   Response data type:', typeof response.data)
      //  console.log('   Response data keys:', response.data ? Object.keys(response.data) : 'No data')
      //  console.log('   Response headers:', response.headers)
    } catch (createError) {
      // console.error('❌ ERROR AL CREAR INTERVENCIÓN:')
      // console.error('   Error status:', createError.response?.status)
      // console.error('   Error data:', createError.response?.data)
      // console.error('   Error message:', createError.message)
      
      // Si falla por falta de proyecto, intentar sin proyecto
      if (createError.response?.data?.error?.message?.includes('fk_project')) {
        //  console.log('🔄 Reintentando sin proyecto...')
        try {
          const interventionDataNoProject = { ...interventionData }
          delete interventionDataNoProject.fk_project
          
          response = await http.post('/api/doli/interventions', interventionDataNoProject)
          //  console.log('✅ Intervención creada sin proyecto')
        } catch (secondError) {
          // console.error('❌ También falló sin proyecto:', secondError.response?.data)
          throw createError // Lanzar el error original
        }
      } else {
        throw createError
      }
    }
    
    // Intentar extraer ID de diferentes formas
    interventionId = response.data?.id || response.data?.rowid || response.data
    
    //  console.log('✅ PASO 1 COMPLETADO - Intervención creada:')
    //  console.log('   ID extraído:', interventionId)
    //  console.log('   Tipo de ID:', typeof interventionId)
    //  console.log('   Ref:', response.data?.ref)
    //  console.log('   Status:', response.data?.statut || response.data?.status)
    //  console.log('-'.repeat(60))
    
    if (!interventionId || interventionId === null || interventionId === undefined) {
      // console.error('❌ NO SE PUDO EXTRAER ID DE LA RESPUESTA')
      // console.error('   Estructura de response.data:', Object.keys(response.data || {}))
      throw new Error('No se obtuvo ID de la intervención creada')
    }

    //  console.log('-'.repeat(60))

    // PASO 2: Agregar línea con nota y tiempo
    //  console.log('📋 PASO 2: Agregando línea a la intervención...')
    const startTime = Math.floor(Date.now() / 1000) - recordedTime.value
    const endTime = Math.floor(Date.now() / 1000)
    
    // Usar la estructura que funciona (alternativa 1)
    const lineData = {
      description: timeEntryNote.value || 'Tiempo registrado desde cronómetro',
      duration: recordedTime.value,
      date: startTime
    }
    
     // console.log('📋 Datos de línea:', lineData)
     // console.log('🕐 Hora inicio:', new Date(startTime * 1000).toLocaleString())
     // console.log('🕐 Hora fin:', new Date(endTime * 1000).toLocaleString())
     // console.log('⏱️ Duración:', recordedTime.value, 'segundos')
    
    try {
      const lineResponse = await http.post(`/api/doli/interventions/${interventionId}/lines`, lineData)
       // console.log('✅ PASO 2 COMPLETADO - Línea agregada:')
       // console.log('   Line ID:', lineResponse.data)
       // console.log('   Descripción:', lineData.description)
       // console.log('   Duración:', lineData.duration)
    } catch (lineError) {
      // console.error('❌ PASO 2 FALLÓ - Error agregando línea:')
      // console.error('   Error status:', lineError.response?.status)
      // console.error('   Error data:', lineError.response?.data)
      // console.error('   Error message:', lineError.message)
      throw lineError
    }
    //  console.log('-'.repeat(60))

    // PASO 3: Vincular intervención al ticket
    //  console.log('🔗 PASO 3: Vinculando intervención al ticket...')
    
    try {
      // ALTERNATIVA 1: Usar API nativa de Dolibarr objectlinks
      //  console.log('🔗 ALTERNATIVA 1: Intentando con API nativa objectlinks...')
      
      const objectLinksData = {
        fk_source: selectedTicket.value.id.toString(),
        sourcetype: "ticket",
        fk_target: interventionId.toString(),
        targettype: "fichinter"
      }
      
      //  console.log('🔗 Datos objectlinks:', objectLinksData)
      const linkResponse = await http.post(`/api/doli/objectlinks`, objectLinksData)
      //  console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con API nativa')
      //  console.log('   Link result:', linkResponse.data)
      
    } catch (objectLinksError) {
      // console.warn('❌ ALTERNATIVA 1 FALLÓ - Intentando módulo personalizado...')
      // console.warn('   ObjectLinks error status:', objectLinksError.response?.status)
      // console.warn('   ObjectLinks error data:', objectLinksError.response?.data)
      
      // ALTERNATIVA 2: Usar módulo personalizado a través del proxy
      try {
        //  console.log('🔗 ALTERNATIVA 2: Usando módulo personalizado a través del proxy...')
        
        const customLinkResponse = await http.post(`/api/doli/dolibarmodernfrontendapi/link/${selectedTicket.value.id}/${interventionId}`)
         // console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con módulo personalizado')
         // console.log('   Custom link result:', customLinkResponse.data)
        
      } catch (customError) {
        // console.error('❌ ALTERNATIVA 2 TAMBIÉN FALLÓ')
        // console.error('   Custom error status:', customError.response?.status)
        // console.error('   Custom error data:', customError.response?.data)
        // console.error('   Custom error message:', customError.message)
        
        // ALTERNATIVA 3: Nota privada como último recurso
        try {
           // console.log('🔗 ALTERNATIVA 3: Usando nota privada como último recurso...')
          
          const referenceData = {
            note_private: `[TICKET_LINK]\nTicket: ${selectedTicket.value.ref} (ID: ${selectedTicket.value.id})\nFecha: ${new Date().toLocaleString('es-ES')}\nDuración: ${Math.floor(recordedTime.value / 60)}m ${recordedTime.value % 60}s\nEstado: Vinculado automáticamente desde cronómetro\n[/TICKET_LINK]`
          }
          
           // console.log('📋 Datos de referencia:', referenceData)
          const referenceResponse = await http.put(`/api/doli/interventions/${interventionId}`, referenceData)
           // console.log('✅ PASO 3 COMPLETADO - Referencia añadida en nota privada')
           // console.log('   Reference result:', referenceResponse.data)
          
        } catch (referenceError) {
          // console.error('❌ TODAS LAS ALTERNATIVAS FALLARON')
          // console.error('   Reference error:', referenceError.response?.data)
          throw new Error('Todas las alternativas de vinculación fallaron')
        }
      }
    }
    //  console.log('-'.repeat(60))

    // PASO 4: Validar la intervención
     // console.log('🔍 PASO 4: Validando intervención...')
    
    const validateData = {
      notrigger: 1
    }
    
     // console.log('🔍 Datos de validación:', validateData)
    
    try {
      const validateResponse = await http.post(`/api/doli/interventions/${interventionId}/validate`, validateData)
       // console.log('✅ PASO 4 COMPLETADO - Intervención validada')
       // console.log('   Validate result:', validateResponse.data)
    } catch (validateError) {
      // console.warn('⚠️ PASO 4 FALLÓ - Error validando intervención')
      // console.warn('   Validate error status:', validateError.response?.status)
      // console.warn('   Validate error data:', validateError.response?.data)
      // console.warn('   Validate error message:', validateError.message)
       // console.log('💡 La intervención se creó y vinculó, pero no se pudo validar')
    }
    //  console.log('-'.repeat(60))
    
    // Reset modal state
    showTimeEntryModal.value = false
    timeEntryNote.value = ''
    recordedTime.value = 0
    
    // Refresh interventions
    if (authStore.user?.id) {
      await fetchUserInterventions(true)
    }
    
     // console.log('🎉 PROCESO COMPLETADO EXITOSAMENTE')
     // console.log('='.repeat(60))
    
  } catch (error) {
    // console.error('💥 ERROR GENERAL EN EL PROCESO:')
    // console.error('   Intervention ID:', interventionId)
    // console.error('   Error:', error.message)
    // console.error('   Details:', error.response?.data)
    // console.error('='.repeat(60))
    
    alert('Error al guardar la intervención: ' + (error.response?.data?.message || error.message))
  } finally {
    isSavingTimeEntry.value = false
  }
}

const cancelTimeEntry = () => {
  showTimeEntryModal.value = false
  timeEntryNote.value = ''
  recordedTime.value = 0
}

// Filter by unassigned tickets
const filterByUnassigned = () => {
  // Limpiar otros filtros
  selectedTercero.value = null
  selectedUser.value = null
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  typeFilter.value = ''
  
  // IMPORTANTE: Desactivar "Mis Tickets" para ver tickets sin asignar
  showOnlyMyTickets.value = false
  showUnassignedOnly.value = true
  applyFilters()
}

// Filter by assigned tickets
const filterByAssigned = () => {
  // Limpiar otros filtros
  selectedTercero.value = null
  selectedUser.value = null
  selectedProject.value = null
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  typeFilter.value = ''
  
  // Mostrar solo tickets asignados (no cerrados)
  showOnlyMyTickets.value = true
  showUnassignedOnly.value = false
  applyFilters()
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
    duration: 0,
    type: 'message',
    emailSubject: '',
    emailTo: '',
    emailContent: '',
    emailAttachments: []
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

// Funciones del editor WYSIWYG
const emailEditor = ref(null)
const emailFileInput = ref(null)
const commentEditor = ref(null)
const commentFileInput = ref(null)

const formatText = (command) => {
  document.execCommand(command, false, null)
  emailEditor.value?.focus()
}

const insertList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
  emailEditor.value?.focus()
}

const updateEmailContent = () => {
  if (emailEditor.value) {
    manualIntervention.value.emailContent = emailEditor.value.innerHTML
  }
}

// Funciones del editor WYSIWYG para comentarios
const formatCommentText = (command) => {
  document.execCommand(command, false, null)
  commentEditor.value?.focus()
}

const insertCommentList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
  commentEditor.value?.focus()
}

const updateCommentContent = () => {
  if (commentEditor.value) {
    newComment.value = commentEditor.value.innerHTML
  }
}

// Watcher para sincronizar contenido entre editor y textarea
watch(commentType, (newType, oldType) => {
  if (newType === 'email' && oldType === 'message') {
    // Cambio de mensaje a email: convertir texto plano a HTML
    nextTick(() => {
      if (commentEditor.value && newComment.value) {
        commentEditor.value.innerHTML = newComment.value.replace(/\n/g, '<br>')
      }
    })
  } else if (newType === 'message' && oldType === 'email') {
    // Cambio de email a mensaje: convertir HTML a texto plano
    if (commentEditor.value) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = commentEditor.value.innerHTML
      newComment.value = tempDiv.textContent || tempDiv.innerText || ''
    }
    // Limpiar archivos adjuntos cuando se cambia a mensaje
    commentAttachments.value = []
  }
})

// Funciones para manejo de archivos adjuntos de comentarios
const handleCommentFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processCommentFiles(files, event.target)
}

const handleCommentFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processCommentFiles(files)
}

const processCommentFiles = (files, inputElement = null) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif']
  
  files.forEach(file => {
    // Validar tamaño
    if (file.size > maxSize) {
      alert(`El archivo "${file.name}" es demasiado grande. Máximo 10MB.`)
      return
    }
    
    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      alert(`El archivo "${file.name}" no es un tipo permitido.`)
      return
    }
    
    // Agregar archivo
    commentAttachments.value.push({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    })
  })
  
  // Limpiar input si se proporcionó
  if (inputElement) {
    inputElement.value = ''
  }
}

const removeCommentAttachment = (index) => {
  commentAttachments.value.splice(index, 1)
}

// Función helper para convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remover el prefijo "data:tipo/mime;base64," para obtener solo el base64
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// Función para obtener el nombre de la empresa
const getCompanyName = async () => {
  try {
    const response = await http.get('/api/doli/setup/company')
    return response.data?.name || 'Sistema'
  } catch (error) {
    // console.warn('Error obteniendo nombre de empresa:', error)
    return 'Sistema'
  }
}

// Función para generar el asunto del email
const generateEmailSubject = async (ticketRef, ticketTitle) => {
  const companyName = await getCompanyName()
  return `[${companyName} - Ticket ${ticketRef}] ${ticketTitle}`
}

// Función para obtener la firma del usuario
const getUserSignature = async (userId) => {
  try {
    // Primero intentar desde authStore si tiene signature
    if (authStore.user?.signature) {
      return authStore.user.signature
    }
    
    // Si no, obtener desde la API
    const response = await http.get(`/api/doli/users/${userId}`)
    return response.data?.signature || ''
  } catch (error) {
    // console.warn('Error obteniendo firma del usuario:', error)
    return ''
  }
}

// Función para enviar mensaje privado al ticket
const sendPrivateMessage = async (ticketId, message) => {
  try {
    const trackId = selectedTicket.value?.track_id || ticketDetails.value?.track_id
    
    if (!trackId) {
      // console.warn('No se encontró track_id para mensaje privado')
      return
    }

    const messageData = {
      track_id: trackId,
      message: message,
      private: 1  // Mensaje privado
    }

    await http.post('/api/doli/tickets/newmessage', messageData)
    // console.log('✅ Mensaje privado enviado al ticket')
  } catch (error) {
    // console.error('Error enviando mensaje privado:', error)
  }
}

// Función para eliminar destinatarios duplicados
const removeDuplicateRecipients = (recipients) => {
  const seen = new Set()
  const unique = []
  
  recipients.forEach(email => {
    const normalizedEmail = email.toLowerCase().trim()
    if (!seen.has(normalizedEmail) && normalizedEmail) {
      seen.add(normalizedEmail)
      unique.push(email)
    }
  })
  
  return unique
}

// Funciones para manejo de archivos adjuntos
const handleEmailFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processEmailFiles(files, event.target)
}

const handleEmailFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processEmailFiles(files)
}

const processEmailFiles = (files, inputElement = null) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif']
  
  files.forEach(file => {
    // Validar tamaño
    if (file.size > maxSize) {
      alert(`El archivo "${file.name}" es demasiado grande. Máximo 10MB.`)
      return
    }
    
    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      alert(`El archivo "${file.name}" no es un tipo permitido.`)
      return
    }
    
    // Agregar archivo
    manualIntervention.value.emailAttachments.push({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    })
  })
  
  // Limpiar input si se proporcionó
  if (inputElement) {
    inputElement.value = ''
  }
}

const removeEmailAttachment = (index) => {
  manualIntervention.value.emailAttachments.splice(index, 1)
}

const formatEmailFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const saveManualIntervention = async () => {
  // Prevenir múltiples clics
  if (isSavingIntervention.value) {
    return
  }
  
  isSavingIntervention.value = true
  let interventionId = null
  
  try {
    // Si es tipo email, usar el endpoint de email
    if (manualIntervention.value.type === 'email') {
      // console.log('📧 ENVIANDO EMAIL DESDE INTERVENCIÓN MANUAL')
      
      const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
      if (!ticketId) {
        throw new Error('No se encontró el ID del ticket')
      }
      
      // Convertir archivos adjuntos a base64
      const attachments = []
      for (const attachment of manualIntervention.value.emailAttachments) {
        try {
          const base64 = await fileToBase64(attachment.file)
          attachments.push({
            name: attachment.name,
            size: attachment.size,
            type: attachment.file.type,
            content: base64
          })
        } catch (error) {
          // console.error('Error convirtiendo archivo a base64:', attachment.name, error)
        }
      }
      
      // Preparar datos del email
      const rawRecipients = manualIntervention.value.emailTo ? [manualIntervention.value.emailTo] : []
      const recipients = removeDuplicateRecipients(rawRecipients)
      
      if (rawRecipients.length !== recipients.length) {
        // console.log('🔄 Duplicados eliminados en intervención manual:', {
        //   original: rawRecipients.length,
        //   unique: recipients.length,
        //   removed: rawRecipients.length - recipients.length
        // })
      }
      
      // Generar asunto con formato [EMPRESA - Ticket REF] TITULO
      const ticketRef = selectedTicket.value?.ref || ticketDetails.value?.ref || ticketId
      const ticketTitle = selectedTicket.value?.subject || ticketDetails.value?.subject || 'Ticket'
      const emailSubject = await generateEmailSubject(ticketRef, ticketTitle)
      
      // Obtener firma del usuario
      const userId = authStore.user?.id
      const userSignature = userId ? await getUserSignature(userId) : ''
      
      // Agregar firma al mensaje si existe
      let emailMessage = manualIntervention.value.emailContent || manualIntervention.value.note
      if (userSignature) {
        emailMessage += `<br><br>---<br>${userSignature}`
      }
      
      const emailData = {
        subject: manualIntervention.value.emailSubject || emailSubject,
        message: emailMessage,
        recipients: recipients,
        attachments: attachments
      }

      // console.log('📤 Enviando email con datos:', {
      //   subject: emailData.subject,
      //   recipients: emailData.recipients,
      //   attachments: attachments.length
      // })

      const response = await http.post(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/sendemail`, emailData)
      // console.log('✅ Email enviado:', response.data)
      
      // Enviar mensaje privado al ticket para registro
      const privateMessage = `Email enviado a: ${recipients.join(', ')}\nAsunto: ${emailData.subject}\n\n${emailMessage}`
      await sendPrivateMessage(ticketId, privateMessage)
      
      // Cerrar modal y limpiar
      closeManualInterventionModal()
      
      // Refrescar ticket
      if (ticketId) {
        await fetchTicketDetails(ticketId)
      }
      
      return
    }
    
    // Proceso normal para intervenciones manuales (no email)
    // console.log('🚀 INICIANDO PROCESO DE CREACIÓN DE INTERVENCIÓN MANUAL')
    // console.log('='.repeat(60))
    
    // PASO 1: Crear intervención en BORRADOR
     // console.log('📝 PASO 1: Creando intervención manual en borrador...')
    
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
      // console.warn('⚠️ Ticket sin proyecto asignado, usando proyecto por defecto')
      interventionData.fk_project = 1 // Cambiar por el ID del proyecto por defecto de tu sistema
    }

    //  console.log('📋 Datos de intervención manual:', interventionData)
    
    let response
    try {
      response = await http.post('/api/doli/interventions', interventionData)
      //  console.log('📊 RESPUESTA COMPLETA DEL SERVIDOR:')
      //  console.log('   Response status:', response.status)
      //  console.log('   Response data:', response.data)
      //  console.log('   Response data type:', typeof response.data)
      //  console.log('   Response data keys:', response.data ? Object.keys(response.data) : 'No data')
      //  console.log('   Response headers:', response.headers)
    } catch (createError) {
      // console.error('❌ ERROR AL CREAR INTERVENCIÓN MANUAL:')
      // console.error('   Error status:', createError.response?.status)
      // console.error('   Error data:', createError.response?.data)
      // console.error('   Error message:', createError.message)
      
      // Si falla por falta de proyecto, intentar sin proyecto
      if (createError.response?.data?.error?.message?.includes('fk_project')) {
        //  console.log('🔄 Reintentando sin proyecto...')
        try {
          const interventionDataNoProject = { ...interventionData }
          delete interventionDataNoProject.fk_project
          
          response = await http.post('/api/doli/interventions', interventionDataNoProject)
          //  console.log('✅ Intervención creada sin proyecto')
        } catch (retryError) {
          // console.error('❌ Error en reintento:', retryError)
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

     // console.log('🆔 ID de intervención extraído:', interventionId)

    if (!interventionId) {
      throw new Error('No se pudo obtener el ID de la intervención creada')
    }

    //  console.log('-'.repeat(60))

    // PASO 2: Agregar línea con nota y tiempo
    //  console.log('📋 PASO 2: Agregando línea a la intervención...')
    
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
    
     // console.log('📋 Datos de línea:', lineData)
     // console.log('🕐 Hora inicio:', new Date(startTime * 1000).toLocaleString())
     // console.log('🕐 Hora fin:', new Date(endTime * 1000).toLocaleString())
     // console.log('⏱️ Duración:', duration, 'segundos')
    
    try {
      const lineResponse = await http.post(`/api/doli/interventions/${interventionId}/lines`, lineData)
       // console.log('✅ PASO 2 COMPLETADO - Línea agregada:')
       // console.log('   Line ID:', lineResponse.data)
       // console.log('   Descripción:', lineData.description)
       // console.log('   Duración:', lineData.duration)
    } catch (lineError) {
      // console.error('❌ PASO 2 FALLÓ - Error agregando línea:')
      // console.error('   Error status:', lineError.response?.status)
      // console.error('   Error data:', lineError.response?.data)
      // console.error('   Error message:', lineError.message)
      throw lineError
    }
    //  console.log('-'.repeat(60))

    // PASO 3: Vincular intervención al ticket (igual que el timer)
    //  console.log('🔗 PASO 3: Vinculando intervención al ticket...')
    
    try {
      // ALTERNATIVA 1: Usar API nativa de Dolibarr objectlinks
      //  console.log('🔗 ALTERNATIVA 1: Intentando con API nativa objectlinks...')
      
      const objectLinksData = {
        fk_source: (selectedTicket.value.id || ticketDetails.value.id).toString(),
        sourcetype: "ticket",
        fk_target: interventionId.toString(),
        targettype: "fichinter"
      }
      
      //  console.log('🔗 Datos objectlinks:', objectLinksData)
      const linkResponse = await http.post(`/api/doli/objectlinks`, objectLinksData)
      //  console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con API nativa')
      //  console.log('   Link result:', linkResponse.data)
      
    } catch (objectLinksError) {
      // console.warn('❌ ALTERNATIVA 1 FALLÓ - Intentando módulo personalizado...')
      // console.warn('   ObjectLinks error status:', objectLinksError.response?.status)
      // console.warn('   ObjectLinks error data:', objectLinksError.response?.data)
      
      // ALTERNATIVA 2: Usar módulo personalizado a través del proxy
      try {
        //  console.log('🔗 ALTERNATIVA 2: Usando módulo personalizado a través del proxy...')
        
        const ticketId = selectedTicket.value.id || ticketDetails.value.id
        const customLinkResponse = await http.post(`/api/doli/dolibarmodernfrontendapi/link/${ticketId}/${interventionId}`)
         // console.log('✅ PASO 3 COMPLETADO - Vinculación exitosa con módulo personalizado')
         // console.log('   Custom link result:', customLinkResponse.data)
        
      } catch (customError) {
        // console.error('❌ ALTERNATIVA 2 TAMBIÉN FALLÓ')
        // console.error('   Custom error status:', customError.response?.status)
        // console.error('   Custom error data:', customError.response?.data)
        // console.error('   Custom error message:', customError.message)
        
        // ALTERNATIVA 3: Nota privada como último recurso
        try {
           // console.log('🔗 ALTERNATIVA 3: Usando nota privada como último recurso...')
          
          const referenceData = {
            note_private: `[TICKET_LINK]\nTicket: ${selectedTicket.value.ref || ticketDetails.value.ref} (ID: ${selectedTicket.value.id || ticketDetails.value.id})\nFecha: ${new Date().toLocaleString('es-ES')}\nTipo: Intervención manual\nEstado: Vinculado automáticamente desde formulario manual\n[/TICKET_LINK]`
          }
          
           // console.log('📋 Datos de referencia:', referenceData)
          const referenceResponse = await http.put(`/api/doli/interventions/${interventionId}`, referenceData)
           // console.log('✅ PASO 3 COMPLETADO - Referencia añadida en nota privada')
           // console.log('   Reference result:', referenceResponse.data)
          
        } catch (referenceError) {
          // console.error('❌ TODAS LAS ALTERNATIVAS FALLARON')
          // console.error('   Reference error:', referenceError.response?.data)
          // console.warn('⚠️ La intervención se creó pero no se pudo vincular al ticket')
        }
      }
    }
    //  console.log('-'.repeat(60))

    // PASO 4: Validar la intervención
     // console.log('🔍 PASO 4: Validando intervención...')
    
    const validateData = {
      notrigger: 1
    }
    
     // console.log('🔍 Datos de validación:', validateData)
    
    try {
      const validateResponse = await http.post(`/api/doli/interventions/${interventionId}/validate`, validateData)
       // console.log('✅ PASO 4 COMPLETADO - Intervención validada')
       // console.log('   Validate result:', validateResponse.data)
    } catch (validateError) {
      // console.warn('⚠️ PASO 4 FALLÓ - Error validando intervención')
      // console.warn('   Validate error status:', validateError.response?.status)
      // console.warn('   Validate error data:', validateError.response?.data)
      // console.warn('   Validate error message:', validateError.message)
       // console.log('💡 La intervención se creó y vinculó, pero no se pudo validar')
    }
    //  console.log('-'.repeat(60))

    // PASO 5: Cerrar modal y actualizar datos
     // console.log('🔄 PASO 5: Actualizando interfaz...')
    closeManualInterventionModal()

    // Refrescar intervenciones del usuario (igual que el timer)
    if (authStore.user?.id) {
      try {
        await fetchUserInterventions(true)
         // console.log('✅ Intervenciones del usuario refrescadas')
      } catch (error) {
        // console.warn('Error al refrescar intervenciones del usuario:', error)
      }
    }
    
    // Forzar actualización de las intervenciones del ticket actual
    try {
       // console.log('🔄 Forzando actualización de intervenciones para el ticket actual...')
      // Trigger reactivity by accessing the computed property
      const currentInterventions = userInterventionsForTicket.value
       // console.log('📋 Intervenciones actuales del ticket:', currentInterventions.length)
    } catch (error) {
      // console.warn('Error al actualizar intervenciones del ticket:', error)
    }

     // console.log('✅ PROCESO COMPLETADO EXITOSAMENTE')
     // console.log('='.repeat(60))
    
  } catch (error) {
    // console.error('❌ ERROR GENERAL EN CREACIÓN DE INTERVENCIÓN MANUAL:', error)
    // console.error('❌ Error response:', error.response?.data)
    // console.error('❌ Error status:', error.response?.status)
    
    alert('Error al crear la intervención manual: ' + (error.response?.data?.message || error.message))
  } finally {
    // Siempre desactivar el loading, sin importar si hubo éxito o error
    isSavingIntervention.value = false
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
const openReminderModal = () => {
  initializeReminderForm()
  showReminderModal.value = true
}

const closeReminderModal = () => {
  showReminderModal.value = false
  newReminder.value = {
    title: '',
    date: '',
    assignedTo: '',
    description: '',
    sendEmail: false,
    actionCode: 'AC_RDV' // Reset al valor por defecto
  }
}

const createReminder = async () => {
  try {
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    const ticketData = ticketDetails.value || selectedTicket.value
    
    if (!ticketId || !ticketData) {
      throw new Error('No se encontró información del ticket')
    }
    
     // console.log('📝 Creando recordatorio para ticket:', ticketId)
     // console.log('📋 Datos del ticket:', {
    //   id: ticketId,
    //   fk_soc: ticketData.fk_soc,
    //   fk_project: ticketData.fk_project
    // })
    
    // Convertir fecha datetime-local a timestamp
    const eventDate = new Date(newReminder.value.date)
    const timestamp = Math.floor(eventDate.getTime() / 1000)
    
    // Crear evento en agenda con datos adicionales del ticket
    const eventData = {
      label: `Recordatorio: ${newReminder.value.description.substring(0, 50)}${newReminder.value.description.length > 50 ? '...' : ''}`,
      datep: timestamp,
      datef: timestamp + 3600, // 1 hora después por defecto
      type_id: 1, // Tipo de evento estándar
      type_code: newReminder.value.actionCode, // Código de tipo de acción seleccionado
      userownerid: authStore.user?.id?.toString() || "1", // Usuario propietario del evento
      track_id: ticketId.toString(), // ID de seguimiento requerido
      note_private: newReminder.value.description,
      // Datos adicionales del ticket
      socid: ticketData.fk_soc?.toString() || "",
      fk_project: ticketData.fk_project?.toString() || "",
      fk_task: parseInt(ticketId), // Enviar como número, no string
      elementid: ticketId.toString(),
      elementtype: "ticket"
    }
    
     // console.log('📅 Creando evento en agenda:', eventData)
     // console.log('📋 Campos enviados:', Object.keys(eventData))
     // console.log('📋 track_id value:', eventData.track_id)
     // console.log('📋 fk_task value:', eventData.fk_task)
     // console.log('📋 fk_task type:', typeof eventData.fk_task)
     // console.log('📋 ticketId:', ticketId)
    
    const eventResponse = await http.post('/api/doli/agendaevents', eventData)
     // console.log('✅ Evento creado:', eventResponse.data)
    
    const eventId = eventResponse.data?.id || eventResponse.data
    
    if (!eventId) {
      throw new Error('No se pudo obtener el ID del evento creado')
    }
    
    // Agregar recordatorio a la lista local
    const newReminderItem = {
      id: eventId,
      title: eventData.label,
      date: newReminder.value.date,
      assignedTo: newReminder.value.assignedTo,
      description: newReminder.value.description,
      status: 'active'
    }
    
    ticketReminders.value.push(newReminderItem)
    
     // console.log('✅ Recordatorio creado exitosamente con ID:', eventId)
    closeReminderModal()
    
  } catch (error) {
    // console.error('❌ Error creando recordatorio:', error)
    // console.error('❌ Error details:', error.response?.data)
    alert('Error al crear recordatorio: ' + (error.response?.data?.message || error.message))
  }
}

const toggleReminderComplete = async (reminderId, isCompleted) => {
  try {
    // console.log('✅ Marcando recordatorio como completado:', { reminderId, isCompleted })
    
    // Actualizar evento en la agenda con percent = 100 (completado)
    const updateData = {
      percent: isCompleted ? 100 : 0
    }
    
    await http.put(`/api/doli/agendaevents/${reminderId}`, updateData)
    // console.log('✅ Recordatorio actualizado en la agenda')
    
    if (isCompleted) {
      // Si se marca como completado, remover de la lista local
      // ya que el filtro solo muestra eventos no completados
      ticketReminders.value = ticketReminders.value.filter(r => r.id !== reminderId)
      // console.log('✅ Recordatorio removido de la lista (completado)')
    }
    
  } catch (error) {
    // console.error('❌ Error actualizando recordatorio:', error)
    alert('Error al actualizar recordatorio: ' + (error.response?.data?.message || error.message))
  }
}

const deleteReminder = async (reminderId) => {
  try {
     // console.log('🗑️ Eliminando recordatorio (evento):', reminderId)
    
    // Eliminar evento de la agenda
    await http.delete(`/api/doli/agendaevents/${reminderId}`)
    
    // Eliminar de la lista local
    ticketReminders.value = ticketReminders.value.filter(reminder => reminder.id !== reminderId)
    
     // console.log('✅ Recordatorio eliminado exitosamente')
    
  } catch (error) {
    // console.error('❌ Error eliminando recordatorio:', error)
    alert('Error al eliminar recordatorio: ' + (error.response?.data?.message || error.message))
  }
}

// Email recipients are now handled by the computed property emailRecipientsPreview
// No separate functions needed since we show them inline

// Create ticket functions
const openCreateTicketModal = async () => {
   // console.log('🎫 Abriendo modal de crear ticket...')
  
  // Cargar terceros si no están cargados
  if (terceros.value.length === 0) {
     // console.log('📋 Cargando terceros...')
    await fetchTerceros()
  }
  
  // Cargar usuarios para el ticket
  if (availableUsersForTicket.value.length === 0) {
     // console.log('👥 Cargando usuarios para ticket...')
    await fetchUsersForTicket()
  }
  
  showCreateTicketModal.value = true
}

// Función para cargar proyectos del tercero
const fetchProjectsForThirdparty = async (thirdpartyId) => {
  try {
     // console.log('📋 Cargando proyectos para tercero ID:', thirdpartyId)
    
    // Usar sqlfilters para filtrar por tercero específico
    const response = await http.get(`/api/doli/projects?limit=1000&sqlfilters=(t.fk_soc:=:${thirdpartyId})`)
    
    availableProjectsForTicket.value = response.data || []
     // console.log('✅ Proyectos cargados para tercero:', availableProjectsForTicket.value.length)
     // console.log('📋 Proyectos:', availableProjectsForTicket.value.map(p => ({ id: p.id, title: p.title, ref: p.ref })))
  } catch (error) {
    // console.error('❌ Error cargando proyectos:', error)
    // console.error('❌ Error details:', error.response?.data)
    availableProjectsForTicket.value = []
  }
}

// Función para cargar todos los usuarios activos
const fetchUsersForTicket = async () => {
  try {
     // console.log('👥 Cargando usuarios para ticket...')
    const response = await http.get('/api/doli/users?limit=1000&status=1')
    availableUsersForTicket.value = response.data || []
     // console.log('✅ Usuarios cargados:', availableUsersForTicket.value.length)
  } catch (error) {
    // console.error('❌ Error cargando usuarios:', error)
    availableUsersForTicket.value = []
  }
}

const closeCreateTicketModal = () => {
  showCreateTicketModal.value = false
  // Reset form
  newTicket.value = {
    ref: '',
    type: '',
    group: '',
    severity: 'NORMAL',
    subject: '',
    message: '',
    thirdparty: null,
    contact: null,
    assignedTo: null,
    project: null,
    contract: null,
    notifyThirdparty: false
  }
  // Reset search states
  thirdpartySearch.value = ''
  contactSearch.value = ''
  userSearch.value = ''
  projectSearch.value = ''
  contractSearch.value = ''
  // Reset dropdown states
  showThirdpartyDropdown.value = false
  showContactDropdown.value = false
  showUserDropdown.value = false
  showProjectDropdown.value = false
  showContractDropdown.value = false
  // Reset data
  availableProjectsForTicket.value = []
}

const createTicket = async () => {
  if (!newTicket.value.subject.trim()) {
    return
  }

  creatingTicket.value = true

  try {
     // console.log('🎫 Creando nuevo ticket:', newTicket.value)

    // Preparar datos para el API de Dolibarr
    const ticketData = {
      subject: newTicket.value.subject.trim(),
      message: newTicket.value.message.trim(),
      fk_soc: newTicket.value.thirdparty?.id || null,
      fk_user_assign: newTicket.value.assignedTo?.id || null,
      fk_project: newTicket.value.project?.id || null,
      type_code: newTicket.value.type || null,
      category_code: newTicket.value.group || null,
      severity_code: newTicket.value.severity || 'Normal',
      notify_tiers_at_create: newTicket.value.notifyThirdparty ? 1 : 0
    }

    // Si se especificó una referencia, agregarla
    if (newTicket.value.ref.trim()) {
      ticketData.ref = newTicket.value.ref.trim()
    }

     // console.log('📤 Datos del ticket para API:', ticketData)

    const response = await http.post('/api/doli/tickets', ticketData)
     // console.log('✅ Ticket creado exitosamente:', response.data)

    // Cerrar modal
    closeCreateTicketModal()

    // Mostrar mensaje de éxito
     // console.log('🎉 Ticket creado con ID:', response.data.id || response.data)

    // Recargar lista de tickets
    await fetchTickets()

    // Actualizar contador
    await updateTicketsCounter()

  } catch (error) {
    // console.error('❌ Error creando ticket:', error)
    // console.error('❌ Error response:', error.response?.data)
    
    let errorMessage = 'Error al crear el ticket'
    if (error.response?.data?.message) {
      errorMessage += ': ' + error.response.data.message
    } else if (error.message) {
      errorMessage += ': ' + error.message
    }
    
    alert(errorMessage)
  } finally {
    creatingTicket.value = false
  }
}

// Selector functions
const selectThirdparty = (tercero) => {
  newTicket.value.thirdparty = tercero
  thirdpartySearch.value = tercero.name
  showThirdpartyDropdown.value = false
  
  // Limpiar proyecto seleccionado ya que cambió el tercero
  newTicket.value.project = null
  projectSearch.value = ''
  
  // Limpiar lista de proyectos anterior
  availableProjectsForTicket.value = []
  
  // Cargar contactos del tercero seleccionado
  if (tercero.id) {
    fetchAvailableContacts(tercero.id)
    // Cargar proyectos del tercero seleccionado
    fetchProjectsForThirdparty(tercero.id)
  }
  
   // console.log('🏢 Tercero seleccionado:', tercero)
   // console.log('📋 Proyectos disponibles limpiados, cargando nuevos...')
}

const selectContact = (contact) => {
  newTicket.value.contact = contact
  contactSearch.value = `${contact.firstname} ${contact.lastname}`
  showContactDropdown.value = false
   // console.log('👤 Contacto seleccionado:', contact)
}

const selectUser = (user) => {
  newTicket.value.assignedTo = user
  userSearch.value = `${user.firstname} ${user.lastname}`
  showUserDropdown.value = false
   // console.log('👨‍💼 Usuario asignado:', user)
}

const selectProject = (project) => {
  newTicket.value.project = project
  projectSearch.value = project.title || project.ref
  showProjectDropdown.value = false
   // console.log('📋 Proyecto seleccionado:', project)
}

// Computed properties for filtered options
const filteredTerceros = computed(() => {
  // Si no hay búsqueda, mostrar los primeros 10 terceros
  if (!thirdpartySearch.value) return terceros.value.slice(0, 10)
  
  // Filtrar terceros por nombre o email
  return terceros.value.filter(tercero => 
    tercero.name.toLowerCase().includes(thirdpartySearch.value.toLowerCase()) ||
    (tercero.email && tercero.email.toLowerCase().includes(thirdpartySearch.value.toLowerCase()))
  ).slice(0, 20) // Mostrar hasta 20 resultados
})

const filteredContacts = computed(() => {
  if (!contactSearch.value) return availableContacts.value.slice(0, 10)
  return availableContacts.value.filter(contact => 
    `${contact.firstname} ${contact.lastname}`.toLowerCase().includes(contactSearch.value.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(contactSearch.value.toLowerCase()))
  ).slice(0, 10)
})

const filteredUsers = computed(() => {
  if (!userSearch.value) return availableUsersForTicket.value.slice(0, 10)
  return availableUsersForTicket.value.filter(user => 
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(userSearch.value.toLowerCase()) ||
    user.login.toLowerCase().includes(userSearch.value.toLowerCase())
  ).slice(0, 20)
})

const filteredProjects = computed(() => {
  // Solo mostrar proyectos si hay un tercero seleccionado
  if (!newTicket.value.thirdparty) return []
  
  // Si no hay búsqueda, mostrar todos los proyectos del tercero (máximo 10)
  if (!projectSearch.value) return availableProjectsForTicket.value.slice(0, 10)
  
  // Filtrar proyectos por título o referencia
  return availableProjectsForTicket.value.filter(project => 
    (project.title && project.title.toLowerCase().includes(projectSearch.value.toLowerCase())) ||
    (project.ref && project.ref.toLowerCase().includes(projectSearch.value.toLowerCase()))
  ).slice(0, 20)
})

// Complete ticket function
const completeTicket = async () => {
  try {
    completingTicket.value = true
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    
    if (!ticketId) {
      throw new Error('No se encontró el ID del ticket')
    }
    
     // console.log('🎯 Cerrando ticket:', ticketId)
    
    // Datos para cerrar el ticket
    const updateData = {
      fk_statut: 8, // Estado cerrado
      status: 8     // Status cerrado
    }
    
     // console.log('📝 Datos de actualización:', updateData)
    
    // Enviar PUT request para actualizar el ticket
    const response = await http.put(`/api/doli/tickets/${ticketId}`, updateData)
     // console.log('✅ Ticket cerrado exitosamente:', response.data)
    
    // Actualizar el estado local del ticket
    if (ticketDetails.value) {
      ticketDetails.value.fk_statut = 8
      ticketDetails.value.status = 8
    }
    
    if (selectedTicket.value) {
      selectedTicket.value.fk_statut = 8
      selectedTicket.value.status = 8
    }
    
    // Actualizar el ticket en la lista principal
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].fk_statut = 8
      tickets.value[ticketIndex].status = 8
    }
    
    // Cerrar modal de confirmación
    showCompleteModal.value = false
    
    // Cerrar modal del ticket
    closeModal()
    
    // Mostrar mensaje de éxito
     // console.log('✅ Ticket marcado como completado exitosamente')
    // TODO: Implementar notificación toast más elegante en el futuro
    
    // Recalcular métricas
    calculateTicketMetrics()
    
    // Actualizar contador del menú lateral
    await updateTicketsCounter()
    
  } catch (error) {
    // console.error('❌ Error cerrando ticket:', error)
    // console.error('❌ Error details:', error.response?.data)
    alert('Error al cerrar ticket: ' + (error.response?.data?.message || error.message))
  } finally {
    completingTicket.value = false
  }
}

// Delete ticket function
const deleteTicket = async () => {
  try {
    // Validar que el nombre del cliente coincida
    if (deleteConfirmationText.value.trim() !== (currentCompany.value?.name || '')) {
      alert('El nombre del cliente no coincide. Por favor, verifica e intenta nuevamente.')
      return
    }
    
    deletingTicket.value = true
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    
    if (!ticketId) {
      throw new Error('No se encontró el ID del ticket')
    }
    
    console.log('🗑️ Eliminando ticket:', ticketId)
    
    // Enviar DELETE request para eliminar el ticket
    const response = await http.delete(`/api/doli/tickets/${ticketId}`)
    console.log('✅ Ticket eliminado exitosamente:', response.data)
    
    // Eliminar el ticket de la lista local
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
    if (ticketIndex !== -1) {
      tickets.value.splice(ticketIndex, 1)
    }
    
    // Cerrar modales
    showDeleteModal.value = false
    deleteConfirmationText.value = ''
    closeModal()
    
    // Mostrar mensaje de éxito
    alert('Ticket eliminado exitosamente')
    
    // Recalcular métricas
    calculateTicketMetrics()
    
    // Actualizar contador del menú lateral
    await updateTicketsCounter()
    
  } catch (error) {
    console.error('❌ Error eliminando ticket:', error)
    console.error('❌ Error details:', error.response?.data)
    alert('Error al eliminar ticket: ' + (error.response?.data?.message || error.message))
  } finally {
    deletingTicket.value = false
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
     // console.log('🔍 Obteniendo seguidores del ticket:', ticketId)
    const response = await http.get(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/contacts`)
    
     // console.log('📋 Raw API Response:', response)
     // console.log('📋 Response Data:', response.data)
     // console.log('📋 Response Data Type:', typeof response.data)
     // console.log('📋 Response Data Keys:', response.data ? Object.keys(response.data) : 'No data')
    
    // Los contactos están en response.data.contacts, no directamente en response.data
    const allFollowers = response.data?.contacts || []
    ticketFollowers.value = allFollowers
    
     // console.log('📋 Contacts Array:', allFollowers)
     // console.log('📋 Contacts Length:', allFollowers.length)
    
    // Log each follower to understand structure
    if (allFollowers.length > 0) {
       // console.log('📋 Analizando estructura de seguidores:')
      allFollowers.forEach((follower, index) => {
         // console.log(`  Seguidor ${index + 1}:`, follower)
         // console.log(`    - Keys:`, Object.keys(follower))
         // console.log(`    - type:`, follower.type)
         // console.log(`    - source:`, follower.source)
         // console.log(`    - is_internal:`, follower.is_internal)
         // console.log(`    - element_type:`, follower.element_type)
         // console.log(`    - fk_element:`, follower.fk_element)
      })
    }
    
    // Separar internos y externos basado en user_id
    internalFollowers.value = allFollowers.filter(follower => {
      // Si tiene user_id (no null), es un usuario interno de Dolibarr
      const isInternal = follower.user_id !== null && follower.user_id !== undefined
      
       // console.log(`🔍 Follower ${follower.contact_id} (${follower.fullname}) es interno?`, isInternal, {
      //   user_id: follower.user_id,
      //   contact_source: follower.contact_source,
      //   contact_type_code: follower.contact_type_code
      // })
      
      return isInternal
    })
    
    externalFollowers.value = allFollowers.filter(follower => {
      // Si user_id es null, es un contacto externo del cliente
      const isExternal = follower.user_id === null || follower.user_id === undefined
      
       // console.log(`🔍 Follower ${follower.contact_id} (${follower.fullname}) es externo?`, isExternal, {
      //   user_id: follower.user_id,
      //   contact_source: follower.contact_source,
      //   company_name: follower.company_name
      // })
      
      return isExternal
    })
    
     // console.log('✅ Seguidores clasificados:', {
    //   total: allFollowers.length,
    //   internos: internalFollowers.value.length,
    //   externos: externalFollowers.value.length
    // })
    
  } catch (error) {
    // console.warn('⚠️ Error obteniendo seguidores:', error)
    // console.warn('⚠️ Error details:', error.response?.data)
    ticketFollowers.value = []
    internalFollowers.value = []
    externalFollowers.value = []
  }
}

// Function to fetch ticket reminders (events linked to ticket)
const fetchTicketReminders = async (ticketId) => {
  try {
     // console.log('📅 Obteniendo recordatorios del ticket:', ticketId)
     // console.log('📅 Filtrando solo eventos NO completados (percent != 100)')
    
    // Buscar eventos de agenda vinculados al ticket (solo los no completados)
    // Filtrar eventos donde percent != 100 (no completados)
    const response = await http.get(`/api/doli/agendaevents?sortfield=t.id&sortorder=ASC&limit=100&sqlfilters=(t.fk_task:=:${ticketId}) AND (t.percent:!=:100)`)
    
    const events = response.data || []
     // console.log('📅 Eventos NO completados encontrados:', events.length)
    
    // Convertir eventos a formato de recordatorios
    ticketReminders.value = events.map(event => {
      let formattedDate = ''
      if (event.datep) {
        try {
          // Convertir timestamp a fecha legible
          const eventDate = new Date(event.datep * 1000)
          formattedDate = eventDate.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        } catch (error) {
          // console.warn('Error convirtiendo fecha:', event.datep, error)
          formattedDate = 'Fecha inválida'
        }
      }
      
      return {
        id: event.id,
        title: event.label || 'Recordatorio',
        date: formattedDate,
        assignedTo: event.userownerid ? `Usuario ${event.userownerid}` : 'Sin asignar',
        description: event.note_private || event.note || 'Sin descripción',
        status: 'active'
      }
    })
    
     // console.log('✅ Recordatorios cargados:', ticketReminders.value.length)
    
  } catch (error) {
    // console.warn('⚠️ Error obteniendo recordatorios:', error)
    // console.warn('⚠️ Error details:', error.response?.data)
    ticketReminders.value = []
  }
}

const fetchAvailableUsers = async () => {
  try {
     // console.log('🔍 Obteniendo usuarios activos de Dolibarr...')
    const response = await http.get('/api/doli/users?limit=100&active=1')
    availableUsers.value = response.data || []
     // console.log('✅ Usuarios activos obtenidos:', availableUsers.value.length)
    if (availableUsers.value.length > 0) {
       // console.log('📋 Primer usuario:', availableUsers.value[0])
    }
  } catch (error) {
    // console.warn('⚠️ Error obteniendo usuarios:', error)
    availableUsers.value = []
  }
}

const fetchAvailableContacts = async (socid) => {
  if (!socid) {
    availableContacts.value = []
    return
  }
  
  try {
     // console.log('🔍 Obteniendo contactos del tercero con filtro SQL:', socid)
     // console.log('📤 URL:', `/api/doli/contacts?sqlfilters=(fk_soc:=:${socid})&limit=100`)
    const response = await http.get(`/api/doli/contacts?sqlfilters=(fk_soc:=:${socid})&limit=100`)
    availableContacts.value = response.data || []
     // console.log('✅ Contactos obtenidos con filtro SQL:', availableContacts.value.length)
    if (availableContacts.value.length > 0) {
       // console.log('📋 Primer contacto:', availableContacts.value[0])
    }
  } catch (error) {
    // console.warn('⚠️ Error obteniendo contactos:', error)
    // console.warn('⚠️ Error details:', error.response?.data)
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
    
    // Preparar datos según el tipo de seguidor
    let requestData
    
    if (type === 'user') {
      // Usuario interno de Dolibarr
      requestData = {
        contact_id: id,
        contact_type: 'SUPPORTTEC',
        contact_source: 'internal'
      }
    } else {
      // Contacto externo (tercero)
      requestData = {
        contact_id: id,
        contact_type: 'CUSTOMER',
        contact_source: 'external'
      }
    }
    
    console.log('📤 Request data:', requestData)
    console.log('📤 Endpoint:', `/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/contacts`)
    
    const response = await http.post(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/contacts`, requestData)
    
    console.log('✅ Seguidor agregado:', response.data)
    
    // Refresh followers list
    await fetchTicketFollowers(ticketId)
    
    // Reset selection
    selectedFollower.value = ''
    followersSearchTerm.value = ''
    
  } catch (error) {
    console.error('❌ Error agregando seguidor:', error)
    console.error('❌ Error response:', error.response?.data)
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
    
     // console.log('➖ Eliminando seguidor:', { followerId, followerType, ticketId })
    
    await http.delete(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/contacts/${followerId}`)
    
     // console.log('✅ Seguidor eliminado')
    
    // Refresh followers list
    await fetchTicketFollowers(ticketId)
    
  } catch (error) {
    // console.error('❌ Error eliminando seguidor:', error)
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
     // console.log('🔍 Obteniendo información de la empresa:', socid)
    const response = await http.get(`/api/doli/thirdparties/${socid}`)
    currentCompany.value = response.data
     // console.log('✅ Empresa obtenida:', currentCompany.value?.name)
  } catch (error) {
    // console.warn('⚠️ Error obteniendo empresa:', error)
    currentCompany.value = null
  }
}

const sendComment = async () => {
  if (!newComment.value.trim() || sendingComment.value) {
    return
  }

  sendingComment.value = true

  try {
    // Obtener el ID del ticket
    const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
    
    if (!ticketId) {
      throw new Error('No se encontró el ID del ticket')
    }

    // console.log('💬 Enviando comentario:', {
    //   type: commentType.value,
    //   message: newComment.value,
    //   ticket_id: ticketId,
    //   attachments: commentAttachments.value.length
    // })

    let response

    if (commentType.value === 'email') {
      // Envío por email usando el endpoint específico
      
      // Convertir archivos adjuntos a base64
      const attachments = []
      for (const attachment of commentAttachments.value) {
        try {
          const base64 = await fileToBase64(attachment.file)
          attachments.push({
            name: attachment.name,
            size: attachment.size,
            type: attachment.file.type,
            content: base64
          })
        } catch (error) {
          // console.error('Error convirtiendo archivo a base64:', attachment.name, error)
        }
      }
      
      // Preparar datos del email
      const rawRecipients = emailRecipientsPreview.value.length > 0 
        ? emailRecipientsPreview.value.map(r => r.email)
        : []
      const recipients = removeDuplicateRecipients(rawRecipients)
      
      if (rawRecipients.length !== recipients.length) {
        // console.log('🔄 Duplicados eliminados en comentario:', {
        //   original: rawRecipients.length,
        //   unique: recipients.length,
        //   removed: rawRecipients.length - recipients.length,
        //   originalEmails: rawRecipients,
        //   uniqueEmails: recipients
        // })
      }
      
      // Generar asunto con formato [EMPRESA - Ticket REF] TITULO
      const ticketRef = selectedTicket.value?.ref || ticketDetails.value?.ref || ticketId
      const ticketTitle = selectedTicket.value?.subject || ticketDetails.value?.subject || 'Ticket'
      const emailSubject = await generateEmailSubject(ticketRef, ticketTitle)
      
      // Obtener firma del usuario
      const userId = authStore.user?.id
      const userSignature = userId ? await getUserSignature(userId) : ''
      
      // Agregar firma al mensaje si existe
      let emailMessage = newComment.value.trim()
      if (userSignature) {
        emailMessage += `<br><br>---<br>${userSignature}`
      }
      
      const emailData = {
        subject: emailSubject,
        message: emailMessage,
        recipients: recipients,
        attachments: attachments
      }

      // console.log('📤 Endpoint: /api/doli/dolibarmodernfrontendapi/tickets/' + ticketId + '/sendemail')
      // console.log('📧 Enviando email con archivos adjuntos:', attachments.length)
      // console.log('📋 Datos del email:', {
      //   subject: emailData.subject,
      //   recipients: emailData.recipients,
      //   attachments: attachments.map(a => ({ name: a.name, size: a.size, type: a.type }))
      // })

      response = await http.post(`/api/doli/dolibarmodernfrontendapi/tickets/${ticketId}/sendemail`, emailData)
      
      // Enviar mensaje privado con el contenido del email (sin la firma)
      const privateMessage = `📧 Email enviado a: ${recipients.join(', ')}\n\n${newComment.value.trim()}`
      await sendPrivateMessage(ticketId, privateMessage)
      
    } else {
      // Mensaje interno usando el endpoint original
      const trackId = selectedTicket.value?.track_id || ticketDetails.value?.track_id
      
      if (!trackId) {
        throw new Error('No se encontró el track_id del ticket')
      }

      const commentData = {
        track_id: trackId,
        message: newComment.value.trim(),
        private: 1  // Mensaje interno
      }

      // console.log('📤 Endpoint: /api/doli/tickets/newmessage')
      // console.log('📋 Datos del comentario:', commentData)

      response = await http.post('/api/doli/tickets/newmessage', commentData)
    }
     // console.log('✅ Comentario enviado:', response.data)

    // Limpiar formulario
    newComment.value = ''
    
    // Limpiar archivos adjuntos si es email
    if (commentType.value === 'email') {
      commentAttachments.value = []
      // Limpiar editor WYSIWYG
      if (commentEditor.value) {
        commentEditor.value.innerHTML = ''
      }
    }
    
    // Refrescar detalles del ticket para mostrar el nuevo comentario
    try {
      const ticketId = selectedTicket.value?.id || ticketDetails.value?.id
      if (ticketId) {
         // console.log('🔄 Refrescando detalles del ticket...', {
        //   ticketId,
        //   commentType: commentType.value,
        //   messagesKeyBefore: messagesKey.value
        // })
        
        // Log mensajes antes de recargar
         // console.log('📋 Mensajes antes de recargar:', ticketDetails.value?.messages?.length || 0)
        
        // Pequeño delay para que el servidor procese el mensaje
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Recargar detalles completos del ticket SIN CACHÉ
        const currentTicket = selectedTicket.value || { id: ticketId }
        const timestamp = Date.now()
         // console.log('🔄 Recargando ticket sin caché con timestamp:', timestamp)
        
        const response = await http.get(`/api/doli/tickets/${ticketId}?_t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
         // console.log('📋 Response completa del servidor:', response.data)
         // console.log('📋 Mensajes en response:', response.data.messages?.length || 0)
        
        // Forzar reactividad creando un nuevo objeto completamente
        const newTicketDetails = JSON.parse(JSON.stringify(response.data))
        ticketDetails.value = newTicketDetails
        
        // Recargar también los datos relacionados
        await Promise.all([
          fetchTicketFollowers(ticketId),
          fetchTicketReminders(ticketId),
          fetchCompanyInfo(response.data.fk_soc)
        ])
        
        // Log mensajes después de recargar
         // console.log('📋 Mensajes después de recargar:', ticketDetails.value?.messages?.length || 0)
        
        // Forzar actualización de mensajes con múltiples técnicas
         // console.log('🔄 Forzando re-render de sección de comentarios...')
        
        // Técnica 1: Incrementar key
        const oldKey = messagesKey.value
        messagesKey.value = Date.now() // Usar timestamp para key única
         // console.log('📋 MessagesKey cambiado de', oldKey, 'a', messagesKey.value)
        
        // Técnica 2: Forzar actualización con nextTick
        await nextTick()
        
        // Técnica 3: Trigger reactivity en el array de mensajes
        if (ticketDetails.value?.messages) {
          const messages = ticketDetails.value.messages
          ticketDetails.value.messages = []
          await nextTick()
          ticketDetails.value.messages = messages
           // console.log('📋 Array de mensajes re-asignado para forzar reactividad')
        }
        
         // console.log('✅ Detalles del ticket y mensajes actualizados', {
        //   messagesKeyAfter: messagesKey.value,
        //   totalMessages: ticketDetails.value?.messages?.length || 0,
        //   lastMessage: ticketDetails.value?.messages?.[ticketDetails.value.messages.length - 1]?.message?.substring(0, 50) + '...'
        // })
        
        // Log para verificar que el template debería actualizarse
         // console.log('🔍 Verificando estado para template:', {
        //   hasTicketDetails: !!ticketDetails.value,
        //   hasMessages: !!(ticketDetails.value?.messages),
        //   messagesLength: ticketDetails.value?.messages?.length || 0,
        //   messagesKeyValue: messagesKey.value
        // })
        
        // Verificación final
         // console.log('✅ Proceso de actualización completado')
      }
    } catch (refreshError) {
      // console.warn('⚠️ Error al refrescar detalles del ticket:', refreshError)
      // No lanzar error, el comentario ya se envió correctamente
    }

     // console.log(`✅ Comentario ${commentType.value === 'email' ? 'enviado por email' : 'guardado como mensaje interno'} correctamente`)

  } catch (error) {
    // console.error('❌ Error enviando comentario:', error)
    // console.error('❌ Error response:', error.response?.data)
    // console.error('❌ Error status:', error.response?.status)
    // console.error('❌ Error message:', error.message)
    
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

// Email templates functions
const loadEmailTemplates = async () => {
  try {
    console.log('📧 Cargando plantillas de email para tickets...')
    // Cargar plantillas con filtros: tipo ticket_send, habilitadas y públicas
    emailTemplates.value = await getEmailTemplates({ 
      type_template: 'ticket_send',
      enabled: 1,
      private: 0
    })
    console.log(`✅ ${emailTemplates.value.length} plantillas cargadas`)
    console.log('📋 Plantillas:', emailTemplates.value)
  } catch (error) {
    console.error('❌ Error cargando plantillas:', error)
    emailTemplates.value = []
  }
}

const loadSubstitutionVariables = async () => {
  try {
    loadingVariables.value = true
    console.log('🔄 Cargando variables de sustitución...')
    substitutionVariables.value = await getSubstitutionVariables('ticket')
    console.log(`✅ ${substitutionVariables.value.length} variables cargadas`)
  } catch (error) {
    console.error('❌ Error cargando variables:', error)
    substitutionVariables.value = []
  } finally {
    loadingVariables.value = false
  }
}

const applyEmailTemplate = async () => {
  if (!selectedTemplate.value) return
  
  try {
    console.log('📝 Aplicando plantilla:', selectedTemplate.value)
    console.log('📧 Plantillas disponibles:', emailTemplates.value)
    
    // Buscar la plantilla seleccionada (por ID o por índice)
    let template = emailTemplates.value.find(t => String(t.id) === String(selectedTemplate.value))
    
    // Si no se encuentra por ID, buscar por índice
    if (!template) {
      const index = parseInt(selectedTemplate.value)
      if (!isNaN(index) && emailTemplates.value[index]) {
        template = emailTemplates.value[index]
      }
    }
    
    if (!template) {
      console.error('❌ Plantilla no encontrada')
      alert('No se pudo cargar la plantilla seleccionada')
      return
    }
    
    console.log('✅ Plantilla encontrada:', template)
    
    // Obtener el contenido de la plantilla (puede estar en diferentes campos)
    let templateContent = template.content || template.content_lines || template.message || template.body || template.text || ''
    
    if (!templateContent) {
      console.warn('⚠️ La plantilla no tiene contenido')
      alert('La plantilla seleccionada está vacía')
      return
    }
    
    console.log('📄 Contenido de plantilla:', templateContent.substring(0, 100) + '...')
    
    // Reemplazar variables de sustitución
    templateContent = await replaceSubstitutionVariables(templateContent)
    
    // Aplicar el contenido al editor
    if (commentEditor.value) {
      commentEditor.value.innerHTML = templateContent
      newComment.value = templateContent
      console.log('✅ Plantilla aplicada al editor')
    } else {
      console.error('❌ Editor no encontrado')
    }
  } catch (error) {
    console.error('❌ Error aplicando plantilla:', error)
    alert('Error al aplicar la plantilla: ' + error.message)
  }
}

const replaceSubstitutionVariables = async (content) => {
  if (!content || !ticketDetails.value) return content
  
  let replacedContent = content
  
  try {
    // Variables del ticket
    const ticketVars = {
      '__TICKET_ID__': ticketDetails.value.id || '',
      '__TICKET_REF__': ticketDetails.value.ref || '',
      '__TICKET_TRACK_ID__': ticketDetails.value.track_id || '',
      '__TICKET_SUBJECT__': ticketDetails.value.subject || '',
      '__TICKET_MESSAGE__': ticketDetails.value.message || '',
      '__TICKET_TYPE__': ticketDetails.value.type_label || '',
      '__TICKET_CATEGORY__': ticketDetails.value.category_label || '',
      '__TICKET_SEVERITY__': ticketDetails.value.severity_label || '',
      '__TICKET_STATUS__': getStatusText(ticketDetails.value.fk_statut) || '',
      '__TICKET_DATE_CREATION__': formatDate(ticketDetails.value.datec) || '',
      '__TICKET_DATE_READ__': formatDate(ticketDetails.value.date_read) || '',
      '__TICKET_DATE_CLOSE__': formatDate(ticketDetails.value.date_close) || '',
      '__TICKET_URL__': `${window.location.origin}/tickets/${ticketDetails.value.id}` || ''
    }
    
    // Variables del tercero/cliente
    if (currentCompany.value) {
      ticketVars['__THIRDPARTY_NAME__'] = currentCompany.value.name || ''
      ticketVars['__THIRDPARTY_EMAIL__'] = currentCompany.value.email || ''
      ticketVars['__THIRDPARTY_PHONE__'] = currentCompany.value.phone || ''
      ticketVars['__THIRDPARTY_ADDRESS__'] = currentCompany.value.address || ''
      ticketVars['__THIRDPARTY_ZIP__'] = currentCompany.value.zip || ''
      ticketVars['__THIRDPARTY_TOWN__'] = currentCompany.value.town || ''
    }
    
    // Variables del usuario asignado
    if (ticketDetails.value.fk_user_assign) {
      const assignedUser = users.value.find(u => String(u.id) === String(ticketDetails.value.fk_user_assign))
      if (assignedUser) {
        ticketVars['__USER_ASSIGNED_FIRSTNAME__'] = assignedUser.firstname || ''
        ticketVars['__USER_ASSIGNED_LASTNAME__'] = assignedUser.lastname || ''
        ticketVars['__USER_ASSIGNED_EMAIL__'] = assignedUser.email || ''
        ticketVars['__USER_ASSIGNED_PHONE__'] = assignedUser.office_phone || ''
      }
    }
    
    // Variables del usuario actual
    if (authStore.user) {
      ticketVars['__USER_FIRSTNAME__'] = authStore.user.firstname || ''
      ticketVars['__USER_LASTNAME__'] = authStore.user.lastname || ''
      ticketVars['__USER_EMAIL__'] = authStore.user.email || ''
      ticketVars['__USER_PHONE__'] = authStore.user.office_phone || ''
      ticketVars['__USER_SIGNATURE__'] = authStore.user.signature || ''
    }
    
    // Variables de fecha actual
    const now = new Date()
    ticketVars['__DATE__'] = now.toLocaleDateString('es-ES')
    ticketVars['__TIME__'] = now.toLocaleTimeString('es-ES')
    ticketVars['__DATETIME__'] = now.toLocaleString('es-ES')
    
    // Reemplazar todas las variables
    for (const [variable, value] of Object.entries(ticketVars)) {
      const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      replacedContent = replacedContent.replace(regex, value)
    }
    
    console.log('✅ Variables de sustitución reemplazadas')
    
  } catch (error) {
    console.error('❌ Error reemplazando variables:', error)
  }
  
  return replacedContent
}

 // console.log('fetchUserInterventions:', fetchUserInterventions)
 // console.log('getInterventionsForTicket:', getInterventionsForTicket)

const tickets = ref([])
const loading = ref(false)

// Vista actual (table o kanban) - cargar desde localStorage
const loadViewPreference = () => {
  const saved = localStorage.getItem('tickets_view_preference')
  return saved || 'table' // Por defecto: tabla
}

const currentView = ref(loadViewPreference())

// Drag and drop state
const draggedTicket = ref(null)

// Columnas visibles del Kanban - cargar desde localStorage o usar valores por defecto
const loadKanbanColumnsPreferences = () => {
  const saved = localStorage.getItem('kanban_columns_preferences')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      // console.error('Error cargando preferencias de columnas:', e)
    }
  }
  // Valores por defecto
  return {
    notRead: true,
    read: true,
    assigned: true,
    inProgress: true,
    needMoreInfo: true,
    waiting: true,
    closed: true,
    canceled: true
  }
}

const visibleKanbanColumns = ref(loadKanbanColumnsPreferences())

// Mostrar selector de columnas
const showColumnSelector = ref(false)

// Sistema de notificaciones
const notifications = ref([])
let notificationId = 0

const showNotification = (message, type = 'success') => {
  const id = notificationId++
  notifications.value.push({
    id,
    message,
    type // 'success', 'error', 'warning', 'info'
  })
  
  // Auto-remover después de 3 segundos
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 3000)
}

// Guardar preferencia de vista cuando cambie
watch(currentView, (newValue) => {
  localStorage.setItem('tickets_view_preference', newValue)
  // console.log('💾 Preferencia de vista guardada:', newValue)
})

// Guardar preferencias de columnas cuando cambien
watch(visibleKanbanColumns, (newValue) => {
  localStorage.setItem('kanban_columns_preferences', JSON.stringify(newValue))
  // console.log('💾 Preferencias de columnas guardadas:', newValue)
}, { deep: true })

// Ticket metrics
const ticketMetrics = ref({
  unassigned: 0,
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
const categoryFilter = ref('')
const typeFilter = ref('')

// Terceros and Users search
const terceros = ref([])
const users = ref([])
const terceroSearch = ref('')
// userSearch is already declared above for create ticket form
const selectedTercero = ref(null)
const selectedUser = ref(null)
const showUnassignedOnly = ref(false)
const showTerceroDropdown = ref(false)
// showUserDropdown is already declared above for create ticket form
const filteredTercerosForFilters = ref([])
const filteredUsersForFilters = ref([])

// Project management
const editingProject = ref(false)
const selectedProjectId = ref('')
const availableProjects = ref([])
const currentProject = ref(null)

// Status management
const editingStatus = ref(false)
const selectedStatus = ref(null)

// Company management
const editingCompany = ref(false)
const selectedCompanyId = ref('')
const selectedThirdparty = ref(null)
const availableCompanies = ref([])
const currentCompany = ref(null)
const showCompanyDropdown = ref(false)
const companySearchTerm = ref('')
const filteredCompanies = ref([])

// User assignment management
const editingAssignment = ref(false)
const selectedAssignedUserId = ref('')
const currentAssignedUser = ref(null)
const showAssignmentDropdown = ref(false)
const assignmentSearchTerm = ref('')

// Subject and description editing
const editingSubject = ref(false)
const editedSubject = ref('')
const editingDescription = ref(false)
const editedDescription = ref('')

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

// Estado para todas las intervenciones del ticket
const allTicketInterventions = ref([])
const loadingAllInterventions = ref(false)

// Función para obtener todas las intervenciones de un ticket específico
const fetchAllTicketInterventions = async (ticketId) => {
  if (!ticketId) return
  
  loadingAllInterventions.value = true
  try {
    // console.log('🔍 Obteniendo todas las intervenciones para ticket:', ticketId)
    
    // Usar el mismo endpoint que funciona, pero obtener todas las intervenciones
    const response = await http.get('/api/doli/interventions', {
      params: {
        sortfield: 't.rowid',
        sortorder: 'DESC',
        limit: 1000,
        properties: 'id,linkedObjectsIds,ref,status,duration,datee,datem,desc,lines,fk_user_author,fk_user_create,user_creation_id'
      }
    })

    // console.log('📦 Respuesta de intervenciones:', response.data?.length || 0, 'intervenciones totales')
    
    // Debug: Ver estructura de una intervención
    if (response.data && response.data.length > 0) {
      // console.log('🔍 Estructura de intervención ejemplo:', response.data[0])
    }

    if (response.data && Array.isArray(response.data)) {
      // Filtrar intervenciones que están vinculadas a este ticket
      const filteredInterventions = response.data.filter(intervention => {
        // Método 1: Verificar vinculación por linkedObjectsIds
        if (intervention.linkedObjectsIds && intervention.linkedObjectsIds.ticket && typeof intervention.linkedObjectsIds.ticket === 'object') {
          const ticketIds = Object.values(intervention.linkedObjectsIds.ticket)
          const matches = ticketIds.some(id => String(id) === String(ticketId))
          if (matches) return true
        }
        
        // Método 2: Verificar vinculación por nota privada
        if (intervention.note_private) {
          const noteMatch = intervention.note_private.includes(`[TICKET_LINK]`) && 
                           intervention.note_private.includes(`(ID: ${ticketId})`)
          if (noteMatch) return true
        }
        
        // Método 3: Verificar vinculación por descripción
        if (intervention.desc && intervention.desc.includes(`(ID: ${ticketId})`)) {
          return true
        }
        
        return false
      })
      
      // Enriquecer intervenciones con información de usuarios
      const enrichedInterventions = await enrichInterventionsWithUserInfo(filteredInterventions)
      allTicketInterventions.value = enrichedInterventions
      // console.log('✅ Intervenciones filtradas para ticket', ticketId, ':', allTicketInterventions.value.length)
    } else {
      allTicketInterventions.value = []
      // console.log('❌ No se recibieron datos de intervenciones')
    }
  } catch (error) {
    // console.error('❌ Error al obtener intervenciones del ticket:', error)
    allTicketInterventions.value = []
  } finally {
    loadingAllInterventions.value = false
  }
}

// Función para enriquecer intervenciones con información de usuarios
const enrichInterventionsWithUserInfo = async (interventions) => {
  if (!interventions || interventions.length === 0) return interventions
  
  // Debug: Ver qué intervenciones tenemos
  // console.log('🔍 Intervenciones a enriquecer:', interventions.map(i => ({
  //   id: i.id,
  //   ref: i.ref,
  //   fk_user_author: i.fk_user_author
  // })))
  
  // Obtener IDs únicos de usuarios (probar diferentes campos)
  const userIds = [...new Set(interventions.map(i => 
    i.fk_user_author || i.fk_user_create || i.user_creation_id
  ).filter(Boolean))]
  
  if (userIds.length === 0) {
    // console.log('⚠️ No se encontraron IDs de usuarios en las intervenciones')
    return interventions
  }
  
  // console.log('🔍 Obteniendo información de usuarios:', userIds)
  
  try {
    // Obtener información de todos los usuarios
    const userPromises = userIds.map(userId => 
      http.get(`/api/doli/users/${userId}`).catch(error => {
        // console.warn(`Error obteniendo usuario ${userId}:`, error)
        return null
      })
    )
    
    const userResponses = await Promise.all(userPromises)
    
    // Crear mapa de usuarios
    const usersMap = {}
    userResponses.forEach((response, index) => {
      if (response && response.data) {
        usersMap[userIds[index]] = response.data
      }
    })
    
    // console.log('✅ Usuarios obtenidos:', Object.keys(usersMap).length)
    
    // Enriquecer intervenciones con información de usuarios
    return interventions.map(intervention => {
      const userId = intervention.fk_user_author || intervention.fk_user_create || intervention.user_creation_id
      return {
        ...intervention,
        user_author: usersMap[userId] || null,
        // Asegurar que tenemos el ID del usuario en fk_user_author
        fk_user_author: userId
      }
    })
    
  } catch (error) {
    // console.error('❌ Error enriqueciendo intervenciones con usuarios:', error)
    return interventions
  }
}

// Función para obtener las iniciales de un usuario (maneja objetos y strings)
const getUserInitials = (userOrName) => {
  if (!userOrName) return '?'
  
  // Si es un string (nombre completo)
  if (typeof userOrName === 'string') {
    if (userOrName === '-' || userOrName === 'undefined') return '?'
    const names = userOrName.trim().split(' ')
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase()
    } else {
      const firstName = names[0]
      const lastName = names[names.length - 1]
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
    }
  }
  
  // Si es un objeto usuario o intervención
  const user = userOrName
  if (user && typeof user === 'object') {
    // Si es una intervención, usar user_author
    if (user.user_author) {
      const author = user.user_author
      if (author.firstname && author.lastname) {
        return `${author.firstname.charAt(0)}${author.lastname.charAt(0)}`.toUpperCase()
      } else if (author.login) {
        return author.login.substring(0, 2).toUpperCase()
      } else if (author.name) {
        const parts = author.name.split(' ')
        if (parts.length >= 2) {
          return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        }
        return author.name.substring(0, 2).toUpperCase()
      }
    }
    
    // Si es un usuario directo
    if (user.firstname && user.lastname) {
      return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
    } else if (user.login) {
      return user.login.substring(0, 2).toUpperCase()
    } else if (user.name) {
      const parts = user.name.split(' ')
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
      }
      return user.name.substring(0, 2).toUpperCase()
    }
    
    // Si solo tenemos fk_user_author, usar las primeras letras del ID
    if (user.fk_user_author) {
      return String(user.fk_user_author).substring(0, 2).toUpperCase()
    }
  }
  
  return '?'
}

// Función para obtener el nombre a mostrar del usuario
const getUserDisplayName = (intervention) => {
  if (!intervention) return 'Usuario desconocido'
  
  // Si tenemos información completa del usuario
  if (intervention.user_author) {
    const user = intervention.user_author
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`
    } else if (user.login) {
      return user.login
    } else if (user.name) {
      return user.name
    }
  }
  
  // Si solo tenemos el ID del usuario
  if (intervention.fk_user_author) {
    return `Usuario ID: ${intervention.fk_user_author}`
  }
  
  return 'Usuario desconocido'
}

const fetchTickets = async () => {
   // console.log('🎫 Fetching tickets...')
  loading.value = true
  try {
    const response = await http.get('/api/doli/tickets')
     // console.log('✅ Tickets loaded:', response.data?.length || 0, 'tickets')
    const ticketsData = response.data || []
    
    // Enrich tickets with tercero names and assigned user names using cached data
     // console.log('🔄 Enriching tickets - Users available:', users.value.length, 'Terceros available:', terceros.value.length)
    
    // Enriquecer tickets con datos disponibles (sin proyectos aún)
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
           // console.log(`👤 Ticket ${ticket.id} assigned to: ${ticket.assigned_to} (User ID: ${ticket.fk_user_assign})`)
        } else {
           // console.log(`⚠️ User not found for ticket ${ticket.id} (User ID: ${ticket.fk_user_assign})`)
        }
      } else if (ticket.fk_user_assign) {
         // console.log(`⚠️ No users loaded for ticket ${ticket.id} (User ID: ${ticket.fk_user_assign})`)
      }
      
      return ticket
    })
    
    // Calculate metrics after loading tickets
    calculateTicketMetrics()
     // console.log('✅ Tickets and metrics updated successfully')
  } catch (error) {
    // console.error('❌ Error fetching tickets:', error)
    // console.error('❌ Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

// Function to calculate ticket metrics
const calculateTicketMetrics = () => {
  const currentUserId = authStore.user?.id
  
  // Reset metrics
  ticketMetrics.value = {
    unassigned: 0,
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
    
    // Determinar si el ticket está activo (no cerrado)
    const isActive = ![7, 8, 9].includes(status) // 7=Solved, 8=Closed, 9=Cancelled
    
    // Solo contar tickets ACTIVOS para asignados/sin asignar
    if (isActive) {
      if (hasAssignedUser) {
        ticketMetrics.value.inProgress++
        if (isMyTicket) ticketMetrics.value.myInProgress++
      } else {
        ticketMetrics.value.unassigned++
      }
    }
    
    // Luego, categorizar por estado para otras métricas
    switch (status) {
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
        // Estados desconocidos no afectan otras métricas específicas
        // La asignación ya se manejó arriba
    }
  })
  
  const totalActive = ticketMetrics.value.inProgress + ticketMetrics.value.unassigned
  
  // console.log('📊 Métricas calculadas:', {
  //   totalTickets: tickets.value.length,
  //   ticketsActivos: totalActive,
  //   ticketsCerrados: ticketMetrics.value.closed,
  //   '---': '---',
  //   activosAsignados: ticketMetrics.value.inProgress,
  //   activosSinAsignar: ticketMetrics.value.unassigned,
  //   '---2': '---',
  //   pending: ticketMetrics.value.pending,
  //   awaiting: ticketMetrics.value.awaiting
  // })
}

const fetchTerceros = async () => {
  try {
    const response = await http.get('/api/doli/thirdparties?limit=5000&status=1')
    terceros.value = response.data || []
  } catch (error) {
    // console.error('Error fetching terceros:', error)
  }
}

const fetchUsers = async () => {
  try {
     // console.log('👥 Fetching users...')
    const response = await http.get('/api/doli/users?limit=1000&status=1')
    users.value = response.data || []
     // console.log('✅ Users loaded:', users.value.length)
  } catch (error) {
    // console.error('❌ Error fetching users:', error)
  }
}

const searchTerceros = () => {
  if (terceroSearch.value.length < 2) {
    filteredTercerosForFilters.value = []
    return
  }
  
  const query = terceroSearch.value.toLowerCase()
  filteredTercerosForFilters.value = terceros.value.filter(tercero => 
    tercero.name?.toLowerCase().includes(query) ||
    tercero.email?.toLowerCase().includes(query)
  ).slice(0, 10)
}

const searchUsers = () => {
  if (userSearch.value.length < 2) {
    filteredUsersForFilters.value = []
    return
  }
  
  const query = userSearch.value.toLowerCase()
  filteredUsersForFilters.value = users.value.filter(user => 
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

const selectUserFilter = (user) => {
  selectedUser.value = user
  userSearch.value = `${user.firstname} ${user.lastname}`
  showUserDropdown.value = false
  
  // IMPORTANTE: Desactivar "Mis Tickets" para mostrar todos los tickets del usuario seleccionado
  showOnlyMyTickets.value = false
  
  applyFilters()
}
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  typeFilter.value = ''
  terceroSearch.value = ''
  userSearch.value = ''
  selectedTercero.value = null
  selectedUser.value = null
  showUnassignedOnly.value = false
  showTerceroDropdown.value = false
  showUserDropdown.value = false
  filteredTercerosForFilters.value = []
  filteredUsersForFilters.value = []
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
  if (statusFilter.value !== 'show_all' && statusFilter.value !== '8' && statusFilter.value !== 8) {
    filtered = filtered.filter(ticket => ticket.fk_statut != '8' && ticket.fk_statut != 8)
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
  
  // Apply unassigned filter
  if (showUnassignedOnly.value) {
    filtered = filtered.filter(ticket => {
      const hasAssignedUser = ticket.fk_user_assign && ticket.fk_user_assign != '0'
      return !hasAssignedUser
    })
  }

  // Apply status filter
  if (statusFilter.value && statusFilter.value !== 'show_all') {
    filtered = filtered.filter(ticket => 
      ticket.fk_statut == statusFilter.value || 
      String(ticket.fk_statut) === String(statusFilter.value)
    )
  }

  // Apply priority filter
  if (priorityFilter.value) {
    filtered = filtered.filter(ticket => 
      ticket.severity_code === priorityFilter.value || 
      ticket.severity === priorityFilter.value
    )
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(ticket => 
      ticket.category_code === categoryFilter.value || 
      ticket.category === categoryFilter.value
    )
  }

  // Apply type filter
  if (typeFilter.value) {
    filtered = filtered.filter(ticket => 
      ticket.type_code === typeFilter.value || 
      ticket.type === typeFilter.value
    )
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

// Columnas del Kanban organizadas por estado
const kanbanColumns = computed(() => {
  const columns = {
    notRead: [],      // Estado 0
    read: [],         // Estado 1
    assigned: [],     // Estado 2
    inProgress: [],   // Estado 3
    needMoreInfo: [], // Estado 5
    waiting: [],      // Estado 7
    closed: [],       // Estado 8 (solo últimos 10)
    canceled: []      // Estado 9
  }
  
  filteredTickets.value.forEach(ticket => {
    const status = parseInt(ticket.fk_statut)
    
    switch(status) {
      case 0:
        columns.notRead.push(ticket)
        break
      case 1:
        columns.read.push(ticket)
        break
      case 2:
        columns.assigned.push(ticket)
        break
      case 3:
        columns.inProgress.push(ticket)
        break
      case 5:
        columns.needMoreInfo.push(ticket)
        break
      case 7:
        columns.waiting.push(ticket)
        break
      case 8:
        columns.closed.push(ticket)
        break
      case 9:
        columns.canceled.push(ticket)
        break
    }
  })
  
  // Limitar columna cerrado a los últimos 10
  columns.closed = columns.closed.slice(-10)
  
  return columns
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

// Email recipients computed
const emailRecipientsPreview = computed(() => {
  const recipients = []
  
  // 1. Email del cliente (tercero)
  if (currentCompany.value?.email) {
    recipients.push({
      email: currentCompany.value.email,
      name: currentCompany.value.name || 'Cliente',
      type: 'external'
    })
  }
  
  // 2. Email del usuario asignado (si existe)
  if (ticketDetails.value?.fk_user_assign && authStore.user?.email) {
    recipients.push({
      email: authStore.user.email,
      name: `${authStore.user.firstname || ''} ${authStore.user.lastname || ''}`.trim() || 'Usuario Asignado',
      type: 'internal'
    })
  }
  
  // 3. Emails de seguidores internos (usuarios de Dolibarr)
  if (internalFollowers.value && internalFollowers.value.length > 0) {
    internalFollowers.value.forEach(follower => {
      if (follower.email) {
        recipients.push({
          email: follower.email,
          name: follower.fullname || follower.name || follower.email,
          type: 'internal'
        })
      }
    })
  }
  
  // 4. Emails de seguidores externos (contactos del cliente)
  if (externalFollowers.value && externalFollowers.value.length > 0) {
    externalFollowers.value.forEach(follower => {
      if (follower.email) {
        recipients.push({
          email: follower.email,
          name: follower.fullname || follower.name || follower.email,
          type: 'external'
        })
      }
    })
  }
  
  // Si no hay destinatarios reales, mostrar ejemplos
  if (recipients.length === 0) {
    recipients.push(
      {
        email: 'cliente@ejemplo.com',
        name: 'Cliente Ejemplo',
        type: 'external'
      },
      {
        email: 'usuario@empresa.com',
        name: 'Usuario Interno',
        type: 'internal'
      }
    )
  }
  
  // Eliminar duplicados basado en email (case-insensitive)
  const seen = new Set()
  const uniqueRecipients = recipients.filter(recipient => {
    const normalizedEmail = recipient.email.toLowerCase().trim()
    if (!seen.has(normalizedEmail) && normalizedEmail) {
      seen.add(normalizedEmail)
      return true
    }
    return false
  })
  
  console.log('📧 Destinatarios de email calculados:', {
    total: uniqueRecipients.length,
    internos: uniqueRecipients.filter(r => r.type === 'internal').length,
    externos: uniqueRecipients.filter(r => r.type === 'external').length,
    lista: uniqueRecipients
  })
  
  return uniqueRecipients
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

// Funciones auxiliares para Kanban
const getKanbanThirdpartyInitials = (ticket) => {
  if (!ticket.thirdparty_name) return '?'
  const names = ticket.thirdparty_name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return ticket.thirdparty_name.substring(0, 2).toUpperCase()
}

const getKanbanUserInitials = (userId) => {
  const user = users.value.find(u => u.id == userId)
  if (!user) return '?'
  if (user.firstname && user.lastname) {
    return (user.firstname[0] + user.lastname[0]).toUpperCase()
  }
  return user.login?.substring(0, 2).toUpperCase() || '?'
}

const getKanbanUserName = (userId) => {
  const user = users.value.find(u => u.id == userId)
  if (!user) return 'Usuario desconocido'
  return `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.login
}

// Drag and Drop functions para Kanban
const handleKanbanDragStart = (event, ticket) => {
  draggedTicket.value = ticket
  event.dataTransfer.effectAllowed = 'move'
  
  // Agregar clase visual al elemento arrastrado
  event.target.style.opacity = '0.5'
  event.target.style.transform = 'rotate(3deg)'
  
  // console.log('🎯 Arrastrando ticket:', ticket.ref)
}

const handleKanbanDragEnd = (event) => {
  // Restaurar estilos
  event.target.style.opacity = '1'
  event.target.style.transform = 'rotate(0deg)'
  draggedTicket.value = null
}

const handleKanbanDrop = async (event, newStatus) => {
  event.preventDefault()
  
  if (!draggedTicket.value) return
  
  const ticket = draggedTicket.value
  const oldStatus = parseInt(ticket.fk_statut)
  
  if (oldStatus === newStatus) {
    // console.log('⚠️ Mismo estado, no se actualiza')
    draggedTicket.value = null
    return
  }
  
  // console.log(`🔄 Moviendo ticket ${ticket.ref} de estado ${oldStatus} a ${newStatus}`)
  
  // 1. ACTUALIZACIÓN OPTIMISTA - Actualizar UI inmediatamente
  ticket.fk_statut = String(newStatus)
  
  const index = tickets.value.findIndex(t => t.id === ticket.id)
  if (index !== -1) {
    tickets.value[index].fk_statut = String(newStatus)
  }
  
  // Actualizar métricas inmediatamente
  calculateTicketMetrics()
  
  // Limpiar estado de drag
  draggedTicket.value = null
  
  // 2. ACTUALIZAR EN SERVIDOR (en segundo plano)
  try {
    const response = await http.put(`/api/doli/tickets/${ticket.id}`, {
      fk_statut: newStatus
    })
    
    // console.log('✅ Estado confirmado en servidor:', response.data)
    
    // Mostrar notificación de éxito
    showNotification(`Ticket ${ticket.ref} movido a ${getStatusName(newStatus)}`, 'success')
    
  } catch (error) {
    // console.error('❌ Error actualizando estado en servidor:', error)
    
    // 3. REVERTIR CAMBIOS si hay error
    // console.log(`🔙 Revirtiendo ticket ${ticket.ref} a estado ${oldStatus}`)
    
    ticket.fk_statut = String(oldStatus)
    
    if (index !== -1) {
      tickets.value[index].fk_statut = String(oldStatus)
    }
    
    // Recalcular métricas con estado original
    calculateTicketMetrics()
    
    // Mostrar notificación de error
    showNotification('Error al actualizar. Cambio revertido', 'error')
  }
}

const getStatusName = (status) => {
  const statusMap = {
    0: 'No leído',
    1: 'Leído',
    2: 'Asignado',
    3: 'En progreso',
    5: 'Necesita más info',
    7: 'En espera',
    8: 'Cerrado',
    9: 'Cancelado'
  }
  return statusMap[status] || 'Desconocido'
}

// Formatear fecha para tarjetas Kanban
const formatKanbanDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(parseInt(timestamp) * 1000)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
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
      // console.warn('Error al refrescar intervenciones del usuario:', error)
    }
  }
  
  try {
     // console.log('🔍 Fetching ticket details for ID:', ticket.id)
    // Fetch detailed ticket information
    const response = await http.get(`/api/doli/tickets/${ticket.id}`)
     // console.log('✅ Ticket details response:', response)
    ticketDetails.value = response.data
    
    // Enriquecer con nombre del proyecto si existe
    if (ticketDetails.value.fk_project) {
      ticketDetails.value.project_name = await getProjectName(ticketDetails.value.fk_project)
      // console.log(`📁 Proyecto del ticket: ${ticketDetails.value.project_name}`)
    }
    
    // Cargar todas las intervenciones del ticket
    await fetchAllTicketInterventions(ticket.id)
    
    // Load followers, users/contacts, reminders, company info, and email templates
    await Promise.all([
      fetchTicketFollowers(ticket.id),
      fetchTicketReminders(ticket.id),
      fetchAvailableUsers(),
      fetchAvailableContacts(response.data.fk_soc),
      fetchCompanyInfo(response.data.fk_soc),
      loadEmailTemplates(),
      loadSubstitutionVariables()
    ])
    
    // Log summary of loaded data
     // console.log('📊 Resumen de datos cargados para intervinientes:')
     // console.log(`   - Usuarios activos: ${availableUsers.value.length}`)
     // console.log(`   - Contactos de empresa (${response.data.fk_soc}): ${availableContacts.value.length}`)
     // console.log(`   - Intervinientes actuales: ${ticketFollowers.value.length}`)
     // console.log(`   - Empresa: ${currentCompany.value?.name || 'No encontrada'}`)
    
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
        // console.warn('Messages endpoint failed:', err)
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
              // console.warn(`Failed to fetch intervention ${link.objectid}:`, interventionErr)
            }
          }
        }
      } catch (err) {
        // console.warn('Objectlinks endpoint failed:', err)
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
        // console.warn('Agenda events endpoint failed:', err)
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
        // console.warn('Fichinter endpoint failed:', err)
      }
    }
    
    ticketDetails.value.messages = interventions
    
    // Fetch third party information if fk_soc exists
    if (ticketDetails.value.fk_soc) {
      try {
        const thirdPartyResponse = await http.get(`/api/doli/thirdparties/${ticketDetails.value.fk_soc}`)
        ticketDetails.value.thirdparty_info = thirdPartyResponse.data
      } catch (thirdPartyError) {
        // console.error('Error fetching third party details:', thirdPartyError)
        ticketDetails.value.thirdparty_info = null
      }
    }
  } catch (error) {
    // console.error('❌ Error fetching ticket details:', error)
    // console.error('Error status:', error.response?.status)
    // console.error('Error data:', error.response?.data)
    // console.error('Request URL:', error.config?.url)
    ticketDetails.value = ticket // Fallback to basic ticket data
    ticketDetails.value.messages = []
  } finally {
    loadingDetails.value = false
  }
}

const closeModal = async () => {
  try {
     // console.log('🔒 Closing ticket modal...')
    
    // Usar composable para cerrar el modal
    closeTicketDetails()
    
    // Lógica adicional específica de la página Tickets
    allTicketInterventions.value = [] // Limpiar intervenciones
    
    // Limpiar plantillas de email
    selectedTemplate.value = ''
    emailTemplates.value = []
    substitutionVariables.value = []
    
    // Force refresh tickets after closing modal
     // console.log('🔄 Refreshing data after modal close...')
    await nextTick() // Wait for DOM updates
    
    // Reload users and terceros first, then tickets
    await Promise.all([
      fetchUsers(),
      fetchTerceros()
    ])
    await fetchTickets()
    
     // console.log('✅ Modal closed and data refreshed successfully')
  } catch (error) {
    // console.error('❌ Error closing modal:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

// Estados de tickets (constantes de Dolibarr)
const TICKET_STATUSES = {
  0: { id: 0, code: 'STATUS_NOT_READ', label: 'No leído', description: 'No leído / borrador' },
  1: { id: 1, code: 'STATUS_READ', label: 'Leído', description: 'Leído' },
  2: { id: 2, code: 'STATUS_ASSIGNED', label: 'Asignado', description: 'Asignado (no iniciado)' },
  3: { id: 3, code: 'STATUS_IN_PROGRESS', label: 'En progreso', description: 'En progreso' },
  5: { id: 5, code: 'STATUS_NEED_MORE_INFO', label: 'Necesita más info', description: 'Esperando información del solicitante' },
  7: { id: 7, code: 'STATUS_WAITING', label: 'En espera', description: 'En espera / On Hold' },
  8: { id: 8, code: 'STATUS_CLOSED', label: 'Cerrado', description: 'Cerrado / Resuelto' },
  9: { id: 9, code: 'STATUS_CANCELED', label: 'Cancelado', description: 'Cancelado / No resuelto' }
}

const getStatusText = (status, ticket = null) => {
  const statusNum = parseInt(status)
  
  // Si el estado es 0 o 1 y tiene usuario asignado, mostrar "Asignado"
  if ((statusNum === 0 || statusNum === 1) && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'Asignado'
  }
  
  return TICKET_STATUSES[statusNum]?.label || 'Desconocido'
}

const getStatusDescription = (status) => {
  const statusNum = parseInt(status)
  return TICKET_STATUSES[statusNum]?.description || 'Estado desconocido'
}

const getStatusCode = (status) => {
  const statusNum = parseInt(status)
  return TICKET_STATUSES[statusNum]?.code || 'UNKNOWN'
}

const getStatusClass = (status, ticket = null) => {
  const statusNum = parseInt(status)
  
  const classes = {
    0: 'bg-red-50 text-red-600 border border-red-200',        // No leído
    1: 'bg-blue-50 text-blue-600 border border-blue-200',     // Leído
    2: 'bg-yellow-50 text-yellow-600 border border-yellow-200', // Asignado
    3: 'bg-purple-50 text-purple-600 border border-purple-200', // En progreso
    5: 'bg-orange-50 text-orange-600 border border-orange-200', // Necesita más info
    7: 'bg-gray-50 text-gray-600 border border-gray-200',     // En espera
    8: 'bg-green-50 text-green-600 border border-green-200',  // Cerrado
    9: 'bg-gray-50 text-gray-700 border border-gray-300'      // Cancelado
  }
  
  // Para estados 0 y 1, si tiene usuario asignado, usar estilo de "Asignado"
  if ((statusNum === 0 || statusNum === 1) && ticket && ticket.fk_user_assign && ticket.fk_user_assign != '0') {
    return 'bg-yellow-50 text-yellow-600 border border-yellow-200' // Asignado
  }
  
  return classes[statusNum] || 'bg-gray-50 text-gray-600 border border-gray-200'
}

const getPriorityText = (priority) => {
  if (!priority) return 'Normal'
  
  // Intentar obtener el nombre desde las referencias de Dolibarr
  const severityName = getSeverityName(priority)
  
  // Si se encontró en las referencias, usarlo
  if (severityName && severityName !== priority) {
    return severityName
  }
  
  // Fallback a mapeo manual si no está en las referencias
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
    '1': 'bg-green-50 text-green-600 border border-green-200',
    '2': 'bg-blue-50 text-blue-600 border border-blue-200',
    '3': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    '4': 'bg-red-50 text-red-600 border border-red-200',
    // Add common severity codes
    'LOW': 'bg-green-50 text-green-600 border border-green-200',
    'NORMAL': 'bg-blue-50 text-blue-600 border border-blue-200',
    'HIGH': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'URGENT': 'bg-red-50 text-red-600 border border-red-200',
    'CRITICAL': 'bg-red-50 text-red-700 border border-red-300',
    'BLOCKING': 'bg-red-50 text-red-800 border border-red-400'
  }
  return classes[priority] || classes[String(priority)] || 'bg-blue-50 text-blue-600 border border-blue-200'
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
    '0': 'bg-gray-50 text-gray-600 border border-gray-200',
    '1': 'bg-green-50 text-green-600 border border-green-200',
    '2': 'bg-blue-50 text-blue-600 border border-blue-200',
    '3': 'bg-purple-50 text-purple-600 border border-purple-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-600 border border-gray-200'
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
watch([searchQuery, statusFilter, priorityFilter, categoryFilter, typeFilter], () => {
  currentPage.value = 1
})

// Watch para limpiar filtro de usuario cuando se active "Mis Tickets"
watch(showOnlyMyTickets, (newValue) => {
  if (newValue === true) {
    // Si se activa "Mis Tickets", limpiar el filtro de usuario específico
    if (selectedUser.value) {
      selectedUser.value = null
      userSearch.value = ''
      // console.log('🧹 Filtro de usuario limpiado al activar "Mis Tickets"')
    }
  }
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
    // Load users, terceros and ticket references first to enrich ticket data
    await Promise.all([
      fetchUsers(),
      fetchTerceros(),
      fetchAllTicketReferences() // Cargar referencias de tickets (categorías, gravedades, tipos)
    ])
    
    // console.log('✅ Referencias de tickets cargadas:', {
    //   categorias: ticketCategories.value.length,
    //   gravedades: ticketSeverities.value.length,
    //   tipos: ticketTypes.value.length
    // })
    
    // Then load tickets with enriched data
    await fetchTickets()
  } catch (error) {
    // console.error('❌ Error loading tickets:', error)
  }
  
  // Fetch user interventions when component mounts
  if (authStore.user && authStore.user.id) {
    try {
      await fetchUserInterventions(true) // Force refresh
    } catch (error) {
      // console.warn('⚠️ Error al obtener intervenciones del usuario:', error)
    }
  }
})

// Project management functions
const startEditProject = async () => {
  editingProject.value = true
  selectedProjectId.value = ticketDetails.value?.fk_project || ''
  
   // console.log('🔍 Starting project edit for ticket:', {
  //   ticketId: ticketDetails.value?.id,
  //   currentProject: ticketDetails.value?.fk_project,
  //   clientId: ticketDetails.value?.fk_soc
  // })
  
  let projects = []
  
  // First, if there's a current project, always include it
  if (ticketDetails.value?.fk_project && currentProject.value) {
    projects.push(currentProject.value)
     // console.log('✅ Added current project:', currentProject.value.ref)
  }
  
  // Then fetch available projects for the client
  if (ticketDetails.value?.fk_soc) {
    try {
       // console.log('🔍 Fetching projects for client:', ticketDetails.value.fk_soc)
      
      // Try different API endpoints to get projects
      let response
      try {
        // Method 1: Use sqlfilters to filter by client ID
        const sqlfilter = `(fk_soc:=:${ticketDetails.value.fk_soc})`
         // console.log('🔍 Using sqlfilter:', sqlfilter)
        response = await http.get(`/api/doli/projects?sqlfilters=${encodeURIComponent(sqlfilter)}&limit=100`)
         // console.log('✅ Method 1 (sqlfilters) succeeded')
      } catch (error1) {
        // console.warn('Method 1 (sqlfilters) failed, trying method 2...', error1.message)
        try {
          // Method 2: Filter by fk_soc parameter
          response = await http.get(`/api/doli/projects?fk_soc=${ticketDetails.value.fk_soc}&limit=100`)
           // console.log('✅ Method 2 (fk_soc param) succeeded')
        } catch (error2) {
          // console.warn('Method 2 failed, trying method 3...', error2.message)
          // Method 3: Get all projects and filter client-side
          response = await http.get(`/api/doli/projects?limit=100`)
           // console.log('✅ Method 3 (get all) succeeded')
        }
      }
      
       // console.log('📋 Projects API response:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        // Debug: Check the structure of the first few projects
         // console.log('🔍 Sample project structure:', response.data.slice(0, 3).map(p => ({
        //   id: p.id,
        //   ref: p.ref,
        //   fk_soc: p.fk_soc,
        //   socid: p.socid,
        //   client_id: p.client_id,
        //   thirdparty_id: p.thirdparty_id
        // })))
        
         // console.log('🎯 Looking for client ID:', ticketDetails.value.fk_soc, '(type:', typeof ticketDetails.value.fk_soc, ')')
        
        // Filter projects to ensure they belong to the correct client
        const clientProjects = response.data.filter(project => {
          const matches = project.fk_soc == ticketDetails.value.fk_soc || 
                         project.socid == ticketDetails.value.fk_soc ||
                         project.client_id == ticketDetails.value.fk_soc ||
                         project.thirdparty_id == ticketDetails.value.fk_soc
          
          if (matches) {
             // console.log('✅ Found matching project:', project.ref, 'with client field:', {
            //   fk_soc: project.fk_soc,
            //   socid: project.socid,
            //   client_id: project.client_id,
            //   thirdparty_id: project.thirdparty_id
            // })
          }
          
          return matches
        })
        
         // console.log('🎯 Client projects found:', clientProjects.length)
        
        // Add client projects that aren't already in the list
        clientProjects.forEach(project => {
          if (!projects.find(p => p.id === project.id)) {
            projects.push(project)
          }
        })
      }
      
      availableProjects.value = projects
       // console.log('✅ Final projects list:', projects.length, 'projects:', projects.map(p => p.ref))
      
    } catch (error) {
      // console.error('Error fetching projects:', error)
      // If API fails, at least keep the current project
      availableProjects.value = projects
    }
  } else {
    // console.warn('⚠️ No client ID (fk_soc) found in ticket details')
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
    
     // console.log('💾 Saving project for ticket:', {
    //   ticketId: ticketDetails.value.id,
    //   currentProject: ticketDetails.value.fk_project,
    //   newProject: selectedProjectId.value,
    //   updateData: updateData
    // })
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
     // console.log('✅ Project update response:', response.data)
     // console.log('✅ Response status:', response.status)
     // console.log('✅ Response headers:', response.headers)
    
    // Update local data
    ticketDetails.value.fk_project = selectedProjectId.value
    
    // Fetch updated project info if project was assigned
    if (selectedProjectId.value) {
      try {
        const projectResponse = await http.get(`/api/doli/projects/${selectedProjectId.value}`)
        currentProject.value = projectResponse.data
      } catch (error) {
        // console.warn('Error fetching project details:', error)
      }
    } else {
      currentProject.value = null
    }
    
    editingProject.value = false
     // console.log('✅ Proyecto actualizado correctamente')
    
  } catch (error) {
    // console.error('❌ Error updating project:', error)
    // console.error('❌ Error response:', error.response?.data)
    // console.error('❌ Error status:', error.response?.status)
    // console.error('❌ Error headers:', error.response?.headers)
    // console.error('❌ Error config:', error.config)
    
    // Show detailed error information
    if (error.response?.data) {
      // console.error('❌ Server error details:', error.response.data)
    }
    
    // Show error message to user
    alert('Error al actualizar el proyecto: ' + (error.response?.data?.message || error.message))
  }
}

// Status management functions
const startEditStatus = () => {
  editingStatus.value = true
  selectedStatus.value = ticketDetails.value?.fk_statut || 0
  // console.log('✏️ Iniciando edición de estado:', selectedStatus.value)
}

const cancelEditStatus = () => {
  editingStatus.value = false
  selectedStatus.value = null
}

const saveStatus = async () => {
  try {
    console.log('💾 Guardando estado del ticket:', {
      ticketId: ticketDetails.value?.id,
      estadoAnterior: ticketDetails.value?.fk_statut,
      estadoNuevo: selectedStatus.value
    })

    if (!ticketDetails.value?.id) {
      alert('Error: No se encontró el ID del ticket')
      return
    }

    const newStatus = String(selectedStatus.value)
    
    const updateData = {
      fk_statut: newStatus,
      status: newStatus
    }

    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    
    console.log('✅ Respuesta del servidor:', response.data)
    
    // Cerrar modo edición primero
    editingStatus.value = false
    
    // Actualizar también en la lista de tickets si existe
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketDetails.value.id)
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].fk_statut = newStatus
      console.log('✅ Estado actualizado en la lista de tickets')
    }
    
    // Recargar detalles del ticket para asegurar sincronización
    await refreshTicketDetails()
    
    // Esperar a que Vue actualice el DOM
    await nextTick()
    
    console.log('✅ Estado después de refresh:', ticketDetails.value?.fk_statut)
    console.log('🔍 Tipo de fk_statut:', typeof ticketDetails.value?.fk_statut)
    console.log('📋 ticketDetails completo:', ticketDetails.value)
    console.log('🎯 Estado esperado era:', newStatus)
    
    // Actualizar contador de tickets
    await updateTicketsCounter()
    
    // Recargar lista de tickets
    await fetchTickets()
    
    console.log('✅ Estado del ticket actualizado exitosamente')
    
    // Mostrar notificación de éxito
    showNotification('Estado del ticket actualizado correctamente', 'success')
  } catch (error) {
    console.error('❌ Error actualizando estado:', error)
    alert('Error al actualizar el estado del ticket: ' + (error.response?.data?.message || error.message))
  }
}

// Company management functions
const startEditCompany = async () => {
  editingCompany.value = true
  selectedCompanyId.value = ticketDetails.value?.fk_soc || ''
  
  // Inicializar el componente ThirdpartySearchInput con la empresa actual
  if (currentCompany.value) {
    selectedThirdparty.value = {
      id: currentCompany.value.id,
      name: currentCompany.value.name,
      alias: currentCompany.value.alias || '',
      email: currentCompany.value.email || '',
      idprof1: currentCompany.value.idprof1 || ''
    }
  } else {
    selectedThirdparty.value = null
  }
  
  // console.log('🔍 Starting company edit for ticket:', {
  //   ticketId: ticketDetails.value?.id,
  //   currentCompany: ticketDetails.value?.fk_soc,
  //   selectedThirdparty: selectedThirdparty.value
  // })
  
  try {
    // console.log('🔍 Fetching available companies...')
    const response = await http.get('/api/doli/thirdparties?limit=100&sortfield=t.nom&sortorder=ASC')
    
    if (response.data && Array.isArray(response.data)) {
      availableCompanies.value = response.data
      filteredCompanies.value = response.data // Inicialmente mostrar todas
      // console.log('✅ Companies loaded:', availableCompanies.value.length)
    } else {
      // console.warn('⚠️ No companies data received')
      availableCompanies.value = []
      filteredCompanies.value = []
    }
  } catch (error) {
    // console.error('❌ Error fetching companies:', error)
    availableCompanies.value = []
    filteredCompanies.value = []
  }
}

const filterCompanies = () => {
  const searchTerm = companySearchTerm.value.toLowerCase().trim()
  
  if (searchTerm === '') {
    filteredCompanies.value = availableCompanies.value
  } else {
    filteredCompanies.value = availableCompanies.value.filter(company => 
      company.name.toLowerCase().includes(searchTerm) ||
      (company.code_client && company.code_client.toLowerCase().includes(searchTerm))
    )
  }
}

const selectCompany = (companyId, companyName) => {
  selectedCompanyId.value = companyId
  companySearchTerm.value = companyName
  showCompanyDropdown.value = false
}

const cancelEditCompany = () => {
  editingCompany.value = false
  selectedCompanyId.value = ''
  selectedThirdparty.value = null
}

// Nuevas funciones para ThirdpartySearchInput
const handleThirdpartySelected = (thirdparty) => {
  // console.log('🏢 Tercero seleccionado:', thirdparty)
  selectedThirdparty.value = thirdparty
  selectedCompanyId.value = thirdparty.id
}

const handleThirdpartyCleared = () => {
  // console.log('🗑️ Tercero limpiado')
  selectedThirdparty.value = null
  selectedCompanyId.value = ''
}

const saveCompany = async () => {
  try {
    // console.log('💾 Saving company for ticket:', {
    //   ticketId: ticketDetails.value?.id,
    //   newCompanyId: selectedCompanyId.value,
    //   selectedThirdparty: selectedThirdparty.value
    // })

    const updateData = {
      fk_soc: selectedCompanyId.value || null
    }

    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    // console.log('✅ Company update response:', response)

    // Update ticket details
    if (ticketDetails.value) {
      ticketDetails.value.fk_soc = selectedCompanyId.value
    }

    // Update current company info
    if (selectedThirdparty.value) {
      // Usar los datos ya disponibles del tercero seleccionado
      currentCompany.value = {
        id: selectedThirdparty.value.id,
        name: selectedThirdparty.value.name,
        alias: selectedThirdparty.value.alias,
        email: selectedThirdparty.value.email,
        idprof1: selectedThirdparty.value.idprof1
      }
      // console.log('✅ Updated company info:', currentCompany.value?.name)
    } else {
      currentCompany.value = null
    }
    
    editingCompany.value = false
    selectedThirdparty.value = null
    // console.log('✅ Empresa actualizada correctamente')
    
  } catch (error) {
    // console.error('❌ Error updating company:', error)
    // console.error('❌ Error response:', error.response?.data)
    
    // Show error message to user
    alert('Error al actualizar la empresa: ' + (error.response?.data?.message || error.message))
  }
}

// User assignment management functions
const startEditAssignment = async () => {
  editingAssignment.value = true
  selectedAssignedUserId.value = ticketDetails.value?.fk_user_assign || ''
  
   // console.log('🔍 Starting user assignment edit for ticket:', {
  //   ticketId: ticketDetails.value?.id,
  //   currentAssignedUser: ticketDetails.value?.fk_user_assign
  // })
  
  try {
     // console.log('🔍 Fetching active users...')
    const response = await http.get('/api/doli/users?status=1&limit=100')
     // console.log('✅ Users API response:', response.data)
    
    if (response.data && Array.isArray(response.data)) {
      availableUsers.value = response.data.filter(user => user.statut == 1) // Only active users
       // console.log('✅ Active users found:', availableUsers.value.length)
    } else {
      availableUsers.value = []
    }
  } catch (error) {
    // console.error('Error fetching users:', error)
    availableUsers.value = []
  }
}

const cancelEditAssignment = () => {
  editingAssignment.value = false
  selectedAssignedUserId.value = ''
  assignmentSearchTerm.value = ''
  showAssignmentDropdown.value = false
}

// Subject editing functions
const startEditSubject = () => {
  editingSubject.value = true
  editedSubject.value = ticketDetails.value?.subject || ''
}

const cancelEditSubject = () => {
  editingSubject.value = false
  editedSubject.value = ''
}

const saveSubject = async () => {
  try {
    if (!editedSubject.value.trim()) {
      alert('El título no puede estar vacío')
      return
    }

    const updateData = {
      subject: editedSubject.value.trim()
    }
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    
    // Update local data
    if (ticketDetails.value) {
      ticketDetails.value.subject = editedSubject.value.trim()
    }
    if (selectedTicket.value) {
      selectedTicket.value.subject = editedSubject.value.trim()
    }
    
    editingSubject.value = false
    editedSubject.value = ''
    
  } catch (error) {
    console.error('❌ Error updating subject:', error)
    alert('Error al actualizar el título: ' + (error.response?.data?.message || error.message))
  }
}

// Description editing functions
const descriptionEditor = ref(null)

const startEditDescription = () => {
  editingDescription.value = true
  editedDescription.value = ticketDetails.value?.message || ''
  
  // Esperar a que el DOM se actualice
  nextTick(() => {
    if (descriptionEditor.value) {
      descriptionEditor.value.innerHTML = ticketDetails.value?.message || ''
      descriptionEditor.value.focus()
    }
  })
}

const updateDescriptionContent = (event) => {
  editedDescription.value = event.target.innerHTML
}

const formatDescriptionText = (command) => {
  if (!descriptionEditor.value) return
  
  // Enfocar el editor primero
  descriptionEditor.value.focus()
  
  // Para listas, usar un enfoque más robusto
  if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
    const listTag = command === 'insertUnorderedList' ? 'ul' : 'ol'
    const selection = window.getSelection()
    
    // Si no hay selección, crear una en el editor
    if (!selection.rangeCount) {
      const range = document.createRange()
      range.selectNodeContents(descriptionEditor.value)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    
    const range = selection.getRangeAt(0)
    
    // Verificar si ya estamos en una lista del mismo tipo
    let currentElement = range.commonAncestorContainer
    if (currentElement.nodeType === Node.TEXT_NODE) {
      currentElement = currentElement.parentNode
    }
    
    let existingList = null
    while (currentElement && currentElement !== descriptionEditor.value) {
      if (currentElement.nodeName === listTag.toUpperCase()) {
        existingList = currentElement
        break
      }
      currentElement = currentElement.parentNode
    }
    
    if (existingList) {
      // Ya estamos en una lista del mismo tipo, removerla
      const parent = existingList.parentNode
      const items = existingList.querySelectorAll('li')
      items.forEach(li => {
        const p = document.createElement('p')
        p.innerHTML = li.innerHTML
        parent.insertBefore(p, existingList)
      })
      parent.removeChild(existingList)
    } else {
      // Crear una nueva lista
      const list = document.createElement(listTag)
      const li = document.createElement('li')
      
      // Si hay texto seleccionado, usarlo
      if (range.toString().trim()) {
        const selectedText = range.extractContents()
        li.appendChild(selectedText)
      } else {
        // Si no hay selección, crear un item vacío
        li.innerHTML = '&nbsp;'
      }
      
      list.appendChild(li)
      range.insertNode(list)
      
      // Colocar el cursor dentro del li
      const newRange = document.createRange()
      newRange.setStart(li, 0)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
      
      // Actualizar el contenido
      editedDescription.value = descriptionEditor.value.innerHTML
    }
  } else {
    // Para otros comandos, usar execCommand normal
    document.execCommand(command, false, null)
  }
  
  // Actualizar el contenido y mantener el foco
  editedDescription.value = descriptionEditor.value.innerHTML
  descriptionEditor.value.focus()
}

const cancelEditDescription = () => {
  editingDescription.value = false
  editedDescription.value = ''
}

const saveDescription = async () => {
  try {
    const updateData = {
      message: editedDescription.value.trim()
    }
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
    
    // Update local data
    if (ticketDetails.value) {
      ticketDetails.value.message = editedDescription.value.trim()
    }
    
    editingDescription.value = false
    editedDescription.value = ''
    
  } catch (error) {
    console.error('❌ Error updating description:', error)
    alert('Error al actualizar la descripción: ' + (error.response?.data?.message || error.message))
  }
}

const saveAssignment = async () => {
  try {
    const updateData = {
      fk_user_assign: selectedAssignedUserId.value || null
    }
    
     // console.log('💾 Saving assignment for ticket:', {
    //   ticketId: ticketDetails.value.id,
    //   currentAssignment: ticketDetails.value.fk_user_assign,
    //   newAssignment: selectedAssignedUserId.value,
    //   updateData: updateData
    // })
    
    const response = await http.put(`/api/doli/tickets/${ticketDetails.value.id}`, updateData)
     // console.log('✅ Assignment update response:', response.data)
    
    // Update local data
    ticketDetails.value.fk_user_assign = selectedAssignedUserId.value
    
    // Fetch updated user info if user was assigned
    if (selectedAssignedUserId.value) {
      try {
        const userResponse = await http.get(`/api/doli/users/${selectedAssignedUserId.value}`)
        currentAssignedUser.value = userResponse.data
      } catch (error) {
        // console.warn('Error fetching user details:', error)
      }
    } else {
      currentAssignedUser.value = null
    }
    
    editingAssignment.value = false
    assignmentSearchTerm.value = ''
    showAssignmentDropdown.value = false
     // console.log('✅ Asignación actualizada correctamente')
    
  } catch (error) {
    // console.error('❌ Error updating assignment:', error)
    // console.error('❌ Error response:', error.response?.data)
    // console.error('❌ Error status:', error.response?.status)
    
    // Show detailed error information
    if (error.response?.data) {
      // console.error('❌ Server error details:', error.response.data)
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
  
   // console.log('🚀 Starting file upload process for', files.length, 'files')
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
       // console.log(`📁 Processing file ${i + 1}/${files.length}:`, file.name)
      
      await uploadSingleFile(file)
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    }
    
     // console.log('✅ All files uploaded successfully')
    // Refresh documents list using custom module
    await fetchTicketDocuments()
    
  } catch (error) {
    // console.error('❌ Error uploading files:', error)
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
        
         // console.log('📤 Uploading file:', {
        //   filename: file.name,
        //   size: file.size,
        //   type: file.type
        // })
        
        // Step 1: Upload document using custom module
        const uploadData = {
          filename: file.name,
          file_content: fileContent
        }
        
         // console.log('📋 Upload data (custom module):', uploadData)
        
        const uploadUrl = `/api/doli/dolibarmodernfrontendapi/ticket/${ticketDetails.value.id}/documents`
         // console.log('📤 Upload URL (custom module):', uploadUrl)
        
        const uploadResponse = await http.post(uploadUrl, uploadData)
         // console.log('✅ Document uploaded via custom module:', uploadResponse.data)
        
        resolve(uploadResponse.data)
        
      } catch (error) {
        // console.error('❌ Error in uploadSingleFile:', error)
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
     // console.log('🔗 Linking document', documentId, 'to ticket', ticketDetails.value.id)
    
    const linkData = {
      source: 'ticket',
      sourceid: ticketDetails.value.id,
      target: 'document', 
      targetid: documentId
    }
    
     // console.log('📋 Link data:', linkData)
    
    const linkResponse = await http.post('/api/doli/objectlinks', linkData)
     // console.log('✅ Document linked successfully:', linkResponse.data)
    
  } catch (error) {
    // console.error('❌ Error linking document:', error)
    // console.error('❌ Error response:', error.response?.data)
    throw error
  }
}


const fetchTicketDocuments = async () => {
  if (!ticketDetails.value?.id) {
     // console.log('📋 No ticket ID, skipping document fetch')
    return
  }
  
  try {
     // console.log('📋 Fetching documents for ticket:', ticketDetails.value.id)
    
    // Use custom module to get documents
    const response = await http.get(`/api/doli/dolibarmodernfrontendapi/ticket/${ticketDetails.value.id}/documents`)
    
     // console.log('📋 Raw response from custom module:', response)
     // console.log('📋 Response data:', response.data)
     // console.log('📋 Response data type:', typeof response.data)
     // console.log('📋 Response data keys:', response.data ? Object.keys(response.data) : 'No data')
    
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
    
     // console.log('✅ Documents processed:', ticketDocuments.value.length)
     // console.log('📋 Documents structure:', ticketDocuments.value)
    
    // Log individual document structure for debugging
    if (ticketDocuments.value.length > 0) {
       // console.log('📋 First document structure:', ticketDocuments.value[0])
       // console.log('📋 First document keys:', Object.keys(ticketDocuments.value[0]))
    }
    
  } catch (error) {
    // console.warn('⚠️ Error fetching ticket documents:', error)
    // console.error('⚠️ Error response:', error.response?.data)
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

const downloadDocument = async (doc) => {
  try {
    // Construir los parámetros para la API de descarga
    const modulepart = 'ticket' // Módulo de tickets
    
    // Obtener la referencia del ticket (ej: TS2510-0392)
    const ticketRef = ticketDetails.value?.ref || selectedTicket.value?.ref
    
    if (!ticketRef) {
      console.error('No se encontró la referencia del ticket')
      notificationStore.error('No se puede descargar el archivo')
      return
    }
    
    // Construir la ruta completa: REF_TICKET/nombre_archivo.ext
    const fileName = doc.name || doc.relativename
    if (!fileName) {
      console.error('No se encontró el nombre del archivo:', doc)
      notificationStore.error('No se puede descargar el archivo')
      return
    }
    
    const originalFile = `${ticketRef}/${fileName}`
    
    console.log('📥 Descargando archivo:', originalFile)
    
    // Construir la URL de descarga con los parámetros
    const downloadUrl = `/api/doli/documents/download?modulepart=${encodeURIComponent(modulepart)}&original_file=${encodeURIComponent(originalFile)}`
    
    // Hacer la petición GET para descargar el archivo
    // La API devuelve un JSON con el contenido en base64
    const response = await http.get(downloadUrl)
    
    console.log('📦 Response:', response.data)
    
    // Verificar que la respuesta tenga el contenido
    if (!response.data || !response.data.content) {
      console.error('❌ No se recibió contenido del archivo')
      notificationStore.error('No se pudo obtener el contenido del archivo')
      return
    }
    
    // Decodificar el contenido base64
    const base64Content = response.data.content
    const binaryString = atob(base64Content)
    const bytes = new Uint8Array(binaryString.length)
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Determinar el tipo MIME correcto
    let mimeType = 'application/octet-stream'
    const contentType = response.data['content-type']
    
    if (contentType === 'archive' || fileName.endsWith('.zip')) {
      mimeType = 'application/zip'
    } else if (fileName.endsWith('.pdf')) {
      mimeType = 'application/pdf'
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      mimeType = 'image/jpeg'
    } else if (fileName.endsWith('.png')) {
      mimeType = 'image/png'
    }
    
    // Crear blob con el contenido decodificado
    const blob = new Blob([bytes], { type: mimeType })
    
    console.log('📦 Blob creado:', {
      size: blob.size,
      type: blob.type,
      expectedSize: response.data.filesize
    })
    
    // Crear URL y descargar
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = response.data.filename || fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // Limpiar después de un pequeño delay
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    console.log('✅ Archivo descargado:', response.data.filename)
  } catch (error) {
    console.error('❌ Error descargando archivo:', error)
    notificationStore.error('Error al descargar el archivo')
  }
}


// Function to get consistent avatar color based on name
const getUserAvatarColor = (fullName) => {
  if (!fullName || fullName === '-') return 'bg-gray-500'
  
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ]
  
  // Generate consistent color based on name hash
  let hash = 0
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Watch for ticket details changes to load project and user info
watch(ticketDetails, async (newDetails) => {
  // Solo ejecutar si hay detalles del ticket (no null)
  if (!newDetails) {
    // Limpiar datos cuando se cierra el modal
    currentProject.value = null
    currentAssignedUser.value = null
    ticketFollowers.value = []
    internalFollowers.value = []
    externalFollowers.value = []
    ticketReminders.value = []
    return
  }
  
  // Load project info
  if (newDetails.fk_project) {
    try {
      const projectResponse = await http.get(`/api/doli/projects/${newDetails.fk_project}`)
      currentProject.value = projectResponse.data
    } catch (error) {
      // console.warn('Error fetching project details:', error)
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
      // console.warn('Error fetching assigned user details:', error)
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

<style scoped>
/* Estilos para el editor WYSIWYG */
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
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

[contenteditable="true"] li {
  margin: 0.25rem 0;
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

/* Estilos para drag and drop */
.drag-over {
  border-color: #3B82F6 !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
}

/* Estilos personalizados para el scrollbar del kanban estilo Trello */
.kanban-container {
  scroll-behavior: smooth;
}

.kanban-container::-webkit-scrollbar {
  height: 12px;
}

.kanban-container::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.kanban-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}

/* Estilos para descripción del ticket - forzar colores según tema */
.ticket-description-content * {
  color: inherit !important;
}

.ticket-description-content {
  color: rgb(209, 213, 219) !important;
}

.ticket-description-content.light-theme {
  color: rgb(55, 65, 81) !important;
}

.ticket-description-content p,
.ticket-description-content div,
.ticket-description-content span,
.ticket-description-content li,
.ticket-description-content strong,
.ticket-description-content em,
.ticket-description-content u {
  color: inherit !important;
}
</style>
