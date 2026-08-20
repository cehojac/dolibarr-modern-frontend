import { ref } from 'vue'
import http from '../utils/http'
import { useAuthStore } from '../stores/auth'

const tercerosCount = ref(null)
let refreshInterval = null

export function useTercerosCounter() {
  const authStore = useAuthStore()

  const fetchTercerosCount = async () => {
    if (!authStore.isAuthenticated || !authStore.user) {
      tercerosCount.value = null
      return
    }

    try {
      // Obtener todos los terceros activos con límite alto
      const response = await http.get('/api/doli/thirdparties?limit=10000&status=1')
      
      if (response.data && Array.isArray(response.data)) {
        tercerosCount.value = response.data.length
      } else {
        tercerosCount.value = 0
      }
    } catch (error) {
      console.error('Error fetching terceros count:', error)
      tercerosCount.value = 0
    }
  }

  const startAutoRefresh = (intervalMs = 300000) => { // 5 minutos por defecto
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    fetchTercerosCount()
    refreshInterval = setInterval(fetchTercerosCount, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    tercerosCount,
    fetchTercerosCount,
    startAutoRefresh,
    stopAutoRefresh
  }
}
