import { ref } from 'vue'
import http from '../utils/http'

export function useTicketDetails() {
  const showModal = ref(false)
  const selectedTicket = ref(null)
  const ticketDetails = ref(null)
  const loadingDetails = ref(false)

  /**
   * Abre el modal de detalles del ticket y carga su información
   * @param {Object} ticket - El objeto ticket a mostrar
   */
  const openTicketDetails = async (ticket) => {
    selectedTicket.value = ticket
    ticketDetails.value = null
    showModal.value = true
    loadingDetails.value = true

    try {
      console.log('🎫 Cargando detalles del ticket:', ticket.id)
      
      // Cargar detalles del ticket
      const response = await http.get(`/api/doli/tickets/${ticket.id}`)
      ticketDetails.value = response.data

      console.log('✅ Detalles del ticket cargados:', ticketDetails.value)
    } catch (error) {
      console.error('❌ Error cargando detalles del ticket:', error)
      ticketDetails.value = null
    } finally {
      loadingDetails.value = false
    }
  }

  /**
   * Cierra el modal de detalles del ticket
   */
  const closeTicketDetails = () => {
    showModal.value = false
    selectedTicket.value = null
    ticketDetails.value = null
    loadingDetails.value = false
  }

  /**
   * Recarga los detalles del ticket actual
   */
  const refreshTicketDetails = async () => {
    if (!selectedTicket.value) return

    loadingDetails.value = true
    try {
      // Agregar timestamp para evitar caché
      const response = await http.get(`/api/doli/tickets/${selectedTicket.value.id}?_t=${Date.now()}`)
      
      // Forzar actualización completa del objeto
      ticketDetails.value = { ...response.data }
      
      console.log('🔄 Detalles del ticket actualizados')
      console.log('🔍 Nuevo estado:', ticketDetails.value.fk_statut)
    } catch (error) {
      console.error('❌ Error actualizando detalles del ticket:', error)
    } finally {
      loadingDetails.value = false
    }
  }

  /**
   * Actualiza el estado del ticket
   * @param {string|number} ticketId - ID del ticket
   * @param {string|number} newStatus - Nuevo estado del ticket
   */
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      console.log('🔄 Actualizando estado del ticket:', ticketId, 'a', newStatus)
      
      const response = await http.put(`/api/doli/tickets/${ticketId}`, {
        fk_statut: newStatus
      })

      console.log('✅ Estado del ticket actualizado')
      
      // Refrescar detalles si este es el ticket actual
      if (selectedTicket.value?.id === ticketId) {
        await refreshTicketDetails()
      }

      return response.data
    } catch (error) {
      console.error('❌ Error actualizando estado del ticket:', error)
      throw error
    }
  }

  /**
   * Actualiza un campo específico del ticket
   * @param {string|number} ticketId - ID del ticket
   * @param {Object} data - Datos a actualizar
   */
  const updateTicketField = async (ticketId, data) => {
    try {
      console.log('🔄 Actualizando campo del ticket:', ticketId, data)
      
      const response = await http.put(`/api/doli/tickets/${ticketId}`, data)

      console.log('✅ Campo del ticket actualizado')
      
      // Refrescar detalles si este es el ticket actual
      if (selectedTicket.value?.id === ticketId) {
        await refreshTicketDetails()
      }

      return response.data
    } catch (error) {
      console.error('❌ Error actualizando campo del ticket:', error)
      throw error
    }
  }

  return {
    // Estado
    showModal,
    selectedTicket,
    ticketDetails,
    loadingDetails,
    
    // Métodos
    openTicketDetails,
    closeTicketDetails,
    refreshTicketDetails,
    updateTicketStatus,
    updateTicketField
  }
}
