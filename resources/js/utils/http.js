import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Create axios instance
const http = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: false, // Importante para cookies de sesión
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Configurar token CSRF automáticamente
/*
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
  http.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}
  */

// Request interceptor - NO CSRF para rutas API
http.interceptors.request.use(
  (config) => {
    // Solo agregar CSRF token si NO es una ruta API de Dolibarr
    if (config.url && !config.url.startsWith('/api/doli/')) {
      const token = document.head.querySelector('meta[name="csrf-token"]')
      if (token && token.content) {
        config.headers['X-CSRF-TOKEN'] = token.content
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          notificationStore.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
          authStore.logout()
          router.push('/login')
          break
          
        case 403:
          notificationStore.error('No tienes permisos para realizar esta acción.')
          break
          
        case 419:
          notificationStore.error('Sesión expirada. Recargando página...')
          // Recargar la página para obtener un nuevo token CSRF
          setTimeout(() => {
            window.location.reload()
          }, 1500)
          break
          
        case 404:
          notificationStore.error('El recurso solicitado no fue encontrado.')
          break
          
        case 422:
          if (data.errors) {
            Object.values(data.errors).flat().forEach(error => {
              notificationStore.error(error)
            })
          } else {
            notificationStore.error(data.message || 'Datos inválidos.')
          }
          break
          
        case 429:
          notificationStore.error('Demasiadas solicitudes. Por favor, espera un momento.')
          break
          
        case 500:
          notificationStore.error('Error interno del servidor. Por favor, contacta al administrador.')
          break
          
        default:
          notificationStore.error(data.message || `Error ${status}: ${error.message}`)
      }
    } else if (error.request) {
      notificationStore.error('Error de conexión. Verifica tu conexión a internet.')
    } else {
      notificationStore.error('Error inesperado: ' + error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
