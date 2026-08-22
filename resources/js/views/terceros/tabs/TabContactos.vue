<template>
  <div class="space-y-6">
    <!-- Header de la pestaña: Título, Filtro y Botón Nuevo Contacto -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Contactos y Direcciones
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ filteredContactos.length }} {{ filteredContactos.length === 1 ? 'contacto registrado' : 'contactos registrados' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Input búsqueda -->
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar contacto..."
              class="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
            />
            <svg class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Botón Nuevo Contacto -->
          <button 
            @click="openCreateModal"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Contactos (Grid de Tarjetas) -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="rounded-xl border p-5 animate-pulse" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-750 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-gray-750 rounded"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-750 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div 
      v-else-if="filteredContactos.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ searchQuery ? 'No se encontraron contactos que coincidan' : 'No hay contactos registrados' }}
      </h3>
      <p class="text-xs mb-4 max-w-sm mx-auto" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        {{ searchQuery ? 'Prueba con otros términos de búsqueda.' : 'Añade personas de contacto asociadas a esta empresa para gestionar comunicaciones y llamadas.' }}
      </p>
      <button 
        v-if="!searchQuery"
        @click="openCreateModal"
        class="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Añadir primer contacto</span>
      </button>
    </div>

    <!-- Cards de Contactos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="contacto in filteredContactos" 
        :key="contacto.id"
        class="rounded-xl border p-5 transition-all relative group flex flex-col justify-between"
        :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-md shadow-black/20 hover:border-gray-600' : 'bg-white border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-sm'"
      >
        <div>
          <!-- Cabecera de la tarjeta -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md flex-shrink-0">
                {{ getInitials(contacto.firstname, contacto.lastname) }}
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ contacto.firstname }} {{ contacto.lastname }}
                </h4>
                <p class="text-xs truncate font-medium mt-0.5" :class="isDark ? 'text-blue-400' : 'text-blue-600'">
                  {{ getContactTypeLabel(contacto) }}
                </p>
                <p v-if="contacto.poste || contacto.position" class="text-[10px] truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ contacto.poste || contacto.position }}
                </p>
              </div>
            </div>

            <!-- Badge de estado -->
            <span 
              class="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
              :class="contacto.statut == 1 || contacto.status == 1 ? (isDark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600')"
            >
              {{ contacto.statut == 1 || contacto.status == 1 ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <!-- Datos de contacto -->
          <div class="space-y-2 text-xs mb-4" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            <!-- Email -->
            <div v-if="contacto.email" class="flex items-center space-x-2 truncate">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${contacto.email}`" class="hover:underline truncate text-blue-600 dark:text-blue-400">{{ contacto.email }}</a>
            </div>

            <!-- Teléfono fijo -->
            <div v-if="contacto.phone_pro || contacto.phone" class="flex items-center space-x-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${contacto.phone_pro || contacto.phone}`" class="hover:underline font-mono">{{ contacto.phone_pro || contacto.phone }}</a>
            </div>

            <!-- Teléfono móvil -->
            <div v-if="contacto.phone_mobile" class="flex items-center space-x-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <a :href="`tel:${contacto.phone_mobile}`" class="hover:underline font-mono">{{ contacto.phone_mobile }}</a>
            </div>

            <!-- Dirección si es específica -->
            <div v-if="contacto.address || contacto.town" class="flex items-start space-x-2">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span class="truncate">{{ [contacto.address, contacto.zip, contacto.town].filter(Boolean).join(', ') }}</span>
            </div>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="pt-3 border-t flex items-center justify-between" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
          <div class="flex items-center space-x-1.5">
            <a 
              v-if="contacto.email" 
              :href="`mailto:${contacto.email}`"
              class="p-1.5 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
              title="Enviar correo"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a 
              v-if="contacto.phone_mobile || contacto.phone_pro" 
              :href="`tel:${contacto.phone_mobile || contacto.phone_pro}`"
              class="p-1.5 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
              title="Llamar"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>

          <div class="flex items-center space-x-1.5">
            <button 
              @click="openEditModal(contacto)"
              class="px-2 py-1 text-xs font-medium rounded border transition-colors"
              :class="isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              Editar
            </button>
            <button 
              @click="deleteContact(contacto.id)"
              class="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              title="Eliminar contacto"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear / Editar Contacto -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" @click.self="showModal = false">
      <div class="rounded-xl p-6 w-full max-w-lg shadow-2xl border transition-all" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'">
        <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="text-base font-bold">{{ isEditing ? 'Modificar Contacto' : 'Nuevo Contacto' }}</h3>
          <button @click="showModal = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            &times;
          </button>
        </div>

        <form @submit.prevent="saveContact" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Nombre *</label>
              <input 
                v-model="form.firstname"
                type="text" 
                required
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Apellidos *</label>
              <input 
                v-model="form.lastname"
                type="text" 
                required
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Puesto / Cargo</label>
              <input 
                v-model="form.poste"
                type="text" 
                placeholder="Ej. Director de Compras"
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Correo Electrónico</label>
              <input 
                v-model="form.email"
                type="email" 
                placeholder="contacto@empresa.com"
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
          </div>

          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Tipo de contacto</label>
            <select 
              v-model="form.fk_c_type_contact"
              class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
              <option :value="null">-- Selecciona un tipo --</option>
              <option 
                v-for="type in contactTypes" 
                :key="type.id || type.rowid" 
                :value="type.id || type.rowid"
              >
                {{ getContactTypeDisplay(type) }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Teléfono Trabajo</label>
              <input 
                v-model="form.phone_pro"
                type="tel" 
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Teléfono Móvil</label>
              <input 
                v-model="form.phone_mobile"
                type="tel" 
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button 
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-xs font-medium rounded-lg border transition-colors"
              :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors inline-flex items-center space-x-1.5"
            >
              <div v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
              <span>{{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar Contacto') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../../composables/useTheme'
import http from '../../../utils/http'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-count'])

const { isDark } = useTheme()

const contactos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = ref({
  firstname: '',
  lastname: '',
  poste: '',
  fk_c_type_contact: null,
  email: '',
  phone_pro: '',
  phone_mobile: ''
})

const contactTypes = ref([])

// Cargar tipos de contacto desde el módulo personalizado de Dolibarr
const loadContactTypes = async () => {
  try {
    const response = await http.get('/api/doli/dolibarrmodernfrontendapi/contacttypes')
    const data = response.data
    contactTypes.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar tipos de contacto:', error.message)
    contactTypes.value = []
  }
}

const getContactTypeDisplay = (type) => {
  const label = type.libelle || type.label || type.name || type.title
  return type.element ? `${type.element} - ${label}` : label
}

const getContactTypeLabel = (contacto) => {
  const typeId = contacto.fk_c_type_contact || contacto.fk_c_type_contact_id || contacto.type_id
  if (typeId) {
    const type = contactTypes.value.find(t =>
      (t.id && (t.id == typeId)) ||
      (t.rowid && (t.rowid == typeId)) ||
      (t.code && (t.code === String(typeId)))
    )
    if (type) return getContactTypeDisplay(type)
  }
  return contacto.type || contacto.libelle_type || contacto.poste || contacto.position || 'Contacto'
}

const filteredContactos = computed(() => {
  if (!searchQuery.value.trim()) return contactos.value
  const q = searchQuery.value.toLowerCase()
  return contactos.value.filter(c => {
    const full = `${c.firstname || ''} ${c.lastname || ''}`.toLowerCase()
    const email = (c.email || '').toLowerCase()
    const poste = (c.poste || c.position || '').toLowerCase()
    const typeLabel = getContactTypeLabel(c).toLowerCase()
    return full.includes(q) || email.includes(q) || poste.includes(q) || typeLabel.includes(q)
  })
})

const getInitials = (first, last) => {
  const f = first ? first[0] : ''
  const l = last ? last[0] : ''
  return (f + l).toUpperCase() || 'C'
}

const loadContactos = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get(`/api/doli/contacts?sqlfilters=(fk_soc:=:${props.tercero.id})&limit=100&sortfield=lastname&sortorder=ASC`)
    const data = response.data
    contactos.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    emit('update-count', { key: 'contactos', count: contactos.value.length })
  } catch (error) {
    console.warn('⚠️ Error al cargar contactos:', error.message)
    contactos.value = []
    emit('update-count', { key: 'contactos', count: 0 })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    firstname: '',
    lastname: '',
    poste: '',
    fk_c_type_contact: null,
    email: '',
    phone_pro: '',
    phone_mobile: ''
  }
  showModal.value = true
}

const openEditModal = (contacto) => {
  isEditing.value = true
  editingId.value = contacto.id
  form.value = {
    firstname: contacto.firstname || '',
    lastname: contacto.lastname || '',
    poste: contacto.poste || contacto.position || '',
    fk_c_type_contact: contacto.fk_c_type_contact || contacto.fk_c_type_contact_id || contacto.type_id || null,
    email: contacto.email || '',
    phone_pro: contacto.phone_pro || contacto.phone || '',
    phone_mobile: contacto.phone_mobile || ''
  }
  showModal.value = true
}

const saveContact = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      socid: props.tercero.id
    }

    if (isEditing.value && editingId.value) {
      await http.put(`/api/doli/contacts/${editingId.value}`, payload)
    } else {
      await http.post('/api/doli/contacts', payload)
    }

    showModal.value = false
    await loadContactos()
  } catch (error) {
    console.error('❌ Error guardando contacto:', error)
    alert('Error al guardar contacto: ' + (error.response?.data?.message || error.message))
  } finally {
    saving.value = false
  }
}

const deleteContact = async (contactId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este contacto?')) return
  try {
    await http.delete(`/api/doli/contacts/${contactId}`)
    await loadContactos()
  } catch (error) {
    console.error('❌ Error eliminando contacto:', error)
    alert('Error al eliminar contacto: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  loadContactTypes()
  loadContactos()
})
</script>
