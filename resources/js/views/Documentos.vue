<template>
  <div class="h-full flex flex-col">
    <!-- Header con controles -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Documentos
        </h1>
        <div class="flex items-center mt-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          <button 
            v-for="(crumb, index) in breadcrumbs" 
            :key="index"
            @click="navigateToFolder(crumb.path)"
            class="hover:underline"
            :class="index === breadcrumbs.length - 1 ? 'font-medium' : ''"
          >
            {{ crumb.name }}
          </button>
          <span v-if="index < breadcrumbs.length - 1" class="mx-2">/</span>
        </div>
      </div>
      
      <!-- Controles superiores -->
      <div class="flex items-center space-x-3">
        <!-- Selector de vista -->
        <div class="flex rounded-lg border" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
          <button
            @click="viewMode = 'grid'"
            class="p-2 transition-colors first:rounded-l-lg"
            :class="viewMode === 'grid' 
              ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
            "
            title="Vista en cuadrícula"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-2 transition-colors last:rounded-r-lg"
            :class="viewMode === 'list' 
              ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
            "
            title="Vista en lista"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <!-- Botón nueva carpeta -->
        <button
          @click="showNewFolderModal = true"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Carpeta
        </button>
        
        <!-- Botón subir archivo -->
        <button
          @click="triggerFileUpload"
          class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Subir Archivo
        </button>
        
        <!-- Input file oculto -->
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <!-- Área de contenido -->
    <div class="flex-1 rounded-lg border overflow-hidden" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 mx-auto mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando documentos...</p>
        </div>
      </div>

      <!-- Vista en cuadrícula -->
      <div v-else-if="viewMode === 'grid'" class="p-6">
        <div v-if="currentItems.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            Esta carpeta está vacía
          </p>
          <p class="text-sm" :class="isDark ? 'text-gray-500' : 'text-gray-500'">
            Sube archivos o crea nuevas carpetas para comenzar
          </p>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <!-- Carpetas -->
          <div
            v-for="folder in currentFolders"
            :key="'folder-' + folder.id"
            @click="openFolder(folder)"
            @contextmenu.prevent="showContextMenu($event, folder, 'folder')"
            class="group cursor-pointer p-3 rounded-lg transition-all hover:bg-opacity-50"
            :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
          >
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-2 transition-colors" :class="isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-500 group-hover:text-blue-600'" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
              </svg>
              <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ folder.name }}
              </p>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ folder.itemCount || 0 }} elementos
              </p>
            </div>
          </div>
          
          <!-- Archivos -->
          <div
            v-for="file in currentFiles"
            :key="'file-' + file.id"
            @click="openFile(file)"
            @contextmenu.prevent="showContextMenu($event, file, 'file')"
            class="group cursor-pointer p-3 rounded-lg transition-all hover:bg-opacity-50"
            :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
          >
            <div class="text-center">
              <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-lg" :class="getFileIconBg(file.extension)">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getFileIconPath(file.extension)" />
                </svg>
              </div>
              <p class="text-sm font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ file.name }}
              </p>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista en lista -->
      <div v-else-if="viewMode === 'list'" class="overflow-hidden">
        <!-- Cabecera de la tabla -->
        <div class="border-b px-6 py-3" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'">
          <div class="grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            <div class="col-span-6">Nombre</div>
            <div class="col-span-2">Tipo</div>
            <div class="col-span-2">Tamaño</div>
            <div class="col-span-2">Modificado</div>
          </div>
        </div>
        
        <!-- Contenido de la tabla -->
        <div class="divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <div v-if="currentItems.length === 0" class="text-center py-12">
            <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">Esta carpeta está vacía</p>
          </div>
          
          <!-- Carpetas en lista -->
          <div
            v-for="folder in currentFolders"
            :key="'folder-list-' + folder.id"
            @click="openFolder(folder)"
            @contextmenu.prevent="showContextMenu($event, folder, 'folder')"
            class="px-6 py-4 hover:bg-opacity-50 cursor-pointer transition-colors"
            :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
          >
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-6 flex items-center">
                <svg class="w-5 h-5 mr-3" :class="isDark ? 'text-blue-400' : 'text-blue-500'" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                </svg>
                <span class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ folder.name }}
                </span>
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                Carpeta
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ folder.itemCount || 0 }} elementos
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatDate(folder.date_creation) }}
              </div>
            </div>
          </div>
          
          <!-- Archivos en lista -->
          <div
            v-for="file in currentFiles"
            :key="'file-list-' + file.id"
            @click="openFile(file)"
            @contextmenu.prevent="showContextMenu($event, file, 'file')"
            class="px-6 py-4 hover:bg-opacity-50 cursor-pointer transition-colors"
            :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'"
          >
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-6 flex items-center">
                <div class="w-5 h-5 mr-3 flex items-center justify-center rounded" :class="getFileIconBg(file.extension)">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getFileIconPath(file.extension)" />
                  </svg>
                </div>
                <span class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ file.name }}
                </span>
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ file.extension?.toUpperCase() || 'Archivo' }}
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatFileSize(file.size) }}
              </div>
              <div class="col-span-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ formatDate(file.date_creation) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nueva carpeta -->
    <div v-if="showNewFolderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          Nueva Carpeta
        </h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Nombre de la carpeta
          </label>
          <input
            v-model="newFolderName"
            type="text"
            class="w-full p-3 border rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
            placeholder="Ingresa el nombre de la carpeta"
            @keyup.enter="createFolder"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="closeNewFolderModal"
            class="px-4 py-2 text-sm font-medium border rounded-lg transition-colors"
            :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          >
            Cancelar
          </button>
          <button
            @click="createFolder"
            :disabled="!newFolderName.trim()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>

    <!-- Menú contextual -->
    <div
      v-if="contextMenu.show"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      class="fixed z-50 min-w-48 rounded-lg shadow-lg border py-1"
      :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    >
      <button
        v-if="contextMenu.type === 'file'"
        @click="downloadFile(contextMenu.item)"
        class="w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors"
        :class="isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'"
      >
        <svg class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Descargar
      </button>
      
      <button
        @click="renameItem(contextMenu.item)"
        class="w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors"
        :class="isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'"
      >
        <svg class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Renombrar
      </button>
      
      <button
        @click="deleteItem(contextMenu.item)"
        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
      >
        <svg class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTheme } from '../composables/useTheme'
