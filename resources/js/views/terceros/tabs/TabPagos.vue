<template>
  <div class="space-y-6">
    <!-- Header: Título y Botón Añadir Cuenta -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Métodos de Pago y Cuentas Bancarias
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Cuentas RIB/IBAN para domiciliaciones y transferencias
            </p>
          </div>
        </div>

        <button 
          @click="openCreateModal"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Añadir Cuenta Bancaria</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="rounded-xl border p-5 animate-pulse" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-750 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="cuentas.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        No hay cuentas bancarias registradas
      </h3>
      <p class="text-xs max-w-sm mx-auto mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Añade un número de cuenta IBAN/BIC para emitir remesas SEPA o gestionar cobros por domiciliación.
      </p>
      <button 
        @click="openCreateModal"
        class="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Añadir primera cuenta</span>
      </button>
    </div>

    <!-- Grid de Cuentas Bancarias -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="acc in cuentas" 
        :key="acc.id"
        class="rounded-xl border p-5 transition-all flex flex-col justify-between"
        :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-md shadow-black/20' : 'bg-white border-gray-200 shadow-xs'"
      >
        <div>
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                IBAN
              </div>
              <div>
                <h4 class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ acc.label || acc.bank || 'Cuenta Bancaria' }}
                </h4>
                <p class="text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ acc.proprio || tercero.name }}
                </p>
              </div>
            </div>

            <span 
              v-if="acc.default_rib == 1" 
              class="px-2 py-0.5 rounded text-[10px] font-semibold"
              :class="isDark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
            >
              Principal
            </span>
          </div>

          <!-- RUM -->
          <div v-if="acc.rum" class="text-xs mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">RUM / Mandato</span>
            <span class="font-mono font-semibold">{{ acc.rum }}</span>
          </div>

          <div v-if="acc.date_rum || acc.frstrecur" class="grid grid-cols-2 gap-2 text-xs mb-3" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            <div v-if="acc.date_rum">
              <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Firma mandato</span>
              <span>{{ formatDate(acc.date_rum) }}</span>
            </div>
            <div v-if="acc.frstrecur">
              <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Modalidad</span>
              <span>{{ acc.frstrecur }}</span>
            </div>
          </div>

          <!-- IBAN -->
          <div class="p-3 rounded-lg font-mono text-sm font-bold tracking-wider mb-3" :class="isDark ? 'bg-gray-750/70 text-emerald-400' : 'bg-gray-50 text-emerald-700'">
            {{ formatIban(acc.iban) }}
          </div>

          <!-- BIC y Banco -->
          <div class="grid grid-cols-2 gap-2 text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            <div>
              <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">BIC / SWIFT</span>
              <span class="font-mono font-semibold">{{ acc.bic || '-' }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-semibold block" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Entidad Bancaria</span>
              <span class="font-semibold">{{ acc.bank || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 mt-4 border-t flex justify-end" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
          <button 
            @click="openEditModal(acc)"
            class="p-1 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors mr-2"
            title="Editar cuenta bancaria"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            @click="deleteAccount(acc.id)"
            class="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Eliminar cuenta bancaria"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Crear Cuenta Bancaria -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" @click.self="showModal = false">
      <div class="rounded-xl p-6 w-full max-w-md shadow-2xl border transition-all" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'">
        <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="text-base font-bold">{{ isEditing ? 'Editar Cuenta Bancaria' : 'Añadir Cuenta Bancaria' }}</h3>
          <button @click="showModal = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            &times;
          </button>
        </div>

        <form @submit.prevent="saveAccount" class="space-y-4">
          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Etiqueta / Nombre *</label>
            <input 
              v-model="form.label"
              type="text" 
              required
              placeholder="Ej. Cuenta Principal BBVA"
              class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">IBAN *</label>
            <input 
              v-model="form.iban"
              type="text" 
              required
              placeholder="ES00 0000 0000 0000 0000 0000"
              class="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">BIC / SWIFT</label>
              <input 
                v-model="form.bic"
                type="text" 
                placeholder="BBVAESMMXXX"
                class="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Nombre del Banco</label>
              <input 
                v-model="form.bank"
                type="text" 
                placeholder="BBVA"
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700" />

          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">RUM / Referencia Única del Mandato</label>
            <input 
              v-model="form.rum"
              type="text" 
              placeholder="RUM-XXXX-..."
              class="w-full px-3 py-2 text-xs font-mono rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Fecha de firma del mandato</label>
              <input 
                v-model="form.date_rum"
                type="date" 
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
            </div>
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Modalidad SEPA</label>
              <select 
                v-model="form.frstrecur"
                class="w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              >
                <option value="">-- Seleccionar --</option>
                <option value="FRST">Primera (FRST)</option>
                <option value="RCUR">Recurrente (RCUR)</option>
              </select>
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
              <span>{{ saving ? 'Guardando...' : (isEditing ? 'Actualizar Cuenta' : 'Guardar Cuenta') }}</span>
            </button>
          </div>
        </form>
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

const cuentas = ref([])
const loading = ref(false)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const form = ref({
  label: '',
  iban: '',
  bic: '',
  bank: '',
  rum: '',
  date_rum: '',
  frstrecur: ''
})

const formatIban = (iban) => {
  if (!iban) return 'IBAN no especificado'
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

const loadCuentas = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get(`/api/doli/dolibarrmodernfrontendapi/sepaaccounts/${props.tercero.id}`)
    const data = response.data
    cuentas.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
  } catch (error) {
    console.warn('⚠️ No se encontraron cuentas bancarias:', error.message)
    cuentas.value = []
  } finally {
    loading.value = false
  }
}

const dateToInput = (val) => {
  if (!val) return ''
  if (typeof val === 'number') {
    const d = new Date(val * 1000)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return val.substring(0, 10)
  }
  const d = new Date(val)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

const inputToTimestamp = (val) => {
  if (!val) return null
  const d = new Date(val + 'T00:00:00')
  if (isNaN(d.getTime())) return null
  return Math.floor(d.getTime() / 1000)
}

const formatDate = (val) => {
  if (!val) return '-'
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return val.substring(0, 10).split('-').reverse().join('/')
  }
  const timestamp = typeof val === 'number' ? val * 1000 : new Date(val).getTime()
  if (isNaN(timestamp)) return val
  return new Date(timestamp).toLocaleDateString('es-ES')
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    label: '',
    iban: '',
    bic: '',
    bank: '',
    rum: '',
    date_rum: '',
    frstrecur: ''
  }
  showModal.value = true
}

const openEditModal = (acc) => {
  isEditing.value = true
  editingId.value = acc.id
  form.value = {
    label: acc.label || '',
    iban: acc.iban || '',
    bic: acc.bic || '',
    bank: acc.bank || '',
    rum: acc.rum || '',
    date_rum: dateToInput(acc.date_rum),
    frstrecur: acc.frstrecur || ''
  }
  showModal.value = true
}

const saveAccount = async () => {
  if (!props.tercero?.id) return
  saving.value = true
  try {
    const payload = {
      ...form.value,
      socid: props.tercero.id,
      date_rum: form.value.date_rum || null
    }

    if (isEditing.value && editingId.value) {
      await http.put(`/api/doli/thirdparties/${props.tercero.id}/bankaccounts/${editingId.value}`, payload)
    } else {
      await http.post(`/api/doli/thirdparties/${props.tercero.id}/bankaccounts`, payload)
    }

    showModal.value = false
    await loadCuentas()
  } catch (error) {
    console.error('❌ Error guardando cuenta:', error)
    alert('Error al guardar cuenta bancaria: ' + (error.response?.data?.message || error.message))
  } finally {
    saving.value = false
  }
}

const deleteAccount = async (accountId) => {
  if (!confirm('¿Deseas eliminar esta cuenta bancaria?')) return
  try {
    await http.delete(`/api/doli/thirdparties/${props.tercero.id}/bankaccounts/${accountId}`)
    await loadCuentas()
  } catch (error) {
    console.error('❌ Error eliminando cuenta:', error)
    alert('Error al eliminar cuenta')
  }
}

onMounted(() => {
  loadCuentas()
})
</script>
