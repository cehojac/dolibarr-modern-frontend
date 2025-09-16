import { ref, computed } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

// Global state for interventions
const interventions = ref([])
const loading = ref(false)
const lastFetch = ref(null)

export function useInterventions() {
  const authStore = useAuthStore()

  // Fetch user interventions
  const fetchUserInterventions = async (forceRefresh = false) => {
    console.log('=== fetchUserInterventions called ===')
    console.log('Auth store user:', authStore.user)
    console.log('Force refresh:', forceRefresh)
    
    if (!authStore.user?.id) {
      console.warn('No user ID available for fetching interventions')
      return []
    }

    // Check if we need to refresh (force or older than 5 minutes)
    const now = Date.now()
    if (!forceRefresh && lastFetch.value && (now - lastFetch.value) < 5 * 60 * 1000) {
      console.log('Using cached interventions, last fetch was recent')
      return interventions.value
    }

    loading.value = true
    console.log('Starting interventions fetch...')
    
    try {
      const userId = authStore.user.id
      console.log('Fetching interventions for user ID:', userId)
      
      const response = await http.get('/api/doli/interventions', {
        params: {
          sortfield: 't.rowid',
          sortorder: 'DESC',
          limit: 1000,
          sqlfilters: `(t.fk_user_author:=:${userId})`,
          properties: 'id,linkedObjectsIds,ref,status,duration,datee,datem,desc,lines,desc'
        }
      })

      console.log('API Response:', response)
      console.log('Response data:', response.data)

      if (response.data && Array.isArray(response.data)) {
        interventions.value = response.data
        lastFetch.value = now
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('user_interventions', JSON.stringify({
          data: interventions.value,
          timestamp: now,
          userId: userId
        }))
        
        console.log(`✅ Fetched ${interventions.value.length} interventions for user ${userId}`)
        console.log('Interventions data:', interventions.value)
      } else {
        console.log('No interventions data or invalid format')
        interventions.value = []
      }
    } catch (error) {
      console.error('❌ Error fetching user interventions:', error)
      interventions.value = []
    } finally {
      loading.value = false
    }

    return interventions.value
  }

  // Load interventions from sessionStorage on init
  const loadFromSession = () => {
    try {
      const stored = sessionStorage.getItem('user_interventions')
      if (stored) {
        const { data, timestamp, userId } = JSON.parse(stored)
        
        // Check if stored data is for current user and not too old (1 hour)
        if (userId === authStore.user?.id && (Date.now() - timestamp) < 60 * 60 * 1000) {
          interventions.value = data
          lastFetch.value = timestamp
          return true
        }
      }
    } catch (error) {
      console.error('Error loading interventions from session:', error)
    }
    return false
  }

  // Get interventions for a specific ticket
  const getInterventionsForTicket = (ticketId) => {
    console.log('=== getInterventionsForTicket called ===')
    console.log('Ticket ID:', ticketId)
    console.log('Available interventions:', interventions.value.length)
    
    
    const filtered = interventions.value.filter(intervention => {
      console.log(`Checking intervention ${intervention.ref}:`, intervention.linkedObjectsIds)
      
      if (!intervention.linkedObjectsIds) {
        console.log(`  No linkedObjectsIds for ${intervention.ref}`)
        return false
      }
      
      // Check if linkedObjectsIds has a ticket property with nested structure
      if (intervention.linkedObjectsIds.ticket && typeof intervention.linkedObjectsIds.ticket === 'object') {
        // Structure: { "ticket": { "366": "438" } }
        // The values are the actual ticket IDs
        const ticketIds = Object.values(intervention.linkedObjectsIds.ticket)
        console.log(`  Found ticket IDs for ${intervention.ref}:`, ticketIds)
        
        const matches = ticketIds.some(id => String(id) === String(ticketId))
        console.log(`  Matches ticket ${ticketId}:`, matches)
        return matches
      }
      
      // Fallback: check if it's a direct array or object structure
      let linkedIds = []
      if (Array.isArray(intervention.linkedObjectsIds)) {
        linkedIds = intervention.linkedObjectsIds
      } else if (typeof intervention.linkedObjectsIds === 'object') {
        linkedIds = Object.values(intervention.linkedObjectsIds)
      }
      
      console.log(`  Processed linkedIds for ${intervention.ref}:`, linkedIds)
      
      const matches = linkedIds.some(id => String(id) === String(ticketId))
      console.log(`  Matches ticket ${ticketId}:`, matches)
      
      return matches
    })
    
    console.log(`Found ${filtered.length} interventions for ticket ${ticketId}`)
    return filtered
  }

  // Clear interventions (on logout)
  const clearInterventions = () => {
    interventions.value = []
    lastFetch.value = null
    sessionStorage.removeItem('user_interventions')
  }

  // Initialize interventions (load from session or fetch)
  const initInterventions = async () => {
    if (!authStore.user?.id) return
    
    const loadedFromSession = loadFromSession()
    if (!loadedFromSession) {
      await fetchUserInterventions(true)
    }
  }

  // Computed properties
  const totalInterventions = computed(() => interventions.value.length)
  
  const interventionsByStatus = computed(() => {
    const grouped = {}
    interventions.value.forEach(intervention => {
      const status = intervention.status || 'unknown'
      if (!grouped[status]) grouped[status] = []
      grouped[status].push(intervention)
    })
    return grouped
  })

  return {
    // State
    interventions: computed(() => interventions.value),
    loading: computed(() => loading.value),
    lastFetch: computed(() => lastFetch.value),
    
    // Computed
    totalInterventions,
    interventionsByStatus,
    
    // Methods
    fetchUserInterventions,
    getInterventionsForTicket,
    clearInterventions,
    initInterventions,
    loadFromSession
  }
}
