import { defineStore } from 'pinia'
import http from '../utils/http'
import { useNotificationStore } from './notifications'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: false
  }),

  persist: {
    key: 'dolibarr-auth',
    storage: localStorage,
    paths: ['isAuthenticated', 'user'],
    beforeRestore: (context) => {
      console.log('Restaurando sesión desde localStorage')
    },
    afterRestore: (context) => {
      console.log('Sesión restaurada:', context.store.isAuthenticated)
    }
  },

  actions: {
    async login(login, password) {
      this.loading = true
      const notificationStore = useNotificationStore()
      
      try {
        const response = await http.post('/api/auth/login', { login, password })
        this.isAuthenticated = true
        this.user = response.data.user
        notificationStore.addNotification('success', 'Sesión iniciada', `Bienvenido ${response.data.user.firstname || response.data.user.login}`)
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const notificationStore = useNotificationStore()
      
      try {
        await http.post('/api/auth/logout')
        notificationStore.addNotification('info', 'Sesión cerrada', 'Has cerrado sesión correctamente')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isAuthenticated = false
        this.user = null
        // Limpiar localStorage
        localStorage.removeItem('dolibarr-auth')
      }
    },

    async checkAuth() {
      try {
        const response = await http.get('/api/auth/me')
        this.isAuthenticated = response.data.authenticated
        this.user = response.data.user
        
        // Si no está autenticado en el servidor, limpiar localStorage
        if (!response.data.authenticated) {
          this.isAuthenticated = false
          this.user = null
          localStorage.removeItem('dolibarr-auth')
        }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        localStorage.removeItem('dolibarr-auth')
      }
    },

    // Método para inicializar la sesión desde localStorage
    initializeFromStorage() {
      const stored = localStorage.getItem('dolibarr-auth')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          if (data.isAuthenticated && data.user) {
            this.isAuthenticated = data.isAuthenticated
            this.user = data.user
            // Verificar con el servidor si la sesión sigue válida
            this.checkAuth()
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error)
          localStorage.removeItem('dolibarr-auth')
        }
      }
    }
  }
})
