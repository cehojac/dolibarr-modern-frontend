<template>
  <div class="space-y-6">
    <!-- Header: Título, Filtros y Conteo -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Tickets de Soporte
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ filteredTickets.length }} {{ filteredTickets.length === 1 ? 'ticket registrado' : 'tickets registrados' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Checkbox mostrar cerrados -->
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              v-model="showClosed"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Mostrar cerrados</span>
          </label>

          <!-- Filtro por Estado -->
          <select 
            v-model="statusFilter"
            class="px-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'"
          >
            <option value="all">Todos los estados</option>
            <option value="open">Abiertos / En curso</option>
            <option value="closed">Cerrados</option>
          </select>

          <!-- Input búsqueda -->
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por asunto, ref..."
              class="w-48 sm:w-60 pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
            />
            <svg class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="rounded-xl border p-8 text-center" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500 mx-auto mb-3"></div>
      <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando tickets de soporte...</p>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredTickets.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ searchQuery || statusFilter !== 'all' ? 'No se encontraron tickets con los filtros actuales' : 'No hay tickets vinculados a este cliente' }}
      </h3>
      <p class="text-xs max-w-sm mx-auto" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Las solicitudes de soporte técnico y peticiones de asistencia aparecerán listadas aquí.
      </p>
    </div>

    <!-- Tabla de Tickets -->
    <div v-else class="rounded-xl border overflow-hidden transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-md shadow-black/20' : 'bg-white border-gray-200 shadow-xs'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <thead>
            <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Ref / ID Track</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Asunto</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Prioridad</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
            <tr 
              v-for="ticket in filteredTickets" 
              :key="ticket.id" 
              class="transition-colors cursor-pointer"
              :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'"
            >
              <!-- Ref y Track ID -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                  {{ ticket.ref || ticket.id }}
                </div>
                <div v-if="ticket.track_id" class="text-[10px] font-mono text-gray-400">
                  {{ ticket.track_id }}
                </div>
              </td>

              <!-- Fecha -->
              <td class="px-4 py-3 whitespace-nowrap text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-800'">
                {{ formatDate(ticket.datec) }}
              </td>

              <!-- Asunto -->
              <td class="px-4 py-3">
                <div class="text-xs font-bold line-clamp-1" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ ticket.subject || 'Sin asunto' }}
                </div>
                <div v-if="ticket.message" class="text-[11px] line-clamp-1 mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ stripHtml(ticket.message) }}
                </div>
              </td>

              <!-- Prioridad -->
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <span 
                  class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                  :class="getSeverityClass(ticket.severity_code)"
                >
                  {{ ticket.severity_code || 'NORMAL' }}
                </span>
              </td>

              <!-- Estado -->
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <span 
                  class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="getStatusClass(ticket.fk_statut)"
                >
                  {{ getStatusLabel(ticket.fk_statut) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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

const tickets = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const showClosed = ref(false)

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    // Ocultar cerrados/cancelados por defecto salvo que se active el check
    if (!showClosed.value && (t.fk_statut == 8 || t.fk_statut == 9)) return false

    // Filtro estado adicional
    if (statusFilter.value === 'open' && (t.fk_statut == 8 || t.fk_statut == 9)) return false
    if (statusFilter.value === 'closed' && (t.fk_statut != 8 && t.fk_statut != 9)) return false

    // Filtro texto
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const ref = (t.ref || '').toLowerCase()
      const subject = (t.subject || '').toLowerCase()
      const track = (t.track_id || '').toLowerCase()
      return ref.includes(q) || subject.includes(q) || track.includes(q)
    }

    return true
  })
})

const formatDate = (val) => {
  if (!val) return '-'
  try {
    const timestamp = typeof val === 'number' ? val * 1000 : new Date(val).getTime()
    if (isNaN(timestamp)) return val
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return val
  }
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const getSeverityClass = (sev) => {
  const s = String(sev || '').toUpperCase()
  if (s === 'URGENT' || s === 'CRITICAL' || s === 'HIGH') {
    return isDark.value ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
  }
  if (s === 'LOW') {
    return isDark.value ? 'bg-gray-750 text-gray-400' : 'bg-gray-100 text-gray-600'
  }
  return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
}

const getStatusClass = (st) => {
  const s = Number(st)
  if (s >= 0 && s <= 2) return isDark.value ? 'bg-amber-900/40 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
  if (s >= 3 && s <= 7) return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
  if (s === 8) return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (st) => {
  const s = Number(st)
  if (s === 0) return 'No leído'
  if (s === 1) return 'Leído'
  if (s === 2) return 'Asignado'
  if (s >= 3 && s <= 7) return 'En curso'
  if (s === 8) return 'Cerrado'
  if (s === 9) return 'Cancelado'
  return 'Abierto'
}

const loadTickets = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get('/api/doli/tickets', {
      params: {
        sqlfilters: `(t.fk_soc:=:${props.tercero.id})`,
        sortfield: 't.datec',
        sortorder: 'DESC',
        limit: 100
      }
    })
    const data = response.data
    tickets.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    emit('update-count', { key: 'tickets', count: tickets.value.length })
  } catch (error) {
    console.warn('⚠️ Error al cargar tickets:', error.message)
    tickets.value = []
    emit('update-count', { key: 'tickets', count: 0 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTickets()
})
</script>
