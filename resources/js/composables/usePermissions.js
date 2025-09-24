import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import http from '../utils/http'

// Store para manejar los permisos del usuario
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    loading: false,
    lastFetch: null
  }),

  persist: {
    key: 'dolibarr-permissions',
    storage: localStorage,
    paths: ['permissions', 'lastFetch'],
    beforeRestore: (context) => {
      // console.log('Restaurando permisos desde localStorage')
    },
    afterRestore: (context) => {
      // console.log('Permisos restaurados:', context.store.permissions.length)
    }
  },

  getters: {
    // Verificar si el usuario tiene un permiso específico
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    },

    // Verificar si el usuario tiene alguno de los permisos especificados
    hasAnyPermission: (state) => (permissions) => {
      if (!Array.isArray(permissions)) return false
      return permissions.some(permission => state.permissions.includes(permission))
    },

    // Verificar si el usuario tiene todos los permisos especificados
    hasAllPermissions: (state) => (permissions) => {
      if (!Array.isArray(permissions)) return false
      return permissions.every(permission => state.permissions.includes(permission))
    },

    // Obtener todos los permisos
    getAllPermissions: (state) => state.permissions,

    // Verificar si hay permisos cargados
    hasPermissions: (state) => state.permissions.length > 0
  },

  actions: {
    async fetchPermissions() {
      this.loading = true
      
      try {
        console.log('🔐 Solicitando permisos del usuario...')
        const response = await http.get('/api/auth/permissions')
        
        console.log('✅ Respuesta completa de la API de permisos:', response.data)
        
        // Los permisos pueden venir en diferentes campos según la implementación
        this.permissions = response.data.permissions || response.data.rights || []
        this.lastFetch = new Date().toISOString()
        
        console.log(`✅ Cargados ${this.permissions.length} permisos del usuario:`)
        console.log('📋 Primeros 20 permisos:', this.permissions.slice(0, 20))
        console.log('🔍 Buscando permisos específicos:')
        const testPermissions = ['societe->lire', 'ticket->lire', 'projet->lire', 'facture->lire']
        testPermissions.forEach(perm => {
          const found = this.permissions.includes(perm)
          console.log(`  - ${perm}: ${found ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}`)
        })
        
        // Buscar todos los permisos relacionados con tickets
        console.log('🎫 Permisos relacionados con tickets:')
        const ticketPermissions = this.permissions.filter(perm => perm.includes('ticket'))
        if (ticketPermissions.length > 0) {
          ticketPermissions.forEach(perm => console.log(`  - ${perm}`))
        } else {
          console.log('  - ❌ No se encontraron permisos de tickets')
        }
        
        return this.permissions
      } catch (error) {
        console.error('❌ Error al cargar permisos del usuario:', error)
        
        // Información adicional de debugging
        if (error.response) {
          console.error('❌ Status:', error.response.status)
          console.error('❌ Headers:', error.response.headers)
          console.error('❌ Data:', error.response.data)
        } else if (error.request) {
          console.error('❌ Request:', error.request)
        } else if (error.isHTMLResponse) {
          console.error('❌ Recibida respuesta HTML en lugar de JSON - problema de configuración del servidor')
          console.error('🔄 Limpiando estado y requiriendo nuevo login...')
          
          // Limpiar localStorage también
          localStorage.removeItem('dolibarr-permissions')
          
          // Limpiar auth store y redirigir
          const authStore = useAuthStore()
          authStore.isAuthenticated = false
          authStore.user = null
          localStorage.removeItem('dolibarr-auth')
          
          // Mostrar mensaje específico para problema de producción
          const notificationStore = useNotificationStore()
          notificationStore.addNotification('error', 'Error de Sesión', 'Problema de configuración en producción. Por favor, inicia sesión nuevamente.')
          
          // Redirigir al login
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
        
        this.permissions = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkPermission(permission) {
      try {
        const response = await http.post('/api/auth/check-permission', {
          permission: permission
        })
        
        return response.data.granted || false
      } catch (error) {
        console.error('Error al verificar permiso:', error)
        return false
      }
    },

    // Limpiar permisos (útil al hacer logout)
    clearPermissions() {
      this.permissions = []
      this.lastFetch = null
      // Limpiar también del localStorage
      localStorage.removeItem('dolibarr-permissions')
    },

    // Verificar si necesita actualizar los permisos (cada 15 minutos)
    shouldRefresh() {
      if (!this.lastFetch) return true
      
      const lastFetchTime = new Date(this.lastFetch)
      const now = new Date()
      const diffMinutes = (now - lastFetchTime) / (1000 * 60)
      
      return diffMinutes > 15
    },

    // Refrescar permisos si es necesario
    async refreshIfNeeded() {
      if (this.shouldRefresh()) {
        await this.fetchPermissions()
      }
    }
  }
})

// Composable para usar los permisos del usuario
export function usePermissions() {
  const store = usePermissionsStore()
  
  // Cargar permisos del usuario
  const loadPermissions = async () => {
    return await store.fetchPermissions()
  }

  // Verificar un permiso específico
  const hasPermission = (permission) => {
    return store.hasPermission(permission)
  }

  // Verificar múltiples permisos (OR)
  const hasAnyPermission = (permissions) => {
    return store.hasAnyPermission(permissions)
  }

  // Verificar múltiples permisos (AND)
  const hasAllPermissions = (permissions) => {
    return store.hasAllPermissions(permissions)
  }

  // Verificar permiso de forma asíncrona (consulta al servidor)
  const checkPermission = async (permission) => {
    return await store.checkPermission(permission)
  }

  // Obtener todos los permisos
  const permissions = computed(() => store.getAllPermissions)

  // Estado de carga
  const loading = computed(() => store.loading)

  // Verificar si hay permisos
  const hasPermissions = computed(() => store.hasPermissions)

  // Limpiar permisos
  const clearPermissions = () => {
    store.clearPermissions()
  }

  // Refrescar si es necesario
  const refreshIfNeeded = async () => {
    return await store.refreshIfNeeded()
  }

  // Función helper para verificar permisos comunes de Dolibarr
  const canAccess = {
    // Permisos de usuarios
    users: {
      read: () => hasPermission('user->user->lire'),
      write: () => hasPermission('user->user->creer'),
      delete: () => hasPermission('user->user->supprimer')
    },
    
    // Permisos de terceros
    thirdparties: {
      read: () => hasPermission('societe->lire'),
      write: () => hasPermission('societe->creer'),
      delete: () => hasPermission('societe->supprimer')
    },
    
    // Permisos de tickets
    tickets: {
      read: () => hasPermission('ticket->lire'),
      write: () => hasPermission('ticket->creer'),
      delete: () => hasPermission('ticket->supprimer')
    },
    
    // Permisos de intervenciones
    interventions: {
      read: () => hasPermission('ficheinter->lire'),
      write: () => hasPermission('ficheinter->creer'),
      delete: () => hasPermission('ficheinter->supprimer')
    },
    
    // Permisos de administración
    admin: {
      access: () => hasPermission('user->user->configurer') || hasAnyPermission(['admin', 'superadmin'])
    }
  }

  return {
    // Métodos
    loadPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermission,
    clearPermissions,
    refreshIfNeeded,
    
    // Computed
    permissions,
    loading,
    hasPermissions,
    
    // Helpers
    canAccess
  }
}
