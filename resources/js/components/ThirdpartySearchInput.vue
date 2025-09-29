<template>
  <div class="relative">
    <!-- Input de búsqueda -->
    <div class="relative">
      <input
        v-model="searchTerm"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        :class="[
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          isDark 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        ]"
      />
      
      <!-- Icono de búsqueda -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg 
          v-if="!isSearching" 
          class="w-4 h-4" 
          :class="isDark ? 'text-gray-400' : 'text-gray-500'" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <!-- Spinner de carga -->
        <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <!-- Mensaje de caracteres mínimos -->
    <div 
      v-if="searchTerm.length > 0 && searchTerm.length < minSearchLength" 
      class="text-xs mt-1"
      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      Escribe al menos {{ minSearchLength }} caracteres para buscar
    </div>

    <!-- Dropdown de resultados -->
    <div 
      v-if="showDropdown && canSearch && searchResults.length > 0"
      class="absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
      :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'"
    >
      <div
        v-for="thirdparty in searchResults"
        :key="thirdparty.id"
        @mousedown="selectThirdparty(thirdparty)"
        class="px-3 py-2 cursor-pointer transition-colors"
        :class="isDark 
          ? 'hover:bg-gray-600 text-white' 
          : 'hover:bg-gray-100 text-gray-900'"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">{{ getDisplayName(thirdparty) }}</div>
            <div 
              v-if="thirdparty.email" 
              class="text-xs"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ thirdparty.email }}
            </div>
          </div>
          <div 
            v-if="thirdparty.idprof1"
            class="text-xs font-mono"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ thirdparty.idprof1 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de no resultados -->
    <div 
      v-if="showDropdown && canSearch && searchResults.length === 0 && !isSearching && searchTerm.length >= minSearchLength"
      class="absolute z-50 w-full mt-1 border rounded-lg shadow-lg p-3"
      :class="isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-300 text-gray-500'"
    >
      <div class="text-sm text-center">
        No se encontraron clientes para "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useThirdpartySearch } from '@/composables/useThirdpartySearch'
import { useTheme } from '@/composables/useTheme'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Buscar cliente...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  initialValue: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'selected', 'cleared'])

// Composables
const { 
  searchTerm, 
  searchResults, 
  isSearching, 
  canSearch, 
  minSearchLength,
  searchThirdparties, 
  clearSearch, 
  getDisplayName 
} = useThirdpartySearch()

const { isDark } = useTheme()

// Estado local
const showDropdown = ref(false)
let searchTimeout = null

// Inicializar con valor inicial si se proporciona
if (props.initialValue) {
  searchTerm.value = props.initialValue
}

// Watcher para búsqueda con debounce
watch(searchTerm, (newValue) => {
  clearTimeout(searchTimeout)
  
  if (newValue.length >= minSearchLength) {
    searchTimeout = setTimeout(() => {
      searchThirdparties(newValue)
    }, 300) // Debounce de 300ms
  } else {
    searchResults.value = []
  }
})

// Métodos
const handleInput = () => {
  showDropdown.value = true
  
  // Si se limpia el input, emitir cleared
  if (!searchTerm.value) {
    emit('update:modelValue', null)
    emit('cleared')
  }
}

const handleBlur = () => {
  // Delay para permitir click en dropdown
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectThirdparty = (thirdparty) => {
  searchTerm.value = getDisplayName(thirdparty)
  showDropdown.value = false
  
  emit('update:modelValue', thirdparty)
  emit('selected', thirdparty)
}

// Método público para limpiar
const clear = () => {
  clearSearch()
  showDropdown.value = false
  emit('update:modelValue', null)
  emit('cleared')
}

// Método público para establecer valor
const setValue = (thirdparty) => {
  if (thirdparty) {
    searchTerm.value = getDisplayName(thirdparty)
    emit('update:modelValue', thirdparty)
  } else {
    clear()
  }
}

// Exponer métodos para uso externo
defineExpose({
  clear,
  setValue,
  focus: () => {
    nextTick(() => {
      const input = document.querySelector('input')
      if (input) input.focus()
    })
  }
})
</script>
