import { ref } from 'vue'
import http from '../utils/http'

// Cache global de proyectos
const projectsCache = ref(new Map())
const loadingProjects = ref(new Set())

export function useProjects() {
  /**
   * Obtiene un proyecto por ID con caché
   * @param {number|string} projectId - ID del proyecto
   * @returns {Promise<Object|null>} - Datos del proyecto o null si no existe
   */
  const getProjectById = async (projectId) => {
    if (!projectId || projectId === '0') return null

    const id = String(projectId)

    // Si ya está en caché, retornar inmediatamente
    if (projectsCache.value.has(id)) {
      console.log(`📁 Proyecto ${id} obtenido desde caché`)
      return projectsCache.value.get(id)
    }

    // Si ya se está cargando, esperar a que termine
    if (loadingProjects.value.has(id)) {
      console.log(`⏳ Esperando carga del proyecto ${id}...`)
      // Esperar hasta que termine de cargar
      while (loadingProjects.value.has(id)) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return projectsCache.value.get(id) || null
    }

    // Marcar como cargando
    loadingProjects.value.add(id)

    try {
      console.log(`📁 Cargando proyecto ${id} desde API...`)
      
      // Crear timeout de 3 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const response = await http.get(`/api/doli/projects/${id}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.data) {
        const project = {
          id: response.data.id,
          ref: response.data.ref,
          title: response.data.title || response.data.label,
          label: response.data.label,
          description: response.data.description,
          fk_soc: response.data.fk_soc,
          public: response.data.public,
          status: response.data.fk_statut,
          // Nombre para mostrar (prioridad: ref > title > label)
          name: response.data.ref || response.data.title || response.data.label || `Proyecto #${id}`
        }

        // Guardar en caché
        projectsCache.value.set(id, project)
        console.log(`✅ Proyecto ${id} cargado:`, project.name)
        
        return project
      }

      return null
    } catch (error) {
      // Silenciar errores de timeout y 404
      if (error.name === 'AbortError') {
        console.warn(`⏱️ Timeout cargando proyecto ${id}`)
      } else if (error.response?.status === 404) {
        console.warn(`⚠️ Proyecto ${id} no encontrado`)
      } else {
        console.warn(`⚠️ Error cargando proyecto ${id}:`, error.message)
      }
      
      // Guardar null en caché para evitar reintentos
      projectsCache.value.set(id, null)
      return null
    } finally {
      // Remover de la lista de carga
      loadingProjects.value.delete(id)
    }
  }

  /**
   * Obtiene el nombre de un proyecto por ID
   * @param {number|string} projectId - ID del proyecto
   * @returns {Promise<string>} - Nombre del proyecto o fallback
   */
  const getProjectName = async (projectId) => {
    const project = await getProjectById(projectId)
    return project?.name || `Proyecto #${projectId}`
  }

  /**
   * Carga múltiples proyectos en paralelo
   * @param {Array<number|string>} projectIds - Array de IDs de proyectos
   * @returns {Promise<Map>} - Map con los proyectos cargados
   */
  const loadProjects = async (projectIds) => {
    if (!projectIds || projectIds.length === 0) return new Map()

    // Filtrar IDs únicos y válidos
    const uniqueIds = [...new Set(projectIds.filter(id => id && id !== '0'))]
    
    if (uniqueIds.length === 0) return new Map()
    
    console.log(`📁 Cargando ${uniqueIds.length} proyectos...`)

    // Cargar todos en paralelo con Promise.allSettled para no fallar si alguno falla
    const promises = uniqueIds.map(id => getProjectById(id))
    const results = await Promise.allSettled(promises)

    // Contar éxitos y fallos
    const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length
    const failed = results.length - successful

    // Retornar Map con los resultados exitosos
    const result = new Map()
    uniqueIds.forEach(id => {
      const project = projectsCache.value.get(String(id))
      if (project) {
        result.set(String(id), project)
      }
    })

    console.log(`✅ ${successful} proyectos cargados, ${failed} fallidos/no encontrados`)
    return result
  }

  /**
   * Limpia el caché de proyectos
   */
  const clearProjectsCache = () => {
    console.log('🗑️ Limpiando caché de proyectos...')
    projectsCache.value.clear()
    loadingProjects.value.clear()
  }

  /**
   * Obtiene el caché completo de proyectos
   * @returns {Map} - Map con todos los proyectos en caché
   */
  const getProjectsCache = () => {
    return projectsCache.value
  }

  /**
   * Precarga proyectos desde un array de objetos que tienen fk_project
   * @param {Array<Object>} items - Array de objetos (tickets, tareas, etc)
   * @returns {Promise<void>}
   */
  const preloadProjectsFromItems = async (items) => {
    if (!items || items.length === 0) return

    const projectIds = items
      .map(item => item.fk_project)
      .filter(id => id && id !== '0')

    if (projectIds.length > 0) {
      await loadProjects(projectIds)
    }
  }

  return {
    getProjectById,
    getProjectName,
    loadProjects,
    clearProjectsCache,
    getProjectsCache,
    preloadProjectsFromItems
  }
}
