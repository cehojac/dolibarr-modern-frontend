import { ref, computed, onMounted, watch } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

const assignedTicketsCount = ref(0)
const loading = ref(false)

export function useTicketsCounter() {
  const authStore = useAuthStore()

  const fetchAssignedTicketsCount = async () => {
    console.log('Auth store user:', authStore.user)
    
    if (!authStore.user) {
      console.log('No user found in auth store')
      return
    }
    
    // Try different possible ID fields, fallback to login if no ID
    const userId = authStore.user.id || authStore.user.rowid || authStore.user.user_id
    const userLogin = authStore.user.login
    
    if (!userId && !userLogin) {
      console.log('No user ID or login found:', Object.keys(authStore.user))
      return
    }
    
    console.log('Using user ID:', userId, 'or login:', userLogin)

    loading.value = true
    try {
      // Fetch tickets assigned to current user
      const response = await http.get('/api/doli/tickets')
      const tickets = response.data || []
      
      console.log('Total tickets fetched:', tickets.length)
      console.log('Current user ID:', userId)
      
      // Count tickets assigned to current user that are not closed
      const assignedTickets = tickets.filter(ticket => {
        // Try matching by ID first, then by login if available
        const isAssignedById = userId && ticket.fk_user_assign == userId
        const isAssignedByLogin = userLogin && ticket.fk_user_assign_login == userLogin
        const isAssigned = isAssignedById || isAssignedByLogin
        const isNotClosed = ticket.fk_statut !== '8'
        
        console.log(`Ticket ${ticket.id}: assigned to ${ticket.fk_user_assign} (login: ${ticket.fk_user_assign_login}), status: ${ticket.fk_statut}, matches user: ${isAssigned}, not closed: ${isNotClosed}`)
        return isAssigned && isNotClosed
      })
      
      console.log('Assigned active tickets:', assignedTickets.length)
      assignedTicketsCount.value = assignedTickets.length
    } catch (error) {
      console.error('Error fetching assigned tickets count:', error)
      assignedTicketsCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const refreshCounter = () => {
    fetchAssignedTicketsCount()
  }

  // Auto-refresh counter every 5 minutes
  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      fetchAssignedTicketsCount()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }

  // Watch for user changes and refresh counter
  watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && (!oldUser || newUser.id !== oldUser.id || newUser.login !== oldUser.login)) {
      console.log('🔄 User changed, refreshing tickets counter:', {
        oldUser: oldUser ? { id: oldUser.id, login: oldUser.login } : null,
        newUser: { id: newUser.id, login: newUser.login }
      })
      fetchAssignedTicketsCount()
    }
  }, { immediate: false })

  return {
    assignedTicketsCount: computed(() => assignedTicketsCount.value),
    loading: computed(() => loading.value),
    fetchAssignedTicketsCount,
    refreshCounter,
    startAutoRefresh
  }
}
