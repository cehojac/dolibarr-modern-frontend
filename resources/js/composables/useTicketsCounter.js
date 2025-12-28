import { ref, computed, watch } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

const assignedTicketsCount = ref(0)
const loading = ref(false)

export function useTicketsCounter() {
  const authStore = useAuthStore()

  const fetchAssignedTicketsCount = async () => {
    // console.log('Auth store user:', authStore.user)
    
    if (!authStore.user) {
      // console.log('No user found in auth store')
      return
    }
    
    const userId = authStore.user.id || authStore.user.rowid || authStore.user.user_id
    const userLogin = authStore.user.login
    
    if (!userId && !userLogin) {
      // console.log('No user ID or login found:', Object.keys(authStore.user))
      return
    }
    
    // console.log('Using user ID:', userId, 'or login:', userLogin)

    loading.value = true
    try {
      const sqlClauses = []
      const assignmentClauses = []

      if (userId) {
        assignmentClauses.push(`(t.fk_user_assign:=:${userId})`)
      }

      if (userLogin) {
        const sanitizedLogin = String(userLogin).replace(/'/g, "''")
        assignmentClauses.push(`(t.fk_user_assign_login:=:'${sanitizedLogin}')`)
      }

      if (assignmentClauses.length > 0) {
        const combinedAssignment = assignmentClauses.length > 1
          ? `(${assignmentClauses.join('or')})`
          : assignmentClauses[0]
        sqlClauses.push(combinedAssignment)
      }

      // Exclude closed tickets (status 8) server-side to reduce payload
      sqlClauses.push('(t.fk_statut:<>:8)')

      const params = {
        limit: 500,
        sortfield: 'datec',
        sortorder: 'DESC'
      }

      if (sqlClauses.length > 0) {
        params.sqlfilters = sqlClauses.join('and')
      }

      const response = await http.get('/api/doli/tickets', {
        params,
        timeout: 5000
      })

      const tickets = Array.isArray(response.data) ? response.data : []

      const assignedTickets = tickets.filter(ticket => {
        const isAssignedById = userId && ticket.fk_user_assign == userId
        const isAssignedByLogin = userLogin && ticket.fk_user_assign_login == userLogin
        const isAssigned = isAssignedById || isAssignedByLogin
        const isNotClosed = ticket.fk_statut !== '8' && ticket.fk_statut !== 8
        return isAssigned && isNotClosed
      })

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
