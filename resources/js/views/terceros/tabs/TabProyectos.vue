<template>
  <div class="space-y-6">
    <!-- Header: Título y Buscador -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Proyectos Asignados
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ filteredProyectos.length }} {{ filteredProyectos.length === 1 ? 'proyecto vinculado' : 'proyectos vinculados' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              v-model="showClosed"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Mostrar cerrados</span>
          </label>

          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar proyecto..."
              class="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="rounded-xl border p-5 animate-pulse" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div class="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div class="h-2 bg-gray-200 dark:bg-gray-750 rounded mb-4"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-750 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredProyectos.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ searchQuery ? 'No se encontraron proyectos' : 'No hay proyectos vinculados' }}
      </h3>
      <p class="text-xs max-w-sm mx-auto" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        {{ searchQuery ? 'Prueba con otro término de búsqueda.' : 'Este cliente no tiene proyectos asignados actualmente en Dolibarr.' }}
      </p>
    </div>

    <!-- Grid de Proyectos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="proj in filteredProyectos" 
        :key="proj.id"
        class="rounded-xl border p-5 transition-all flex flex-col justify-between"
        :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-md shadow-black/20 hover:border-gray-600' : 'bg-white border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-sm'"
      >
        <div>
          <!-- Cabecera de la Card -->
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {{ proj.ref }}
            </span>
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-semibold"
              :class="getProjectStatusClass(proj.statut || proj.status)"
            >
              {{ getProjectStatusLabel(proj.statut || proj.status) }}
            </span>
          </div>

          <h4 class="text-sm font-bold line-clamp-1 mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ proj.title || proj.label || 'Sin título' }}
          </h4>

          <p v-if="proj.description" class="text-xs line-clamp-2 mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ proj.description }}
          </p>

          <!-- Barra de Progreso -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-[11px] font-medium mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              <span>Progreso</span>
              <span class="font-mono font-bold">{{ proj.progress || 0 }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                class="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, Math.max(0, proj.progress || 0))}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Fechas y Presupuesto -->
        <div class="pt-3 border-t flex items-center justify-between text-xs" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
          <div>
            <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Fecha Inicio</span>
            <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ formatDate(proj.date_start || proj.date_c) }}</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Oportunidad</span>
            <span class="font-mono font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ formatCurrency(proj.opp_amount) }}</span>
          </div>
        </div>
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

const proyectos = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showClosed = ref(false)

const filteredProyectos = computed(() => {
  let list = proyectos.value
  if (!showClosed.value) {
    list = list.filter(p => (p.statut ?? p.status) != 2)
  }
  if (!searchQuery.value.trim()) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(p => {
    const ref = (p.ref || '').toLowerCase()
    const title = (p.title || p.label || '').toLowerCase()
    return ref.includes(q) || title.includes(q)
  })
})

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(amount) || 0)
}

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

const getProjectStatusClass = (status) => {
  if (status == 1) return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (status == 2) return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
  if (status == 0) return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
  return isDark.value ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
}

const getProjectStatusLabel = (status) => {
  if (status == 1) return 'Abierto'
  if (status == 2) return 'Cerrado'
  if (status == 0) return 'Borrador'
  return 'Cancelado'
}

const loadProyectos = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get('/api/doli/projects', {
      params: {
        sqlfilters: `(t.fk_soc:=:${props.tercero.id})`,
        sortfield: 't.datec',
        sortorder: 'DESC',
        limit: 100
      }
    })
    const data = response.data
    proyectos.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    emit('update-count', { key: 'proyectos', count: proyectos.value.length })
  } catch (error) {
    console.warn('⚠️ Error al cargar proyectos:', error.message)
    proyectos.value = []
    emit('update-count', { key: 'proyectos', count: 0 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProyectos()
})
</script>
