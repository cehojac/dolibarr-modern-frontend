<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <!-- Búsqueda -->
    <div class="flex-1">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchTerm"
          type="text"
          :placeholder="placeholder"
          :class="['block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm', isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500']"
          @input="onSearch"
        />
        <div v-if="searchTerm" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            @click="clearSearch"
            :class="[isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500']"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="filters.length > 0" class="flex gap-2">
      <select
        v-for="filter in filters"
        :key="filter.key"
        v-model="filterValues[filter.key]"
        @change="onFilterChange"
        :class="['block px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm', isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900']"
      >
        <option value="">{{ filter.placeholder }}</option>
        <option
          v-for="option in filter.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Botón limpiar filtros -->
    <button
      v-if="hasActiveFilters"
      @click="clearFilters"
      :class="['inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500', isDark ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50']"
    >
      <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Limpiar
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  filters: {
    type: Array,
    default: () => []
  },
  searchDelay: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'filter-change'])

const searchTerm = ref('')
const filterValues = ref({})

// Initialize filter values
props.filters.forEach(filter => {
  filterValues.value[filter.key] = ''
})

const hasActiveFilters = computed(() => {
  return searchTerm.value || Object.values(filterValues.value).some(value => value)
})

// Simple debounce implementation
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

const debouncedSearch = debounce(() => {
  emit('search', searchTerm.value)
}, props.searchDelay)

const onSearch = () => {
  debouncedSearch()
}

const onFilterChange = () => {
  emit('filter-change', { ...filterValues.value })
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('search', '')
}

const clearFilters = () => {
  searchTerm.value = ''
  Object.keys(filterValues.value).forEach(key => {
    filterValues.value[key] = ''
  })
  emit('search', '')
  emit('filter-change', { ...filterValues.value })
}

// Watch for external changes
watch(() => props.filters, (newFilters) => {
  const newFilterValues = {}
  newFilters.forEach(filter => {
    newFilterValues[filter.key] = filterValues.value[filter.key] || ''
  })
  filterValues.value = newFilterValues
}, { deep: true })
</script>
