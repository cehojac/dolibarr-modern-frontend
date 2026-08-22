<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Proveedores</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Gestión de proveedores y suministradores</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div>
          <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalSuppliers }}</p>
          <p class="text-sm font-medium text-blue-500">Total Proveedores</p>
        </div>
      </div>
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div>
          <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ activeSuppliers }}</p>
          <p class="text-sm font-medium text-green-500">Activos</p>
        </div>
      </div>
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div>
          <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ preferredSuppliers }}</p>
          <p class="text-sm font-medium text-purple-500">Con Categoría</p>
        </div>
      </div>
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div>
          <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ ordersThisMonth }}</p>
          <p class="text-sm font-medium text-blue-500">Pedidos Este Mes</p>
        </div>
      </div>
      <div class="rounded-xl p-4 border" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div>
          <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ formatCurrency(monthlySpending) }}</p>
          <p class="text-sm font-medium text-orange-500">Gasto Mensual</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="px-4 py-2 rounded-lg text-sm font-medium flex items-center text-white" :class="isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proveedor
        </button>
        <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Catálogo
        </button>
      </div>
      
      <button class="border px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors" :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </button>
    </div>

    <!-- Controls Bar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <select v-model="itemsPerPage" class="border border-gray-300 rounded px-3 py-1 text-sm" :class="isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'">
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Exportar</button>
        <button class="text-sm transition-colors" :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'">Acciones Masivas</button>
        <button class="transition-colors" :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'" @click="loadSuppliers">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar proveedores..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Proveedores -->
    <div class="rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50" :class="isDark ? 'bg-gray-700' : ''">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" :class="isDark ? 'text-gray-400' : ''">
                <div class="flex items-center">
                  ID
                  <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Empresa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Categorías</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Pedidos Mes</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Última Compra</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-4">
                <div v-for="i in 5" :key="i" class="flex items-center space-x-4 py-2">
                  <div class="w-8 h-8 rounded-full" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 rounded w-1/4" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                    <div class="h-2 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  </div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                  <div class="h-3 rounded w-1/6" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredSuppliers.length === 0">
              <td colspan="9" class="px-6 py-16 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-sm font-medium">No se encontraron proveedores</p>
                <p class="text-xs mt-1">Prueba a cambiar los filtros de búsqueda</p>
              </td>
            </tr>
            <tr v-else v-for="supplier in paginatedSuppliers" :key="supplier.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- ID -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ supplier.id }}
              </td>
              
              <!-- Empresa -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <span class="text-xs font-medium text-white">{{ getInitials(supplier.name) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div 
                      @click="viewSupplier(supplier)"
                      class="text-sm font-medium cursor-pointer hover:underline transition-colors" 
                      :class="isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'"
                    >
                      {{ supplier.name }}
                    </div>
                    <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ supplier.code_fournisseur || 'Sin código' }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Contacto -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ supplier.categories || '-' }}
              </td>
              
              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ supplier.email || '-' }}
              </td>
              
              <!-- Teléfono -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ supplier.phone || '-' }}
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :checked="supplier.status == 1"
                    class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled
                  >
                  <span class="ml-2 text-sm" :class="supplier.status == 1 ? 'text-green-600' : 'text-red-600'">
                    {{ supplier.status == 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </label>
              </td>
              
              <!-- Pedidos Mes -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ supplier.orders_this_month || 0 }}
              </td>
              
              <!-- Última Compra -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ supplier.last_purchase_date ? formatDate(supplier.last_purchase_date) : '-' }}
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewSupplier(supplier)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editSupplier(supplier)"
                    class="text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="createOrder(supplier)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Nuevo Pedido"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredSuppliers.length) }} de {{ filteredSuppliers.length }} proveedores
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

const router = useRouter()
const { isDark } = useTheme()

// Reactive data
const suppliers = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalSuppliers = computed(() => suppliers.value.length)
const activeSuppliers = computed(() => suppliers.value.filter(s => s.status == 1).length)
const preferredSuppliers = computed(() => suppliers.value.filter(s => s.categories && s.categories.length > 0).length)
const ordersThisMonth = computed(() => suppliers.value.reduce((sum, s) => sum + (s.orders_this_month || 0), 0))
const monthlySpending = computed(() => suppliers.value.reduce((sum, s) => sum + (s.monthly_spending || 0), 0))

// Computed properties
const filteredSuppliers = computed(() => {
  let filtered = suppliers.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(supplier => 
      (supplier.name && supplier.name.toLowerCase().includes(query)) ||
      (supplier.email && supplier.email.toLowerCase().includes(query)) ||
      (supplier.code_fournisseur && supplier.code_fournisseur.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredSuppliers.value.length / itemsPerPage.value))

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSuppliers.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredSuppliers.value.length))

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
let searchTimeout = null
const loadSuppliers = async () => {
  loading.value = true
  try {
    const response = await http.get('/api/doli/dolibarrmodernfrontendapi/suppliers/enriched')
    suppliers.value = response.data || []
  } catch (error) {
    console.warn('Endpoint enriquecido no disponible, usando endpoint estándar...')
    try {
      const response = await http.get('/api/doli/thirdparties?limit=1000&sqlfilters=(t.fournisseur:=:1)AND(t.status:=:1)')
      suppliers.value = (response.data || []).map(s => ({
        ...s,
        orders_this_month: 0,
        monthly_spending: 0,
        last_purchase_date: null,
        categories: null
      }))
    } catch (err2) {
      console.error('Error loading suppliers:', err2)
      suppliers.value = []
    }
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'P'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (error) {
    return dateString
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
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

const viewSupplier = (supplier) => {
  router.push(`/terceros/clientes/${supplier.id}`)
}

const editSupplier = (supplier) => {
   console.log('Edit supplier:', supplier)
}

const createOrder = (supplier) => {
   console.log('Create order for supplier:', supplier)
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
  loadSuppliers()
})
</script>
