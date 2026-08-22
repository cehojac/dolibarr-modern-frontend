<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Estructura Corporativa y Asociaciones
          </h2>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Relación con empresa matriz, filiales y entidades vinculadas
          </p>
        </div>
      </div>
    </div>

    <!-- Grid: Empresa Matriz y Filiales -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Empresa Matriz / Padre -->
      <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center space-x-2.5 mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <h3 class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Empresa Matriz / Matriz</h3>
        </div>

        <div v-if="parentCompany" class="flex items-center space-x-3 p-4 rounded-xl border" :class="isDark ? 'bg-gray-750/70 border-gray-600' : 'bg-gray-50 border-gray-200'">
          <div class="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            {{ getInitials(parentCompany.name) }}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ parentCompany.name }}
            </h4>
            <p class="text-[11px] font-mono text-gray-400">
              {{ parentCompany.code_client || parentCompany.idprof1 || 'Empresa principal' }}
            </p>
          </div>
          <button 
            @click="navigateTo(parentCompany.id)"
            class="px-2.5 py-1 text-xs font-medium rounded border transition-colors text-blue-600 dark:text-blue-400"
            :class="isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'"
          >
            Ver ficha
          </button>
        </div>

        <div v-else class="p-6 text-center rounded-xl border border-dashed" :class="isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/60 border-gray-300'">
          <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Esta empresa es independiente o matriz principal (no tiene empresa padre).
          </p>
        </div>
      </div>

      <!-- Filiales / Entidades Dependientes -->
      <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center space-x-2.5 mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <h3 class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Filiales y Subsidiarias ({{ subsidiaries.length }})</h3>
        </div>

        <div v-if="loading" class="py-6 text-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Buscando filiales...</span>
        </div>

        <div v-else-if="subsidiaries.length > 0" class="space-y-2.5">
          <div 
            v-for="sub in subsidiaries" 
            :key="sub.id"
            class="flex items-center space-x-3 p-3 rounded-xl border transition-all"
            :class="isDark ? 'bg-gray-750/50 border-gray-700 hover:border-gray-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
          >
            <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
              {{ getInitials(sub.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ sub.name }}
              </h4>
              <p class="text-[11px] font-mono text-gray-400 truncate">
                {{ sub.town ? `${sub.town} · ` : '' }}{{ sub.code_client || sub.idprof1 || 'Filial' }}
              </p>
            </div>
            <button 
              @click="navigateTo(sub.id)"
              class="px-2 py-1 text-[11px] font-medium rounded border transition-colors text-blue-600 dark:text-blue-400"
              :class="isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'"
            >
              Ver
            </button>
          </div>
        </div>

        <div v-else class="p-6 text-center rounded-xl border border-dashed" :class="isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/60 border-gray-300'">
          <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            No se han registrado empresas filiales asociadas a este tercero.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../../../composables/useTheme'
import http from '../../../utils/http'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { isDark } = useTheme()

const parentCompany = ref(null)
const subsidiaries = ref([])
const loading = ref(false)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

const navigateTo = (thirdpartyId) => {
  router.push(`/terceros/clientes/${thirdpartyId}`)
}

const loadAssociations = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    // Si tiene empresa matriz
    const parentId = props.tercero.parent || props.tercero.fk_parent
    if (parentId && parentId != 0) {
      const parentRes = await http.get(`/api/doli/thirdparties/${parentId}`).catch(() => null)
      if (parentRes?.data) parentCompany.value = parentRes.data
    }

    // Buscar filiales
    const subRes = await http.get('/api/doli/thirdparties', {
      params: {
        sqlfilters: `(t.parent:=:${props.tercero.id})`,
        limit: 50
      }
    }).catch(() => ({ data: [] }))

    subsidiaries.value = Array.isArray(subRes.data) ? subRes.data : []
  } catch (error) {
    console.warn('⚠️ Error al cargar asociaciones:', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAssociations()
})
</script>
