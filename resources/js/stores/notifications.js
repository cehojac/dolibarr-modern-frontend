import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: []
  }),

  actions: {
    addNotification(notification) {
      const id = Date.now() + Math.random()
      
      // Si notification es un string, convertirlo a objeto con message
      let notificationObj
      if (typeof notification === 'string') {
        notificationObj = { message: notification }
      } else if (typeof notification === 'object' && notification !== null) {
        notificationObj = { ...notification }
      } else {
        notificationObj = { message: 'Notificación' }
      }
      
      const newNotification = {
        id,
        type: 'info',
        duration: 5000,
        ...notificationObj
      }
      
      this.notifications.push(newNotification)
      
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }
      
      return id
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    success(message, title = 'Éxito', options = {}) {
      return this.addNotification({
        type: 'success',
        title,
        message,
        ...options
      })
    },

    error(message, title = 'Error', options = {}) {
      return this.addNotification({
        type: 'error',
        title,
        message,
        duration: 8000,
        ...options
      })
    },

    warning(message, title = 'Advertencia', options = {}) {
      return this.addNotification({
        type: 'warning',
        title,
        message,
        ...options
      })
    },

    info(message, title = 'Información', options = {}) {
      return this.addNotification({
        type: 'info',
        title,
        message,
        ...options
      })
    },

    // Método adicional para compatibilidad con el formato anterior
    add(notification) {
      return this.addNotification(notification)
    },

    clear() {
      this.notifications = []
    }
  }
})
