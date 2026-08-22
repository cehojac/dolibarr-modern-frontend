<template>
  <div class="space-y-6">
    <!-- Header: Título, Filtros y Nuevo Evento -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Eventos y Agenda
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ filteredEventos.length }} {{ filteredEventos.length === 1 ? 'evento registrado' : 'eventos registrados' }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Filtro por Tipo -->
          <select 
            v-model="typeFilter"
            class="px-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'"
          >
            <option value="all">Todos los tipos</option>
            <option value="AC_TEL">Llamadas</option>
            <option value="AC_EMAIL">Correos</option>
            <option value="AC_RDV">Reuniones</option>
            <option value="AC_OTH">Otros</option>
          </select>

          <!-- Input búsqueda -->
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar evento..."
              class="w-40 sm:w-56 pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
            />
            <svg class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Botón Nuevo Evento -->
          <button 
            @click="openCreateModal"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="rounded-xl border p-8 text-center" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500 mx-auto mb-3"></div>
      <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando agenda de eventos...</p>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredEventos.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ searchQuery || typeFilter !== 'all' ? 'No hay eventos con los filtros actuales' : 'No hay eventos registrados en la agenda' }}
      </h3>
      <p class="text-xs max-w-sm mx-auto mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Registra llamadas, visitas, reuniones o tareas programadas vinculadas a este cliente.
      </p>
      <button 
        v-if="!searchQuery && typeFilter === 'all'"
        @click="openCreateModal"
        class="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Registrar primer evento</span>
      </button>
    </div>

    <!-- Timeline / Lista de Eventos -->
    <div v-else class="space-y-3">
      <div 
        v-for="ev in filteredEventos" 
        :key="ev.id"
        class="rounded-xl border p-4 transition-all flex items-start justify-between gap-4"
        :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-sm hover:border-gray-600' : 'bg-white border-gray-200 shadow-xs hover:border-gray-300'"
      >
        <div class="flex items-start space-x-3.5 min-w-0 flex-1">
          <!-- Icono tipo -->
          <div class="p-2.5 rounded-xl flex-shrink-0" :class="getEventTypeContainerClass(ev.actioncode || ev.type_code)">
            <svg v-if="isPhoneEvent(ev.actioncode || ev.type_code)" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <svg v-else-if="isEmailEvent(ev.actioncode || ev.type_code)" class="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="isMeetingEvent(ev.actioncode || ev.type_code)" class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          <!-- Información del Evento -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-xs font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ ev.label || ev.title || 'Evento' }}
              </span>
              <span class="text-[10px] font-mono text-gray-400">#{{ ev.id }}</span>
            </div>

            <p v-if="ev.note || ev.description" class="text-xs line-clamp-2 mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ stripHtml(ev.note || ev.description) }}
            </p>

            <div class="flex flex-wrap items-center gap-3 text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              <!-- Fecha -->
              <span class="inline-flex items-center space-x-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatEventDate(ev.datep || ev.datea || ev.datec) }}</span>
              </span>

              <!-- Usuario autor -->
              <span v-if="ev.user_author || ev.author" class="inline-flex items-center space-x-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ ev.user_author || ev.author }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Estado / Porcentaje -->
        <div class="flex flex-col items-end space-y-1">
          <span 
            class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
            :class="ev.percentage >= 100 ? (isDark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') : (isDark ? 'bg-amber-900/40 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200')"
          >
            {{ ev.percentage >= 100 ? 'Realizado' : 'Pendiente' }}
          </span>
          <span v-if="ev.percentage !== undefined && ev.percentage !== null" class="text-[10px] font-mono" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ ev.percentage }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Modal Crear Evento -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" @click.self="showModal = false">
      <div class="rounded-xl p-6 w-full max-w-lg shadow-2xl border transition-all" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'">
        <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="text-base font-bold">Registrar Nuevo Evento en Agenda</h3>
          <button @click="showModal = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            &times;
          </button>
        </div>

        <form @submit.prevent="saveEvent" class="space-y-4">
          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Título / Asunto *</label>
            <input 
              v-model="form.label"
              type="text" 
              required
              placeholder="Ej. Llamada de seguimiento de presupuesto"
              class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Tipo de Acción *</label>
              <select 
                v-model="form.actioncode"
                required
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              >
                <option value="AC_TEL">Llamada Telefónica</option>
                <option value="AC_EMAIL">Envío de Correo</option>
                <option value="AC_RDV">Reunión / Cita</option>
                <option value="AC_OTH">Otro Evento</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Fecha y Hora *</label>
              <input 
                v-model="form.datep"
                type="datetime-local" 
                required
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
          </div>

          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Descripción / Resumen</label>
            <textarea 
              v-model="form.note"
              rows="4"
              placeholder="Detalles sobre lo tratado o acuerdos alcanzados..."
              class="w-full p-3 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            ></textarea>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              id="is_done"
              v-model="form.isDone"
              type="checkbox"
              class="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label for="is_done" class="text-xs font-medium cursor-pointer" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Marcar como ya realizado (100% completado)
            </label>
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
              <span>{{ saving ? 'Guardando...' : 'Crear Evento' }}</span>
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

