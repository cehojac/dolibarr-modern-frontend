import { ref } from 'vue'
import http from '../utils/http'

// Cache global para extrafields
const extrafieldsCache = ref({})
const loadingExtrafields = ref({})

/**
 * Composable para gestionar extrafields de Dolibarr
 */
export function useExtrafields() {
  /**
   * Obtiene los extrafields de un elemento específico
   * @param {string} elementType - Tipo de elemento (thirdparty, contact, product, etc.)
   * @returns {Promise<Object>} Extrafields del elemento
   */
  const getExtrafields = async (elementType) => {
    // Si ya está en caché, retornar
    if (extrafieldsCache.value[elementType]) {
      console.log(`✅ Extrafields de ${elementType} obtenidos desde caché`)
      return extrafieldsCache.value[elementType]
    }

    // Si ya se está cargando, esperar
    if (loadingExtrafields.value[elementType]) {
      console.log(`⏳ Esperando carga de extrafields de ${elementType}...`)
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (extrafieldsCache.value[elementType]) {
            clearInterval(checkInterval)
            resolve(extrafieldsCache.value[elementType])
          }
        }, 100)
      })
    }

    try {
      loadingExtrafields.value[elementType] = true
      console.log(`🔄 Cargando extrafields de ${elementType}...`)

      const response = await http.get('/api/doli/setup/extrafields', {
        params: { elementtype: elementType }
      })

      // Guardar en caché
      extrafieldsCache.value[elementType] = response.data || {}
      console.log(`✅ Extrafields de ${elementType} cargados:`, response.data)
      
      // Log detallado de cada campo
      Object.entries(response.data || {}).forEach(([key, config]) => {
        console.log(`📋 Campo: ${key}`, {
          label: config.label,
          type: config.type,
          param: config.param,
          required: config.required
        })
      })

      return extrafieldsCache.value[elementType]
    } catch (error) {
      console.error(`❌ Error cargando extrafields de ${elementType}:`, error)
      return {}
    } finally {
      loadingExtrafields.value[elementType] = false
    }
  }

  /**
   * Formatea el valor de un extrafield según su tipo
   * @param {any} value - Valor del extrafield
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string|Promise<string>} Valor formateado (puede ser una promesa para sellist)
   */
  const formatExtrafieldValue = async (value, fieldConfig) => {
    if (!value && value !== 0) return '-'

    const type = fieldConfig?.type || 'varchar'

    switch (type) {
      case 'date':
        // Convertir timestamp a fecha
        const date = new Date(value * 1000)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })

      case 'datetime':
        // Convertir timestamp a fecha y hora
        const datetime = new Date(value * 1000)
        return datetime.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })

      case 'boolean':
      case 'checkbox':
        return value === '1' || value === 1 ? 'Sí' : 'No'

      case 'double':
      case 'price':
        return parseFloat(value).toFixed(2)

      case 'int':
      case 'integer':
        return parseInt(value).toString()

      case 'select':
        // Si hay opciones disponibles, buscar la etiqueta
        if (fieldConfig.param && fieldConfig.param[value]) {
          return fieldConfig.param[value]
        }
        return value

      case 'sellist':
        // Para sellist, obtener el nombre del elemento relacionado
        const param = fieldConfig?.param
        
        // Verificar si es una referencia a societe (thirdparty)
        if (param && (param.includes('societe') || param.includes('thirdparty'))) {
          try {
            const response = await http.get(`/api/doli/thirdparties/${value}`)
            return response.data?.name || value
          } catch (error) {
            console.error(`Error obteniendo nombre de tercero ${value}:`, error)
            return value
          }
        }
        
        // Verificar si es una referencia a contact
        if (param && param.includes('contact')) {
          try {
            const response = await http.get(`/api/doli/contacts/${value}`)
            return `${response.data?.firstname || ''} ${response.data?.lastname || ''}`.trim() || value
          } catch (error) {
            console.error(`Error obteniendo nombre de contacto ${value}:`, error)
            return value
          }
        }
        
        // Verificar si es una referencia a user
        if (param && param.includes('user')) {
          try {
            const response = await http.get(`/api/doli/users/${value}`)
            return `${response.data?.firstname || ''} ${response.data?.lastname || ''}`.trim() || value
          } catch (error) {
            console.error(`Error obteniendo nombre de usuario ${value}:`, error)
            return value
          }
        }
        
        // Si no se puede resolver, devolver el valor
        return value

      case 'link':
        // Para campos de tipo link, mostrar el ID o nombre
        if (typeof value === 'object' && value.label) {
          return value.label
        }
        return value

      case 'text':
      case 'html':
        // Para textos largos, limitar caracteres
        const textValue = String(value)
        if (textValue.length > 100) {
          return textValue.substring(0, 100) + '...'
        }
        return textValue

      case 'varchar':
      case 'mail':
      case 'phone':
      case 'url':
      default:
        return String(value)
    }
  }

  /**
   * Obtiene el tipo de input apropiado para un extrafield
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} Tipo de input HTML
   */
  const getInputType = (fieldConfig) => {
    const type = fieldConfig?.type || 'varchar'

    switch (type) {
      case 'date':
        return 'date'
      case 'datetime':
        return 'datetime-local'
      case 'int':
      case 'integer':
      case 'double':
      case 'price':
        return 'number'
      case 'mail':
        return 'email'
      case 'phone':
        return 'tel'
      case 'url':
        return 'url'
      case 'boolean':
      case 'checkbox':
        return 'checkbox'
      case 'text':
      case 'html':
        return 'textarea'
      case 'select':
      case 'sellist':
        return 'select'
      default:
        return 'text'
    }
  }

  /**
   * Obtiene el icono apropiado para un tipo de extrafield
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {string} Nombre del icono
   */
  const getFieldIcon = (fieldConfig) => {
    const type = fieldConfig?.type || 'varchar'

    const icons = {
      'date': 'calendar',
      'datetime': 'clock',
      'boolean': 'check-circle',
      'checkbox': 'check-square',
      'double': 'hash',
      'price': 'currency-dollar',
      'int': 'hash',
      'integer': 'hash',
      'select': 'selector',
      'sellist': 'list',
      'link': 'link',
      'text': 'document-text',
      'html': 'code',
      'mail': 'mail',
      'phone': 'phone',
      'url': 'globe',
      'varchar': 'pencil'
    }

    return icons[type] || 'pencil'
  }

  /**
   * Valida un valor de extrafield según su tipo
   * @param {any} value - Valor a validar
   * @param {Object} fieldConfig - Configuración del campo
   * @returns {Object} { valid: boolean, error: string }
   */
  const validateExtrafieldValue = (value, fieldConfig) => {
    // Si el campo es requerido y está vacío
    if (fieldConfig.required && (!value && value !== 0)) {
      return {
        valid: false,
        error: 'Este campo es requerido'
      }
    }

    const type = fieldConfig?.type || 'varchar'

    switch (type) {
      case 'mail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          return {
            valid: false,
            error: 'Email no válido'
          }
        }
        break

      case 'url':
        try {
          if (value) new URL(value)
        } catch {
          return {
            valid: false,
            error: 'URL no válida'
          }
        }
        break

      case 'int':
      case 'integer':
        if (value && !Number.isInteger(Number(value))) {
          return {
            valid: false,
            error: 'Debe ser un número entero'
          }
        }
        break

      case 'double':
      case 'price':
        if (value && isNaN(Number(value))) {
          return {
            valid: false,
            error: 'Debe ser un número válido'
          }
        }
        break
    }

    return { valid: true, error: null }
  }

  /**
   * Limpia la caché de extrafields
   * @param {string} elementType - Tipo de elemento (opcional, si no se especifica limpia todo)
   */
  const clearCache = (elementType = null) => {
    if (elementType) {
      delete extrafieldsCache.value[elementType]
      console.log(`🗑️ Caché de extrafields de ${elementType} limpiada`)
    } else {
      extrafieldsCache.value = {}
      console.log('🗑️ Toda la caché de extrafields limpiada')
    }
  }

  return {
    // Métodos
    getExtrafields,
    formatExtrafieldValue,
    getInputType,
    getFieldIcon,
    validateExtrafieldValue,
    clearCache,

    // Estado
    extrafieldsCache,
    loadingExtrafields
  }
}
