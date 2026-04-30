import { ref } from 'vue'
import http from '../utils/http'

const productsCount = ref(null)
let refreshInterval = null

export function useProductsCounter() {
  const fetchProductsCount = async () => {
    try {
      const response = await http.get('/api/doli/products', {
        params: { limit: 500, status: 1 },
        timeout: 20000,
        silentError: true
      })
      
      if (response.data && Array.isArray(response.data)) {
        productsCount.value = response.data.length
      } else {
        productsCount.value = 0
      }
    } catch (error) {
      console.error('Error fetching products count:', error)
      productsCount.value = 0
    }
  }

  const startAutoRefresh = (intervalMs = 300000) => { // 5 minutos por defecto
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    fetchProductsCount()
    refreshInterval = setInterval(fetchProductsCount, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    productsCount,
    fetchProductsCount,
    startAutoRefresh,
    stopAutoRefresh
  }
}
