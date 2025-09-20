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
        </div>
      </div>
    </div>

    <!-- Calendario -->
    <div class="flex-1 rounded-lg border overflow-hidden" :class="isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'">
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
            class="border-r border-b p-2 min-h-[120px] relative cursor-pointer hover:bg-opacity-50"
            :class="[
              isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100',
              day.isCurrentMonth ? '' : (isDark ? 'bg-gray-900 text-gray-600' : 'bg-gray-50 text-gray-400'),
              day.isToday ? (isDark ? 'bg-blue-900' : 'bg-blue-50') : ''
            ]"
            @click="selectDate(day.date)"
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
                class="h-16 border-b p-1 relative"
                :class="isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'"
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
            class="border-b p-4 min-h-[80px] relative"
            :class="isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import http from '../utils/http'

const { isDark } = useTheme()

// Estado del calendario
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const currentView = ref('month')
const eventos = ref([])
const loading = ref(true)

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
  return eventos.value.filter(event => {
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
  
  return eventos.value.filter(event => {
    if (!event.datep) return false
    const eventDate = new Date(event.datep * 1000)
    return eventDate.toDateString() === targetDate.toDateString() && 
           eventDate.getHours() === hour
  })
}

// Obtener eventos para una hora específica del día seleccionado
const getEventsForSelectedDayHour = (hour) => {
  return eventos.value.filter(event => {
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
    const response = await http.get('/api/doli/agenda/events')
    eventos.value = response.data || []
    console.log('✅ Eventos cargados:', eventos.value.length)
    
    // Agregar algunos eventos de ejemplo si no hay datos
    if (eventos.value.length === 0) {
      eventos.value = [
        {
          id: 1,
          label: 'Reunión con cliente',
          note: 'Revisión del proyecto',
          datep: Math.floor(new Date().getTime() / 1000) + 3600, // En 1 hora
          duration: '1h'
        },
        {
          id: 2,
          label: 'Llamada de seguimiento',
          note: 'Seguimiento del ticket #123',
          datep: Math.floor(new Date(Date.now() + 86400000).getTime() / 1000) + 7200, // Mañana en 2 horas
          duration: '30min'
        },
        {
          id: 3,
          label: 'Presentación del proyecto',
          note: 'Presentar avances al equipo',
          datep: Math.floor(new Date(Date.now() + 172800000).getTime() / 1000) + 10800, // Pasado mañana en 3 horas
          duration: '2h'
        }
      ]
      console.log('📝 Agregados eventos de ejemplo')
    }
  } catch (error) {
    console.error('❌ Error cargando eventos:', error)
    // Agregar eventos de ejemplo en caso de error
    eventos.value = [
      {
        id: 1,
        label: 'Reunión con cliente',
        note: 'Revisión del proyecto',
        datep: Math.floor(new Date().getTime() / 1000) + 3600,
        duration: '1h'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEventos()
})
</script>
