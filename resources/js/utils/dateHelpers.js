import { useDolibarrStatus } from '../composables/useDolibarrStatus'

/**
 * Formatea una fecha usando el timestamp del servidor de Dolibarr
 * Ajusta automáticamente el horario de verano para España
 */
export function formatDateWithServerTime(timestamp, options = {}) {
  const { serverTimestamp } = useDolibarrStatus()
  
  // Si no hay timestamp del servidor, usar hora local del navegador
  if (!serverTimestamp.value) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      ...options
    })
  }
  
  // Calcular la diferencia entre el servidor y el timestamp dado
  const date = new Date(timestamp * 1000)
  
  // Formatear usando la zona horaria de España
  return date.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...options
  })
}

/**
 * Obtiene la hora actual del servidor ajustada a España
 */
export function getCurrentServerTime() {
  const { getSpainTime } = useDolibarrStatus()
  return getSpainTime()
}

/**
 * Obtiene un objeto Date con la hora actual del servidor ajustada a España
 */
export function getCurrentServerDate() {
  const { getSpainDate } = useDolibarrStatus()
  return getSpainDate()
}

/**
 * Formatea una fecha relativa (hace X minutos, hace X horas, etc.)
 */
export function formatRelativeTime(timestamp) {
  const { serverTimestamp } = useDolibarrStatus()
  
  const now = serverTimestamp.value || Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  
  if (diff < 60) {
    return 'Hace unos segundos'
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400)
    return `Hace ${days} día${days > 1 ? 's' : ''}`
  } else if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800)
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000)
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`
  } else {
    const years = Math.floor(diff / 31536000)
    return `Hace ${years} año${years > 1 ? 's' : ''}`
  }
}

/**
 * Verifica si una fecha está en horario de verano en España
 */
export function isDST(date) {
  const jan = new Date(date.getFullYear(), 0, 1)
  const jul = new Date(date.getFullYear(), 6, 1)
  
  const janOffset = jan.getTimezoneOffset()
  const julOffset = jul.getTimezoneOffset()
  
  return Math.max(janOffset, julOffset) !== date.getTimezoneOffset()
}

/**
 * Obtiene el offset de España (CET/CEST) en horas
 * CET (invierno): UTC+1
 * CEST (verano): UTC+2
 */
export function getSpainOffset(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'short'
  })
  
  const parts = formatter.formatToParts(date)
  const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value
  
  // CEST = UTC+2 (verano), CET = UTC+1 (invierno)
  return timeZoneName === 'CEST' ? 2 : 1
}
