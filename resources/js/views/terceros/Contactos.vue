<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Contactos</h1>
          <div class="flex items-center mt-1">
            <span class="text-sm text-gray-500">Gestión de contactos y personas de contacto</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <!-- Total Contacts -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ totalContacts }}</div>
        <div class="text-sm text-gray-500">Total Contactos</div>
      </div>
      
      <!-- Active Contacts -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-green-600">{{ activeContacts }}</div>
        <div class="text-sm text-green-600">Activos</div>
      </div>
      
      <!-- Primary Contacts -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-blue-600">{{ primaryContacts }}</div>
        <div class="text-sm text-blue-600">Principales</div>
      </div>
      
      <!-- New This Month -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-purple-600">{{ newThisMonth }}</div>
        <div class="text-sm text-purple-600">Nuevos Este Mes</div>
      </div>
      
      <!-- With Email -->
      <div class="bg-white rounded-lg border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
        <div class="text-2xl font-bold text-yellow-600">{{ contactsWithEmail }}</div>
        <div class="text-sm text-yellow-600">Con Email</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <button class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Contacto
        </button>
        <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center" :class="isDark ? 'border-gray-600 text-gray-300' : ''">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Enviar Email Masivo
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
        <button class="text-gray-500 hover:text-gray-700" @click="loadContacts">
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
          placeholder="Buscar contactos..."
          class="border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white'"
        >
        <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Tabla de Contactos -->
    <div class="bg-white rounded-lg border overflow-hidden" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Contacto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Empresa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Cargo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" :class="isDark ? 'text-gray-400' : ''">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" :class="isDark ? 'bg-gray-800 divide-gray-700' : ''">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span class="text-sm">Cargando contactos...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredContacts.length === 0">
              <td colspan="9" class="px-6 py-8 text-center" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <span class="text-sm">No se encontraron contactos</span>
              </td>
            </tr>
            <tr v-else v-for="contact in paginatedContacts" :key="contact.id" class="hover:bg-gray-50 transition-colors" :class="isDark ? 'hover:bg-gray-700' : ''">
              <!-- ID -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ contact.id }}
              </td>
              
              <!-- Contacto -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span class="text-xs font-medium text-white">{{ getInitials(contact) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                      {{ getFullName(contact) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ contact.civility_code || '' }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Empresa -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ getCompanyName(contact) }}
              </td>
              
              <!-- Cargo -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ contact.poste || '-' }}
              </td>
              
              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                <a v-if="contact.email" :href="`mailto:${contact.email}`" class="text-blue-600 hover:text-blue-800">
                  {{ contact.email }}
                </a>
                <span v-else>-</span>
              </td>
              
              <!-- Teléfono -->
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                {{ contact.phone_pro || contact.phone_perso || contact.phone_mobile || '-' }}
              </td>
              
              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :checked="contact.statut == 1"
                    class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    disabled
                  >
                  <span class="ml-2 text-sm" :class="contact.statut == 1 ? 'text-green-600' : 'text-red-600'">
                    {{ contact.statut == 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </label>
              </td>
              
              <!-- Tipo -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full"
                      :class="getContactTypeClass(contact)">
                  {{ getContactType(contact) }}
                </span>
              </td>
              
              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button 
                    @click="viewContact(contact)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="editContact(contact)"
                    class="text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    v-if="contact.email"
                    @click="sendEmail(contact)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Enviar Email"
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
            Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredContacts.length) }} de {{ filteredContacts.length }} contactos
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
const contacts = ref([])
const loading = ref(false)

// Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Métricas computadas
const totalContacts = computed(() => contacts.value.length)
const activeContacts = computed(() => contacts.value.filter(c => c.statut == 1).length)
const primaryContacts = computed(() => {
  // Simular contactos principales
  return contacts.value.filter(c => parseInt(c.id) % 3 === 0).length
})
const newThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  return contacts.value.filter(c => {
    if (!c.datec) return false
    const date = new Date(c.datec)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length
})
const contactsWithEmail = computed(() => contacts.value.filter(c => c.email).length)

// Computed properties
const filteredContacts = computed(() => {
  let filtered = contacts.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact => 
      (contact.firstname && contact.firstname.toLowerCase().includes(query)) ||
      (contact.lastname && contact.lastname.toLowerCase().includes(query)) ||
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      (contact.poste && contact.poste.toLowerCase().includes(query))
    )
  }

  // Sort by ID in descending order
  return filtered.sort((a, b) => {
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idB - idA
  })
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredContacts.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredContacts.value.length))

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
const loadContacts = async () => {
  loading.value = true
  try {
     console.log('🔄 Cargando contactos...')
    const response = await http.get('/api/doli/contacts?limit=1000&sqlfilters=(t.statut:=:1)')
    contacts.value = response.data || []
     console.log('✅ Contactos cargados:', contacts.value.length)
  } catch (error) {
    console.error('❌ Error loading contacts:', error)
    contacts.value = []
  } finally {
    loading.value = false
  }
}

const getInitials = (contact) => {
  const firstname = contact.firstname || ''
  const lastname = contact.lastname || ''
  if (firstname && lastname) {
    return (firstname[0] + lastname[0]).toUpperCase()
  } else if (firstname) {
    return firstname[0].toUpperCase()
  } else if (lastname) {
    return lastname[0].toUpperCase()
  }
  return 'C'
}

const getFullName = (contact) => {
  const firstname = contact.firstname || ''
  const lastname = contact.lastname || ''
  return `${firstname} ${lastname}`.trim() || 'Sin nombre'
}

const getCompanyName = (contact) => {
  // Simular nombre de empresa basado en el ID del contacto
  const companies = ['Empresa A', 'Corporación B', 'Industrias C', 'Servicios D', 'Tecnología E']
  return companies[parseInt(contact.id) % companies.length]
}

const getContactType = (contact) => {
  const types = ['Principal', 'Secundario', 'Técnico', 'Comercial', 'Administrativo']
  return types[parseInt(contact.id) % types.length]
}

const getContactTypeClass = (contact) => {
  const type = getContactType(contact)
  const classes = {
    'Principal': 'bg-blue-100 text-blue-800',
    'Secundario': 'bg-gray-100 text-gray-800',
    'Técnico': 'bg-green-100 text-green-800',
    'Comercial': 'bg-purple-100 text-purple-800',
    'Administrativo': 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const handleSearch = () => {
  currentPage.value = 1
}

const viewContact = (contact) => {
   console.log('View contact:', contact)
}

const editContact = (contact) => {
   console.log('Edit contact:', contact)
}

const sendEmail = (contact) => {
   console.log('Send email to contact:', contact)
  window.open(`mailto:${contact.email}`)
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
  loadContacts()
})
</script>
