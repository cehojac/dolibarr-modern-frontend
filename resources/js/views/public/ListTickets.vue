<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{{ $t('public.common.back') }}</span>
          </button>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  v-if="companyLogo" 
                  :src="companyLogo" 
                  :alt="companyName"
                  class="w-full h-full object-contain"
                  @error="(e) => { console.error('❌ Error al cargar imagen:', companyLogo, e); companyLogo = null }"
                  @load="() => console.log('✅ Imagen cargada exitosamente')"
                />
                <span v-else class="text-white font-bold">{{ companyInitials }}</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('public.tickets.title') }}</h1>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ companyName }}</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header con botón de cerrar sesión -->
      <div v-if="tickets.length > 0" class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('public.tickets.list.title') }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ $t('public.tickets.list.sessionOf') }} <span class="font-medium">{{ searchEmail || 'ID: ' + trackingId }}</span>
          </p>
        </div>
        <button
          @click="logout"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{{ $t('public.tickets.list.logout') }}</span>
        </button>
      </div>

      <!-- Search Form -->
      <div v-if="tickets.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.list.searchTitle') }}</h2>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('public.tickets.list.searchSubtitle') }}</p>
        </div>
        
        <div class="max-w-2xl mx-auto space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('public.tickets.list.trackingIdLabel') }}
            </label>
            <input
              v-model="trackingId"
              type="text"
              :placeholder="$t('public.tickets.list.trackingIdPlaceholder')"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
              @keyup.enter="searchTickets"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {{ $t('public.tickets.list.emailLabel') }}
            </label>
            <input
              v-model="searchEmail"
              type="email"
              :placeholder="$t('public.tickets.list.emailPlaceholder')"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              @keyup.enter="searchTickets"
            />
          </div>
          
          <div class="flex gap-3">
            <button
              @click="searchTickets"
              :disabled="(!searchEmail && !trackingId) || isLoading"
              class="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? $t('public.common.loading') : $t('public.tickets.list.viewListButton') }}</span>
            </button>
            <button
              @click="clearSearch"
              class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {{ $t('public.tickets.list.cancelButton') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div v-if="tickets.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Búsqueda de texto -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {{ $t('public.tickets.list.searchPlaceholder').split('...')[0] }}
            </label>
            <input
              v-model="searchFilter"
              type="text"
              :placeholder="$t('public.tickets.list.searchPlaceholder')"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Filtro de Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('public.tickets.list.filterByStatus') }}</label>
            <select
              v-model="statusFilter"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">{{ $t('public.tickets.list.allStatuses') }}</option>
              <option value="open">{{ $t('public.tickets.list.statuses.open') }}</option>
              <option value="in_progress">{{ $t('public.tickets.list.statuses.in_progress') }}</option>
              <option value="pending">{{ $t('public.tickets.list.statuses.pending') }}</option>
              <option value="closed">{{ $t('public.tickets.list.statuses.closed') }}</option>
            </select>
          </div>

          <!-- Filtro de Prioridad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('public.tickets.list.filterByPriority') }}</label>
            <select
              v-model="priorityFilter"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">{{ $t('public.tickets.list.allPriorities') }}</option>
              <option value="low">{{ $t('public.tickets.list.severities.LOW') }}</option>
              <option value="normal">{{ $t('public.tickets.list.severities.NORMAL') }}</option>
              <option value="high">{{ $t('public.tickets.list.severities.HIGH') }}</option>
              <option value="urgent">{{ $t('public.tickets.list.severities.URGENT') }}</option>
            </select>
          </div>
        </div>

        <!-- Checkbox para mostrar cerrados -->
        <div class="mt-4 flex items-center">
          <input
            id="showClosed"
            v-model="showClosed"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label for="showClosed" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t('public.tickets.list.showClosed') }}
          </label>
          <span class="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {{ filteredTickets.length }} {{ $t('public.tickets.list.ticketsCount') }} {{ tickets.length }} {{ $t('public.tickets.list.ticketsLabel') }}
          </span>
        </div>
      </div>

      <!-- Tickets Table -->
      <div v-if="tickets.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.date') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.ref') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.subject') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.type') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.severity') }}</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{{ $t('public.tickets.list.table.status') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(ticket.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="viewTicketDetails(ticket)"
                    class="text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 -mx-2 transition-colors"
                  >
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ ticket.ref }}
                    </div>
                    <div class="text-xs font-mono text-blue-600 dark:text-blue-400">
                      {{ ticket.trackingId }}
                    </div>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white max-w-md truncate">
                    {{ ticket.subject }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ getTypeLabel(ticket.type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="getPriorityClass(ticket.priority)"
                  >
                    {{ getPriorityLabel(ticket.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(ticket.status)"
                  >
                    {{ getStatusLabel(ticket.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No results after filtering -->
      <div v-if="tickets.length > 0 && filteredTickets.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('public.tickets.list.noMatchingTickets') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('public.tickets.list.adjustFilters') }}
        </p>
        <button
          @click="searchFilter = ''; statusFilter = 'all'; priorityFilter = 'all'"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          {{ $t('public.tickets.list.clearFilters') }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="searched && !isLoading && tickets.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('public.tickets.list.noTicketsFound') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('public.tickets.list.noTicketsMessage') }}
        </p>
      </div>

      <!-- Initial State -->
      <div v-else-if="!searched" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('public.tickets.list.searchTitle') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('public.tickets.list.searchSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Modal de Detalles del Ticket -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ selectedTicket?.ref }}<span v-if="selectedTicket?.companyName" class="text-blue-100 font-normal"> - {{ selectedTicket.companyName }}</span></h3>
              <p class="text-blue-100 text-sm">ID: {{ selectedTicket?.trackingId }}</p>
            </div>
          </div>
          <button @click="closeModal" class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <!-- Header Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('public.tickets.list.trackingIdLabel') }}</p>
                <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ selectedTicket?.trackingId }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="px-4 py-2 rounded-full text-sm font-medium"
                  :class="getStatusClass(selectedTicket?.status)"
                >
                  {{ getStatusLabel(selectedTicket?.status) }}
                </span>
                <span
                  class="px-4 py-2 rounded-full text-sm font-medium"
                  :class="getPriorityClass(selectedTicket?.priority)"
                >
                  {{ getPriorityLabel(selectedTicket?.priority) }}
                </span>
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ selectedTicket?.subject }}</h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-gray-500 dark:text-gray-400">{{ $t('public.tickets.list.table.type') }}</p>
                <p class="font-medium text-gray-900 dark:text-white mt-1">{{ getTypeLabel(selectedTicket?.type) }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">{{ $t('public.tickets.list.modal.created') }}</p>
                <p class="font-medium text-gray-900 dark:text-white mt-1">{{ formatRelativeDate(selectedTicket?.createdAt) }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">{{ $t('public.tickets.list.modal.lastUpdate') }}</p>
                <p class="font-medium text-gray-900 dark:text-white mt-1">{{ formatRelativeDate(selectedTicket?.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Description Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('public.tickets.list.modal.description') }}
            </h3>
            <div class="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" v-html="selectedTicket?.description"></div>
          </div>

          <!-- Timeline Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 historial-section">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t('public.tickets.list.modal.messages') }}
            </h3>

            <div class="space-y-6">
              <div
                v-for="(message, index) in sortedTicketMessages"
                :key="message.id"
                class="flex gap-4 message-item"
              >
                <div class="flex flex-col items-center">
                  <!-- Icono azul para usuarios externos (clientes), púrpura para internos -->
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="message.isExternal 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-purple-100 dark:bg-purple-900/30'"
                  >
                    <svg 
                      class="w-5 h-5" 
                      :class="message.isExternal 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-purple-600 dark:text-purple-400'"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div
                    v-if="index < sortedTicketMessages.length - 1"
                    class="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2"
                    style="min-height: 2rem;"
                  ></div>
                </div>

                <div class="flex-1 pb-6">
                  <p class="font-medium text-gray-900 dark:text-white mb-1">
                    {{ message.author }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {{ message.content }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    {{ formatRelativeDate(message.date) }}
                  </p>
                </div>
              </div>

              <div v-if="sortedTicketMessages.length === 0" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 pb-6">
                  <p class="font-medium text-gray-900 dark:text-white mb-1">{{ $t('public.tickets.list.modal.ticketCreated') }}</p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {{ $t('public.tickets.list.modal.ticketRegistered') }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    {{ formatRelativeDate(selectedTicket?.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Form Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {{ $t('public.tickets.list.modal.sendMessage') }}
            </h3>
            <textarea
              v-model="newMessage"
              rows="4"
              :placeholder="$t('public.tickets.list.modal.messagePlaceholder')"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none mb-4"
            ></textarea>
            <div class="flex justify-end">
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || isSending"
                class="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center space-x-2"
              >
                <svg v-if="isSending" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSending ? $t('public.tickets.list.modal.sending') : $t('public.tickets.list.modal.send') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de Éxito -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 z-[60] animate-fade-in"
    >
      <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p class="font-semibold">{{ $t('public.tickets.list.modal.messageSent') }}</p>
          <p class="text-sm text-green-100">{{ $t('public.tickets.list.modal.messageSentSuccess') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

const searchEmail = ref('')
const trackingId = ref('')
const tickets = ref([])
const isLoading = ref(false)
const searched = ref(false)
const currentContact = ref(null) // Contacto del email consultado

// Filtros
const showClosed = ref(false)
const searchFilter = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')

// Modal
const showModal = ref(false)
const selectedTicket = ref(null)
const ticketMessages = ref([])
const newMessage = ref('')
const isSending = ref(false)
const showSuccessToast = ref(false)
const companyName = ref('CH CONSULTING') // Valor por defecto
const companyLogo = ref(null) // Logo de la empresa
const companyInitials = ref('CH') // Iniciales por defecto

// Mensajes ordenados por fecha (más antiguo primero, más nuevo al final)
const sortedTicketMessages = computed(() => {
  return [...ticketMessages.value].sort((a, b) => {
    // Convertir fechas a timestamps para comparar
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB // Orden ascendente (más antiguo primero)
  })
})

// Tickets filtrados
const filteredTickets = computed(() => {
  let result = tickets.value

  // Filtrar por estado cerrado
  if (!showClosed.value) {
    result = result.filter(ticket => ticket.status !== 'closed')
  }

  // Filtrar por búsqueda de texto
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase()
    result = result.filter(ticket => 
      ticket.subject?.toLowerCase().includes(search) ||
      ticket.trackingId?.toLowerCase().includes(search) ||
      ticket.description?.toLowerCase().includes(search)
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    result = result.filter(ticket => ticket.status === statusFilter.value)
  }

  // Filtrar por prioridad
  if (priorityFilter.value !== 'all') {
    result = result.filter(ticket => ticket.priority === priorityFilter.value)
  }

  return result
})

// Datos de ejemplo - reemplazar con llamada API real
const mockTickets = [
  {
    id: 1,
    trackingId: 'TK12345678',
    subject: 'Problema con el acceso al sistema',
    description: 'No puedo acceder al sistema desde esta mañana. Me aparece un error de autenticación.',
    status: 'open',
    priority: 'high',
    type: 'problem',
    createdAt: '2024-01-15T10:30:00',
    email: 'cliente@ejemplo.com'
  },
  {
    id: 2,
    trackingId: 'TK12345679',
    subject: 'Consulta sobre facturación',
    description: 'Tengo una duda sobre mi última factura. ¿Podrían revisarla?',
    status: 'in_progress',
    priority: 'normal',
    type: 'question',
    createdAt: '2024-01-14T15:20:00',
    email: 'cliente@ejemplo.com'
  },
  {
    id: 3,
    trackingId: 'TK12345680',
    subject: 'Solicitud de nueva funcionalidad',
    description: 'Me gustaría solicitar la implementación de reportes personalizados.',
    status: 'closed',
    priority: 'low',
    type: 'request',
    createdAt: '2024-01-10T09:15:00',
    email: 'cliente@ejemplo.com'
  }
]

const searchTickets = async () => {
  try {
    console.log('🔍 INICIO - searchTickets llamado')
    
    if (!searchEmail.value && !trackingId.value) {
      console.log('⚠️ No hay email ni tracking ID')
      return
    }
    
    console.log('🔍 Iniciando búsqueda de tickets:', {
      trackingId: trackingId.value,
      email: searchEmail.value
    })
    
    isLoading.value = true
    searched.value = true
    tickets.value = []
    let socid = null
    
    // Si se proporciona tracking ID, primero obtener el ticket y su socid
    if (trackingId.value) {
      console.log('📋 Buscando por tracking ID:', trackingId.value)
      const trackResponse = await http.get(`/api/doli/tickets/track_id/${trackingId.value}`)
      
      console.log('📦 Respuesta completa de track_id:', trackResponse)
      console.log('📦 trackResponse.data:', trackResponse.data)
      console.log('📦 Tipo de data:', typeof trackResponse.data)
      console.log('📦 Es array?:', Array.isArray(trackResponse.data))
      
      // La API de Dolibarr puede devolver un objeto directamente o un array
      let ticket = null
      if (Array.isArray(trackResponse.data)) {
        if (trackResponse.data.length === 0) {
          alert('No se encontró ningún ticket con ese ID de seguimiento.')
          return
        }
        ticket = trackResponse.data[0]
      } else if (trackResponse.data && typeof trackResponse.data === 'object') {
        ticket = trackResponse.data
      } else {
        console.error('❌ Formato de respuesta inesperado:', trackResponse.data)
        alert('Error: Formato de respuesta inesperado del servidor.')
        return
      }
      
      console.log('🎫 Ticket extraído:', ticket)
      
      if (!ticket || !ticket.socid) {
        console.error('❌ Ticket sin socid:', ticket)
        alert('Error: El ticket no tiene un tercero asociado.')
        return
      }
      
      socid = ticket.socid
      console.log('✅ Ticket encontrado, socid:', socid)
      
      // Verificar que el email coincida con el tercero o sus contactos
      if (searchEmail.value) {
        console.log('🔐 Verificando email para tercero...')
        const isEmailValid = await verifyEmailForThirdparty(socid, searchEmail.value)
        
        if (!isEmailValid) {
          console.error('❌ Email no coincide con el tercero')
          alert('El correo electrónico no coincide con el tercero asociado a este ticket.')
          return
        }
        console.log('✅ Email verificado correctamente')
      }
      
      // Si solo se buscó por tracking ID (sin email), mostrar directamente el modal
      if (!searchEmail.value) {
        console.log('🎫 Mostrando modal directamente para tracking ID')
        
        // Obtener nombre de la empresa
        let companyName = ''
        try {
          const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${ticket.socid}`, {
            headers: { 'X-Public-Request': 'true' }
          })
          companyName = thirdpartyResponse.data?.name || ''
          console.log('🏢 Nombre de empresa:', companyName)
        } catch (error) {
          console.error('⚠️ Error al obtener nombre de empresa:', error)
        }
        
        const mappedTicket = {
          id: ticket.id,
          ref: ticket.ref || ticket.id,
          trackingId: ticket.track_id,
          subject: ticket.subject,
          description: ticket.message,
          status: mapTicketStatus(ticket.fk_statut),
          priority: mapTicketPriority(ticket.severity_code),
          type: ticket.type_code || 'other',
          createdAt: ticket.datec,
          email: searchEmail.value,
          socid: ticket.socid,
          companyName: companyName,
          messages: ticket.messages || []
        }
        
        // Agregar el ticket a la lista para que funcione el logout
        tickets.value = [mappedTicket]
        
        // Abrir modal directamente
        await viewTicketDetails(mappedTicket)
        return
      }
    } else if (searchEmail.value) {
      // Si solo se proporciona email, buscar el tercero por email
      console.log('📧 Buscando tercero por email:', searchEmail.value)
      socid = await findThirdpartyByEmail(searchEmail.value)
      
      if (!socid) {
        console.error('❌ No se encontró tercero con ese email')
        alert('No se encontró ningún tercero con ese correo electrónico.')
        return
      }
      console.log('✅ Tercero encontrado, socid:', socid)
    }
    
    // Obtener todos los tickets del tercero
    if (socid) {
      console.log('🎫 Obteniendo tickets del tercero, socid:', socid)
      const ticketsResponse = await http.get(`/api/doli/tickets`, {
        params: {
          socid: socid,
          sortfield: 't.datec',
          sortorder: 'DESC',
          limit: 100
        },
        headers: {
          'X-Public-Request': 'true'
        }
      })
      
      console.log('📦 Respuesta de tickets:', ticketsResponse.data)
      
      if (ticketsResponse.data && Array.isArray(ticketsResponse.data)) {
        console.log(`✅ ${ticketsResponse.data.length} tickets encontrados`)
        
        // Obtener nombre de la empresa (tercero)
        let companyName = ''
        if (socid) {
          try {
            const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${socid}`, {
              headers: { 'X-Public-Request': 'true' }
            })
            companyName = thirdpartyResponse.data?.name || ''
            console.log('🏢 Nombre de empresa:', companyName)
          } catch (error) {
            console.error('⚠️ Error al obtener nombre de empresa:', error)
          }
        }
        
        tickets.value = ticketsResponse.data.map(ticket => ({
          id: ticket.id,
          ref: ticket.ref || ticket.id,
          trackingId: ticket.track_id,
          subject: ticket.subject,
          description: ticket.message,
          status: mapTicketStatus(ticket.fk_statut),
          priority: mapTicketPriority(ticket.severity_code),
          type: ticket.type_code || 'other',
          createdAt: ticket.datec,
          email: searchEmail.value,
          socid: ticket.socid,
          companyName: companyName,
          messages: ticket.messages || []
        }))
      }
    }
    
  } catch (error) {
    console.error('❌❌❌ ERROR CAPTURADO ❌❌❌')
    console.error('Error al buscar tickets:', error)
    console.error('Error type:', typeof error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
      fullError: JSON.stringify(error, null, 2)
    })
    
    // Alert inmediato con toda la info
    let errorDetails = `
Status: ${error.response?.status || 'N/A'}
Message: ${error.message || 'N/A'}
Response: ${JSON.stringify(error.response?.data || 'N/A')}
    `
    
    if (error.response?.status === 404) {
      alert('No se encontraron tickets.')
    } else if (error.response?.status === 401) {
      alert('Error de autenticación. Verifique la configuración de la API.\n\n' + errorDetails)
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'Error desconocido'
      alert(`Error al buscar tickets: ${errorMsg}\n\nDetalles:\n${errorDetails}`)
    }
  } finally {
    console.log('🏁 Finally block - isLoading = false')
    isLoading.value = false
  }
}

// Verificar si el email pertenece al tercero o sus contactos
const verifyEmailForThirdparty = async (socid, email) => {
  try {
    console.log('🔍 Verificando email para socid:', socid)
    
    // Obtener información del tercero
    const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${socid}`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    const thirdparty = thirdpartyResponse.data
    console.log('📋 Tercero obtenido:', { email: thirdparty.email, name: thirdparty.name })
    
    // Verificar email del tercero
    if (thirdparty.email && thirdparty.email.toLowerCase() === email.toLowerCase()) {
      console.log('✅ Email coincide con el tercero')
      return true
    }
    
    // Obtener contactos del tercero
    console.log('👥 Obteniendo contactos del tercero...')
    const contactsResponse = await http.get(`/api/doli/contacts`, {
      params: {
        thirdparty_ids: socid
      },
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('📋 Contactos obtenidos:', contactsResponse.data?.length || 0)
    
    if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
      const hasMatchingContact = contactsResponse.data.some(
        contact => contact.email && contact.email.toLowerCase() === email.toLowerCase()
      )
      
      if (hasMatchingContact) {
        console.log('✅ Email coincide con un contacto')
        return true
      }
    }
    
    console.log('❌ Email no coincide con tercero ni contactos')
    return false
  } catch (error) {
    console.error('❌ Error al verificar email:', error)
    return false
  }
}

// Buscar tercero por email
const findThirdpartyByEmail = async (email) => {
  try {
    console.log('🔍 Buscando tercero por email:', email)
    
    // Buscar terceros por email
    const response = await http.get('/api/doli/thirdparties', {
      params: {
        email: email,
        limit: 1
      }
    })
    
    console.log('📋 Respuesta búsqueda terceros:', response.data)
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log('✅ Tercero encontrado por email directo, id:', response.data[0].id)
      return response.data[0].id
    }
    
    // Si no se encuentra por email del tercero, buscar en contactos
    console.log('👥 Buscando en contactos...')
    const contactsResponse = await http.get('/api/doli/contacts', {
      params: {
        email: email,
        limit: 1
      }
    })
    
    console.log('📋 Respuesta búsqueda contactos:', contactsResponse.data)
    
    if (contactsResponse.data && Array.isArray(contactsResponse.data) && contactsResponse.data.length > 0) {
      console.log('✅ Tercero encontrado por contacto, socid:', contactsResponse.data[0].socid)
      return contactsResponse.data[0].socid
    }
    
    console.log('❌ No se encontró tercero con ese email')
    return null
  } catch (error) {
    console.error('❌ Error al buscar tercero:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    return null
  }
}

// Mapear estado del ticket de Dolibarr a nuestro formato
const mapTicketStatus = (fkStatut) => {
  const statusMap = {
    '0': 'open',      // Not read
    '1': 'open',      // Read
    '2': 'open',      // Assigned
    '3': 'in_progress', // In progress
    '4': 'in_progress', // Waiting/On hold
    '5': 'in_progress', // Need more info
    '6': 'in_progress', // Need more info (customer)
    '7': 'in_progress', // Need more info (internal)
    '8': 'closed',    // Closed
    '9': 'closed'     // Cancelled
  }
  return statusMap[String(fkStatut)] || 'open'
}

// Mapear prioridad del ticket de Dolibarr a nuestro formato
const mapTicketPriority = (severityCode) => {
  const priorityMap = {
    'LOW': 'low',
    'NORMAL': 'normal',
    'HIGH': 'high',
    'URGENT': 'urgent'
  }
  return priorityMap[severityCode] || 'normal'
}

const clearSearch = () => {
  searchEmail.value = ''
  trackingId.value = ''
  tickets.value = []
  searched.value = false
}

const viewTicketDetails = async (ticket) => {
  console.log('🎫 Abriendo detalles del ticket:', ticket)
  selectedTicket.value = ticket
  showModal.value = true
  ticketMessages.value = [] // Limpiar mensajes anteriores
  
  try {
    // Obtener detalles completos del ticket con mensajes
    console.log('📡 Obteniendo detalles completos del ticket:', ticket.trackingId)
    const response = await http.get(`/api/doli/tickets/track_id/${ticket.trackingId}`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('📦 Respuesta completa del ticket:', response.data)
    
    // La respuesta puede ser un objeto o un array
    let ticketData = null
    if (Array.isArray(response.data)) {
      ticketData = response.data[0]
    } else if (response.data && typeof response.data === 'object') {
      ticketData = response.data
    }
    
    console.log('🎫 Datos del ticket:', ticketData)
    
    // Actualizar ticket seleccionado con datos completos
    if (ticketData) {
      selectedTicket.value = {
        ...ticket,
        ref: ticketData.ref || ticket.ref,
        trackingId: ticketData.track_id || ticket.trackingId,
        subject: ticketData.subject || ticket.subject,
        description: ticketData.message || ticket.description,
        status: mapTicketStatus(ticketData.fk_statut),
        priority: mapTicketPriority(ticketData.severity_code),
        type: ticketData.type_code || ticket.type,
        createdAt: ticketData.datec || ticket.createdAt,
        socid: ticketData.socid || ticket.socid
      }
      console.log('✅ Ticket actualizado con estado:', selectedTicket.value.status)
    }
    
    // Procesar mensajes usando el nuevo endpoint GET
    console.log('📡 Obteniendo mensajes del ticket con nuevo endpoint')
    try {
      const messagesResponse = await http.get(`/api/doli/dolibarrmodernfrontendapi/tickets/${ticket.id}/messages`, {
        headers: {
          'X-Public-Request': 'true'
        }
      })
      
      console.log('📦 Respuesta de mensajes:', messagesResponse.data)
      
      if (messagesResponse.data && messagesResponse.data.messages && Array.isArray(messagesResponse.data.messages)) {
        console.log('📨 Procesando mensajes:', messagesResponse.data.total_messages)
        
        ticketMessages.value = messagesResponse.data.messages.map(msg => {
          console.log('📝 Mensaje:', msg)
          
          // Determinar el autor y si es externo usando el nuevo formato
          let author = 'Sistema'
          let isExternal = false
          
          if (msg.author) {
            author = msg.author.name || 'Desconocido'
            
            // Determinar si es externo según el tipo
            if (msg.author.type === 'contact') {
              isExternal = true
              console.log('👥 Cliente externo detectado:', author, '(', msg.author.email, ')')
            } else if (msg.author.type === 'user') {
              isExternal = false
              console.log('👤 Usuario interno detectado:', author, '(', msg.author.login, ')')
            } else {
              isExternal = false
              console.log('🤖 Tipo desconocido:', author)
            }
          }
          
          return {
            id: msg.id,
            author: author,
            content: decodeHtmlEntities(msg.message),
            date: msg.date_creation, // Usar date_creation del nuevo formato
            private: msg.private === 1 || msg.private === '1',
            isExternal: isExternal
          }
        })
        
        console.log('✅ Mensajes mapeados:', ticketMessages.value)
      } else {
        console.log('⚠️ No hay mensajes en el ticket')
        ticketMessages.value = []
      }
    } catch (messagesError) {
      console.error('❌ Error al obtener mensajes:', messagesError)
      ticketMessages.value = []
    }
  } catch (error) {
    console.error('❌ Error al obtener detalles del ticket:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    // Mantener el ticket básico aunque falle la carga de detalles
    ticketMessages.value = []
  }
}

// Función para decodificar entidades HTML
const decodeHtmlEntities = (text) => {
  if (!text) return ''
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

const closeModal = () => {
  showModal.value = false
  selectedTicket.value = null
  ticketMessages.value = []
  newMessage.value = ''
}

const loadTicketMessages = async (ticketId) => {
  try {
    // Obtener mensajes del ticket desde Dolibarr
    const response = await http.get(`/api/doli/tickets/${ticketId}/messages`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    if (response.data && Array.isArray(response.data)) {
      ticketMessages.value = response.data.map(msg => ({
        id: msg.id,
        author: msg.fk_user_create ? msg.user_create : 'Cliente',
        content: msg.message,
        date: msg.datec,
        private: msg.private === '1' || msg.private === 1
      }))
    }
  } catch (error) {
    console.error('Error al cargar mensajes:', error)
    // Si falla, mostrar array vacío
    ticketMessages.value = []
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedTicket.value) return
  
  isSending.value = true
  
  try {
    console.log('📤 Enviando mensaje al ticket:', selectedTicket.value.id)
    
    // Obtener el contacto del email si no lo tenemos
    if (!currentContact.value && searchEmail.value) {
      console.log('👤 Obteniendo contacto para email:', searchEmail.value)
      const contactResponse = await http.get(`/api/doli/contacts/email/${encodeURIComponent(searchEmail.value)}`, {
        headers: {
          'X-Public-Request': 'true'
        }
      })
      
      console.log('📦 Respuesta de contacto:', contactResponse.data)
      
      if (contactResponse.data && contactResponse.data.id) {
        currentContact.value = contactResponse.data
        console.log('✅ Contacto encontrado:', currentContact.value)
      } else {
        console.error('❌ No se encontró contacto con ese email')
        alert('No se pudo identificar el usuario. Por favor, intente nuevamente.')
        isSending.value = false
        return
      }
    }
    
    // Enviar mensaje privado al ticket usando el endpoint correcto de Dolibarr
    console.log('📝 Datos a enviar:', {
      ticketId: selectedTicket.value.id,
      message: newMessage.value,
      contactId: currentContact.value?.id
    })
    
    const response = await http.post(`/api/doli/dolibarrmodernfrontendapi/tickets/${selectedTicket.value.id}/newmessage`, {
      message: newMessage.value,
      contact_id: currentContact.value?.id || null, // ID del contacto que envía
      private: 1, // Siempre privado para clientes públicos
      send_email: 0 // No enviar email por defecto
    }, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('✅ Respuesta de envío de mensaje:', response.data)
    
    if (response.data) {
      // Agregar mensaje a la lista
      const authorName = currentContact.value ? 
        `${currentContact.value.firstname || ''} ${currentContact.value.lastname || ''}`.trim() || 'Cliente' : 
        'Cliente'
      
      // Crear fecha en formato ISO local (no UTC)
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const dateISO = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      
      console.log('📅 Fecha del nuevo mensaje:', dateISO)
      
      ticketMessages.value.push({
        id: response.data.id || Date.now(),
        author: authorName,
        content: newMessage.value,
        date: dateISO, // Formato: "2025-10-20 20:28:00" (hora local)
        private: true,
        isExternal: true // Mensaje enviado desde portal público (cliente)
      })
      
      newMessage.value = ''
      
      // Mostrar notificación de éxito
      showSuccessToast.value = true
      setTimeout(() => {
        showSuccessToast.value = false
      }, 3000)
      
      // Esperar a que Vue actualice el DOM antes de hacer scroll
      await nextTick()
      
      // Pequeño delay adicional para asegurar renderizado completo
      setTimeout(() => {
        // Buscar el último mensaje en el DOM
        const messages = document.querySelectorAll('.message-item')
        console.log('🔍 Mensajes encontrados para scroll:', messages.length)
        
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          console.log('📍 Haciendo scroll al último mensaje')
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        } else {
          // Fallback: scroll al final de la sección de historial
          const historialSection = document.querySelector('.historial-section')
          if (historialSection) {
            console.log('📍 Fallback: scroll manual al final')
            historialSection.scrollTop = historialSection.scrollHeight
          }
        }
      }, 100)
    }
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    alert('Error al enviar el mensaje. Por favor, intente nuevamente.')
  } finally {
    isSending.value = false
  }
}

const goBack = () => {
  router.push('/new-ticket')
}

const logout = () => {
  // Limpiar todos los datos de la sesión
  searchEmail.value = ''
  trackingId.value = ''
  tickets.value = []
  searched.value = false
  
  // Limpiar filtros
  showClosed.value = false
  searchFilter.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  
  // Cerrar modal si está abierto
  if (showModal.value) {
    closeModal()
  }
  
  console.log('🚪 Sesión cerrada - Volviendo al formulario')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  // Si es un timestamp Unix (número de segundos), convertir a milisegundos
  let timestamp = dateString
  if (typeof dateString === 'number' || !isNaN(dateString)) {
    timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  
  // Calcular diferencia en tiempo
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)
  
  // Formato relativo
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else if (diffWeeks < 4) {
    return `hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`
  } else if (diffMonths < 12) {
    return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`
  } else {
    return `hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`
  }
}

const formatRelativeDate = (dateString) => {
  if (!dateString) return '-'
  
  // Si es un timestamp Unix (número de segundos), convertir a milisegundos
  let timestamp = dateString
  if (typeof dateString === 'number' || !isNaN(dateString)) {
    timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  
  // Calcular diferencia en tiempo
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  // Formato relativo
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else {
    return formatDate(dateString)
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  // Si es un timestamp Unix (número de segundos), convertir a milisegundos
  let timestamp = dateString
  if (typeof dateString === 'number' || !isNaN(dateString)) {
    timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  
  // Calcular diferencia en tiempo
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  // Formato relativo con más detalle para mensajes
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else {
    // Para fechas más antiguas, mostrar fecha completa
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getStatusLabel = (status) => {
  const labels = {
    open: t('public.tickets.list.statuses.open'),
    in_progress: t('public.tickets.list.statuses.in_progress'),
    closed: t('public.tickets.list.statuses.closed'),
    pending: t('public.tickets.list.statuses.pending')
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    closed: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    pending: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
  }
  return classes[status] || classes.open
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: t('public.tickets.list.severities.LOW'),
    normal: t('public.tickets.list.severities.NORMAL'),
    high: t('public.tickets.list.severities.HIGH'),
    urgent: t('public.tickets.list.severities.URGENT')
  }
  return labels[priority] || priority
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    normal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return classes[priority] || classes.normal
}

// Cargar nombre y logo de la empresa
const loadCompanyInfo = async () => {
  try {
    console.log('🏢 Obteniendo información de la empresa')
    const response = await http.get('/api/doli/setup/company', {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    if (response.data) {
      // Cargar nombre
      if (response.data.name) {
        companyName.value = response.data.name
        console.log('✅ Nombre de empresa cargado:', companyName.value)
        
        // Calcular iniciales del nombre
        const words = response.data.name.split(' ')
        if (words.length >= 2) {
          companyInitials.value = words[0][0] + words[1][0]
        } else if (words.length === 1 && words[0].length >= 2) {
          companyInitials.value = words[0].substring(0, 2)
        }
        console.log('✅ Iniciales calculadas:', companyInitials.value)
      }
      
      // Cargar logo
      console.log('📦 Respuesta completa de la API:', response.data)
      if (response.data.logo) {
        // Usar un endpoint proxy en el backend para obtener la imagen
        companyLogo.value = `/api/doli-image?modulepart=mycompany&file=${encodeURIComponent(response.data.logo)}`
        console.log('✅ Logo de empresa configurado:', companyLogo.value)
        console.log('📄 Logo original de API:', response.data.logo)
      } else {
        console.log('⚠️ No se encontró logo en la respuesta de la API')
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar información de empresa:', error)
    // Mantener valores por defecto
  }
}

// Cargar información de empresa al montar el componente
loadCompanyInfo()

const getTypeLabel = (type) => {
  const types = {
    QUESTION: t('public.tickets.list.types.QUESTION'),
    PROBLEM: t('public.tickets.list.types.PROBLEM'),
    REQUEST: t('public.tickets.list.types.REQUEST'),
    OTHER: t('public.tickets.list.types.OTHER'),
    question: t('public.tickets.list.types.QUESTION'),
    problem: t('public.tickets.list.types.PROBLEM'),
    request: t('public.tickets.list.types.REQUEST'),
    other: t('public.tickets.list.types.OTHER')
  }
  return types[type] || type
}
</script>