import http from '../utils/http'

const { isDark } = useTheme()

// Estado del gestor de documentos
const loading = ref(true)
const viewMode = ref('grid') // 'grid' o 'list'
const currentPath = ref('/')
const folders = ref([])
const files = ref([])

// Modales y UI
const showNewFolderModal = ref(false)
const newFolderName = ref('')
const fileInput = ref(null)

// Menú contextual
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  item: null,
  type: null
})

// Breadcrumbs para navegación
const breadcrumbs = computed(() => {
  const parts = currentPath.value.split('/').filter(Boolean)
  const crumbs = [{ name: 'Documentos', path: '/' }]
  
  let path = ''
  for (const part of parts) {
    path += '/' + part
    crumbs.push({ name: part, path })
  }
  
  return crumbs
})

// Items actuales (carpetas + archivos)
const currentItems = computed(() => [...currentFolders.value, ...currentFiles.value])
const currentFolders = computed(() => folders.value.filter(folder => folder.path === currentPath.value))
const currentFiles = computed(() => files.value.filter(file => file.path === currentPath.value))

// Navegación de carpetas
const navigateToFolder = (path) => {
  currentPath.value = path
  loadDocuments()
}

const openFolder = (folder) => {
  currentPath.value = folder.fullPath || `${currentPath.value}${folder.name}/`.replace('//', '/')
  loadDocuments()
}

