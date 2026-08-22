<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Ítems y Productos Relacionados
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Precios específicos asignados y catálogo personalizado
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Precios específicos y descuentos -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-2.5 mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <svg class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Descuentos Fijos y Precios Específicos</h3>
      </div>

      <div v-if="loading" class="py-6 text-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Cargando precios de cliente...</span>
      </div>

      <div v-else-if="discounts.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <thead>
            <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
              <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Descripción</th>
              <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Importe</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
            <tr v-for="d in discounts" :key="d.id" :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'">
              <td class="px-4 py-3 text-xs" :class="isDark ? 'text-white' : 'text-gray-900'">{{ d.description || 'Descuento aplicado' }}</td>
              <td class="px-4 py-3 text-xs font-mono font-bold text-right text-emerald-600">{{ formatCurrency(d.amount_ht) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="p-6 text-center rounded-xl border border-dashed" :class="isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/60 border-gray-300'">
        <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          El cliente utiliza las tarifas estándar según su nivel de precios ({{ tercero.price_level ? `Nivel ${tercero.price_level}` : 'Tarifa General' }}).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../../../composables/useTheme'
import http from '../../../utils/http'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const { isDark } = useTheme()

const discounts = ref([])
const loading = ref(false)

const formatCurrency = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(amount) || 0)
}

const loadItems = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get(`/api/doli/thirdparties/${props.tercero.id}/fixedamountdiscounts`).catch(() => ({ data: [] }))
    discounts.value = Array.isArray(response.data) ? response.data : []
  } catch (e) {
    discounts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItems()
})
</script>
