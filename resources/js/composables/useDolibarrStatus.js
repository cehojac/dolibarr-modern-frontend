import { ref, computed } from 'vue'
import http from '../utils/http'

// Estado global compartido entre todas las instancias
const statusData = ref(null)
const loading = ref(false)
const error = ref(null)

export function useDolibarrStatus() {
  const loadStatus = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await http.get('/api/doli/status')
      
      if (response.data && response.data.success) {
        statusData.value = response.data.success
        console.log('✅ Dolibarr status cargado:', statusData.value)
      }
    } catch (err) {
      console.error('❌ Error cargando status de Dolibarr:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const dolibarrVersion = computed(() => statusData.value?.dolibarr_version || null)
  
  const isAccessLocked = computed(() => {
    if (!statusData.value) return true // Por defecto bloqueado si no hay datos
    return statusData.value.access_locked === '1' || statusData.value.access_locked === 1
  })
  
  const environment = computed(() => statusData.value?.environment || 'unknown')
  
  const serverTimestamp = computed(() => statusData.value?.timestamp_now_utc || null)
  
  // Convertir timestamp UTC a hora local de España (con horario de verano)
  const getSpainTime = () => {
    if (!serverTimestamp.value) return null
    
    // Crear fecha desde timestamp UTC
    const date = new Date(serverTimestamp.value * 1000)
    
    // Convertir a hora de España (Europe/Madrid)
    // Esto automáticamente maneja el horario de verano (CEST) y el horario de invierno (CET)
    const spainTime = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date)
    
    return spainTime
  }
  
  // Obtener objeto Date ajustado a hora de España
  const getSpainDate = () => {
    if (!serverTimestamp.value) return null
    
    // Crear fecha desde timestamp UTC
    const utcDate = new Date(serverTimestamp.value * 1000)
    
    // Obtener el offset de España (en minutos)
    // Esto automáticamente considera el horario de verano
    const spainFormatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    const parts = spainFormatter.formatToParts(utcDate)
    const year = parts.find(p => p.type === 'year').value
    const month = parts.find(p => p.type === 'month').value
    const day = parts.find(p => p.type === 'day').value
    const hour = parts.find(p => p.type === 'hour').value
    const minute = parts.find(p => p.type === 'minute').value
    const second = parts.find(p => p.type === 'second').value
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  }

  return {
    statusData,
    loading,
    error,
    loadStatus,
    dolibarrVersion,
    isAccessLocked,
    environment,
    serverTimestamp,
    getSpainTime,
    getSpainDate
  }
}
