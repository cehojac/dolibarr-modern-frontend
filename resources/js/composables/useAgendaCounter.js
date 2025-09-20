import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const todayEventsCount = ref(0)
const isLoading = ref(false)
const lastFetch = ref(null)

export function useAgendaCounter() {
  const authStore = useAuthStore()

  const fetchTodayEventsCount = async () => {
    if (!authStore.isAuthenticated) {
      console.log('🚫 No authenticated user for agenda counter')
      return
    }

    isLoading.value = true
    
    try {
      console.log('📅 Fetching today upcoming events count (from now until end of day)...')
      
      // Obtener fecha y hora actual en formato string para filtros SQL
      const now = new Date()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      
      // Para comparación interna (timestamps)
      const currentTimestamp = Math.floor(now.getTime() / 1000)
      
      // Para filtros SQL (strings de fecha)
      const currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ')
      const endDateTime = endOfDay.toISOString().slice(0, 19).replace('T', ' ')
      
      // Filtro SQL con strings de fecha
      const sqlFilters = `(t.datep:>=:'${currentDateTime}')AND(t.datep:<=:'${endDateTime}')`
      
      
      // Llamar a la API con filtros de fecha y usuario
      const response = await fetch(`/api/doli/agendaevents?limit=1000&user_ids=${authStore.user.id}&sqlfilters=${encodeURIComponent(sqlFilters)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📅 Today events response:', data)
      
      // Contar eventos del día actual, excluyendo eventos systemauto
      let count = 0
      let events = []
      
      if (Array.isArray(data)) {
        events = data
      } else if (data && typeof data === 'object') {
        events = Object.values(data)
      }
      
      
      // Primero filtrar por hora (solo eventos futuros)
      const futureEvents = events.filter(event => {
        // Convertir datep a timestamp si es string
        let eventTimestamp
        if (typeof event.datep === 'string') {
          eventTimestamp = Math.floor(new Date(event.datep).getTime() / 1000)
        } else {
          eventTimestamp = event.datep
        }
        
        // Comparar timestamps numéricos
        return eventTimestamp >= currentTimestamp
      })
      
      console.log('⏰ Future events after time filter:', futureEvents.length)
      
      // Luego filtrar eventos systemauto (eventos automáticos del sistema)
      const filteredEvents = futureEvents.filter(event => {
        const label = (event.label || '').toLowerCase()
        const note = (event.note || event.note_private || '').toLowerCase()
        const type = (event.type || '').toLowerCase()
        const typeCode = (event.type_code || '').toLowerCase()
        
        // Excluir eventos que contengan 'systemauto' en cualquier campo relevante
        const isSystemAuto = label.includes('systemauto') || 
                            note.includes('systemauto') || 
                            type.includes('systemauto') ||
                            typeCode.includes('auto') ||
                            event.type === 'systemauto'
        
        return !isSystemAuto
      })
      
      count = filteredEvents.length
      const totalEvents = events.length
      const futureEventsCount = futureEvents.length
      const systemAutoFiltered = futureEventsCount - count
      
      todayEventsCount.value = count
      lastFetch.value = new Date()
      
      console.log('📅 Today upcoming events count updated:', count)
      if (systemAutoFiltered > 0) {
        console.log('🚫 Filtered out', systemAutoFiltered, 'systemauto events')
      }
      
    } catch (error) {
      console.error('❌ Error fetching today events count:', error)
      todayEventsCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const startAutoRefresh = () => {
    console.log('🔄 Starting agenda counter auto-refresh...')
    
    // Refrescar cada 5 minutos
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing today events count...')
      fetchTodayEventsCount()
    }, 5 * 60 * 1000) // 5 minutos

    // Función para detener el auto-refresh
    return () => {
      console.log('⏹️ Stopping agenda counter auto-refresh')
      clearInterval(interval)
    }
  }

  // Computed para mostrar el contador solo si hay eventos
  const displayCount = computed(() => {
    return todayEventsCount.value > 0 ? todayEventsCount.value : null
  })

  // Función para incrementar el contador cuando se crea un evento futuro de hoy
  const incrementTodayCount = (eventTimestamp) => {
    const now = Math.floor(Date.now() / 1000)
    
    // Solo incrementar si el evento es futuro (superior a la hora actual)
    if (eventTimestamp >= now) {
      todayEventsCount.value = (todayEventsCount.value || 0) + 1
      console.log('📅 Today upcoming events count incremented to:', todayEventsCount.value)
    } else {
      console.log('📅 Event is in the past, not incrementing counter')
    }
  }

  return {
    todayEventsCount: displayCount,
    isLoading,
    lastFetch,
    fetchTodayEventsCount,
    startAutoRefresh,
    incrementTodayCount
  }
}
