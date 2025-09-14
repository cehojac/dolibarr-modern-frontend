import { ref, computed } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import http from '../utils/http'

// Cache global reactivo
const cache = ref(new Map())
const cacheStats = ref({
  hits: 0,
  misses: 0,
  total: 0
})

export function useApiCache() {
  const notifications = useNotificationStore()

  /**
   * Realizar petición con caché automático
   */
  const cachedFetch = async (url, options = {}) => {
    const {
      ttl = 300000, // 5 minutos por defecto
      forceRefresh = false,
      cacheKey = null
    } = options

    const key = cacheKey || generateCacheKey(url, options)
    const now = Date.now()

    // Verificar caché existente
    if (!forceRefresh && cache.value.has(key)) {
      const cached = cache.value.get(key)
      if (now - cached.timestamp < ttl) {
        cacheStats.value.hits++
        cacheStats.value.total++
        return {
          data: cached.data,
          fromCache: true,
          timestamp: cached.timestamp
        }
      } else {
        // Caché expirado
        cache.value.delete(key)
      }
    }

    try {
      // Realizar petición
      const response = await http.get(url, options)
      const data = response.data

      // Guardar en caché
      cache.value.set(key, {
        data,
        timestamp: now,
        url,
        ttl
      })

      cacheStats.value.misses++
      cacheStats.value.total++

      return {
        data,
        fromCache: false,
        timestamp: now
      }
    } catch (error) {
      console.error('Error in cachedFetch:', error)
      throw error
    }
  }

  /**
   * Invalidar caché por patrón
   */
  const invalidateCache = (pattern) => {
    let deleted = 0
    
    for (const [key] of cache.value) {
      if (key.includes(pattern)) {
        cache.value.delete(key)
        deleted++
      }
    }

    if (deleted > 0) {
      notifications.add({
        type: 'info',
        title: 'Caché actualizado',
        message: `Se invalidaron ${deleted} entradas de caché`
      })
    }

    return deleted
  }

  /**
   * Limpiar todo el caché
   */
  const clearCache = () => {
    const size = cache.value.size
    cache.value.clear()
    cacheStats.value.hits = 0
    cacheStats.value.misses = 0
    cacheStats.value.total = 0

    notifications.add({
      type: 'success',
      title: 'Caché limpiado',
      message: `Se eliminaron ${size} entradas del caché`
    })

    return size
  }

  /**
   * Obtener estadísticas del caché
   */
  const getCacheStats = computed(() => ({
    ...cacheStats.value,
    size: cache.value.size,
    hitRate: cacheStats.value.total > 0 
      ? ((cacheStats.value.hits / cacheStats.value.total) * 100).toFixed(2)
      : '0.00'
  }))

  /**
   * Verificar si una clave existe en caché
   */
  const hasCache = (key) => {
    return cache.value.has(key)
  }

  /**
   * Obtener entrada de caché
   */
  const getCache = (key) => {
    return cache.value.get(key)
  }

  /**
   * Establecer entrada de caché manualmente
   */
  const setCache = (key, data, ttl = 300000) => {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Generar clave de caché única
   */
  const generateCacheKey = (url, options = {}) => {
    const params = options.params || {}
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${url}${sortedParams ? '?' + sortedParams : ''}`
  }

  /**
   * Gestión de caché del servidor
   */
  const serverCache = {
    async getStats() {
      try {
        const response = await http.get('/api/cache/stats')
        return response.data
      } catch (error) {
        console.error('Error getting cache stats:', error)
        throw error
      }
    },

    async clearModule(module) {
      try {
        const response = await http.post(`/api/cache/clear/${module}`)
        notifications.add({
          type: 'success',
          title: 'Caché del servidor',
          message: response.data.message
        })
        return response.data
      } catch (error) {
        notifications.add({
          type: 'error',
          title: 'Error',
          message: 'No se pudo limpiar el caché del servidor'
        })
        throw error
      }
    },

    async flush() {
      try {
        const response = await http.post('/api/cache/flush')
        notifications.add({
          type: 'success',
          title: 'Caché del servidor',
          message: response.data.message
        })
        return response.data
      } catch (error) {
        notifications.add({
          type: 'error',
          title: 'Error',
          message: 'No se pudo limpiar el caché del servidor'
        })
        throw error
      }
    },

    async check(key) {
      try {
        const response = await http.post('/api/cache/check', { key })
        return response.data
      } catch (error) {
        console.error('Error checking cache:', error)
        throw error
      }
    }
  }

  return {
    // Métodos principales
    cachedFetch,
    invalidateCache,
    clearCache,
    
    // Gestión de caché
    hasCache,
    getCache,
    setCache,
    generateCacheKey,
    
    // Estadísticas
    getCacheStats,
    
    // Caché del servidor
    serverCache
  }
}
