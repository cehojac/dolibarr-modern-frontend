import { ref, computed, watch } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

const assignedTasksCount = ref(0)
const loading = ref(false)

export function useTasksCounter() {
  const authStore = useAuthStore()

  const fetchAssignedTasksCount = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
      return
    }

    const userId = authStore.user.id || authStore.user.rowid || authStore.user.user_id
    const userLogin = authStore.user.login

    if (!userId && !userLogin) {
      return
    }

    loading.value = true
    try {
      // IMPORTANTE: fk_user_assign_login NO es una columna SQL real en Dolibarr
      // (es una propiedad calculada solo disponible en la respuesta JSON). Incluirla
      // en sqlfilters provoca un error 500/503 en el endpoint de Dolibarr.
      // Por eso solo filtramos server-side por fk_user_assign (columna real) y
      // dejamos el match por login para el filtrado en cliente (ver más abajo).
      const sqlClauses = []

      if (userId) {
        sqlClauses.push(`(t.fk_user_assign:=:${userId})`)
      }

      sqlClauses.push('(t.progress:<:100)')

      const params = {
        limit: 200,
        sortfield: 't.rowid',
        sortorder: 'DESC',
        include_contacts: 0
      }

      if (sqlClauses.length > 0) {
        params.sqlfilters = sqlClauses.join('and')
      }

      let tasks = []

      try {
        // Try enriched endpoint first
        const response = await http.get('/api/doli/dolibarrmodernfrontendapi/tasks/enriched', {
          params,
          timeout: 30000
        })

        if (response.data && response.data.tasks && Array.isArray(response.data.tasks)) {
          tasks = response.data.tasks
        }
      } catch (enrichedError) {
        if (enrichedError?.response?.status === 401) {
          throw enrichedError
        }

        // Fallback to native endpoint if enriched fails
        console.warn('⚠️ Enriched endpoint failed, using native endpoint:', enrichedError.message)
        const fallbackResponse = await http.get('/api/doli/tasks', {
          params,
          timeout: 30000
        })

        if (Array.isArray(fallbackResponse.data)) {
          tasks = fallbackResponse.data
        } else if (fallbackResponse.data && Array.isArray(fallbackResponse.data.data)) {
          tasks = fallbackResponse.data.data
        }
      }

      const taskCount = tasks.filter(task => {
        const isAssignedById = userId && task.fk_user_assign == userId
        const isAssignedByLogin = userLogin && task.fk_user_assign_login == userLogin
        return (isAssignedById || isAssignedByLogin) && (task.progress ?? 0) < 100
      }).length

      assignedTasksCount.value = taskCount
    } catch (error) {
      console.error('❌ Tasks Counter - Error:', error)
      assignedTasksCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const refreshCounter = () => {
    fetchAssignedTasksCount()
  }

  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      fetchAssignedTasksCount()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }

  watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && (!oldUser || newUser.id !== oldUser.id || newUser.login !== oldUser.login)) {
      fetchAssignedTasksCount()
    }
  }, { immediate: false })

  return {
    assignedTasksCount: computed(() => assignedTasksCount.value),
    loading: computed(() => loading.value),
    fetchAssignedTasksCount,
    refreshCounter,
    startAutoRefresh
  }
}
