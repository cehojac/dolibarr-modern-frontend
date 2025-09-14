import { ref, reactive } from 'vue'

// Global cache store
const cache = reactive(new Map())
const cacheTimestamps = reactive(new Map())

export function useCache(defaultTTL = 5 * 60 * 1000) { // 5 minutes default TTL
  
  const isExpired = (key, ttl = defaultTTL) => {
    const timestamp = cacheTimestamps.get(key)
    if (!timestamp) return true
    return Date.now() - timestamp > ttl
  }

  const get = (key, ttl = defaultTTL) => {
    if (!cache.has(key) || isExpired(key, ttl)) {
      return null
    }
    return cache.get(key)
  }

  const set = (key, value) => {
    cache.set(key, value)
    cacheTimestamps.set(key, Date.now())
  }

  const remove = (key) => {
    cache.delete(key)
    cacheTimestamps.delete(key)
  }

  const clear = () => {
    cache.clear()
    cacheTimestamps.clear()
  }

  const has = (key, ttl = defaultTTL) => {
    return cache.has(key) && !isExpired(key, ttl)
  }

  // Cache with automatic fetch
  const cachedFetch = async (key, fetchFn, ttl = defaultTTL) => {
    // Check if we have valid cached data
    if (has(key, ttl)) {
      return get(key, ttl)
    }

    try {
      // Fetch new data
      const data = await fetchFn()
      set(key, data)
      return data
    } catch (error) {
      // If fetch fails and we have expired data, return it
      if (cache.has(key)) {
        return cache.get(key)
      }
      throw error
    }
  }

  // Reactive cached data with loading state
  const useCachedData = (key, fetchFn, ttl = defaultTTL) => {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const load = async (force = false) => {
      if (!force && has(key, ttl)) {
        data.value = get(key, ttl)
        return data.value
      }

      loading.value = true
      error.value = null

      try {
        const result = await fetchFn()
        set(key, result)
        data.value = result
        return result
      } catch (err) {
        error.value = err
        // If fetch fails and we have expired data, use it
        if (cache.has(key)) {
          data.value = cache.get(key)
        }
        throw err
      } finally {
        loading.value = false
      }
    }

    const refresh = () => load(true)

    // Load initial data if available in cache
    if (has(key, ttl)) {
      data.value = get(key, ttl)
    }

    return {
      data,
      loading,
      error,
      load,
      refresh
    }
  }

  // Generate cache key from object/array
  const generateKey = (prefix, params = {}) => {
    const paramString = JSON.stringify(params, Object.keys(params).sort())
    return `${prefix}:${btoa(paramString)}`
  }

  return {
    get,
    set,
    remove,
    clear,
    has,
    isExpired,
    cachedFetch,
    useCachedData,
    generateKey
  }
}
