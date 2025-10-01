import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const overdueEventsCount = ref(0)
const isLoading = ref(false)
const lastFetch = ref(null)

export function useAgendaCounter() {
  const authStore = useAuthStore()

  const fetchOverdueEventsCount = async () => {
    if (!authStore.isAuthenticated) {
       console.log('🚫 No authenticated user for agenda counter')
      return
    }

    isLoading.value = true
    
    try {
      console.log('📅 Fetching overdue events count (past incomplete events)...')
      
      // Obtener fecha y hora actual
      const now = new Date()
      
      // Para comparación interna (timestamps)
      const currentTimestamp = Math.floor(now.getTime() / 1000)
      
      // Llamar a la API SIN filtros SQL - traer todos los eventos del usuario
      // (igual que en la página Agenda para consistencia)
      const response = await fetch(`/api/doli/agendaevents?sortfield=t.id&sortorder=DESC&limit=500&user_ids=${authStore.user.id}`, {
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
      console.log('📅 Overdue events response:', data)
      
      // Contar eventos vencidos, excluyendo eventos systemauto y completados
      let count = 0
      let events = []
      
      if (Array.isArray(data)) {
        events = data
      } else if (data && typeof data === 'object') {
        events = Object.values(data)
      }
      
      console.log('📊 Total events received:', events.length)
      
      // PASO 1: Filtrar eventos systemauto (igual que filteredEventos en Agenda.vue)
      const eventsWithoutSystemAuto = events.filter(event => {
        const label = (event.label || '').toLowerCase()
        const note = (event.note || '').toLowerCase()
        const type = (event.type || '').toLowerCase()
        
        return !label.includes('systemauto') && 
               !note.includes('systemauto') && 
               !type.includes('systemauto')
      })
      
      console.log('🚫 Events after systemauto filter:', eventsWithoutSystemAuto.length)
      
      // PASO 2: Filtrar eventos vencidos (igual que overdueEvents en Agenda.vue)
      const filteredEvents = eventsWithoutSystemAuto.filter(event => {
        // Convertir datep a Date (viene como timestamp Unix en segundos)
        const eventDateTime = new Date(event.datep * 1000)
        
        // Verificar si el evento es anterior a la hora actual (now)
        const isOverdue = eventDateTime < now
        
        // Verificar si NO está completado al 100%
        const isNotCompleted = event.status !== '1' && (event.percentage || '0') !== '100'
        
        return isOverdue && isNotCompleted
      })
      
      console.log('⏰ Overdue incomplete events:', filteredEvents.length)
      
      // Calcular estadísticas de filtrado
      count = filteredEvents.length
      const totalEvents = events.length
      const eventsWithoutSystemAutoCount = eventsWithoutSystemAuto.length
      const systemAutoEvents = totalEvents - eventsWithoutSystemAutoCount
      
      overdueEventsCount.value = count
      lastFetch.value = new Date()
      
      console.log('⏰ Overdue events count updated:', count)
      console.log('📊 Events breakdown:', {
        total: totalEvents,
        withoutSystemAuto: eventsWithoutSystemAutoCount,
        systemAuto: systemAutoEvents,
        overdueIncomplete: count
      })
      
      if (systemAutoEvents > 0) {
        console.log('🚫 Filtered out', systemAutoEvents, 'systemauto events')
      }
      
    } catch (error) {
      console.error('❌ Error fetching overdue events count:', error)
      overdueEventsCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const startAutoRefresh = () => {
     console.log('🔄 Starting agenda counter auto-refresh...')
    
    // Refrescar cada 5 minutos
    const interval = setInterval(() => {
       console.log('🔄 Auto-refreshing overdue events count...')
      fetchOverdueEventsCount()
    }, 5 * 60 * 1000) // 5 minutos

    // Función para detener el auto-refresh
    return () => {
       console.log('⏹️ Stopping agenda counter auto-refresh')
      clearInterval(interval)
    }
  }

  // Computed para mostrar el contador solo si hay eventos
  const displayCount = computed(() => {
    return overdueEventsCount.value > 0 ? overdueEventsCount.value : null
  })

  // Función para decrementar el contador cuando un evento vencido se completa
  const decrementOverdueCount = () => {
    if (overdueEventsCount.value > 0) {
      overdueEventsCount.value = overdueEventsCount.value - 1
      console.log('✅ Overdue events count decremented to:', overdueEventsCount.value)
    }
  }

  // Función para incrementar el contador cuando un evento vencido se marca como pendiente
  const incrementOverdueCount = () => {
    overdueEventsCount.value = (overdueEventsCount.value || 0) + 1
    console.log('⏳ Overdue events count incremented to:', overdueEventsCount.value)
  }

  return {
    overdueEventsCount: displayCount,
    isLoading,
    lastFetch,
    fetchOverdueEventsCount,
    startAutoRefresh,
    decrementOverdueCount,
    incrementOverdueCount
  }
}
