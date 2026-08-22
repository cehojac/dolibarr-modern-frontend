<template>
  <div class="space-y-6">
    <!-- Header: Título y Estadísticas de Documentos -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Documentos y Archivos Adjuntos
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ documentos.length }} {{ documentos.length === 1 ? 'archivo adjunto' : 'archivos adjuntos' }}
            </p>
          </div>
        </div>

        <button 
          @click="triggerFileInput"
          :disabled="uploading"
          class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors inline-flex items-center space-x-1.5 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>{{ uploading ? 'Subiendo...' : 'Subir Documento' }}</span>
        </button>
        <input 
          ref="fileInput" 
          type="file" 
          class="hidden" 
          @change="handleFileUpload" 
          multiple
        />
      </div>
    </div>

    <!-- Zona Drag & Drop -->
    <div 
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleFileDrop"
      class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
      :class="isDragging 
        ? (isDark ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
        : (isDark ? 'border-gray-700 hover:border-gray-600 bg-gray-800/40' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50')"
      @click="triggerFileInput"
    >
      <svg class="w-10 h-10 mx-auto mb-3" :class="isDragging ? 'text-blue-500' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-xs font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-800'">
        Arrastra y suelta tus archivos aquí o <span class="text-blue-500 underline">haz clic para examinar</span>
      </p>
      <p class="text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        PDF, Word, Excel, imágenes o archivos comprimidos
      </p>
    </div>

    <!-- Barra de progreso si está subiendo -->
    <div v-if="uploading" class="rounded-xl border p-4" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="flex items-center justify-between text-xs font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        <span>Subiendo archivo a Dolibarr...</span>
        <div class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-500"></div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div class="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="rounded-xl border p-8 text-center" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500 mx-auto mb-3"></div>
      <p class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando documentos adjuntos...</p>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="documentos.length === 0" 
      class="rounded-xl border p-12 text-center transition-all"
      :class="isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'"
    >
      <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
        No hay documentos adjuntos
      </h3>
      <p class="text-xs max-w-sm mx-auto" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        Sube contratos, acuerdos, NIF escaneado o cualquier documento relevante para este cliente.
      </p>
    </div>

    <!-- Lista de Documentos -->
    <div v-else class="rounded-xl border overflow-hidden transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-md shadow-black/20' : 'bg-white border-gray-200 shadow-xs'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <thead>
            <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Nombre del Archivo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tamaño</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha Subida</th>
              <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
            <tr 
              v-for="doc in documentos" 
              :key="doc.name || doc.id" 
              class="transition-colors"
              :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'"
            >
              <!-- Nombre con icono de archivo -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center space-x-2.5">
                  <svg class="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ doc.name || doc.filename }}
                  </span>
                </div>
              </td>

              <!-- Tamaño -->
              <td class="px-4 py-3 whitespace-nowrap text-xs font-mono" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatFileSize(doc.size || doc.filesize) }}
              </td>

              <!-- Fecha -->
              <td class="px-4 py-3 whitespace-nowrap text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                {{ formatDate(doc.date || doc.date_c) }}
              </td>

              <!-- Acciones -->
              <td class="px-4 py-3 whitespace-nowrap text-right space-x-2">
                <button 
                  @click="downloadDocument(doc)"
                  class="p-1.5 rounded-lg border text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors inline-flex items-center space-x-1"
                  :class="isDark ? 'border-gray-700' : 'border-gray-200'"
                  title="Descargar archivo"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button 
                  @click="deleteDocument(doc)"
                  class="p-1.5 rounded-lg border text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors inline-flex items-center space-x-1"
                  :class="isDark ? 'border-gray-700' : 'border-gray-200'"
                  title="Eliminar archivo"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

const emit = defineEmits(['update-count'])

const { isDark } = useTheme()

const fileInput = ref(null)
const documentos = ref([])
const loading = ref(false)
const uploading = ref(false)
const isDragging = ref(false)

const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  const b = Number(bytes)
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
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

const triggerFileInput = () => {
  fileInput.value?.click()
}

const loadDocumentos = async () => {
  if (!props.tercero?.id) return
  loading.value = true
  try {
    const response = await http.get('/api/doli/documents', {
      params: {
        modulepart: 'societe',
        id: props.tercero.id
      }
    })
    const data = response.data
    documentos.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
    emit('update-count', { key: 'documentos', count: documentos.value.length })
  } catch (error) {
    console.warn('⚠️ Error al cargar documentos:', error.message)
    documentos.value = []
    emit('update-count', { key: 'documentos', count: 0 })
  } finally {
    loading.value = false
  }
}

const uploadFile = async (file) => {
  if (!file || !props.tercero?.id) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    formData.append('modulepart', 'societe')
    formData.append('id', props.tercero.id)

    await http.post('/api/doli/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    await loadDocumentos()
  } catch (error) {
    console.error('❌ Error subiendo documento:', error)
    alert('Error al subir documento: ' + (error.response?.data?.message || error.message))
  } finally {
    uploading.value = false
  }
}

const handleFileUpload = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

const downloadDocument = async (doc) => {
  try {
    const filename = doc.name || doc.filename
    const response = await http.get('/api/doli/documents/download', {
      params: {
        modulepart: 'societe',
        original_file: `${props.tercero.id}/${filename}`
      },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('❌ Error descargando documento:', error)
    alert('Error al descargar documento')
  }
}

const deleteDocument = async (doc) => {
  const filename = doc.name || doc.filename
  if (!confirm(`¿Eliminar el documento "${filename}"?`)) return
  try {
    await http.delete('/api/doli/documents', {
      params: {
        modulepart: 'societe',
        original_file: `${props.tercero.id}/${filename}`
      }
    })
    await loadDocumentos()
  } catch (error) {
    console.error('❌ Error eliminando documento:', error)
    alert('Error al eliminar documento')
  }
}

onMounted(() => {
  loadDocumentos()
})
</script>