const eventos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const typeFilter = ref('all')
const showModal = ref(false)
const saving = ref(false)

const form = ref({
  label: '',
  actioncode: 'AC_TEL',
  datep: '',
  note: '',
  isDone: false
})

const filteredEventos = computed(() => {
  return eventos.value.filter(ev => {
    // Filtro por tipo
    if (typeFilter.value !== 'all') {
      const code = String(ev.actioncode || ev.type_code || '').toUpperCase()
      if (!code.includes(typeFilter.value)) return false
    }

    // Filtro por texto
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const label = (ev.label || ev.title || '').toLowerCase()
      const note = (ev.note || ev.description || '').toLowerCase()
      return label.includes(q) || note.includes(q)
    }

    return true
  })
})

const formatEventDate = (dateVal) => {
  if (!dateVal) return '-'
  try {
    const timestamp = typeof dateVal === 'number' ? dateVal * 1000 : new Date(dateVal).getTime()
    if (isNaN(timestamp)) return dateVal
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateVal
  }
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const isPhoneEvent = (code) => String(code || '').toUpperCase().includes('TEL')
const isEmailEvent = (code) => String(code || '').toUpperCase().includes('EMAIL') || String(code || '').toUpperCase().includes('MSG')
const isMeetingEvent = (code) => String(code || '').toUpperCase().includes('RDV')

const getEventTypeContainerClass = (code) => {
  if (isPhoneEvent(code)) return isDark.value ? 'bg-emerald-900/30' : 'bg-emerald-50'
  if (isEmailEvent(code)) return isDark.value ? 'bg-pink-900/30' : 'bg-pink-50'
  if (isMeetingEvent(code)) return isDark.value ? 'bg-purple-900/30' : 'bg-purple-50'
  return isDark.value ? 'bg-blue-900/30' : 'bg-blue-50'
}

const loadAgenda = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get('/api/doli/agendaevents', {
      params: {
        sqlfilters: `(t.fk_soc:=:${props.tercero.id})`,
        sortfield: 't.datec',
        sortorder: 'DESC',
        limit: 100
      }
    })
    const data = response.data
    eventos.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    emit('update-count', { key: 'agenda', count: eventos.value.length })
  } catch (error) {
    console.warn('⚠️ Error al cargar agenda:', error.message)
    eventos.value = []
    emit('update-count', { key: 'agenda', count: 0 })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  const now = new Date()
  const nowIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  form.value = {
    label: '',
    actioncode: 'AC_TEL',
    datep: nowIso,
    note: '',
    isDone: false
  }
  showModal.value = true
}

const saveEvent = async () => {
  if (!props.tercero?.id) return
  saving.value = true
  try {
    const timestamp = Math.floor(new Date(form.value.datep).getTime() / 1000)
    const payload = {
      socid: props.tercero.id,
      label: form.value.label,
      actioncode: form.value.actioncode,
      type_code: form.value.actioncode,
      datep: timestamp,
      note: form.value.note,
      percentage: form.value.isDone ? 100 : 0
    }

    await http.post('/api/doli/agendaevents', payload)
    showModal.value = false
    await loadAgenda()
  } catch (error) {
    console.error('❌ Error creando evento:', error)
    alert('Error al crear evento: ' + (error.response?.data?.message || error.message))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAgenda()
})
</script>
