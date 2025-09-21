import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import http from '../utils/http'

// Store para manejar las intervenciones del usuario
export const useUserInterventionsStore = defineStore('userInterventions', {
  state: () => ({
    interventions: [],
    loading: false,
    lastFetch: null
  }),

  persist: {
    key: 'dolibarr-user-interventions',
    storage: localStorage,
    paths: ['interventions', 'lastFetch']
  },

  getters: {
    // Obtener intervenciones relacionadas con un ticket específico
    getInterventionsByTicket: (state) => (ticketId) => {
      if (!ticketId) return []
      
      return state.interventions.filter(intervention => {
        // Verificar si el ticket está en linkedObjectsIds
        if (intervention.linkedObjectsIds && intervention.linkedObjectsIds.ticket) {
          return intervention.linkedObjectsIds.ticket.includes(ticketId.toString())
        }
        return false
      })
    },

    // Obtener todas las intervenciones del usuario
    getAllInterventions: (state) => state.interventions,

    // Verificar si hay intervenciones cargadas
    hasInterventions: (state) => state.interventions.length > 0
  },

  actions: {
    async fetchUserInterventions(userId) {
      if (!userId) {
        console.warn('No se puede cargar intervenciones sin ID de usuario')
        return
      }

      this.loading = true
      
      try {
        // Construir la URL con los parámetros necesarios
        const params = new URLSearchParams({
          sortfield: 't.rowid',
          sortorder: 'DESC',
          limit: '1000',
          sqlfilters: `(t.fk_user_author:=:${userId})`,
          properties: 'id,linkedObjectsIds,ref,status,duration,datee,datem,desc,lines,desc'
        })

        const response = await http.get(`/api/doli/interventions?${params.toString()}`)
         console.log('API Response:', response)
        
        this.interventions = response.data || []
        this.lastFetch = new Date().toISOString()
        
         console.log(`Cargadas ${this.interventions.length} intervenciones para el usuario ${userId}`)
        
        return this.interventions
      } catch (error) {
        console.error('Error al cargar intervenciones del usuario:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Limpiar intervenciones (útil al hacer logout)
    clearInterventions() {
      this.interventions = []
      this.lastFetch = null
      localStorage.removeItem('dolibarr-user-interventions')
    },

    // Verificar si necesita actualizar las intervenciones (cada 30 minutos)
    shouldRefresh() {
      if (!this.lastFetch) return true
      
      const lastFetchTime = new Date(this.lastFetch)
      const now = new Date()
      const diffMinutes = (now - lastFetchTime) / (1000 * 60)
      
      return diffMinutes > 30
    },

    // Refrescar intervenciones si es necesario
    async refreshIfNeeded(userId) {
      if (this.shouldRefresh()) {
        await this.fetchUserInterventions(userId)
      }
    }
  }
})

// Composable para usar las intervenciones del usuario
export function useUserInterventions() {
  const store = useUserInterventionsStore()
  
  // Cargar intervenciones del usuario
  const loadUserInterventions = async (userId) => {
    return await store.fetchUserInterventions(userId)
  }

  // Obtener intervenciones por ticket
  const getInterventionsByTicket = (ticketId) => {
    return store.getInterventionsByTicket(ticketId)
  }

  // Obtener todas las intervenciones
  const getAllInterventions = computed(() => store.getAllInterventions)

  // Estado de carga
  const loading = computed(() => store.loading)

  // Verificar si hay intervenciones
  const hasInterventions = computed(() => store.hasInterventions)

  // Limpiar intervenciones
  const clearInterventions = () => {
    store.clearInterventions()
  }

  // Refrescar si es necesario
  const refreshIfNeeded = async (userId) => {
    return await store.refreshIfNeeded(userId)
  }

  return {
    // Métodos
    loadUserInterventions,
    getInterventionsByTicket,
    clearInterventions,
    refreshIfNeeded,
    
    // Computed
    interventions: getAllInterventions,
    loading,
    hasInterventions
  }
}
