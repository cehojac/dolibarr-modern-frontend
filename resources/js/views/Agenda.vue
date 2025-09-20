<template>
  <div class="h-full flex flex-col">
    <!-- Header con controles del calendario -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Agenda
        </h1>
        <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          {{ currentDateFormatted }}
        </p>
      </div>
      
      <!-- Controles de vista y navegación -->
      <div class="flex items-center space-x-4">
        <!-- Selector de vista -->
        <div class="flex rounded-lg border" :class="isDark ? 'border-gray-600' : 'border-gray-300'">
          <button
            v-for="view in views"
            :key="view.key"
            @click="currentView = view.key"
            class="px-3 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg"
            :class="currentView === view.key 
              ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
              : (isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
            "
          >
            {{ view.label }}
          </button>
        </div>
        
        <!-- Navegación -->
        <div class="flex items-center space-x-2">
          <button
            @click="navigateCalendar('prev')"
            class="p-2 rounded-lg transition-colors"
            :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            @click="goToToday"
            class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            Hoy
          </button>
          
          <button
            @click="navigateCalendar('next')"
            class="p-2 rounded-lg transition-colors"
            :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Botón de recarga -->
          <button
            @click="loadEventos"
            :disabled="loading"
            class="p-2 rounded-lg transition-colors"
            :class="[
              loading ? 'opacity-50 cursor-not-allowed' : '',
              isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'
            ]"
            title="Recargar eventos"
          >
            <svg class="w-5 h-5" :class="loading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <!-- Filtro systemauto -->
          <label class="flex items-center space-x-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              v-model="showSystemAuto"
              class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded"
            >
            <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Mostrar systemauto
            </span>
          </label>
          
          <!-- Contador de eventos -->
          <div class="text-sm px-3 py-2 rounded-lg" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'">
            {{ filteredEventos.length }} eventos
          </div>
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex-1 rounded-lg border flex items-center justify-center" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando eventos de la agenda...</p>
      </div>
    </div>

    <!-- Calendario -->
    <div v-else class="flex-1 rounded-lg border overflow-hidden" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'">
      <!-- Vista Mes -->
      <div v-if="currentView === 'month'" class="h-full flex flex-col">
        <!-- Cabecera días de la semana -->
        <div class="grid grid-cols-7 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div
            v-for="day in weekDays"
            :key="day"
            class="p-3 text-center text-sm font-medium"
            :class="isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-50'"
          >
            {{ day }}
          </div>
        </div>
        
        <!-- Días del mes -->
        <div class="flex-1 grid grid-cols-7">
          <div
            v-for="day in monthDays"
            :key="day.date"
            class="border-r border-b p-2 min-h-[120px] relative cursor-pointer hover:bg-opacity-50 group"
            :class="[
              isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100',
              day.isCurrentMonth ? '' : (isDark ? 'bg-gray-900 text-gray-600' : 'bg-gray-50 text-gray-400'),
              day.isToday ? (isDark ? 'bg-blue-900' : 'bg-blue-50') : ''
            ]"
            @click="handleDayClick(day.date)"
          >
            <div class="flex items-center justify-between mb-1">
              <span 
                class="text-sm font-medium"
                :class="[
                  day.isToday ? (isDark ? 'text-blue-300' : 'text-blue-600') : '',
                  day.isCurrentMonth ? (isDark ? 'text-white' : 'text-gray-900') : ''
                ]"
              >
                {{ day.day }}
              </span>
            </div>
            
            <!-- Eventos del día -->
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="event.id"
                class="text-xs p-1 rounded truncate"
                :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'"
                :title="event.label"
              >
                {{ event.label }}
              </div>
              
              <!-- Indicador para crear evento si no hay eventos -->
              <div 
                v-if="getEventsForDay(day.date).length === 0 && day.isCurrentMonth"
                class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                + Crear evento
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Semana -->
      <div v-else-if="currentView === 'week'" class="h-full flex flex-col">
        <!-- Cabecera de la semana -->
        <div class="grid grid-cols-8 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="p-3" :class="isDark ? 'bg-gray-800' : 'bg-gray-50'"></div>
          <div
            v-for="day in weekDays"
            :key="day"
            class="p-3 text-center"
            :class="isDark ? 'bg-gray-800' : 'bg-gray-50'"
          >
            <div class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ day }}
            </div>
            <div 
              class="text-lg font-bold mt-1"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ getWeekDayNumber(day) }}
            </div>
          </div>
        </div>
        
        <!-- Horas y eventos -->
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-8">
            <!-- Columna de horas -->
            <div class="border-r" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
              <div
                v-for="hour in hours"
                :key="hour"
                class="h-16 border-b px-3 py-2 text-xs"
                :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'"
              >
                {{ hour }}:00
              </div>
            </div>
            
            <!-- Columnas de días -->
            <div
              v-for="day in 7"
              :key="day"
              class="border-r"
              :class="isDark ? 'border-gray-700' : 'border-gray-200'"
            >
              <div
                v-for="hour in hours"
                :key="hour"
                class="h-16 border-b p-1 relative cursor-pointer"
                :class="isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'"
                @click="handleHourClick(day - 1, hour)"
                :title="`Crear evento a las ${hour}:00`"
              >
                <!-- Eventos en esta hora -->
                <div
                  v-for="event in getEventsForHour(day - 1, hour)"
                  :key="event.id"
                  class="absolute inset-1 text-xs p-1 rounded truncate"
                  :class="isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'"
                  :title="event.label"
                >
                  {{ event.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Día -->
      <div v-else-if="currentView === 'day'" class="h-full flex flex-col">
        <!-- Cabecera del día -->
        <div class="border-b p-4" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'">
          <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ selectedDateFormatted }}
          </h2>
        </div>
        
        <!-- Horas del día -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="hour in hours"
            :key="hour"
            class="border-b p-4 min-h-[80px] relative cursor-pointer"
            :class="isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'"
            @click="handleDayHourClick(hour)"
            :title="`Crear evento a las ${hour}:00`"
          >
            <div class="flex items-start space-x-4">
              <div class="text-sm font-medium w-16" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ hour }}:00
              </div>
              <div class="flex-1">
                <!-- Eventos en esta hora -->
                <div
                  v-for="event in getEventsForSelectedDayHour(hour)"
                  :key="event.id"
                  class="p-3 rounded-lg mb-2"
                  :class="isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'"
                >
                  <div class="font-medium">{{ event.label }}</div>
                  <div v-if="event.note" class="text-sm mt-1 opacity-90">{{ event.note }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Creación de Evento -->
    <div v-if="showCreateEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" :class="isDark ? 'bg-gray-800' : 'bg-white'">
        <!-- Header del Modal -->
        <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <svg class="w-6 h-6 inline mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear un Evento
          </h2>
          <button @click="closeCreateEventModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="createEvent" class="p-6 space-y-6">
          <!-- Tipo -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Tipo</label>
            <div class="col-span-3">
              <select v-model="newEvent.type" class="w-full border rounded-lg px-3 py-2 text-sm" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'">
                <option value="AC_OTH">Cita</option>
                <option value="AC_MEETING">Reunión</option>
                <option value="AC_PHONE">Llamada</option>
                <option value="AC_EMAIL">Email</option>
                <option value="AC_RDV">Cita médica</option>
              </select>
            </div>
          </div>

          <!-- Título -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Título</label>
            <div class="col-span-3">
              <input 
                v-model="newEvent.label" 
                type="text" 
                required
                class="w-full border rounded-lg px-3 py-2 text-sm" 
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                placeholder="Título del evento"
              >
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium pt-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Fecha</label>
            <div class="col-span-3 space-y-3">
              <div class="flex items-center space-x-2">
                <input type="checkbox" v-model="newEvent.allDay" class="form-checkbox h-4 w-4 text-blue-600">
                <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Evento para todo el día</span>
              </div>
              
              <div class="flex items-center space-x-4">
                <input 
                  v-model="newEvent.date" 
                  type="date" 
                  required
                  class="border rounded-lg px-3 py-2 text-sm" 
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                >
                <input 
                  v-if="!newEvent.allDay"
                  v-model="newEvent.startTime" 
                  type="time" 
                  required
                  class="border rounded-lg px-3 py-2 text-sm" 
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                >
                <span v-if="!newEvent.allDay" class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">a</span>
                <input 
                  v-if="!newEvent.allDay"
                  v-model="newEvent.endTime" 
                  type="time" 
                  class="border rounded-lg px-3 py-2 text-sm" 
                  :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                >
              </div>
            </div>
          </div>

          <!-- Evento asignado a -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Evento asignado a</label>
            <div class="col-span-3 flex items-center space-x-2">
              <div class="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-white">{{ userInitials }}</span>
                </div>
                <span>{{ authStore.user?.firstname || authStore.user?.login }} (Propietario)</span>
                <input type="checkbox" checked disabled class="form-checkbox h-4 w-4 text-blue-600">
                <span class="text-xs">Ocupado</span>
              </div>
            </div>
          </div>

          <!-- Localización -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Localización</label>
            <div class="col-span-3">
              <input 
                v-model="newEvent.location" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 text-sm" 
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                placeholder="Ubicación del evento"
              >
            </div>
          </div>

          <!-- Estado/Progreso -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Estado / Progreso</label>
            <div class="col-span-3 flex items-center space-x-2">
              <select v-model="newEvent.status" class="border rounded-lg px-3 py-2 text-sm" :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'">
                <option value="0">A realizar</option>
                <option value="50">En progreso</option>
                <option value="100">Realizado</option>
              </select>
              <input 
                v-model="newEvent.percentage" 
                type="number" 
                min="0" 
                max="100" 
                class="w-20 border rounded-lg px-3 py-2 text-sm" 
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
              >
              <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">%</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium pt-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Descripción</label>
            <div class="col-span-3">
              <textarea 
                v-model="newEvent.note" 
                rows="4" 
                class="w-full border rounded-lg px-3 py-2 text-sm" 
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
                placeholder="Descripción del evento"
              ></textarea>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button 
              type="button" 
              @click="closeCreateEventModal"
              class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
              :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              Anular
            </button>
            <button 
              type="submit" 
              :disabled="creating"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <span v-if="creating">Creando...</span>
              <span v-else>Añadir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../stores/auth'
import http from '../utils/http'

const { isDark } = useTheme()
const authStore = useAuthStore()

// Estado del calendario
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const currentView = ref('month')
const eventos = ref([])
const loading = ref(true)
const showSystemAuto = ref(false)

// Modal de creación de eventos
const showCreateEventModal = ref(false)
const creating = ref(false)
const newEvent = ref({
  type: 'AC_OTH',
  label: '',
  date: '',
  startTime: '',
  endTime: '',
  allDay: false,
  location: '',
  status: '0',
  percentage: 0,
  note: ''
})

// Vistas disponibles
const views = [
  { key: 'month', label: 'Mes' },
  { key: 'week', label: 'Semana' },
  { key: 'day', label: 'Día' }
]

// Días de la semana
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Horas del día (8 AM a 8 PM)
const hours = Array.from({ length: 13 }, (_, i) => i + 8)

// Eventos filtrados (sin systemauto por defecto)
const filteredEventos = computed(() => {
  if (showSystemAuto.value) {
    return eventos.value
  }
  
  return eventos.value.filter(event => {
    // Filtrar eventos que contengan "systemauto" en el label, note, o type
    const label = (event.label || '').toLowerCase()
    const note = (event.note || '').toLowerCase()
    const type = (event.type || '').toLowerCase()
    
    return !label.includes('systemauto') && 
           !note.includes('systemauto') && 
           !type.includes('systemauto')
  })
})

// Fecha actual formateada
const currentDateFormatted = computed(() => {
  const options = { 
    year: 'numeric', 
    month: 'long',
    ...(currentView.value !== 'month' && { day: 'numeric' })
  }
  return currentDate.value.toLocaleDateString('es-ES', options)
})

// Fecha seleccionada formateada
const selectedDateFormatted = computed(() => {
  return selectedDate.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Días del mes para la vista mensual
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Primer día del mes
  const firstDay = new Date(year, month, 1)
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0)
  
  // Ajustar para que la semana empiece en lunes
  const startDate = new Date(firstDay)
  const dayOfWeek = firstDay.getDay()
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(firstDay.getDate() - daysToSubtract)
  
  const days = []
  const today = new Date()
  
  // Generar 42 días (6 semanas)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    days.push({
      date: new Date(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString()
    })
  }
  
  return days
})

