import { ref } from 'vue'
import http from '../utils/http'

// Cache global de terceros
const thirdpartiesCache = ref(new Map())
const loadingThirdparties = ref(new Set())
const allThirdpartiesLoaded = ref(false)

export function useThirdparties() {
  /**
   * Carga TODOS los terceros activos y los guarda en caché
   * @returns {Promise<Map>} - Map con todos los terceros
   */
  const loadAllThirdparties = async () => {
    // Si ya están cargados, retornar caché
    if (allThirdpartiesLoaded.value) {
      console.log('🏢 Terceros ya están en caché:', thirdpartiesCache.value.size)
      return thirdpartiesCache.value
    }

    try {
      console.log('🏢 Cargando TODOS los terceros activos...')
      
      const response = await http.get('/api/doli/thirdparties', {
        params: {
          limit: 5000, // Límite alto para obtener todos
          sortfield: 't.nom',
          sortorder: 'ASC',
          sqlfilters: '(t.status:=:1)' // Solo activos
        }
      })

      const thirdparties = response.data || []
      console.log(`✅ ${thirdparties.length} terceros cargados desde API`)

      // Guardar todos en caché
      thirdparties.forEach(tp => {
        const thirdparty = {
          id: tp.id,
          name: tp.name,
          name_alias: tp.name_alias,
          email: tp.email,
          phone: tp.phone,
          address: tp.address,
          zip: tp.zip,
          town: tp.town,
          country_code: tp.country_code,
          client: tp.client,
          displayName: tp.name || tp.name_alias || `Cliente #${tp.id}`
        }
        thirdpartiesCache.value.set(String(tp.id), thirdparty)
      })

      allThirdpartiesLoaded.value = true
      console.log(`💾 ${thirdpartiesCache.value.size} terceros guardados en caché`)

      return thirdpartiesCache.value

    } catch (error) {
      console.error('❌ Error cargando todos los terceros:', error)
      return thirdpartiesCache.value
    }
  }

  /**
   * Obtiene un tercero por ID desde el caché (solo lectura)
   * @param {number|string} thirdpartyId - ID del tercero
   * @returns {Object|null} - Datos del tercero o null si no existe en caché
   */
  const getThirdpartyById = (thirdpartyId) => {
    if (!thirdpartyId || thirdpartyId === '0') return null

    const id = String(thirdpartyId)

    // Buscar en caché
    return thirdpartiesCache.value.get(id) || null
  }

  /**
   * Obtiene el nombre de un tercero por ID desde caché
   * @param {number|string} thirdpartyId - ID del tercero
   * @returns {string} - Nombre del tercero o fallback
   */
  const getThirdpartyName = (thirdpartyId) => {
    const thirdparty = getThirdpartyById(thirdpartyId)
    return thirdparty?.displayName || `Cliente #${thirdpartyId}`
  }

  /**
   * Carga múltiples terceros en paralelo
   * @param {Array<number|string>} thirdpartyIds - Array de IDs de terceros
   * @returns {Promise<Map>} - Map con los terceros cargados
   */
  const loadThirdparties = async (thirdpartyIds) => {
    if (!thirdpartyIds || thirdpartyIds.length === 0) return new Map()

    // Filtrar IDs únicos y válidos
    const uniqueIds = [...new Set(thirdpartyIds.filter(id => id && id !== '0'))]
    
    if (uniqueIds.length === 0) return new Map()
    
    console.log(`🏢 Cargando ${uniqueIds.length} terceros...`)

    // Cargar todos en paralelo con Promise.allSettled
    const promises = uniqueIds.map(id => getThirdpartyById(id))
    const results = await Promise.allSettled(promises)

    // Contar éxitos y fallos
    const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length
    const failed = results.length - successful

    // Retornar Map con los resultados exitosos
    const result = new Map()
    uniqueIds.forEach(id => {
      const thirdparty = thirdpartiesCache.value.get(String(id))
      if (thirdparty) {
        result.set(String(id), thirdparty)
      }
    })

    console.log(`✅ ${successful} terceros cargados, ${failed} fallidos/no encontrados`)
    return result
  }

  /**
   * Precarga terceros desde un array de objetos que tienen socid o fk_soc
   * @param {Array<Object>} items - Array de objetos (facturas, tickets, etc)
   * @param {string} fieldName - Nombre del campo ('socid', 'fk_soc', etc)
   * @returns {Promise<void>}
   */
  const preloadThirdpartiesFromItems = async (items, fieldName = 'socid') => {
    if (!items || items.length === 0) return

    const thirdpartyIds = items
      .map(item => item[fieldName])
      .filter(id => id && id !== '0')

    if (thirdpartyIds.length > 0) {
      await loadThirdparties(thirdpartyIds)
    }
  }

  /**
   * Limpia el caché de terceros
   */
  const clearThirdpartiesCache = () => {
    console.log('🗑️ Limpiando caché de terceros...')
    thirdpartiesCache.value.clear()
    loadingThirdparties.value.clear()
  }

  /**
   * Obtiene el caché completo de terceros
   * @returns {Map} - Map con todos los terceros en caché
   */
  const getThirdpartiesCache = () => {
    return thirdpartiesCache.value
  }

  return {
    loadAllThirdparties,
    getThirdpartyById,
    getThirdpartyName,
    loadThirdparties,
    preloadThirdpartiesFromItems,
    clearThirdpartiesCache,
    getThirdpartiesCache
  }
}
