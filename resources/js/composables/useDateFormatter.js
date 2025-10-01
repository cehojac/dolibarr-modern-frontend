/**
 * Composable para formateo de fechas de Dolibarr
 * Maneja timestamps Unix, fechas ISO y diferentes formatos
 */
export function useDateFormatter() {
  /**
   * Formatea una fecha de Dolibarr a formato legible
   * @param {string|number} dateValue - Timestamp Unix o fecha ISO
   * @param {string} format - Formato de salida: 'date', 'datetime', 'time'
   * @returns {string} - Fecha formateada o '-'
   */
  const formatDate = (dateValue, format = 'date') => {
    if (!dateValue || dateValue === '0' || dateValue === 0) {
      return '-'
    }

    try {
      let date

      // Si es un timestamp Unix (número o string numérico)
      if (typeof dateValue === 'number' || !isNaN(dateValue)) {
        const timestamp = parseInt(dateValue)
        
        // Validar que sea un timestamp válido (después del 2000)
        if (timestamp < 946684800) { // 1 de enero de 2000
          return '-'
        }
        
        date = new Date(timestamp * 1000) // Convertir de segundos a milisegundos
      } else {
        // Si es una fecha ISO string
        date = new Date(dateValue)
      }

      // Validar que la fecha sea válida
      if (isNaN(date.getTime())) {
        return '-'
      }

      // Formatear según el tipo solicitado
      switch (format) {
        case 'date':
          return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        
        case 'datetime':
          return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        
        case 'time':
          return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })
        
        default:
          return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
      }
    } catch (error) {
      console.warn('Error formateando fecha:', dateValue, error)
      return '-'
    }
  }

  /**
   * Formatea una fecha en formato relativo (hace X días)
   * @param {string|number} dateValue - Timestamp Unix o fecha ISO
   * @returns {string} - Fecha en formato relativo
   */
  const formatRelativeDate = (dateValue) => {
    if (!dateValue || dateValue === '0' || dateValue === 0) {
      return '-'
    }

    try {
      let date

      if (typeof dateValue === 'number' || !isNaN(dateValue)) {
        const timestamp = parseInt(dateValue)
        if (timestamp < 946684800) return '-'
        date = new Date(timestamp * 1000)
      } else {
        date = new Date(dateValue)
      }

      if (isNaN(date.getTime())) return '-'

      const now = new Date()
      const diffMs = now - date
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffMs / (1000 * 60))

      if (diffMinutes < 1) return 'Ahora mismo'
      if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
      if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) !== 1 ? 's' : ''}`
      if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) !== 1 ? 'es' : ''}`
      
      return `Hace ${Math.floor(diffDays / 365)} año${Math.floor(diffDays / 365) !== 1 ? 's' : ''}`
    } catch (error) {
      console.warn('Error formateando fecha relativa:', dateValue, error)
      return '-'
    }
  }

  /**
   * Verifica si una fecha está vencida
   * @param {string|number} dateValue - Timestamp Unix o fecha ISO
   * @returns {boolean} - True si está vencida
   */
  const isOverdue = (dateValue) => {
    if (!dateValue || dateValue === '0' || dateValue === 0) {
      return false
    }

    try {
      let date

      if (typeof dateValue === 'number' || !isNaN(dateValue)) {
        const timestamp = parseInt(dateValue)
        if (timestamp < 946684800) return false
        date = new Date(timestamp * 1000)
      } else {
        date = new Date(dateValue)
      }

      if (isNaN(date.getTime())) return false

      return date < new Date()
    } catch (error) {
      return false
    }
  }

  /**
   * Obtiene el timestamp actual de Dolibarr (Unix timestamp)
   * @returns {number} - Timestamp Unix en segundos
   */
  const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000)
  }

  return {
    formatDate,
    formatRelativeDate,
    isOverdue,
    getCurrentTimestamp
  }
}
