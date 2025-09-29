import { ref, computed } from 'vue'
import http from '@/utils/http'

// Estado global para caché de búsquedas
const searchCache = ref(new Map())
const isSearching = ref(false)

export function useThirdpartySearch() {
  const searchTerm = ref('')
  const searchResults = ref([])
  const minSearchLength = 3

  // Computed para verificar si se puede buscar
  const canSearch = computed(() => {
    return searchTerm.value.length >= minSearchLength
  })

  // Función para buscar terceros
  const searchThirdparties = async (query = null) => {
    const searchQuery = query || searchTerm.value
    
    // Validar longitud mínima
    if (!searchQuery || searchQuery.length < minSearchLength) {
      searchResults.value = []
      return []
    }

    // Verificar caché
    const cacheKey = searchQuery.toLowerCase()
    if (searchCache.value.has(cacheKey)) {
      searchResults.value = searchCache.value.get(cacheKey)
      return searchResults.value
    }

    try {
      isSearching.value = true
      
      // Construir filtros SQL
      const filters = [
        '(status:=:1)',  // Solo activos
        `((t.nom:LIKE:'%${searchQuery}%')or(t.name_alias:LIKE:'%${searchQuery}%'))` // Búsqueda por nombre o alias
      ].join(' and ')

      // Realizar petición
      const response = await http.get('/api/doli/thirdparties', {
        params: {
          properties: 'id,idprof1,email,name,alias',
          sqlfilters: filters,
          limit: 50 // Limitar resultados para mejor rendimiento
        }
      })

      const results = response.data || []
      
      // Guardar en caché
      searchCache.value.set(cacheKey, results)
      searchResults.value = results
      
      console.log(`🔍 Terceros encontrados para "${searchQuery}":`, results.length)
      return results

    } catch (error) {
      console.error('❌ Error buscando terceros:', error)
      searchResults.value = []
      return []
    } finally {
      isSearching.value = false
    }
  }

  // Función para limpiar búsqueda
  const clearSearch = () => {
    searchTerm.value = ''
    searchResults.value = []
  }

  // Función para obtener el nombre a mostrar
  const getDisplayName = (thirdparty) => {
    if (!thirdparty) return ''
    return thirdparty.name || thirdparty.alias || `Cliente #${thirdparty.id}`
  }

  // Función para buscar por ID específico
  const findThirdpartyById = async (id) => {
    if (!id) return null

    try {
      const response = await http.get(`/api/doli/thirdparties/${id}`, {
        params: {
          properties: 'id,idprof1,email,name,alias'
        }
      })
      return response.data
    } catch (error) {
      console.error('❌ Error obteniendo tercero por ID:', error)
      return null
    }
  }

  // Función para limpiar caché (útil para refrescar datos)
  const clearCache = () => {
    searchCache.value.clear()
  }

  return {
    // Estado reactivo
    searchTerm,
    searchResults,
    isSearching: computed(() => isSearching.value),
    canSearch,
    minSearchLength,
    
    // Métodos
    searchThirdparties,
    clearSearch,
    getDisplayName,
    findThirdpartyById,
    clearCache
  }
}