// Iniciales del usuario
const userInitials = computed(() => {
  const user = authStore.user
  if (user?.firstname && user?.lastname) {
    return (user.firstname[0] + user.lastname[0]).toUpperCase()
  } else if (user?.firstname) {
    return user.firstname[0].toUpperCase()
  } else if (user?.login) {
    return user.login[0].toUpperCase()
  }
  return 'U'
})

// Navegación del calendario
const navigateCalendar = (direction) => {
  const newDate = new Date(currentDate.value)
  
  if (currentView.value === 'month') {
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
  } else if (currentView.value === 'week') {
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
  } else if (currentView.value === 'day') {
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
  }
  
  currentDate.value = newDate
}

// Ir a hoy
const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

// Seleccionar fecha
const selectDate = (date) => {
  selectedDate.value = new Date(date)
  if (currentView.value === 'month') {
    currentView.value = 'day'
    currentDate.value = new Date(date)
  }
}

// Obtener eventos para un día específico
const getEventsForDay = (date) => {
  return filteredEventos.value.filter(event => {
    if (!event.datep) return false
    const eventDate = new Date(event.datep * 1000)
    return eventDate.toDateString() === date.toDateString()
  })
}

// Obtener eventos para una hora específica en la vista semana
const getEventsForHour = (dayIndex, hour) => {
  const weekStart = getWeekStart(currentDate.value)
  const targetDate = new Date(weekStart)
  targetDate.setDate(weekStart.getDate() + dayIndex)
  
  return filteredEventos.value.filter(event => {
    if (!event.datep) return false
    const eventDate = new Date(event.datep * 1000)
    return eventDate.toDateString() === targetDate.toDateString() && 
           eventDate.getHours() === hour
  })
}

