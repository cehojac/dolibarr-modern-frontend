<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Clientes</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de clientes activos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- Total Clients -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalClients }}</p>
            <p class="text-sm font-medium text-blue-500">Total Clientes</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Total: {{ totalClients }}</p>
          </div>
        </div>
      </div>
      
      <!-- Active Clients -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ activeClients }}</p>
            <p class="text-sm font-medium text-green-500">Activos</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Total: {{ activeClients }}</p>
          </div>
        </div>
      </div>
      
      <!-- New This Month -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ newThisMonth }}</p>
            <p class="text-sm font-medium text-orange-500">Nuevos Este Mes</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <span v-if="monthComparison !== null">
                <span v-if="monthComparison > 0" class="text-green-500">↑ {{ Math.abs(monthComparison) }}</span>
                <span v-else-if="monthComparison < 0" class="text-red-500">↓ {{ Math.abs(monthComparison) }}</span>
                <span v-else>→ 0</span>
                vs mes anterior
              </span>
              <span v-else>Mes anterior: {{ newLastMonth }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Clientes que también son Proveedores -->
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ clientsAlsoSuppliers }}</p>
            <p class="text-sm font-medium text-purple-500">También Proveedores</p>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Socios comerciales
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="px-4 py-2 rounded-lg text-sm font-medium flex items-center text-white"
                :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Cliente
        </button>
        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Importar Clientes
        </button>
      </div>
      
      <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="rounded-lg border p-4 mb-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center space-x-4 flex-wrap gap-2">
          <!-- Estado Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Estado:</label>
            <select v-model="statusFilter" @change="handleFilterChange" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'">
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <!-- Tipo Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Tipo:</label>
            <select v-model="typeFilter" @change="handleFilterChange" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'">
              <option value="all">Todos</option>
              <option value="1">Cliente</option>
              <option value="3">Cliente y Proveedor</option>
            </select>
          </div>

          <!-- Items per page -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Mostrar:</label>
            <select v-model="itemsPerPage" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'">
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>
          </div>

          <!-- Reset Filters -->
          <button 
            @click="resetFilters" 
            class="px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
            :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar
          </button>
        </div>
        
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Buscar por nombre, alias, email o código..."
            class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
          >
          <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions Bar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Export</button>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Bulk Actions</button>
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadClients">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        <span class="font-medium">{{ filteredClients.length }}</span> clientes encontrados
      </div>
    </div>

    <!-- Tabla de Clientes -->
    <div class="rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full" :class="isDark ? 'bg-gray-800' : 'bg-white'">
          <thead :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                <div class="flex items-center">
                  ID
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Empresa</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Fecha Creación</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando clientes...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredClients.length === 0">
              <td colspan="8" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron clientes</span>
              </td>
            </tr>
            <tr v-else v-for="client in paginatedClients" :key="client.id" class="transition-colors" :class="isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'">
              <!-- ID -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ client.id }}
              </td>
              
              <!-- Empresa -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-xs font-medium text-white">{{ getInitials(client.name) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div 
                      @click="viewClient(client)"
                      class="text-sm font-medium cursor-pointer hover:underline transition-colors" 
                      :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                    >
                      {{ client.name }}
                    </div>
                    <div class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                      <span v-if="client.name_alias" class="inline-flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {{ client.name_alias }}
                      </span>
                      <span v-if="client.name_alias && client.code_client" class="mx-1">•</span>
                      <span v-if="client.code_client">{{ client.code_client }}</span>
                      <span v-if="!client.name_alias && !client.code_client">Sin código</span>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ client.email || '-' }}
              </td>
              
              <!-- Teléfono -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ client.phone || '-' }}
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :checked="client.status == 1"
                    class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled
                  >
                  <span class="ml-2 text-sm" :class="client.status == 1 ? 'text-green-600' : 'text-red-600'">
                    {{ client.status == 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </label>
              </td>
              
              <!-- Tipo -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="badge in getThirdpartyBadges(client)" 
                    :key="badge.label"
                    class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full" 
                    :class="badge.class"
                  >
                    {{ badge.label }}
                  </span>
                </div>
              </td>
              
              <!-- Fecha Creación -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(client.date_creation) }}
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewClient(client)"
                    class="transition-colors"
                    :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editClient(client)"
                    class="transition-colors"
                    :class="isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-800'"
                    title="Editar"
                  >
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredClients.length) }} de {{ filteredClients.length }} clientes
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : '',
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              class="px-3 py-2 text-sm rounded-lg transition-colors"
            >
              Anterior
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="page === currentPage ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
                class="px-3 py-2 text-sm rounded-lg transition-colors"
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
              class="px-3 py-2 text-sm rounded-lg transition-colors"
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
import { useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import http from '../../utils/http'
import { getThirdpartyType, getThirdpartyBadges } from '../../utils/thirdpartyHelpers'

const router = useRouter()
const { isDark } = useTheme()

// Reactive data
const clients = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')
const statusFilter = ref('active') // Por defecto mostrar solo activos
const typeFilter = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalClients = computed(() => clients.value.length)
const activeClients = computed(() => clients.value.filter(c => c.status == 1).length)

// Clientes que también son proveedores (socios)
const clientsAlsoSuppliers = computed(() => {
  return clients.value.filter(c => {
    const typeInfo = getThirdpartyType(c)
    return typeInfo.isPartner
  }).length
})

const newThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  return clients.value.filter(c => {
    if (!c.date_creation) return false
    const date = new Date(c.date_creation * 1000) // Convertir timestamp Unix a Date
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length
})

const newLastMonth = computed(() => {
  const now = new Date()
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  
  return clients.value.filter(c => {
    if (!c.date_creation) return false
    const date = new Date(c.date_creation * 1000) // Convertir timestamp Unix a Date
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
  }).length
})

const monthComparison = computed(() => {
  if (newLastMonth.value === null) return null
  return newThisMonth.value - newLastMonth.value
})

// Computed properties
const filteredClients = computed(() => {
  let filtered = clients.value

  // Filter by status
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(client => client.status == 1)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(client => client.status != 1)
  }

  // Filter by type
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(client => client.client == typeFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(client => 
      (client.name && client.name.toLowerCase().includes(query)) ||
      (client.name_alias && client.name_alias.toLowerCase().includes(query)) ||
      (client.email && client.email.toLowerCase().includes(query)) ||
      (client.code_client && client.code_client.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value))

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClients.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredClients.value.length))

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
const loadClients = async () => {
  loading.value = true
  try {
     console.log('🔄 Cargando clientes...')
    // Filtrar solo clientes (client = 1 o 3) - Todos (activos e inactivos)
    const response = await http.get('/api/doli/thirdparties?limit=1000&sqlfilters=(t.client:in:1,3)')
    clients.value = response.data || []
     console.log('✅ Clientes cargados:', clients.value.length)
  } catch (error) {
    console.error('❌ Error loading clients:', error)
    clients.value = []
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'C'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  
  try {
    // Convertir timestamp Unix (segundos) a Date (milisegundos)
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return '-'
  }
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  statusFilter.value = 'active'
  typeFilter.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

const viewClient = (client) => {
  router.push(`/terceros/clientes/${client.id}`)
}

const editClient = (client) => {
   console.log('Edit client:', client)
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

onMounted(() => {
  loadClients()
})
</script>
