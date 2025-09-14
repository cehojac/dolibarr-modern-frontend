import { ref, computed } from 'vue'

export function useSearch(data, searchFields = []) {
  const searchTerm = ref('')
  const filters = ref({})

  const filteredData = computed(() => {
    let result = data.value || []

    // Apply search filter
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      result = result.filter(item => {
        if (searchFields.length === 0) {
          // Search in all string fields if no specific fields provided
          return Object.values(item).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(term)
          )
        } else {
          // Search in specified fields
          return searchFields.some(field => {
            const value = getNestedValue(item, field)
            return typeof value === 'string' && value.toLowerCase().includes(term)
          })
        }
      })
    }

    // Apply additional filters
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key)
          return itemValue == value
        })
      }
    })

    return result
  })

  const setSearchTerm = (term) => {
    searchTerm.value = term
  }

  const setFilters = (newFilters) => {
    filters.value = { ...newFilters }
  }

  const clearSearch = () => {
    searchTerm.value = ''
    filters.value = {}
  }

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  return {
    searchTerm,
    filters,
    filteredData,
    setSearchTerm,
    setFilters,
    clearSearch
  }
}
