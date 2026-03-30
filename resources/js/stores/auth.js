import { defineStore } from 'pinia'
import http from '../utils/http'
import { useNotificationStore } from './notifications'
import { useUserInterventionsStore } from '../composables/useUserInterventions'
import { usePermissionsStore } from '../composables/usePermissions'
import { loadInitialCounters } from '../utils/loadInitialCounters'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    isLoggingOut: false,
    loginStep: null, // 'authenticating', 'loading_permissions', 'loading_data', 'complete'
    loginProgress: 0 // 0-100
  }),

  persist: {
    key: 'dolibarr-auth',
    storage: localStorage,
    paths: ['isAuthenticated', 'user'],
    beforeRestore: (context) => {
       // console.log('Restaurando sesión desde localStorage')
    },
    afterRestore: (context) => {
       // console.log('Sesión restaurada:', context.store.isAuthenticated)
    }
  },

  actions: {
    async login(login, password) {
      this.loading = true
      this.loginStep = null
      this.loginProgress = 0
      
      const notificationStore = useNotificationStore()
      const interventionsStore = useUserInterventionsStore()
      const permissionsStore = usePermissionsStore()
      
      try {
        // PASO 1: Autenticación
        this.loginStep = 'authenticating'
        this.loginProgress = 10
        console.log('🔐 PASO 1: Autenticando usuario...')
        
        const response = await http.post('/api/auth/login', { login, password })
        
        if (!response.data.user) {
          throw new Error('No se recibieron datos del usuario')
        }
        
        this.isAuthenticated = true
        this.user = response.data.user
        this.loginProgress = 25
        console.log('✅ PASO 1 COMPLETADO: Usuario autenticado')
        
        // PASO 2: Cargar Permisos
        this.loginStep = 'loading_permissions'
        this.loginProgress = 30
        console.log('🔑 PASO 2: Cargando permisos del usuario...')
        
        // Pausa para asegurar que la sesión esté establecida
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        await permissionsStore.fetchPermissions()
        this.loginProgress = 60
        console.log('✅ PASO 2 COMPLETADO: Permisos cargados correctamente')
        
        // PASO 3: Precargar contadores críticos (tickets, tareas, agenda)
        this.loginStep = 'loading_counters'
        this.loginProgress = 70
        console.log('🧮 PASO 3: Precargando contadores (tickets, tareas, agenda)...')
        await loadInitialCounters(response.data.user)
        this.loginProgress = 80
        console.log('✅ PASO 3 COMPLETADO: Contadores precargados')

        // PASO 4: Cargar Datos Adicionales
        this.loginStep = 'loading_data'
        this.loginProgress = 85
        console.log('📊 PASO 4: Cargando datos adicionales...')
        
        if (response.data.user && response.data.user.id) {
          await interventionsStore.fetchUserInterventions()
          console.log('✅ PASO 4 COMPLETADO: Intervenciones cargadas')
        }
        
        // PASO 5: Finalización
        this.loginStep = 'complete'
        this.loginProgress = 100
        console.log('🎉 LOGIN COMPLETADO: Todos los pasos exitosos')
        
        notificationStore.addNotification('success', 'Login exitoso', `Bienvenido, ${response.data.user.firstname || login}!`)
        
        // Limpiar estado de progreso después de un momento
        setTimeout(() => {
          this.loginStep = null
          this.loginProgress = 0
        }, 2000)
        
      } catch (error) {
        console.error(`❌ ERROR EN PASO ${this.loginStep}:`, error)
        
        // Limpiar estado en caso de error
        this.isAuthenticated = false
        this.user = null
        this.loginStep = null
        this.loginProgress = 0
        
        // Manejo específico de errores por paso
        if (this.loginStep === 'authenticating') {
          if (error.response && error.response.status === 401) {
            notificationStore.addNotification('error', 'Error de autenticación', 'Credenciales incorrectas')
          } else {
            notificationStore.addNotification('error', 'Error de conexión', 'No se pudo conectar con el servidor')
          }
        } else if (this.loginStep === 'loading_permissions') {
          notificationStore.addNotification('error', 'Error de permisos', 'No se pudieron cargar los permisos. Intenta nuevamente.')
        } else if (this.loginStep === 'loading_counters') {
          notificationStore.addNotification('warning', 'Datos parciales', 'Login exitoso pero los contadores principales no se precargaron completamente.')
          return
        } else if (this.loginStep === 'loading_data') {
          notificationStore.addNotification('warning', 'Datos parciales', 'Login exitoso pero algunos datos no se cargaron completamente.')
          // En este caso, no hacer throw para no interrumpir el login
          return
        } else {
          notificationStore.addNotification('error', 'Error inesperado', 'Ocurrió un error durante el login')
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      const notificationStore = useNotificationStore()
      const interventionsStore = useUserInterventionsStore()
      const permissionsStore = usePermissionsStore()
      
      this.isLoggingOut = true
      
      console.log('🚪 Cerrando sesión local...')
      
      this.isAuthenticated = false
      this.user = null
      this.isLoggingOut = false
      this.loginStep = null
      this.loginProgress = 0
      
      // Limpiar localStorage y stores relacionados
      localStorage.removeItem('dolibarr-auth')
      interventionsStore.clearInterventions()
      permissionsStore.clearPermissions()
      
      // Mostrar notificación
      notificationStore.addNotification('info', 'Sesión cerrada', 'Has cerrado sesión correctamente')
      
      console.log('✅ Sesión cerrada localmente')
    },

    async checkAuth() {
      try {
        const response = await http.get('/api/auth/me')
        this.user = response.data.user
        
        // Si no está autenticado en el servidor, limpiar localStorage y permisos
        if (!response.data.authenticated) {
          this.isAuthenticated = false
          this.user = null
          localStorage.removeItem('dolibarr-auth')
          
          // Limpiar permisos también
          const permissionsStore = usePermissionsStore()
          permissionsStore.clearPermissions()
        }
      } catch (error) {
        this.isAuthenticated = false
        this.user = null
        localStorage.removeItem('dolibarr-auth')
        
        // Limpiar permisos también
        const permissionsStore = usePermissionsStore()
        permissionsStore.clearPermissions()
      }
    },

    // Método para inicializar la sesión desde localStorage
    async initializeFromStorage() {
      const stored = localStorage.getItem('dolibarr-auth')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          if (data.isAuthenticated && data.user) {
            this.isAuthenticated = data.isAuthenticated
            this.user = data.user
            
            // Verificar con el servidor si la sesión sigue válida
            await this.checkAuth()
            
            // Si sigue autenticado, cargar permisos si no están en localStorage
            if (this.isAuthenticated) {
              const permissionsStore = usePermissionsStore()
              
              // Si no hay permisos en localStorage o son muy antiguos, cargarlos
              if (!permissionsStore.hasPermissions || permissionsStore.shouldRefresh()) {
                try {
                  await permissionsStore.fetchPermissions()
                  console.log('Permisos recargados al inicializar sesión')
                } catch (error) {
                  console.warn('Error al cargar permisos al inicializar:', error)
                }
              } else {
                console.log('Permisos restaurados desde localStorage')
              }
            }
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error)
          localStorage.removeItem('dolibarr-auth')
        }
      }
    }
  }
})