// Gestión de archivos
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  try {
    console.log('📤 Subiendo archivos:', files.length)
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', currentPath.value)
      
      // Simular subida (aquí iría la llamada real a Dolibarr)
      console.log(`📄 Subiendo: ${file.name} (${formatFileSize(file.size)})`)
      
      // Agregar archivo localmente para demostración
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        extension: file.name.split('.').pop()?.toLowerCase() || '',
        size: file.size,
        path: currentPath.value,
        date_creation: Math.floor(Date.now() / 1000),
        type: file.type
      }
      
      files.value.push(newFile)
    }
    
    console.log('✅ Archivos subidos exitosamente')
    
  } catch (error) {
    console.error('❌ Error subiendo archivos:', error)
    alert('Error al subir archivos: ' + error.message)
  } finally {
    // Limpiar input
    event.target.value = ''
  }
}

// Gestión de carpetas
const closeNewFolderModal = () => {
  showNewFolderModal.value = false
  newFolderName.value = ''
}

const createFolder = async () => {
  if (!newFolderName.value.trim()) return

  try {
    console.log('📁 Creando carpeta:', newFolderName.value)
    
    const folderData = {
      name: newFolderName.value.trim(),
      path: currentPath.value,
      parent_path: currentPath.value
    }
    
    // Aquí iría la llamada a la API de Dolibarr
    // const response = await http.post('/api/doli/documents/folders', folderData)
    
    // Agregar carpeta localmente para demostración
    const newFolder = {
      id: Date.now(),
      name: folderData.name,
      path: currentPath.value,
      fullPath: `${currentPath.value}${folderData.name}/`.replace('//', '/'),
      date_creation: Math.floor(Date.now() / 1000),
      itemCount: 0
    }
    
    folders.value.push(newFolder)
    
    console.log('✅ Carpeta creada exitosamente')
    closeNewFolderModal()
    
  } catch (error) {
    console.error('❌ Error creando carpeta:', error)
    alert('Error al crear carpeta: ' + error.message)
  }
}

// Menú contextual
const showContextMenu = (event, item, type) => {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    item,
    type
  }
  
  // Cerrar menú al hacer click fuera
  nextTick(() => {
    const closeMenu = () => {
      contextMenu.value.show = false
      document.removeEventListener('click', closeMenu)
    }
    document.addEventListener('click', closeMenu)
  })
}

// Acciones de archivos
const openFile = (file) => {
  console.log('📂 Abriendo archivo:', file.name)
  // Aquí se podría abrir el archivo o mostrar un preview
  downloadFile(file)
}

const downloadFile = async (file) => {
  try {
    console.log('⬇️ Descargando archivo:', file.name)
    
    // Aquí iría la llamada real para descargar desde Dolibarr
    // const response = await http.get(`/api/doli/documents/download/${file.id}`, { responseType: 'blob' })
    
    // Simular descarga
    alert(`Descargando: ${file.name}`)
    
    contextMenu.value.show = false
    
  } catch (error) {
    console.error('❌ Error descargando archivo:', error)
    alert('Error al descargar archivo: ' + error.message)
  }
}

const renameItem = (item) => {
  const newName = prompt(`Renombrar ${contextMenu.value.type === 'folder' ? 'carpeta' : 'archivo'}:`, item.name)
  if (newName && newName.trim() !== item.name) {
    console.log(`✏️ Renombrando ${item.name} a ${newName}`)
    item.name = newName.trim()
    // Aquí iría la llamada a la API
  }
  contextMenu.value.show = false
}

