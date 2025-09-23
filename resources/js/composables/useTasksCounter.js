import { ref, computed, onMounted, watch } from 'vue'
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
    
    // Try different possible ID fields, fallback to login if no ID
    const userId = authStore.user.id || authStore.user.rowid || authStore.user.user_id
    const userLogin = authStore.user.login
    
    if (!userId && !userLogin) {
      return
    }

    loading.value = true
    try {
      // Fetch tasks assigned to current user
      const response = await http.get('/api/doli/tasks?limit=500&sqlfilters=(t.progress:<:100)or(t.progress:is:null)')
      const tasks = response.data || []
      
       // console.log('📋 Tasks Counter - Total tasks fetched:', tasks.length)
      
      // Check for role-based assignment first
      let taskCount = 0
      
      for (const task of tasks) {
        let isAssigned = false
        
        // First check if user has a role in this task
        if (task.id && userId) {
          try {
            const roleResponse = await http.get(`/tasks/${task.id}/roles?userid=${userId}`)
            if (roleResponse.data && roleResponse.data.length > 0) {
              isAssigned = true
               // console.log(`✅ User ${userId} has role in task ${task.ref}`)
            }
          } catch (error) {
            // No role found, continue with fallback logic
          }
        }
        
        // Fallback: Check traditional assignment fields
        if (!isAssigned) {
          const isAssignedById = userId && task.fk_user_assign == userId
          const isAssignedByLogin = userLogin && task.fk_user_assign_login == userLogin
          isAssigned = isAssignedById || isAssignedByLogin
        }
        
        // Only count if assigned and not completed
        const isNotCompleted = task.progress < 100
        if (isAssigned && isNotCompleted) {
          taskCount++
        }
      }
      
       // console.log('🎯 Tasks Counter - Final count:', taskCount)
      assignedTasksCount.value = taskCount
      
      // Force reactivity update
       // console.log('📊 Tasks Counter - Value set to:', assignedTasksCount.value)
    } catch (error) {
      // console.error('❌ Tasks Counter - Error:', error)
      assignedTasksCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const refreshCounter = () => {
    fetchAssignedTasksCount()
  }

  // Auto-refresh counter every 5 minutes
  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      fetchAssignedTasksCount()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }

  // Watch for user changes and refresh counter
  watch(() => authStore.user, (newUser, oldUser) => {
    if (newUser && (!oldUser || newUser.id !== oldUser.id || newUser.login !== oldUser.login)) {
       // console.log('🔄 User changed, refreshing tasks counter:', {
        // oldUser: oldUser ? { id: oldUser.id, login: oldUser.login } : null,
        // newUser: { id: newUser.id, login: newUser.login }
      // })
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
