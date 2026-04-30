import { ref } from 'vue'
import http from '../utils/http'

const tercerosCount = ref(null)
let refreshInterval = null

export function useTercerosCounter() {
  const fetchTercerosCount = async () => {
    try {
      const response = await http.get('/api/doli/thirdparties', {
        params: { limit: 500, status: 1 },
        timeout: 20000,
        silentError: true
      })
      
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
