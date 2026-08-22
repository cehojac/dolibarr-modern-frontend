<template>
  <div class="space-y-6">
    <!-- Header: Título y Botón Guardar Global -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Notas del Tercero
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Anotaciones públicas para documentos y notas privadas de uso interno
            </p>
          </div>
        </div>

        <button 
          @click="saveNotes"
          :disabled="saving"
          class="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors inline-flex items-center space-x-1.5 shadow-sm"
        >
          <div v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
          <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </div>
    </div>

    <!-- Grid con 2 columnas: Nota Pública y Nota Privada -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Nota Pública -->
      <div class="rounded-xl border p-6 transition-all flex flex-col justify-between" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div>
          <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Nota Pública</h3>
            </div>
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-full" :class="isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'">
              Visible en facturas y presupuestos
            </span>
          </div>

          <p class="text-xs mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Esta nota se incluirá automáticamente en la documentación comercial generada para el cliente.
          </p>

          <textarea 
            v-model="publicNote"
            rows="8"
            placeholder="Escribe aquí las observaciones o condiciones que deben ser visibles por el cliente..."
            class="w-full p-3 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-y"
            :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
          ></textarea>
        </div>
      </div>

      <!-- Nota Privada -->
      <div class="rounded-xl border p-6 transition-all flex flex-col justify-between" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div>
          <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Nota Privada</h3>
            </div>
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-full" :class="isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700'">
              Solo uso interno
            </span>
          </div>

          <p class="text-xs mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Anotaciones confidenciales visibles únicamente por el equipo interno de la empresa.
          </p>

          <textarea 
            v-model="privateNote"
            rows="8"
            placeholder="Anotaciones internas sobre acuerdos, particularidades del cliente, histórico o recordatorios..."
            class="w-full p-3 text-xs rounded-lg border focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-y"
            :class="isDark ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTheme } from '../../../composables/useTheme'
import http from '../../../utils/http'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const { isDark } = useTheme()

const publicNote = ref(props.tercero?.note_public || '')
const privateNote = ref(props.tercero?.note_private || '')
const saving = ref(false)

watch(() => props.tercero, (newVal) => {
  if (newVal) {
    publicNote.value = newVal.note_public || ''
    privateNote.value = newVal.note_private || ''
  }
}, { immediate: true })

const saveNotes = async () => {
  if (!props.tercero?.id) return
  saving.value = true
  try {
    await http.put(`/api/doli/thirdparties/${props.tercero.id}`, {
      note_public: publicNote.value,
      note_private: privateNote.value
    })
    alert('Notas actualizadas exitosamente')
  } catch (error) {
    console.error('❌ Error guardando notas:', error)
    alert('Error al guardar notas: ' + (error.response?.data?.message || error.message))
  } finally {
    saving.value = false
  }
}
</script>
