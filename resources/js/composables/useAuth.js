import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const currentUser = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const loading = computed(() => authStore.loading)

  return {
    currentUser,
    isAuthenticated,
    loading,
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth
  }
}
