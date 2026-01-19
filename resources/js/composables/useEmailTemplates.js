import { ref } from 'vue'
import http from '../utils/http'

// Cache global de plantillas y variables
const emailTemplatesCache = ref(new Map())
const substitutionVariablesCache = ref(new Map())
const allTemplatesLoaded = ref(false)
const allVariablesLoaded = ref(false)

export function useEmailTemplates() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Obtiene todas las plantillas de email con filtros opcionales
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.type_template - Tipo de plantilla (e.g., 'thirdparty', 'invoice', 'ticket')
   * @param {string} filters.lang - Código de idioma (e.g., 'es_ES', 'en_US')
   * @param {number} filters.enabled - Estado habilitado (0 o 1)
   * @param {number} filters.private - Estado privado (0=público, 1=privado)
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de plantillas de email
   */
  const getEmailTemplates = async (filters = {}, useCache = true) => {
    const cacheKey = JSON.stringify(filters)

    // Si se solicita caché y ya está cargado, retornar desde caché
    if (useCache && emailTemplatesCache.value.has(cacheKey)) {
      console.log('📧 Plantillas de email desde caché:', cacheKey)
      return emailTemplatesCache.value.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      console.log('📧 Cargando plantillas de email...', filters)

      const params = {}
      if (filters.type_template) params.type_template = filters.type_template
      if (filters.lang) params.lang = filters.lang
      if (filters.enabled !== undefined) params.enabled = filters.enabled
      if (filters.private !== undefined) params.private = filters.private

      console.log('📤 Parámetros enviados a la API:', params)
      console.log('🔗 URL completa:', '/api/doli/dolibarrmodernfrontendapi/emailtemplates')

      const response = await http.get('/api/doli/dolibarrmodernfrontendapi/emailtemplates', {
        params
      })

      // Manejar diferentes estructuras de respuesta
      let templates = []
      
      if (response.data && response.data.templates && Array.isArray(response.data.templates)) {
        // Estructura: { templates: [...], total_count: X }
        templates = response.data.templates
      } else if (Array.isArray(response.data)) {
        // Estructura: [...]
        templates = response.data
      } else if (response.data && typeof response.data === 'object') {
        // Si es un objeto, intentar extraer el array
        templates = Object.values(response.data).filter(item => 
          item && typeof item === 'object' && !Array.isArray(item)
        )
      }
      
      console.log(`✅ ${templates.length} plantillas de email cargadas`)
      if (templates.length > 0) {
        console.log('📋 Primera plantilla:', templates[0])
        console.log('📋 Label de primera plantilla:', templates[0].label)
      }

      // Guardar en caché
      emailTemplatesCache.value.set(cacheKey, templates)

      return templates

    } catch (err) {
      console.error('❌ Error cargando plantillas de email:', err)
      error.value = err.message || 'Error al cargar plantillas de email'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene todas las plantillas de email sin filtros (para caché completo)
   * @returns {Promise<Array>} - Array de todas las plantillas
   */
  const loadAllEmailTemplates = async () => {
    if (allTemplatesLoaded.value) {
      console.log('📧 Todas las plantillas ya están en caché')
      return emailTemplatesCache.value.get('all') || []
    }

    const templates = await getEmailTemplates({}, false)
    emailTemplatesCache.value.set('all', templates)
    allTemplatesLoaded.value = true

    return templates
  }

  /**
   * Obtiene plantillas de email por tipo
   * @param {string} type - Tipo de plantilla (e.g., 'ticket', 'invoice', 'thirdparty')
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de plantillas del tipo especificado
   */
  const getTemplatesByType = async (type, useCache = true) => {
    return await getEmailTemplates({ type_template: type }, useCache)
  }

  /**
   * Obtiene plantillas de email por idioma
   * @param {string} lang - Código de idioma (e.g., 'es_ES', 'en_US')
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de plantillas del idioma especificado
   */
  const getTemplatesByLanguage = async (lang, useCache = true) => {
    return await getEmailTemplates({ lang }, useCache)
  }

  /**
   * Obtiene solo plantillas habilitadas
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de plantillas habilitadas
   */
  const getEnabledTemplates = async (useCache = true) => {
    return await getEmailTemplates({ enabled: 1 }, useCache)
  }

  /**
   * Obtiene solo plantillas públicas
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de plantillas públicas
   */
  const getPublicTemplates = async (useCache = true) => {
    return await getEmailTemplates({ private: 0 }, useCache)
  }

  /**
   * Obtiene todas las variables de sustitución disponibles
   * @param {string} context - Contexto opcional (e.g., 'ticket', 'invoice', 'thirdparty', 'user', 'mycompany', 'global')
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de variables de sustitución
   */
  const getSubstitutionVariables = async (context = null, useCache = true) => {
    const cacheKey = context || 'all'

    // Si se solicita caché y ya está cargado, retornar desde caché
    if (useCache && substitutionVariablesCache.value.has(cacheKey)) {
      console.log('🔄 Variables de sustitución desde caché:', cacheKey)
      return substitutionVariablesCache.value.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Cargando variables de sustitución...', context ? `contexto: ${context}` : 'todas')

      const params = {}
      if (context) params.context = context

      const response = await http.get('/api/doli/dolibarrmodernfrontendapi/substitutionvariables', {
        params
      })

      const variables = response.data || []
      console.log(`✅ ${variables.length} variables de sustitución cargadas`)

      // Guardar en caché
      substitutionVariablesCache.value.set(cacheKey, variables)

      return variables

    } catch (err) {
      console.error('❌ Error cargando variables de sustitución:', err)
      error.value = err.message || 'Error al cargar variables de sustitución'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene todas las variables de sustitución sin filtros (para caché completo)
   * @returns {Promise<Array>} - Array de todas las variables
   */
  const loadAllSubstitutionVariables = async () => {
    if (allVariablesLoaded.value) {
      console.log('🔄 Todas las variables ya están en caché')
      return substitutionVariablesCache.value.get('all') || []
    }

    const variables = await getSubstitutionVariables(null, false)
    substitutionVariablesCache.value.set('all', variables)
    allVariablesLoaded.value = true

    return variables
  }

  /**
   * Obtiene variables de sustitución por contexto
   * @param {string} context - Contexto (e.g., 'ticket', 'invoice', 'thirdparty')
   * @param {boolean} useCache - Si debe usar caché (default: true)
   * @returns {Promise<Array>} - Array de variables del contexto especificado
   */
  const getVariablesByContext = async (context, useCache = true) => {
    return await getSubstitutionVariables(context, useCache)
  }

  /**
   * Busca una plantilla específica por ID en el caché
   * @param {number|string} templateId - ID de la plantilla
   * @returns {Object|null} - Plantilla encontrada o null
   */
  const findTemplateById = (templateId) => {
    if (!templateId) return null

    for (const templates of emailTemplatesCache.value.values()) {
      const found = templates.find(t => String(t.id) === String(templateId))
      if (found) return found
    }

    return null
  }

  /**
   * Busca plantillas por nombre o etiqueta
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} - Array de plantillas que coinciden
   */
  const searchTemplates = (searchTerm) => {
    if (!searchTerm) return []

    const term = searchTerm.toLowerCase()
    const results = []

    for (const templates of emailTemplatesCache.value.values()) {
      const matches = templates.filter(t => 
        (t.label && t.label.toLowerCase().includes(term)) ||
        (t.topic && t.topic.toLowerCase().includes(term)) ||
        (t.type_template && t.type_template.toLowerCase().includes(term))
      )
      results.push(...matches)
    }

    // Eliminar duplicados
    return [...new Map(results.map(t => [t.id, t])).values()]
  }

  /**
   * Limpia el caché de plantillas de email
   */
  const clearTemplatesCache = () => {
    console.log('🗑️ Limpiando caché de plantillas de email...')
    emailTemplatesCache.value.clear()
    allTemplatesLoaded.value = false
  }

  /**
   * Limpia el caché de variables de sustitución
   */
  const clearVariablesCache = () => {
    console.log('🗑️ Limpiando caché de variables de sustitución...')
    substitutionVariablesCache.value.clear()
    allVariablesLoaded.value = false
  }

  /**
   * Limpia todo el caché (plantillas y variables)
   */
  const clearAllCache = () => {
    clearTemplatesCache()
    clearVariablesCache()
  }

  /**
   * Obtiene estadísticas del caché
   * @returns {Object} - Objeto con estadísticas
   */
  const getCacheStats = () => {
    return {
      templatesKeys: emailTemplatesCache.value.size,
      variablesKeys: substitutionVariablesCache.value.size,
      allTemplatesLoaded: allTemplatesLoaded.value,
      allVariablesLoaded: allVariablesLoaded.value
    }
  }

  return {
    // Estado
    loading,
    error,

    // Plantillas de email
    getEmailTemplates,
    loadAllEmailTemplates,
    getTemplatesByType,
    getTemplatesByLanguage,
    getEnabledTemplates,
    getPublicTemplates,
    findTemplateById,
    searchTemplates,

    // Variables de sustitución
    getSubstitutionVariables,
    loadAllSubstitutionVariables,
    getVariablesByContext,

    // Gestión de caché
    clearTemplatesCache,
    clearVariablesCache,
    clearAllCache,
    getCacheStats
  }
}
