import { ref } from 'vue'
import http from '../utils/http'

const overdueInvoicesCount = ref(null)
let refreshInterval = null

export function useInvoicesCounter() {
  const fetchOverdueInvoicesCount = async () => {
    try {
      // Obtener todas las facturas con límite alto
      const response = await http.get('/api/doli/invoices?limit=10000')
      
      if (response.data && Array.isArray(response.data)) {
        const now = Math.floor(Date.now() / 1000) // Timestamp actual en segundos
        
        // Filtrar facturas vencidas:
        // - No pagadas (paye !== '1')
        // - Fecha de vencimiento pasada (date_lim_reglement < now)
        // - Estado validado (statut === '1')
        const overdueInvoices = response.data.filter(invoice => {
          const isPaid = invoice.paye === '1' || invoice.paye === 1
          const isValidated = invoice.statut === '1' || invoice.statut === 1
          const dueDate = parseInt(invoice.date_lim_reglement)
          const isOverdue = dueDate && dueDate < now
          
          return !isPaid && isValidated && isOverdue
        })
        
        overdueInvoicesCount.value = overdueInvoices.length
        
        console.log('💰 Overdue invoices count:', overdueInvoicesCount.value)
      } else {
        overdueInvoicesCount.value = 0
      }
    } catch (error) {
      console.error('Error fetching overdue invoices count:', error)
      overdueInvoicesCount.value = 0
    }
  }

  const startAutoRefresh = (intervalMs = 300000) => { // 5 minutos por defecto
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    fetchOverdueInvoicesCount()
    refreshInterval = setInterval(fetchOverdueInvoicesCount, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    overdueInvoicesCount,
    fetchOverdueInvoicesCount,
    startAutoRefresh,
    stopAutoRefresh
  }
}
