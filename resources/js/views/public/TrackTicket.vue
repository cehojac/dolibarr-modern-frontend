<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">CH</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Rastrear Ticket</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Search Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Buscar Ticket</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Ingrese su ID de seguimiento y correo electrónico para ver el estado de su ticket
        </p>
        
        <div class="space-y-4">
          <!-- ID de Seguimiento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID de Seguimiento
            </label>
            <input
              v-model="trackingId"
              type="text"
              placeholder="15u5c9yf61dtfyy3"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
              @keyup.enter="searchTicket"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              v-model="searchEmail"
              type="email"
              placeholder="cliente@example.com"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              @keyup.enter="searchTicket"
            />
          </div>

          <!-- Botón Buscar -->
          <button
            @click="searchTicket"
            :disabled="!trackingId || isLoading"
            class="w-full px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Buscando...' : 'Buscar' }}</span>
          </button>
        </div>

        <div v-if="notFound" class="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-red-700 dark:text-red-300 text-sm font-medium mb-1">
                No se encontró el ticket
              </p>
              <p class="text-red-600 dark:text-red-400 text-xs">
                • Verifica que el ID de seguimiento sea correcto<br>
                • Si ingresaste un email, asegúrate que sea el correcto o déjalo vacío
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal de Detalles del Ticket -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ ticket?.ref }}<span v-if="ticket?.companyName" class="text-blue-100 font-normal"> - {{ ticket.companyName }}</span></h3>
              <p class="text-blue-100 text-sm">ID: {{ ticket?.trackingId }}</p>
            </div>
          </div>
          <button @click="closeModal" class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[70vh] space-y-6">
        <!-- Header Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">ID de Seguimiento</p>
              <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ ticket.trackingId }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="px-4 py-2 rounded-full text-sm font-medium"
                :class="getStatusClass(ticket.status)"
              >
                {{ getStatusLabel(ticket.status) }}
              </span>
              <span
                class="px-4 py-2 rounded-full text-sm font-medium"
                :class="getPriorityClass(ticket.priority)"
              >
                {{ getPriorityLabel(ticket.priority) }}
              </span>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {{ ticket.subject }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500 dark:text-gray-400">Tipo</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ getTypeLabel(ticket.type) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Creado</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(ticket.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-500 dark:text-gray-400">Última Actualización</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(ticket.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Description Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descripción
          </h3>
          <div class="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none" v-html="ticket.description"></div>
        </div>

        <!-- Timeline Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 historial-section">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial
          </h3>

          <div class="space-y-6">
            <div
              v-for="(event, index) in sortedTimeline"
              :key="index"
              class="flex gap-4 timeline-event"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getEventIconClass(event.type, event.isExternal)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="event.type === 'created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    <path v-else-if="event.type === 'updated'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    <path v-else-if="event.type === 'comment'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div
                  v-if="index < sortedTimeline.length - 1"
                  class="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2"
                  style="min-height: 2rem;"
                ></div>
              </div>

              <div class="flex-1 pb-6">
                <p class="font-medium text-gray-900 dark:text-white mb-1">
                  {{ event.title }}
                </p>
                <p v-if="event.description" class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {{ event.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ formatDateTime(event.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Enviar Mensaje Privado
          </h3>
          <textarea
            v-model="newMessage"
            rows="4"
            placeholder="Escriba su mensaje aquí..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none mb-4"
          ></textarea>
          <div class="flex justify-end">
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isSending"
              class="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center space-x-2"
            >
              <svg v-if="isSending" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSending ? 'Enviando...' : 'Enviar Mensaje' }}</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Toast de Éxito -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 z-[60] animate-fade-in"
    >
      <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p class="font-semibold">Mensaje enviado</p>
          <p class="text-sm text-green-100">Tu mensaje ha sido enviado correctamente</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/utils/http'

const router = useRouter()
const route = useRoute()

// Timeline ordenado por fecha (más antiguo primero, más nuevo al final)
const sortedTimeline = computed(() => {
  if (!ticket.value || !ticket.value.timeline) return []
  return [...ticket.value.timeline].sort((a, b) => {
    // Convertir fechas a timestamps para comparar
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB // Orden ascendente (más antiguo primero)
  })
})

const trackingId = ref('')
const searchEmail = ref('')
const ticket = ref(null)
const isLoading = ref(false)
const showModal = ref(false)
const notFound = ref(false)
const newMessage = ref('')
const isSending = ref(false)
const currentContact = ref(null) // Contacto del email consultado
const showSuccessToast = ref(false)

// Verificar si el email pertenece al tercero o sus contactos (igual que ListTickets)
const verifyEmailForThirdparty = async (socid, email) => {
  try {
    console.log('🔍 Verificando email para socid:', socid)
    
    // Obtener información del tercero
    const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${socid}`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    const thirdparty = thirdpartyResponse.data
    console.log('📋 Tercero obtenido:', { email: thirdparty.email, name: thirdparty.name })
    console.log('📧 Email ingresado:', email)
    
    // Verificar email del tercero (case-insensitive)
    if (thirdparty.email && thirdparty.email.toLowerCase() === email.toLowerCase()) {
      console.log('✅ Email coincide con el tercero')
      return true
    }
    
    // Obtener contactos del tercero
    console.log('👥 Obteniendo contactos del tercero...')
    const contactsResponse = await http.get(`/api/doli/contacts`, {
      params: {
        thirdparty_ids: socid
      },
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('📋 Contactos obtenidos:', contactsResponse.data?.length || 0)
    
    if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
      const contactEmails = contactsResponse.data.map(c => c.email).filter(e => e)
      console.log('📧 Emails de contactos:', contactEmails)
      
      const hasMatchingContact = contactsResponse.data.some(
        contact => contact.email && contact.email.toLowerCase() === email.toLowerCase()
      )
      
      if (hasMatchingContact) {
        console.log('✅ Email coincide con un contacto')
        return true
      }
    }
    
    console.log('❌ Email no coincide con tercero ni contactos')
    return false
  } catch (error) {
    console.error('❌ Error al verificar email:', error)
    return false
  }
}

onMounted(() => {
  // Si viene con ID en la URL, buscar automáticamente
  if (route.query.id) {
    trackingId.value = route.query.id
    searchTicket()
  }
})

const searchTicket = async () => {
  if (!trackingId.value) return
  
  isLoading.value = true
  notFound.value = false
  
  try {
    console.log('📍 Buscando por tracking ID:', trackingId.value)
    
    // Llamar a la API de Dolibarr (igual que ListTickets)
    const trackResponse = await http.get(`/api/doli/tickets/track_id/${trackingId.value}`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('📦 Respuesta completa de track_id:', trackResponse)
    console.log('📦 trackResponse.data:', trackResponse.data)
    
    // La API de Dolibarr puede devolver un objeto directamente o un array
    let ticketData = null
    if (Array.isArray(trackResponse.data)) {
      if (trackResponse.data.length === 0) {
        notFound.value = true
        return
      }
      ticketData = trackResponse.data[0]
    } else if (trackResponse.data && typeof trackResponse.data === 'object') {
      ticketData = trackResponse.data
    } else {
      console.error('❌ Formato de respuesta inesperado:', trackResponse.data)
      notFound.value = true
      return
    }
    
    console.log('🎫 Ticket extraído:', ticketData)
    
    if (!ticketData || !ticketData.socid) {
      console.error('❌ Ticket sin socid:', ticketData)
      notFound.value = true
      return
    }
    
    console.log('✅ Ticket encontrado, socid:', ticketData.socid)
    
    // Obtener información del tercero para el nombre de la empresa
    let companyName = ''
    try {
      const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${ticketData.socid}`, {
        headers: { 'X-Public-Request': 'true' }
      })
      companyName = thirdpartyResponse.data?.name || ''
      console.log('🏢 Nombre de empresa:', companyName)
    } catch (error) {
      console.error('⚠️ Error al obtener nombre de empresa:', error)
    }
    
    // Si se proporcionó email, verificar que coincida (igual que ListTickets)
    if (searchEmail.value && searchEmail.value.trim()) {
      console.log('🔐 Verificando email para tercero...')
      const isEmailValid = await verifyEmailForThirdparty(ticketData.socid, searchEmail.value.trim())
      
      if (!isEmailValid) {
        console.error('❌ Email no coincide con el tercero')
        notFound.value = true
        return
      }
      console.log('✅ Email verificado correctamente')
    }
    
    // Mapear datos del ticket (igual que ListTickets)
    const mappedTicket = {
      id: ticketData.id,
      ref: ticketData.ref || ticketData.id,
      trackingId: ticketData.track_id,
      subject: ticketData.subject,
      description: ticketData.message,
      status: mapTicketStatus(ticketData.fk_statut),
      priority: mapTicketPriority(ticketData.severity_code),
      type: ticketData.type_code || 'other',
      createdAt: ticketData.datec,
      updatedAt: ticketData.date_modification || ticketData.datec,
      email: searchEmail.value,
      socid: ticketData.socid,
      companyName: companyName,
      messages: ticketData.messages || [],
      timeline: buildTimeline(ticketData)
    }
    
    ticket.value = mappedTicket
    console.log('✅ Ticket mapeado:', ticket.value)
    
    // Abrir modal directamente (igual que ListTickets cuando solo hay tracking ID)
    showModal.value = true
    
  } catch (error) {
    console.error('❌ Error al buscar ticket:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    if (error.response?.status === 404) {
      notFound.value = true
    } else {
      notFound.value = true
    }
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  ticket.value = null
  newMessage.value = ''
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !ticket.value) return
  
  isSending.value = true
  
  try {
    console.log('📤 Enviando mensaje al ticket:', ticket.value.id)
    
    // Obtener el contacto del email si no lo tenemos
    if (!currentContact.value && searchEmail.value) {
      console.log('👤 Obteniendo contacto para email:', searchEmail.value)
      const contactResponse = await http.get(`/api/doli/contacts/email/${encodeURIComponent(searchEmail.value)}`, {
        headers: {
          'X-Public-Request': 'true'
        }
      })
      
      console.log('📦 Respuesta de contacto:', contactResponse.data)
      
      if (contactResponse.data && contactResponse.data.id) {
        currentContact.value = contactResponse.data
        console.log('✅ Contacto encontrado:', currentContact.value)
      } else {
        console.error('❌ No se encontró contacto con ese email')
        alert('No se pudo identificar el usuario. Por favor, intente nuevamente.')
        isSending.value = false
        return
      }
    }
    
    // Enviar mensaje privado al ticket usando el endpoint correcto de Dolibarr
    console.log('📝 Datos a enviar:', {
      ticketId: ticket.value.id,
      message: newMessage.value,
      contactId: currentContact.value?.id
    })
    
    const response = await http.post(`/api/doli/dolibarmodernfrontendapi/tickets/${ticket.value.id}/newmessage`, {
      message: newMessage.value,
      contact_id: currentContact.value?.id || null, // ID del contacto que envía
      private: 1, // Siempre privado para clientes públicos
      send_email: 0 // No enviar email por defecto
    }, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    console.log('✅ Respuesta de envío de mensaje:', response.data)
    
    if (response.data) {
      // Agregar evento al timeline
      const authorName = currentContact.value ? 
        `${currentContact.value.firstname || ''} ${currentContact.value.lastname || ''}`.trim() || 'Cliente' : 
        'Cliente'
      
      // Crear fecha en formato ISO local (no UTC)
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const dateISO = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      
      console.log('📅 Fecha del nuevo evento:', dateISO)
      
      ticket.value.timeline.push({
        type: 'comment',
        title: authorName,
        description: newMessage.value,
        date: dateISO, // Formato: "2025-10-20 20:28:00" (hora local)
        isExternal: true // Mensaje enviado desde portal público (cliente)
      })
      
      newMessage.value = ''
      
      // Mostrar notificación de éxito
      showSuccessToast.value = true
      setTimeout(() => {
        showSuccessToast.value = false
      }, 3000)
      
      // Esperar a que Vue actualice el DOM antes de hacer scroll
      await nextTick()
      
      // Pequeño delay adicional para asegurar renderizado completo
      setTimeout(() => {
        // Buscar el último evento en el DOM
        const events = document.querySelectorAll('.timeline-event')
        console.log('🔍 Eventos encontrados para scroll:', events.length)
        
        if (events.length > 0) {
          const lastEvent = events[events.length - 1]
          console.log('📍 Haciendo scroll al último evento')
          lastEvent.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        } else {
          // Fallback: scroll al final de la sección de historial
          const historialSection = document.querySelector('.historial-section')
          if (historialSection) {
            console.log('📍 Fallback: scroll manual al final')
            historialSection.scrollTop = historialSection.scrollHeight
          }
        }
      }, 100)
    }
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    alert('Error al enviar el mensaje. Por favor, intente nuevamente.')
  } finally {
    isSending.value = false
  }
}

// Mapear estado del ticket
const mapTicketStatus = (fkStatut) => {
  const statusMap = {
    '0': 'open',
    '1': 'open',
    '2': 'open',
    '3': 'in_progress',
    '4': 'in_progress',
    '5': 'in_progress',
    '6': 'in_progress',
    '7': 'in_progress',
    '8': 'closed',
    '9': 'closed'
  }
  return statusMap[String(fkStatut)] || 'open'
}

// Mapear prioridad del ticket
const mapTicketPriority = (severityCode) => {
  const priorityMap = {
    'LOW': 'low',
    'NORMAL': 'normal',
    'HIGH': 'high',
    'URGENT': 'urgent'
  }
  return priorityMap[severityCode] || 'normal'
}

// Construir timeline desde mensajes
const buildTimeline = (ticketData) => {
  const timeline = []
  
  // Evento de creación
  timeline.push({
    type: 'created',
    title: 'Ticket creado',
    description: `Ticket ${ticketData.ref} registrado en el sistema`,
    date: ticketData.datec
  })
  
  // Agregar mensajes como eventos
  if (ticketData.messages && Array.isArray(ticketData.messages)) {
    ticketData.messages.forEach(msg => {
      timeline.push({
        type: 'comment',
        title: msg.fk_user_action_string || 'Actualización',
        description: decodeHtmlEntities(msg.message),
        date: msg.datec
      })
    })
  }
  
  // Ordenar por fecha
  timeline.sort((a, b) => a.date - b.date)
  
  return timeline
}

// Decodificar entidades HTML
const decodeHtmlEntities = (text) => {
  if (!text) return ''
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

const goBack = () => {
  router.push('/new-ticket')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  // Si es un timestamp Unix (segundos), convertir a milisegundos
  let timestamp = dateString
  if (typeof dateString === 'number' || !isNaN(dateString)) {
    timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  
  // Formato relativo
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)
  
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else if (diffWeeks < 4) {
    return `hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`
  } else if (diffMonths < 12) {
    return `hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`
  } else {
    return `hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  // Si es un timestamp Unix (segundos), convertir a milisegundos
  let timestamp = dateString
  if (typeof dateString === 'number' || !isNaN(dateString)) {
    timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
  }
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'
  
  // Calcular diferencia en tiempo
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  // Formato relativo con más detalle para mensajes
  if (diffSecs < 60) {
    return 'hace unos segundos'
  } else if (diffMins < 60) {
    return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
  } else if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
  } else if (diffDays < 7) {
    return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
  } else {
    // Para fechas más antiguas, mostrar fecha completa
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    closed: 'Cerrado',
    pending: 'Pendiente'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    closed: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    pending: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
  }
  return classes[status] || classes.open
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Baja',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente'
  }
  return labels[priority] || priority
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    normal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return classes[priority] || classes.normal
}

const getTypeLabel = (type) => {
  const types = {
    question: 'Pregunta',
    problem: 'Problema Técnico',
    request: 'Solicitud de Servicio',
    other: 'Otro'
  }
  return types[type] || type
}

const getEventIconClass = (type, isExternal = false) => {
  const classes = {
    created: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    updated: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    // Comentarios: azul para externos (clientes), púrpura para internos
    comment: isExternal 
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    closed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  }
  return classes[type] || classes.updated
}
</script>
