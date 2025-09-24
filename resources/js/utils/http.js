import axios from 'axios'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Variable para evitar múltiples redirecciones simultáneas
let isRedirecting = false

// Create axios instance
const http = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: true, // Importante para cookies de sesión en producción
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

// Request interceptor - CSRF solo para rutas Laravel internas
http.interceptors.request.use(
  (config) => {
    // Solo agregar CSRF token para rutas Laravel internas (no para proxies a Dolibarr)
    const isDolibarrProxy = config.url && config.url.startsWith('/api/doli/')
    const isAuthRoute = config.url && config.url.startsWith('/api/auth/')
    const isCacheRoute = config.url && config.url.startsWith('/api/cache/')
    
    // CSRF solo necesario para rutas Laravel que modifican estado
    if (!isDolibarrProxy && (isAuthRoute || isCacheRoute)) {
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
    // Detectar si recibimos HTML en lugar de JSON (indica redirección)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('ERROR: Respuesta HTML recibida - posible problema de sesión o configuración')
      console.log('URL solicitada:', response.config.url)
      console.log('Respuesta HTML:', response.data.substring(0, 200) + '...')
      
      // Evitar múltiples redirecciones simultáneas
      if (!isRedirecting) {
        isRedirecting = true
        
        const notificationStore = useNotificationStore()
        const authStore = useAuthStore()
        
        notificationStore.error('Error de sesión. Redirigiendo al login...')
        authStore.logout()
        
        // Resetear la variable después de un tiempo
        setTimeout(() => {
          isRedirecting = false
        }, 2000)
      }
      
      // Crear un error personalizado
      const error = new Error('Respuesta HTML recibida en lugar de JSON')
      error.isHTMLResponse = true
      return Promise.reject(error)
    }
    
    return response
  },
  (error) => {
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Evitar múltiples redirecciones simultáneas
          if (!isRedirecting) {
            isRedirecting = true
            notificationStore.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
            authStore.logout()
            router.push('/login')
            
            // Resetear la variable después de un tiempo
            setTimeout(() => {
              isRedirecting = false
            }, 2000)
          }
          break
          
        case 403:
          notificationStore.error('No tienes permisos para realizar esta acción.')
          break
          
        case 419:
          // Evitar múltiples recargas simultáneas
          if (!isRedirecting) {
            isRedirecting = true
            notificationStore.error('Sesión expirada. Recargando página...')
            // Recargar la página para obtener un nuevo token CSRF
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          }
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
