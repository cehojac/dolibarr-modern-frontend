import { ref, computed } from 'vue'
import http from '../utils/http'

// Estado compartido entre todas las instancias
const ticketCategories = ref([])
const ticketSeverities = ref([])
const ticketTypes = ref([])
const loadingCategories = ref(false)
const loadingSeverities = ref(false)
const loadingTypes = ref(false)
const categoriesLoaded = ref(false)
const severitiesLoaded = ref(false)
const typesLoaded = ref(false)

export function useTicketReferences() {
  /**
   * Obtener categorías de tickets desde la API
   */
  const fetchTicketCategories = async (forceRefresh = false) => {
    // Si ya están cargadas y no se fuerza refresh, retornar las existentes
    if (categoriesLoaded.value && !forceRefresh) {
      console.log('📋 Categorías de tickets ya cargadas desde caché')
      return ticketCategories.value
    }

    loadingCategories.value = true
    try {
      console.log('🔍 Obteniendo categorías de tickets...')
      const response = await http.get('/api/doli/setup/dictionary/ticket_categories')
      
      ticketCategories.value = response.data || []
      categoriesLoaded.value = true
      
      console.log('✅ Categorías de tickets cargadas:', ticketCategories.value.length)
      return ticketCategories.value
    } catch (error) {
      console.error('❌ Error obteniendo categorías de tickets:', error)
      ticketCategories.value = []
      return []
    } finally {
      loadingCategories.value = false
    }
  }

  /**
   * Obtener gravedades de tickets desde la API
   */
  const fetchTicketSeverities = async (forceRefresh = false) => {
    // Si ya están cargadas y no se fuerza refresh, retornar las existentes
    if (severitiesLoaded.value && !forceRefresh) {
      console.log('📋 Gravedades de tickets ya cargadas desde caché')
      return ticketSeverities.value
    }

    loadingSeverities.value = true
    try {
      console.log('🔍 Obteniendo gravedades de tickets...')
      const response = await http.get('/api/doli/setup/dictionary/ticket_severities')
      
      ticketSeverities.value = response.data || []
      severitiesLoaded.value = true
      
      console.log('✅ Gravedades de tickets cargadas:', ticketSeverities.value.length)
      return ticketSeverities.value
    } catch (error) {
      console.error('❌ Error obteniendo gravedades de tickets:', error)
      ticketSeverities.value = []
      return []
    } finally {
      loadingSeverities.value = false
    }
  }

  /**
   * Obtener tipos de tickets desde la API
   */
  const fetchTicketTypes = async (forceRefresh = false) => {
    // Si ya están cargados y no se fuerza refresh, retornar los existentes
    if (typesLoaded.value && !forceRefresh) {
      console.log('📋 Tipos de tickets ya cargados desde caché')
      return ticketTypes.value
    }

    loadingTypes.value = true
    try {
      console.log('🔍 Obteniendo tipos de tickets...')
      const response = await http.get('/api/doli/setup/dictionary/ticket_types')
      
      ticketTypes.value = response.data || []
      typesLoaded.value = true
      
      console.log('✅ Tipos de tickets cargados:', ticketTypes.value.length)
      return ticketTypes.value
    } catch (error) {
      console.error('❌ Error obteniendo tipos de tickets:', error)
      ticketTypes.value = []
      return []
    } finally {
      loadingTypes.value = false
    }
  }

  /**
   * Cargar todas las referencias de tickets en paralelo
   */
  const fetchAllTicketReferences = async (forceRefresh = false) => {
    console.log('🔄 Cargando todas las referencias de tickets...')
    
    try {
      await Promise.all([
        fetchTicketCategories(forceRefresh),
        fetchTicketSeverities(forceRefresh),
        fetchTicketTypes(forceRefresh)
      ])
      
      console.log('✅ Todas las referencias de tickets cargadas')
      return {
        categories: ticketCategories.value,
        severities: ticketSeverities.value,
        types: ticketTypes.value
      }
    } catch (error) {
      console.error('❌ Error cargando referencias de tickets:', error)
      return {
        categories: [],
        severities: [],
        types: []
      }
    }
  }

  /**
   * Obtener el nombre de una categoría por su código
   */
  const getCategoryName = (code) => {
    const category = ticketCategories.value.find(c => c.code === code || c.id === code)
    return category?.label || category?.name || code
  }

  /**
   * Obtener el nombre de una gravedad por su código
   */
  const getSeverityName = (code) => {
    const severity = ticketSeverities.value.find(s => s.code === code || s.id === code)
    return severity?.label || severity?.name || code
  }

  /**
   * Obtener el nombre de un tipo por su código
   */
  const getTypeName = (code) => {
    const type = ticketTypes.value.find(t => t.code === code || t.id === code)
    return type?.label || type?.name || code
  }

  /**
   * Limpiar el caché de referencias
   */
  const clearCache = () => {
    console.log('🗑️ Limpiando caché de referencias de tickets')
    ticketCategories.value = []
    ticketSeverities.value = []
    ticketTypes.value = []
    categoriesLoaded.value = false
    severitiesLoaded.value = false
    typesLoaded.value = false
  }

  // Computed properties para facilitar el uso
  const isLoading = computed(() => 
    loadingCategories.value || loadingSeverities.value || loadingTypes.value
  )

  const allLoaded = computed(() => 
    categoriesLoaded.value && severitiesLoaded.value && typesLoaded.value
  )

  return {
    // Estado
    ticketCategories,
    ticketSeverities,
    ticketTypes,
    loadingCategories,
    loadingSeverities,
    loadingTypes,
    categoriesLoaded,
    severitiesLoaded,
    typesLoaded,
    
    // Computed
    isLoading,
    allLoaded,
    
    // Métodos
    fetchTicketCategories,
    fetchTicketSeverities,
    fetchTicketTypes,
    fetchAllTicketReferences,
    getCategoryName,
    getSeverityName,
    getTypeName,
    clearCache
  }
}
