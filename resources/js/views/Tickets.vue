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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
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
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-xl border overflow-hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
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
              <th @click="sortBy('subject')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Asunto</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Grupo de Ticket
              </th>
              <th @click="sortBy('severity')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Gravedad</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Tercero
              </th>
              <th @click="sortBy('datec')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Fecha de creación</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Asignada a
              </th>
              <th @click="sortBy('fk_statut')" class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors" :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <div class="flex items-center space-x-1">
                  <span>Estado</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span>Cargando tickets...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTickets.length === 0">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex flex-col items-center space-y-2">
                  <svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>No hay tickets que coincidan con los filtros</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="ticket in paginatedTickets" :key="ticket.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewTicketDetails(ticket)"
                  class="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                >
                  {{ ticket.ref }}
                </button>
              </td>
              <td class="px-6 py-4 text-sm max-w-xs truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ ticket.subject }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.category || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      :class="getPriorityClass(ticket.severity)">
                  {{ getPriorityText(ticket.severity) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.thirdparty_name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(ticket.datec) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ ticket.assigned_to || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(ticket.fk_statut)">
                  {{ getStatusText(ticket.fk_statut) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewTicketDetails(ticket)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Ver detalles"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="text-green-400 hover:text-green-300 transition-colors" title="Editar">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredTickets.length) }} de {{ filteredTickets.length }} tickets
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

    <!-- Modal de detalles del ticket -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="relative inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border" :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'" @click.stop>
          <!-- Header -->
          <div class="px-6 py-4 border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Detalles del Ticket</h3>
                <p class="mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ selectedTicket?.ref }}</p>
              </div>
              <button @click="closeModal" class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-6" :class="isDark ? 'bg-gray-900' : 'bg-white'">
            <div v-if="loadingDetails" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span class="ml-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Cargando detalles...</span>
            </div>

            <div v-else-if="ticketDetails" class="space-y-6">
              <!-- Información básica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Referencia</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-gray-100'">{{ ticketDetails.ref }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Estado</label>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getStatusClass(ticketDetails.fk_statut)">
                      {{ getStatusText(ticketDetails.fk_statut) }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Prioridad</label>
                    <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getPriorityClass(ticketDetails.severity)">
                      {{ getPriorityText(ticketDetails.severity) }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Fecha de creación</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'">{{ formatDate(ticketDetails.datec) }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Tercero</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'">
                      {{ ticketDetails.thirdparty_info?.name || ticketDetails.thirdparty_name || '-' }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Asignado a</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'">{{ ticketDetails.assigned_to || 'Sin asignar' }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Categoría</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'">{{ ticketDetails.category || '-' }}</p>
                  </div>

                  <div v-if="ticketDetails.date_close">
                    <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Fecha de cierre</label>
                    <p class="px-3 py-2 rounded-lg" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'">{{ formatDate(ticketDetails.date_close) }}</p>
                  </div>
                </div>
              </div>

              <!-- Asunto -->
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Asunto</label>
                <p class="px-4 py-3 rounded-lg" :class="isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-gray-100'">{{ ticketDetails.subject }}</p>
              </div>

              <!-- Mensaje -->
              <div v-if="ticketDetails.message">
                <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Descripción</label>
                <div class="px-4 py-3 rounded-lg max-h-64 overflow-y-auto" :class="isDark ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'" v-html="ticketDetails.message"></div>
              </div>

              <!-- Mensajes del ticket -->
              <div v-if="ticketDetails.messages && ticketDetails.messages.length > 0" class="mt-6">
                <label class="block text-sm font-medium mb-3" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Mensajes del Ticket</label>
                <div class="space-y-4 max-h-96 overflow-y-auto">
                  <div 
                    v-for="message in ticketDetails.messages" 
                    :key="message.id"
                    class="border rounded-lg p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-blue-400">
                          {{ message.fk_user_author_name || 'Usuario' }}
                        </span>
                        <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                          {{ formatDate(message.datec) }}
                        </span>
                      </div>
                      <span v-if="message.private" class="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                        Privado
                      </span>
                    </div>
                    <div class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'" v-html="message.message || message.content"></div>
                  </div>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                <div>
                  <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Creado por</label>
                  <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ ticketDetails.fk_user_create_label || 'Sistema' }}</p>
                </div>
                <div v-if="ticketDetails.fk_user_assign_label">
                  <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Asignado por</label>
                  <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ ticketDetails.fk_user_assign_label }}</p>
                </div>
                <div v-if="ticketDetails.progress">
                  <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Progreso</label>
                  <p class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ ticketDetails.progress }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'">
            <div class="flex justify-end space-x-3">
              <button @click="closeModal" class="px-4 py-2 rounded-lg transition-colors" :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
                Cerrar
              </button>
              <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Editar Ticket
              </button>
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
    tickets.value = response.data || []
  } catch (error) {
    console.error('Error fetching tickets:', error)
  } finally {
    loading.value = false
  }
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
    const [ticketResponse, messagesResponse] = await Promise.all([
      http.get(`/api/doli/tickets/${ticket.id}`),
      http.get(`/api/doli/tickets/${ticket.id}/messages`).catch(err => {
        console.warn('Error fetching ticket messages:', err)
        return { data: [] }
      })
    ])
    
    ticketDetails.value = ticketResponse.data
    ticketDetails.value.messages = messagesResponse.data || []
    
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
  const priorities = {
    '1': 'Baja',
    '2': 'Normal',
    '3': 'Alta',
    '4': 'Urgente'
  }
  return priorities[priority] || 'Normal'
}

const getPriorityClass = (priority) => {
  const classes = {
    '1': 'bg-green-600 text-green-100',
    '2': 'bg-blue-600 text-blue-100',
    '3': 'bg-yellow-600 text-yellow-100',
    '4': 'bg-red-600 text-red-100'
  }
  return classes[priority] || 'bg-blue-600 text-blue-100'
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, priorityFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchTickets()
})
</script>
