import { ref, computed, watch } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

const assignedTasksCount = ref(0)
const loading = ref(false)

export function useTasksCounter() {
  const authStore = useAuthStore()

  const fetchAssignedTasksCount = async () => {
    if (!authStore.user) {
      return
    }

    const userId = authStore.user.id || authStore.user.rowid || authStore.user.user_id
    const userLogin = authStore.user.login

    if (!userId && !userLogin) {
      return
    }

    loading.value = true
    try {
      const sqlClauses = []

      if (userId) {
        sqlClauses.push(`(t.fk_user_assign:=:${userId})`)
      }

      if (userLogin) {
        const sanitizedLogin = String(userLogin).replace(/'/g, "''")
        sqlClauses.push(`(t.fk_user_assign_login:=:'${sanitizedLogin}')`)
      }

      sqlClauses.push('(t.progress:<:100)')

      const params = {
        limit: 200,
        sortfield: 't.rowid',
        sortorder: 'DESC'
      }

      if (sqlClauses.length > 0) {
        params.sqlfilters = sqlClauses.join('and')
      }

      let tasks = []

      const response = await http.get('/api/doli/tasks', {
        params,
        timeout: 20000
      })

      if (Array.isArray(response.data)) {
        tasks = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        tasks = response.data.data
      }

      if (tasks.length === 0 && userId) {
        const fallbackParams = {
          limit: 200,
          sortfield: 't.rowid',
          sortorder: 'DESC',
          sqlfilters: `(t.fk_user_assign:=:${userId})and(t.progress:<:100)`
        }

        const fallbackResponse = await http.get('/api/doli/tasks', {
          params: fallbackParams,
          timeout: 20000
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