const deleteItem = async (item) => {
  const itemType = contextMenu.value.type === 'folder' ? 'carpeta' : 'archivo'
  if (confirm(`¿Estás seguro de que quieres eliminar esta ${itemType}?`)) {
    try {
      console.log(`🗑️ Eliminando ${itemType}:`, item.name)
      
      // Aquí iría la llamada a la API de Dolibarr
      // await http.delete(`/api/doli/documents/${contextMenu.value.type}s/${item.id}`)
      
      // Eliminar localmente
      if (contextMenu.value.type === 'folder') {
        folders.value = folders.value.filter(f => f.id !== item.id)
      } else {
        files.value = files.value.filter(f => f.id !== item.id)
      }
      
      console.log(`✅ ${itemType} eliminado exitosamente`)
      
    } catch (error) {
      console.error(`❌ Error eliminando ${itemType}:`, error)
      alert(`Error al eliminar ${itemType}: ` + error.message)
    }
  }
  contextMenu.value.show = false
}

// Utilidades
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFileIconBg = (extension) => {
  const iconMap = {
    pdf: 'bg-red-500',
    doc: 'bg-blue-500',
    docx: 'bg-blue-500',
    xls: 'bg-green-500',
    xlsx: 'bg-green-500',
    ppt: 'bg-orange-500',
    pptx: 'bg-orange-500',
    txt: 'bg-gray-500',
    jpg: 'bg-purple-500',
    jpeg: 'bg-purple-500',
    png: 'bg-purple-500',
    gif: 'bg-purple-500',
    zip: 'bg-yellow-500',
    rar: 'bg-yellow-500'
  }
  return iconMap[extension?.toLowerCase()] || 'bg-gray-500'
}

const getFileIconPath = (extension) => {
  const iconPaths = {
    pdf: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    docx: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    xls: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0',
    xlsx: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0',
    jpg: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    jpeg: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    png: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    zip: 'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z'
  }
  return iconPaths[extension?.toLowerCase()] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}

// Cargar documentos
const loadDocuments = async () => {
  try {
    console.log('🔍 Cargando documentos para ruta:', currentPath.value)
    
    // Aquí irían las llamadas reales a la API de Dolibarr
    // const [foldersResponse, filesResponse] = await Promise.all([
    //   http.get(`/api/doli/documents/folders?path=${encodeURIComponent(currentPath.value)}`),
    //   http.get(`/api/doli/documents/files?path=${encodeURIComponent(currentPath.value)}`)
    // ])
    
    // Por ahora, datos de ejemplo
    if (folders.value.length === 0 && files.value.length === 0) {
      // Carpetas de ejemplo
      folders.value = [
        {
          id: 1,
          name: 'Contratos',
          path: '/',
          fullPath: '/Contratos/',
          date_creation: Math.floor(Date.now() / 1000) - 86400,
          itemCount: 5
        },
        {
          id: 2,
          name: 'Facturas',
          path: '/',
          fullPath: '/Facturas/',
          date_creation: Math.floor(Date.now() / 1000) - 172800,
          itemCount: 12
        },
        {
          id: 3,
          name: 'Propuestas',
          path: '/',
          fullPath: '/Propuestas/',
          date_creation: Math.floor(Date.now() / 1000) - 259200,
          itemCount: 8
        }
      ]
      
      // Archivos de ejemplo
      files.value = [
        {
          id: 101,
          name: 'Informe_Mensual.pdf',
          extension: 'pdf',
          size: 2048576,
          path: '/',
          date_creation: Math.floor(Date.now() / 1000) - 3600,
          type: 'application/pdf'
        },
        {
          id: 102,
          name: 'Presentacion_Cliente.pptx',
          extension: 'pptx',
          size: 5242880,
          path: '/',
          date_creation: Math.floor(Date.now() / 1000) - 7200,
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        },
        {
          id: 103,
          name: 'Datos_Ventas.xlsx',
          extension: 'xlsx',
          size: 1048576,
          path: '/',
          date_creation: Math.floor(Date.now() / 1000) - 10800,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
      
      console.log('📝 Cargados datos de ejemplo')
    }
    
    console.log('✅ Documentos cargados:', {
      carpetas: currentFolders.value.length,
      archivos: currentFiles.value.length
    })
    
  } catch (error) {
    console.error('❌ Error cargando documentos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDocuments()
})
</script>
