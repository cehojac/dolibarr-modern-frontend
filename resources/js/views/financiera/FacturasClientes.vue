<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Facturas a Clientes</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm text-gray-500">Gestión de facturas emitidas a clientes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <!-- Total Invoices -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalInvoices }}</div>
        <div class="text-sm text-gray-500">Total Facturas</div>
      </div>
      
      <!-- Paid Invoices -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-green-600">{{ paidInvoices }}</div>
        <div class="text-sm text-green-600">Pagadas</div>
      </div>
      
      <!-- Pending Invoices -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-orange-600">{{ pendingInvoices }}</div>
        <div class="text-sm text-orange-600">Pendientes</div>
      </div>
      
      <!-- Overdue Invoices -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-red-600">{{ overdueInvoices }}</div>
        <div class="text-sm text-red-600">Vencidas</div>
      </div>
      
      <!-- Total Amount -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalAmount) }}</div>
        <div class="text-sm text-blue-600">Importe Total</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Factura
        </button>
        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Importar
        </button>
      </div>
      
      <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
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
        <button class="text-blue-600 hover:text-blue-800 text-sm">Export</button>
        <button class="text-blue-600 hover:text-blue-800 text-sm">Bulk Actions</button>
        <button class="text-gray-500 hover:text-gray-700" @click="loadInvoices">
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
          placeholder="Buscar facturas..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Facturas -->
    <div class="bg-white rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50" :class="isDark ? 'bg-gray-700' : ''">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Referencia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Vencimiento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Importe</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" :class="isDark ? 'bg-gray-800 divide-gray-700' : ''">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando facturas...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredInvoices.length === 0">
              <td colspan="7" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron facturas</span>
              </td>
            </tr>
            <tr v-else v-for="invoice in paginatedInvoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- Referencia -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ invoice.ref }}
              </td>
              
              <!-- Cliente -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getClientName(invoice) }}
              </td>
              
              <!-- Fecha -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(invoice.date) }}
              </td>
              
              <!-- Vencimiento -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ formatDate(invoice.date_lim_reglement) }}
              </td>
              
              <!-- Importe -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(invoice.total_ttc) }}
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getStatusClass(invoice.statut)">
                  {{ getStatusText(invoice.statut) }}
                </span>
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewInvoice(invoice)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="downloadPDF(invoice)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Descargar PDF"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button 
                    v-if="invoice.statut == 1"
                    @click="sendReminder(invoice)"
                    class="text-orange-600 hover:text-orange-800 transition-colors"
                    title="Enviar Recordatorio"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredInvoices.length) }} de {{ filteredInvoices.length }} facturas
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
import { useTheme } from '../../composables/useTheme'
import http from '../../utils/http'

const { isDark } = useTheme()

// Reactive data
const invoices = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalInvoices = computed(() => invoices.value.length)
const paidInvoices = computed(() => invoices.value.filter(i => i.statut == 2).length)
const pendingInvoices = computed(() => invoices.value.filter(i => i.statut == 1).length)
const overdueInvoices = computed(() => {
  const now = new Date()
  return invoices.value.filter(i => {
    if (i.statut != 1) return false
    const dueDate = new Date(i.date_lim_reglement)
    return dueDate < now
  }).length
})
const totalAmount = computed(() => {
  return invoices.value.reduce((sum, invoice) => sum + parseFloat(invoice.total_ttc || 0), 0)
})

// Computed properties
const filteredInvoices = computed(() => {
  let filtered = invoices.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(invoice => 
      (invoice.ref && invoice.ref.toLowerCase().includes(query)) ||
      (invoice.socname && invoice.socname.toLowerCase().includes(query))
    )
  }

  // Sort by date in descending order
  return filtered.sort((a, b) => {
    const dateA = new Date(a.date || 0)
    const dateB = new Date(b.date || 0)
    return dateB - dateA
  })
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage.value))

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInvoices.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredInvoices.value.length))

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
const loadInvoices = async () => {
  loading.value = true
  try {
     console.log('🔄 Cargando facturas...')
    const response = await http.get('/api/doli/invoices?limit=1000&sortfield=date&sortorder=DESC')
    invoices.value = response.data || []
     console.log('✅ Facturas cargadas:', invoices.value.length)
  } catch (error) {
    console.error('❌ Error loading invoices:', error)
    invoices.value = []
  } finally {
    loading.value = false
  }
}

const getClientName = (invoice) => {
  return invoice.socname || 'Cliente desconocido'
}

const getStatusText = (status) => {
  const statuses = {
    0: 'Borrador',
    1: 'Pendiente',
    2: 'Pagada',
    3: 'Abandonada'
  }
  return statuses[status] || 'Desconocido'
}

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-orange-100 text-orange-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
  currentPage.value = 1
}

const viewInvoice = (invoice) => {
   console.log('View invoice:', invoice)
}

const downloadPDF = (invoice) => {
   console.log('Download PDF for invoice:', invoice)
}

const sendReminder = (invoice) => {
   console.log('Send reminder for invoice:', invoice)
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
  loadInvoices()
})
</script>