// Obtener eventos para una hora específica del día seleccionado
const getEventsForSelectedDayHour = (hour) => {
  return filteredEventos.value.filter(event => {
    if (!event.datep) return false
    const eventDate = new Date(event.datep * 1000)
    return eventDate.toDateString() === selectedDate.value.toDateString() && 
           eventDate.getHours() === hour
  })
}

// Obtener inicio de la semana
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Ajustar para que lunes sea el primer día
  return new Date(d.setDate(diff))
}

// Obtener número del día para la vista semana
const getWeekDayNumber = (dayName) => {
  const weekStart = getWeekStart(currentDate.value)
  const dayIndex = weekDays.indexOf(dayName)
  const targetDate = new Date(weekStart)
  targetDate.setDate(weekStart.getDate() + dayIndex)
  return targetDate.getDate()
}

// Cargar eventos
const loadEventos = async () => {
  try {
    console.log('🔍 Cargando eventos de la agenda...')
    
    // Obtener el ID del usuario logueado
    const userId = authStore.user?.id || 1
    console.log('👤 Usuario ID:', userId)
    
    // Llamar a la API de Dolibarr con los parámetros especificados
    const response = await http.get(`/api/doli/agendaevents?sortfield=t.id&sortorder=DESC&limit=100&user_ids=${userId}`)
    eventos.value = response.data || []
    console.log('✅ Eventos cargados:', eventos.value.length)
    
    // Procesar eventos para asegurar formato correcto
    eventos.value = eventos.value.map(event => ({
      ...event,
      // Asegurar que tenemos un label
      label: event.label || event.title || event.note || 'Evento sin título',
      // Convertir datep si viene como timestamp
      datep: event.datep || event.datehour || event.date_creation,
      // Asegurar que tenemos una duración
      duration: event.duration || event.duree || '1h'
    }))
    
    console.log('📅 Eventos procesados:', eventos.value.slice(0, 3)) // Mostrar primeros 3 para debug
    
    // Contar eventos systemauto para información
    const systemautoCount = eventos.value.filter(event => {
      const label = (event.label || '').toLowerCase()
      const note = (event.note || '').toLowerCase()
      const type = (event.type || '').toLowerCase()
      return label.includes('systemauto') || note.includes('systemauto') || type.includes('systemauto')
    }).length
    
    if (systemautoCount > 0) {
      console.log(`🤖 Eventos systemauto encontrados: ${systemautoCount} (ocultos por defecto)`)
    }
    
    // Si no hay eventos, agregar algunos de ejemplo para mostrar funcionalidad
    if (eventos.value.length === 0) {
      console.log('📝 No hay eventos, agregando ejemplos...')
      eventos.value = [
        {
          id: 'example-1',
          label: 'Reunión con cliente',
          note: 'Revisión del proyecto - Ejemplo',
          datep: Math.floor(new Date().getTime() / 1000) + 3600, // En 1 hora
          duration: '1h'
        },
        {
          id: 'example-2',
          label: 'Llamada de seguimiento',
          note: 'Seguimiento del ticket #123 - Ejemplo',
          datep: Math.floor(new Date(Date.now() + 86400000).getTime() / 1000) + 7200, // Mañana en 2 horas
          duration: '30min'
        },
        {
          id: 'example-3',
          label: 'Presentación del proyecto',
          note: 'Presentar avances al equipo - Ejemplo',
          datep: Math.floor(new Date(Date.now() + 172800000).getTime() / 1000) + 10800, // Pasado mañana en 3 horas
          duration: '2h'
        }
      ]
    }
  } catch (error) {
    console.error('❌ Error cargando eventos:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    // En caso de error, mostrar eventos de ejemplo
    eventos.value = [
      {
        id: 'error-example',
        label: 'Error cargando eventos',
        note: 'No se pudieron cargar los eventos reales. Mostrando ejemplo.',
        datep: Math.floor(new Date().getTime() / 1000) + 3600,
        duration: '1h'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Funciones del modal de creación de eventos
const openCreateEventModal = (date, hour = null) => {
  // Formatear la fecha para el input date
  const formattedDate = date.toISOString().split('T')[0]
  
  // Resetear el formulario
  newEvent.value = {
    type: 'AC_OTH',
    label: '',
    date: formattedDate,
    startTime: hour ? `${hour.toString().padStart(2, '0')}:00` : '09:00',
    endTime: hour ? `${(hour + 1).toString().padStart(2, '0')}:00` : '10:00',
    allDay: false,
    location: '',
    status: '0',
    percentage: 0,
    note: ''
  }
  
  showCreateEventModal.value = true
  console.log('📅 Abriendo modal para crear evento:', { date: formattedDate, hour })
}

const closeCreateEventModal = () => {
  showCreateEventModal.value = false
  creating.value = false
}

// Manejar click en hora de la vista semana
const handleHourClick = (dayIndex, hour) => {
  const weekStart = getWeekStart(currentDate.value)
  const targetDate = new Date(weekStart)
  targetDate.setDate(weekStart.getDate() + dayIndex)
  
  // Verificar si ya hay eventos en esa hora
  const existingEvents = getEventsForHour(dayIndex, hour)
  if (existingEvents.length === 0) {
    openCreateEventModal(targetDate, hour)
  }
}

// Manejar click en hora de la vista día
const handleDayHourClick = (hour) => {
  // Verificar si ya hay eventos en esa hora
  const existingEvents = getEventsForSelectedDayHour(hour)
  if (existingEvents.length === 0) {
    openCreateEventModal(selectedDate.value, hour)
  }
}

// Manejar click en día de la vista mes
const handleDayClick = (date) => {
  // Si es un doble click rápido o si no hay eventos, abrir modal de creación
  const existingEvents = getEventsForDay(date)
  
  if (existingEvents.length === 0) {
    // No hay eventos, abrir modal para crear uno
    openCreateEventModal(date)
  } else {
    // Hay eventos, cambiar a vista día para ver detalles
    selectDate(date)
  }
}

const createEvent = async () => {
  creating.value = true
  
  try {
    console.log('🔄 Creando evento...', newEvent.value)
    
    // Preparar los datos del evento para la API de Dolibarr
    const eventData = {
      type: newEvent.value.type,
      label: newEvent.value.label,
      note: newEvent.value.note,
      location: newEvent.value.location,
      status: parseInt(newEvent.value.status),
      percentage: parseInt(newEvent.value.percentage),
      userassigned: authStore.user?.id || 1
    }
    
    // Calcular timestamp para datep
    if (newEvent.value.allDay) {
      // Para eventos de todo el día, usar medianoche
      const eventDate = new Date(newEvent.value.date + 'T00:00:00')
      eventData.datep = Math.floor(eventDate.getTime() / 1000)
      eventData.datef = eventData.datep + 86400 // +24 horas
    } else {
      // Para eventos con hora específica
      const startDateTime = new Date(newEvent.value.date + 'T' + newEvent.value.startTime)
      eventData.datep = Math.floor(startDateTime.getTime() / 1000)
      
      if (newEvent.value.endTime) {
        const endDateTime = new Date(newEvent.value.date + 'T' + newEvent.value.endTime)
        eventData.datef = Math.floor(endDateTime.getTime() / 1000)
      } else {
        eventData.datef = eventData.datep + 3600 // +1 hora por defecto
      }
    }
    
    console.log('📤 Enviando datos del evento:', eventData)
    
    // Llamar a la API de Dolibarr para crear el evento
    const response = await http.post('/api/doli/agendaevents', eventData)
    
    console.log('✅ Evento creado exitosamente:', response.data)
    
    // Agregar el evento creado a la lista local
    const createdEvent = {
      id: response.data.id || Date.now(),
      label: eventData.label,
      note: eventData.note,
      datep: eventData.datep,
      location: eventData.location,
      status: eventData.status,
      percentage: eventData.percentage,
      type: eventData.type
    }
    
    eventos.value.push(createdEvent)
    
    // Cerrar el modal
    closeCreateEventModal()
    
    // Mostrar mensaje de éxito
    console.log('🎉 Evento agregado al calendario')
    
  } catch (error) {
    console.error('❌ Error creando evento:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    // Aquí podrías mostrar un toast o notificación de error
    alert('Error al crear el evento. Por favor, inténtalo de nuevo.')
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  loadEventos()
})
</script>
