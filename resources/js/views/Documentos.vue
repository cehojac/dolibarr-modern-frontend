<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Documentos</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Gestión de documentos y archivos
        </p>
      </div>
    </div>

    <div class="mt-8">
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Cargando documentos...</div>
      </div>
      
      <div v-else-if="documentos.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">No hay documentos disponibles</div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="documento in documentos"
          :key="documento.id"
          class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ documento.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ documento.type || 'Documento' }}
                </p>
              </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(documento.date_creation) }}
              </span>
              <button class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 text-sm">
                Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../utils/http'
import { useNotificationStore } from '../stores/notifications'

const documentos = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString * 1000).toLocaleDateString('es-ES')
}

const loadDocumentos = async () => {
  const notificationStore = useNotificationStore()
  
  try {
    const response = await http.get('/doli/documents')
    documentos.value = response.data
    if (documentos.value.length === 0) {
      notificationStore.info('No se encontraron documentos disponibles')
    }
  } catch (error) {
    console.error('Error loading documentos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDocumentos()
})
</script>
