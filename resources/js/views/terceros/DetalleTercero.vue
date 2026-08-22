<template>
  <div class="min-h-screen" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- Header con navegación -->
    <div class="border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="px-6 py-4">
        <!-- Breadcrumb y botón volver -->
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center space-x-2 text-sm transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al listado</span>
          </button>
          
          <!-- Navegación anterior/siguiente -->
          <div class="flex items-center space-x-2">
            <button 
              class="p-2 rounded-lg transition-colors"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              title="Anterior"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              class="p-2 rounded-lg transition-colors"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              title="Siguiente"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Información del tercero -->
        <div v-if="tercero" class="flex items-start justify-between mb-6">
          <div class="flex items-start space-x-4">
            <!-- Logo/Icono -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            <!-- Detalles -->
            <div>
              <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.name || 'Cargando...' }}
              </h1>
              
              <!-- Dirección y datos de contacto -->
              <div class="space-y-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                <div v-if="tercero.address" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ getFullAddress(tercero) }}</span>
                </div>
                <div v-if="tercero.email" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a :href="`mailto:${tercero.email}`" class="hover:underline">{{ tercero.email }}</a>
                </div>
                <div v-if="tercero.url" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a :href="tercero.url" target="_blank" class="hover:underline flex items-center space-x-1">
                    <span>{{ tercero.url }}</span>
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Badge de estado y botones -->
          <div class="flex items-center space-x-3">
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="tercero.status == 1 
                ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                : (isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')"
            >
              {{ tercero.status == 1 ? 'Activo' : 'Inactivo' }}
            </span>
            
            <!-- Botones de acción -->
            <button 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' : 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Enviar E-mail</span>
            </button>
            <button 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Modificar</span>
            </button>
            <button 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Fusión</span>
            </button>
            <button 
              @click="showDeleteModal = true"
              :disabled="deletingThirdparty"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed'"
              title="Eliminar cliente"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        <!-- Tabs de navegación -->
        <div v-if="tabs.length > 0" class="flex space-x-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === tab.key
              ? (isDark 
                ? 'border-blue-500 text-blue-400' 
                : 'border-blue-600 text-blue-600')
              : (isDark 
                ? 'border-transparent text-gray-400 hover:text-gray-300' 
                : 'border-transparent text-gray-600 hover:text-gray-800')"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" 
                  class="ml-2 px-2 py-0.5 text-xs rounded-full"
                  :class="activeTab === tab.key
                    ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                    : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')">
              {{ tab.count }}
            </span>
          </button>
        </div>
        
        <!-- Mensaje si no hay pestañas disponibles -->
        <div v-else class="px-4 py-3">
          <div class="flex items-center space-x-2 text-sm" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No tienes permisos para ver ninguna sección de este tercero.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="p-6">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Pestañas Renderizadas Modularmente -->
      <div v-else-if="tercero" class="max-w-6xl mx-auto">
        <!-- 1. Tercero (Ficha Principal) -->
        <TabTercero 
          v-if="activeTab === 'tercero'" 
          :tercero="tercero" 
          :filtered-array-options="filteredArrayOptions" 
          :get-formatted-value="getFormattedValue"
          @switch-tab="activeTab = $event"
        />

        <!-- 2. Contactos / Direcciones -->
        <TabContactos 
          v-else-if="activeTab === 'contactos'" 
          :tercero="tercero" 
          @update-count="handleUpdateCount"
        />

        <!-- 3. Cliente (Comercial / Financiero) -->
        <TabCliente 
          v-else-if="activeTab === 'cliente'" 
          :tercero="tercero" 
        />

        <!-- 4. Proyectos -->
        <TabProyectos 
          v-else-if="activeTab === 'proyectos'" 
          :tercero="tercero" 
          @update-count="handleUpdateCount"
        />

        <!-- 5. Ítems Relacionados / Precios -->
        <TabItems 
          v-else-if="activeTab === 'items'" 
          :tercero="tercero" 
        />

        <!-- 6. Métodos de Pago / Bancos -->
        <TabPagos 
          v-else-if="activeTab === 'pagos'" 
          :tercero="tercero" 
        />

        <!-- 7. Asociaciones / Filiales -->
        <TabAsociaciones 
          v-else-if="activeTab === 'asociaciones'" 
          :tercero="tercero" 
        />

        <!-- 8. Tickets de Soporte -->
        <TabTickets 
          v-else-if="activeTab === 'tickets'" 
          :tercero="tercero" 
          @update-count="handleUpdateCount"
        />

        <!-- 9. Notificaciones -->
        <TabNotificaciones 
          v-else-if="activeTab === 'notificaciones'" 
          :tercero="tercero" 
        />

        <!-- 10. Notas Públicas y Privadas -->
        <TabNotas 
          v-else-if="activeTab === 'notas'" 
          :tercero="tercero" 
        />

        <!-- 11. Documentos -->
        <TabDocumentos 
          v-else-if="activeTab === 'documentos'" 
          :tercero="tercero" 
          @update-count="handleUpdateCount"
        />

        <!-- 12. Agenda / Eventos -->
        <TabAgenda 
          v-else-if="activeTab === 'agenda'" 
          :tercero="tercero" 
          @update-count="handleUpdateCount"
        />
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para eliminar cliente -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showDeleteModal = false">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'" @click.stop>
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Eliminar Cliente
        </h3>
      </div>
      
      <p class="text-sm mb-4" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        Esta acción es <strong class="text-red-600">permanente</strong> y no se puede deshacer. Se eliminarán todos los datos asociados al cliente, incluyendo contactos, proyectos, tickets y documentos.
      </p>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6" :class="isDark ? 'bg-red-900/20 border-red-800' : ''">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-xs font-medium" :class="isDark ? 'text-red-400' : 'text-red-800'">¡Advertencia!</p>
            <p class="text-xs mt-1" :class="isDark ? 'text-red-300' : 'text-red-700'">
              Para confirmar, escribe el nombre del cliente: <strong>{{ tercero?.name || 'N/A' }}</strong>
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
          :placeholder="`Escribe: ${tercero?.name || 'N/A'}`"
          @keyup.enter="deleteThirdparty"
        />
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteModal = false; deleteConfirmationText = ''"
          :disabled="deletingThirdparty"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50' : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="deleteThirdparty"
          :disabled="deletingThirdparty || deleteConfirmationText.trim() !== (tercero?.name || '')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
        >
          <svg v-if="deletingThirdparty" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ deletingThirdparty ? 'Eliminando...' : 'Sí, eliminar cliente' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import { usePermissions } from '../../composables/usePermissions'
import { useExtrafields } from '../../composables/useExtrafields'
import http from '../../utils/http'
import { getThirdpartyType, getThirdpartyBadges } from '../../utils/thirdpartyHelpers'

// Subcomponentes de pestañas
import TabTercero from './tabs/TabTercero.vue'
import TabContactos from './tabs/TabContactos.vue'
import TabCliente from './tabs/TabCliente.vue'
import TabProyectos from './tabs/TabProyectos.vue'
import TabItems from './tabs/TabItems.vue'
import TabPagos from './tabs/TabPagos.vue'
import TabAsociaciones from './tabs/TabAsociaciones.vue'
import TabTickets from './tabs/TabTickets.vue'
import TabNotificaciones from './tabs/TabNotificaciones.vue'
import TabNotas from './tabs/TabNotas.vue'
import TabDocumentos from './tabs/TabDocumentos.vue'
import TabAgenda from './tabs/TabAgenda.vue'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()
const { hasPermission, hasAnyPermission } = usePermissions()
const { getExtrafields, formatExtrafieldValue } = useExtrafields()

const loading = ref(true)
const tercero = ref(null)
const activeTab = ref('tercero')
const extrafieldsConfig = ref({})
const extrafieldsFormattedValues = ref({})

// Contadores dinámicos de pestañas
const tabCounts = ref({
  contactos: undefined,
  proyectos: undefined,
  tickets: undefined,
  documentos: undefined,
  agenda: undefined
})

const handleUpdateCount = ({ key, count }) => {
  tabCounts.value[key] = count
}

// Delete thirdparty state
const showDeleteModal = ref(false)
const deletingThirdparty = ref(false)
const deleteConfirmationText = ref('')

const tabs = computed(() => {
  const allTabs = [
    { 
      key: 'tercero', 
      label: 'Tercero',
      permission: 'societe->lire'
    },
    { 
      key: 'contactos', 
      label: 'Contactos/Direcciones', 
      count: tabCounts.value.contactos,
      permission: 'societe->contact->lire'
    },
    { 
      key: 'cliente', 
      label: 'Cliente',
      permission: 'societe->lire'
    },
    { 
      key: 'proyectos', 
      label: 'Proyectos', 
      count: tabCounts.value.proyectos,
      permission: 'projet->lire'
    },
    { 
      key: 'items', 
      label: 'Ítems relacionados',
      permission: 'produit->lire'
    },
    { 
      key: 'pagos', 
      label: 'Métodos de pago',
      permission: 'banque->lire'
    },
    { 
      key: 'asociaciones', 
      label: 'Asociaciones',
      permission: 'societe->lire'
    },
    { 
      key: 'tickets', 
      label: 'Tickets', 
      count: tabCounts.value.tickets,
      permissions: ['ticket->lire', 'ticket.lire', 'ticket->ticket->lire', 'societe->lire']
    },
    { 
      key: 'notificaciones', 
      label: 'Notificaciones',
      permission: 'societe->lire'
    },
    { 
      key: 'notas', 
      label: 'Notas',
      permission: 'societe->lire'
    },
    { 
      key: 'documentos', 
      label: 'Documentos', 
      count: tabCounts.value.documentos,
      permission: 'societe->lire'
    },
    { 
      key: 'agenda', 
      label: 'Eventos/Agenda',
      count: tabCounts.value.agenda,
      permission: 'agenda->myactions->read'
    },
  ]
  
  // Filtrar pestañas según permisos del usuario
  const filteredTabs = allTabs.filter(tab => {
    // Si no tiene permiso definido, mostrar siempre
    if (!tab.permission && !tab.permissions) return true
    
    // Si hay un array de permisos alternativos, basta con tener uno
    if (tab.permissions) {
      return hasAnyPermission(tab.permissions)
    }
    
    // Verificar si el usuario tiene el permiso
    return hasPermission(tab.permission)
  })
  
  console.log('🔐 Pestañas filtradas por permisos:', {
    total: allTabs.length,
    visibles: filteredTabs.length,
    ocultas: allTabs.length - filteredTabs.length,
    tabs: filteredTabs.map(t => t.label)
  })
  
  return filteredTabs
})

// Computed property to filter non-null array_options with extrafield configuration
const filteredArrayOptions = computed(() => {
  if (!tercero.value?.array_options) {
    return []
  }
  
  // La configuración viene anidada en 'societe'
  const fieldsConfig = extrafieldsConfig.value.societe || extrafieldsConfig.value
  
  // Filter out null, undefined, and empty string values
  return Object.entries(tercero.value.array_options)
    .filter(([key, value]) => {
      // Keep the field if value is not null, undefined, or empty string
      if (value === null || value === undefined || value === '') return false
      
      // Para campos select, verificar que la opción exista
      const fieldKey = key.replace(/^options_/, '')
      const fieldConfig = fieldsConfig[fieldKey]
      
      if (fieldConfig?.type === 'select') {
        const options = fieldConfig.param?.options
        // Solo mostrar si la opción existe
        return options && options[value]
      }
      
      return true
    })
    .map(([key, value]) => {
      // Obtener configuración del extrafield
      const fieldKey = key.replace(/^options_/, '')
      const fieldConfig = fieldsConfig[fieldKey]
      
      return {
        key,
        value,
        config: fieldConfig,
        label: fieldConfig?.label || formatFieldName(key),
        type: fieldConfig?.type || 'varchar'
      }
    })
})

const loadTercero = async () => {
  try {
    loading.value = true
    const terceroId = route.params.id
    
    // Cargar datos del tercero y extrafields en paralelo
    const [terceroResponse, extrafields] = await Promise.all([
      http.get(`/api/doli/thirdparties/${terceroId}`),
      getExtrafields('thirdparty')
    ])
    
    tercero.value = terceroResponse.data
    extrafieldsConfig.value = extrafields
    
    console.log('✅ Tercero y extrafields cargados:', {
      tercero: tercero.value.name,
      extrafieldsCount: Object.keys(extrafields).length
    })
    
    // Formatear valores de extrafields (especialmente para sellist que necesitan llamadas API)
    await formatExtrafieldsValues()
    
    // Verificar que la pestaña activa esté disponible después de filtrar por permisos
    const availableTabs = tabs.value
    if (availableTabs.length > 0 && !availableTabs.find(t => t.key === activeTab.value)) {
      // Si la pestaña activa no está disponible, cambiar a la primera disponible
      activeTab.value = availableTabs[0].key
      console.log(`⚠️ Pestaña activa no disponible, cambiando a: ${availableTabs[0].label}`)
    }
  } catch (error) {
    console.error('Error cargando tercero:', error)
  } finally {
    loading.value = false
  }
}

// Obtener valor formateado de un campo
const getFormattedValue = (field) => {
  const formattedValue = extrafieldsFormattedValues.value[field.key]
  
  console.log(`🔍 getFormattedValue para ${field.key}:`, {
    hasFormatted: !!formattedValue,
    formattedValue,
    originalValue: field.value,
    type: field.type
  })
  
  if (formattedValue !== undefined && formattedValue !== null) {
    return formattedValue
  }
  
  return field.value
}

// Formatear valores de extrafields
const formatExtrafieldsValues = async () => {
  if (!tercero.value?.array_options) {
    console.log('⚠️ No hay array_options para formatear')
    return
  }
  
  console.log('🔄 Iniciando formateo de extrafields...')
  console.log('📋 Array options:', tercero.value.array_options)
  console.log('⚙️ Extrafields config:', extrafieldsConfig.value)
  
  // La configuración viene anidada en 'societe'
  const fieldsConfig = extrafieldsConfig.value.societe || extrafieldsConfig.value
  console.log('⚙️ Configuración de campos societe:', fieldsConfig)
  
  const formattedValues = {}
  
  // Procesar cada extrafield
  for (const [key, value] of Object.entries(tercero.value.array_options)) {
    if (value === null || value === undefined || value === '') continue
    
    // Limpiar el key: quitar "options_" del inicio
    const fieldKey = key.replace(/^options_/, '')
    
    // Buscar la configuración del campo
    const fieldConfig = fieldsConfig[fieldKey]
    
    if (!fieldConfig) {
      console.warn(`⚠️ No se encontró configuración para el campo: ${fieldKey}`)
      formattedValues[key] = value
      continue
    }
    
    console.log(`🔍 Procesando campo: ${key}`, {
      fieldKey,
      value,
      type: fieldConfig.type,
      label: fieldConfig.label
    })
    
    try {
      // Formatear según el tipo
      if (fieldConfig.type === 'date') {
        // Convertir timestamp a fecha
        const date = new Date(value * 1000)
        formattedValues[key] = date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        console.log(`✅ Fecha formateada: ${value} → ${formattedValues[key]}`)
        
      } else if (fieldConfig.type === 'select') {
        // Para select, buscar la etiqueta en las opciones
        const options = fieldConfig.param?.options
        if (options && options[value]) {
          formattedValues[key] = options[value]
          console.log(`✅ Select resuelto: ${value} → ${formattedValues[key]}`)
        } else {
          // Si no se encuentra la opción, no mostrar el campo (no agregar a formattedValues)
          console.log(`⚠️ No se encontró opción para: ${value}, campo omitido`)
          continue
        }
        
      } else if (fieldConfig.type === 'sellist') {
        // Para sellist, buscar el nombre del elemento
        const param = fieldConfig.param?.options || fieldConfig.param
        
        // Si es una referencia a societe
        if (fieldConfig.elementtype === 'societe' || String(param).includes('societe')) {
          try {
            const response = await http.get(`/api/doli/thirdparties/${value}`)
            formattedValues[key] = response.data?.name || value
            console.log(`✅ Tercero resuelto: ${value} → ${formattedValues[key]}`)
          } catch (error) {
            console.error(`❌ Error obteniendo tercero ${value}:`, error)
            formattedValues[key] = value
          }
        } else {
          formattedValues[key] = value
        }
        
      } else if (fieldConfig.type === 'checkbox' || fieldConfig.type === 'boolean') {
        // Para checkbox/boolean, mostrar Sí/No
        formattedValues[key] = (value === '1' || value === 1 || value === true) ? 'Sí' : 'No'
        console.log(`✅ Boolean formateado: ${value} → ${formattedValues[key]}`)
        
      } else if (fieldConfig.type === 'double' || fieldConfig.type === 'price') {
        // Para números decimales
        formattedValues[key] = parseFloat(value).toFixed(2)
        console.log(`✅ Número formateado: ${value} → ${formattedValues[key]}`)
        
      } else {
        // Para otros tipos, usar el valor directo
        formattedValues[key] = value
      }
    } catch (error) {
      console.error(`❌ Error formateando campo ${key}:`, error)
      formattedValues[key] = value
    }
  }
  
  extrafieldsFormattedValues.value = formattedValues
  console.log('✅ Todos los valores formateados:', formattedValues)
}

// Generar URL de validación para CIF/NIF
const getValidationUrl = (idprof) => {
  if (!idprof) return '#'
  
  // Limpiar el ID profesional (quitar espacios)
  const cleanIdprof = idprof.replace(/\s+/g, '')
  
  // URL template para España (por defecto)
  // Puedes configurar esto según el país del tercero si es necesario
  const urlTemplate = 'http://www.e-informa.es/servlet/app/portal/ENTP/screen/SProducto/prod/ETIQUETA_EMPRESA/nif/{IDPROF}'
  
  // Reemplazar {IDPROF} con el valor real
  const validationUrl = urlTemplate.replace('{IDPROF}', cleanIdprof)
  
  console.log('🔍 URL de verificación CIF/NIF:', {
    idprof: cleanIdprof,
    url: validationUrl
  })
  
  return validationUrl
}

const goBack = () => {
  router.push('/terceros/clientes')
}

const getFullAddress = (tercero) => {
  const parts = []
  if (tercero.address) parts.push(tercero.address)
  if (tercero.zip) parts.push(tercero.zip)
  if (tercero.town) parts.push(tercero.town)
  if (tercero.state) parts.push(tercero.state)
  if (tercero.country) parts.push(tercero.country)
  return parts.join(', ') || '-'
}

const formatCurrency = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
}

const formatEventDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr
}

// Format field name from array_options key
const formatFieldName = (key) => {
  // Remove 'options_' prefix if exists
  let name = key.replace(/^options_/, '')
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ')
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  return name
}

// Format field value based on type
const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  
  // Boolean
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  
  // Number
  if (typeof value === 'number') {
    return value.toLocaleString('es-ES')
  }
  
  // Date (check if it's a timestamp or date string)
  if (isDate(value)) {
    return formatDate(value)
  }
  
  // String
  return value
}

// Check if value is a date
const isDate = (value) => {
  if (!value) return false
  
  // Check if it's a timestamp (number > 1000000000)
  if (typeof value === 'number' && value > 1000000000) {
    return true
  }
  
  // Check if it's a date string (YYYY-MM-DD or similar)
  if (typeof value === 'string') {
    const datePattern = /^\d{4}-\d{2}-\d{2}/
    return datePattern.test(value)
  }
  
  return false
}

// Format date value
const formatDate = (value) => {
  try {
    let date
    
    // If it's a timestamp
    if (typeof value === 'number') {
      date = new Date(value * 1000) // Convert to milliseconds
    } else {
      date = new Date(value)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return value
    }
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch (error) {
    return value
  }
}

// Delete thirdparty function
const deleteThirdparty = async () => {
  try {
    // Validar que el nombre del cliente coincida
    if (deleteConfirmationText.value.trim() !== (tercero.value?.name || '')) {
      alert('El nombre del cliente no coincide. Por favor, verifica e intenta nuevamente.')
      return
    }
    
    deletingThirdparty.value = true
    const terceroId = route.params.id
    
    if (!terceroId) {
      throw new Error('No se encontró el ID del cliente')
    }
    
    console.log('🗑️ Eliminando cliente:', terceroId)
    
    // Enviar DELETE request para eliminar el cliente
    const response = await http.delete(`/api/doli/thirdparties/${terceroId}`)
    console.log('✅ Cliente eliminado exitosamente:', response.data)
    
    // Cerrar modal
    showDeleteModal.value = false
    deleteConfirmationText.value = ''
    
    // Mostrar mensaje de éxito
    alert('Cliente eliminado exitosamente')
    
    // Redirigir al listado de clientes
    router.push('/terceros/clientes')
    
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error)
    console.error('❌ Error details:', error.response?.data)
    alert('Error al eliminar cliente: ' + (error.response?.data?.message || error.message))
  } finally {
    deletingThirdparty.value = false
  }
}

onMounted(() => {
  // Scroll al inicio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadTercero()
})
</script>
