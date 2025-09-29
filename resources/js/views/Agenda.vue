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
              class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
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

    <!-- Agenda Overview -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Agenda Overview</h2>
        <a href="#" class="text-blue-500 hover:text-blue-600 text-sm font-medium">Ver todos →</a>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <!-- Eventos de Hoy -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ todayEvents.length }}</p>
              <p class="text-sm font-medium text-blue-500">Hoy</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Eventos programados</p>
            </div>
          </div>
        </div>

        <!-- Eventos de Esta Semana -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ thisWeekEvents.length }}</p>
              <p class="text-sm font-medium text-green-500">Esta Semana</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Total programados</p>
            </div>
          </div>
        </div>

        <!-- Eventos Próximos -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ upcomingEvents.length }}</p>
              <p class="text-sm font-medium text-purple-500">Próximos</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Siguientes 7 días</p>
            </div>
          </div>
        </div>

        <!-- Eventos Vencidos -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all duration-200" 
          :class="overdueEvents.length > 0 
            ? (isDark ? 'bg-red-900/20 border-red-700 hover:bg-red-900/30' : 'bg-red-50 border-red-200 hover:bg-red-100')
            : (isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50')
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" 
                 :class="overdueEvents.length > 0 
                   ? (isDark ? 'text-red-300' : 'text-red-700')
                   : (isDark ? 'text-white' : 'text-gray-900')
                 ">
                {{ overdueEvents.length }}
              </p>
              <p class="text-sm font-medium" 
                 :class="overdueEvents.length > 0 ? 'text-red-500' : 'text-orange-500'">
                Vencidos
              </p>
              <p class="text-xs" 
                 :class="overdueEvents.length > 0 
                   ? (isDark ? 'text-red-400' : 'text-red-600')
                   : (isDark ? 'text-gray-400' : 'text-gray-600')
                 ">
                Eventos pasados
              </p>
            </div>
            <!-- Icono de alerta cuando hay eventos vencidos -->
            <div v-if="overdueEvents.length > 0" class="ml-2">
              <svg class="w-6 h-6" :class="isDark ? 'text-red-400' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Eventos Pendientes -->
        <div 
          class="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-shadow" 
          :class="isDark ? 'bg-gray-900 border-gray-800 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ pendingEvents.length }}</p>
              <p class="text-sm font-medium text-yellow-500">Pendientes</p>
              <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Por completar</p>
            </div>
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
            class="border-r border-b p-2 min-h-[120px] relative group"
            :class="[
              isDark ? 'border-gray-700' : 'border-gray-200',
              day.isCurrentMonth ? '' : (isDark ? 'bg-gray-900 text-gray-600' : 'bg-gray-50 text-gray-400'),
              day.isToday ? (isDark ? 'bg-blue-900' : 'bg-blue-50') : '',
              // Estilos para fechas pasadas
              isPastDate(day.date) ? 
                (isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') :
                (isDark ? 'cursor-pointer hover:bg-gray-700' : 'cursor-pointer hover:bg-gray-100')
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
                class="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-all duration-200 relative"
                :class="event.status === '1' 
                  ? (isDark ? 'bg-green-600 text-white border border-green-500' : 'bg-green-100 text-green-800 border border-green-300')
                  : (isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800')"
                @click="showEventDetail(event)"
              >
                <!-- Badge de completado -->
                <div v-if="event.status === '1'" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <!-- Hora del evento -->
                <div class="font-semibold text-xs mb-1 flex items-center justify-between">
                  <span>{{ formatEventTime(event) }}</span>
                  <!-- Indicador de completado en línea -->
                  <span v-if="event.status === '1'" class="text-xs">✅</span>
                </div>
                
                <!-- Título del evento -->
                <div class="truncate" :title="event.label" 
                     :class="event.status === '1' ? 'line-through opacity-75' : ''">
                  {{ event.label }}
                </div>
                
                <!-- Badge del tercero si existe -->
                <div v-if="event.thirdparty_name" class="mt-1">
                  <span class="inline-block px-1 py-0.5 text-xs rounded" 
                        :class="event.status === '1' 
                          ? (isDark ? 'bg-green-800 text-green-100' : 'bg-green-200 text-green-900')
                          : (isDark ? 'bg-blue-800 text-blue-100' : 'bg-blue-200 text-blue-900')">
                    {{ event.thirdparty_name }}
                  </span>
                </div>
              </div>
              
              <!-- Indicador para crear evento si no hay eventos -->
              <div 
                v-if="getEventsForDay(day.date).length === 0 && day.isCurrentMonth && !isPastDate(day.date)"
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
                class="h-16 border-b p-1 relative"
                :class="[
                  isDark ? 'border-gray-700' : 'border-gray-200',
                  isPastHour(day - 1, hour) ? 
                    (isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed') :
                    (isDark ? 'cursor-pointer hover:bg-gray-700' : 'cursor-pointer hover:bg-gray-50')
                ]"
                @click="handleHourClick(day - 1, hour)"
                :title="isPastHour(day - 1, hour) ? 'Hora pasada' : `Crear evento a las ${hour}:00`"
              >
                <!-- Eventos en esta hora -->
                <div
                  v-for="event in getEventsForHour(day - 1, hour)"
                  :key="event.id"
                  class="absolute inset-1 text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  :class="isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'"
                  @click="showEventDetail(event)"
                >
                  <div class="truncate font-semibold" :title="event.label">
                    {{ event.label }}
                  </div>
                  <div v-if="event.thirdparty_name" class="truncate text-xs opacity-90">
                    {{ event.thirdparty_name }}
                  </div>
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
            :class="[
              isDark ? 'border-gray-700' : 'border-gray-200',
              isPastDayHour(hour) ? 
                (isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed') :
                (isDark ? 'cursor-pointer hover:bg-gray-700' : 'cursor-pointer hover:bg-gray-50')
            ]"
            @click="handleDayHourClick(hour)"
            :title="isPastDayHour(hour) ? 'Hora pasada' : `Crear evento a las ${hour}:00`"
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
                  class="p-3 rounded-lg mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                  :class="isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'"
                  @click="showEventDetail(event)"
                >
                  <div class="font-medium">{{ event.label }}</div>
                  <div v-if="event.note" class="text-sm mt-1 opacity-90">{{ event.note }}</div>
                  <!-- Badge del tercero si existe -->
                  <div v-if="event.thirdparty_name" class="mt-2">
                    <span class="inline-block px-2 py-1 text-xs rounded-full" 
                          :class="isDark ? 'bg-purple-800 text-purple-100' : 'bg-purple-200 text-purple-900'">
                      👤 {{ event.thirdparty_name }}
                    </span>
                  </div>
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
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
            <div class="col-span-3">
              <select 
                v-model="newEvent.type" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="AC_RDV">Cita</option>
                <option value="AC_TEL">Llamada telefónica</option>
                <option value="AC_INT">Intervención in situ</option>
                <option value="AC_OTH">Otra</option>
                <option value="AC_EO_ONLINECONF">Online/Virtual conference</option>
                <option value="AC_EO_INDOORCONF">Indoor conference</option>
                <option value="AC_EO_ONLINEBOOTH">Online/Virtual booth</option>
                <option value="AC_EO_INDOORBOOTH">Indoor booth</option>
              </select>
            </div>
          </div>

          <!-- Título -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
            <div class="col-span-3">
              <input 
                v-model="newEvent.label" 
                type="text" 
                required
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Título del evento"
              >
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium pt-2 text-gray-700 dark:text-gray-300">Fecha</label>
            <div class="col-span-3 space-y-3">
              <div class="flex items-center space-x-2">
                <input type="checkbox" v-model="newEvent.allDay" class="form-checkbox h-4 w-4 text-blue-600 rounded bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                <span class="text-sm text-gray-700 dark:text-gray-300">Evento para todo el día</span>
              </div>
              
              <div class="flex items-center space-x-4">
                <input 
                  v-model="newEvent.date" 
                  type="date" 
                  required
                  :min="new Date().toISOString().split('T')[0]"
                  class="border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                <input 
                  v-if="!newEvent.allDay"
                  v-model="newEvent.startTime" 
                  type="time" 
                  required
                  class="border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                <span v-if="!newEvent.allDay" class="text-sm text-gray-700 dark:text-gray-300">a</span>
                <input 
                  v-if="!newEvent.allDay"
                  v-model="newEvent.endTime" 
                  type="time" 
                  class="border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
              </div>
            </div>
          </div>

          <!-- Evento asignado a -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Evento asignado a</label>
            <div class="col-span-3 flex items-center space-x-2">
              <div class="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium text-white">{{ userInitials }}</span>
                </div>
                <span>{{ authStore.user?.firstname || authStore.user?.login }} (Propietario)</span>
                <input type="checkbox" checked disabled class="form-checkbox h-4 w-4 text-blue-600 rounded bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                <span class="text-xs">Ocupado</span>
              </div>
            </div>
          </div>

          <!-- Localización -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Localización</label>
            <div class="col-span-3">
              <input 
                v-model="newEvent.location" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ubicación del evento"
              >
            </div>
          </div>

          <!-- Estado/Progreso -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estado / Progreso</label>
            <div class="col-span-3 flex items-center space-x-2">
              <select v-model="newEvent.status" class="border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="0">A realizar</option>
                <option value="50">En progreso</option>
                <option value="100">Realizado</option>
              </select>
              <input 
                v-model="newEvent.percentage" 
                type="number" 
                min="0" 
                max="100" 
                class="w-20 border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">%</span>
            </div>
          </div>

          <!-- Descripción -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium pt-2 text-gray-700 dark:text-gray-300">Descripción</label>
            <div class="col-span-3">
              <textarea 
                v-model="newEvent.note" 
                rows="4" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

    <!-- Modal de Detalle de Evento -->
    <div v-if="showEventDetailModal && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg" :class="isDark ? 'bg-gray-800' : 'bg-white'">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div>
            <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Detalle del Evento
            </h3>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ formatEventTime(selectedEvent) }} - {{ new Date(selectedEvent.datep * 1000).toLocaleDateString('es-ES') }}
            </p>
          </div>
          <button 
            @click="closeEventDetail"
            class="p-2 rounded-lg transition-colors"
            :class="isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-6">
          <!-- Título -->
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Título
            </label>
            <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              {{ selectedEvent.label || 'Sin título' }}
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Fecha
              </label>
              <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
                {{ new Date(selectedEvent.datep * 1000).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Hora
              </label>
              <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
                {{ formatEventTime(selectedEvent) }}
              </div>
            </div>
          </div>

          <!-- Tercero relacionado -->
          <div v-if="selectedEvent.thirdparty_name">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Tercero Relacionado
            </label>
            <div class="p-3 rounded-lg flex items-center space-x-2" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <span class="inline-block px-3 py-1 text-sm rounded-full" 
                    :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'">
                👤 {{ selectedEvent.thirdparty_name }}
              </span>
            </div>
          </div>

          <!-- Tipo de evento -->
          <div v-if="selectedEvent.type">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Tipo
            </label>
            <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              {{ selectedEvent.type }}
            </div>
          </div>

          <!-- Descripción/Notas -->
          <div v-if="selectedEvent.note">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Descripción
            </label>
            <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              {{ selectedEvent.note }}
            </div>
          </div>

          <!-- Ubicación -->
          <div v-if="selectedEvent.location">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Ubicación
            </label>
            <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              📍 {{ selectedEvent.location }}
            </div>
          </div>

          <!-- Duración -->
          <div v-if="selectedEvent.duration">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Duración
            </label>
            <div class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              ⏱️ {{ selectedEvent.duration }}
            </div>
          </div>

          <!-- Estado -->
          <div v-if="selectedEvent.status !== undefined">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Estado del Evento
            </label>
            <div class="p-4 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <!-- Check visual de completado -->
              <div class="flex items-center space-x-3 mb-3">
                <!-- Check visual grande -->
                <div v-if="selectedEvent.status === '1'" 
                     class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <!-- Círculo vacío para eventos pendientes -->
                <div v-else 
                     class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                     :class="isDark ? 'border-gray-500 bg-gray-600' : 'border-gray-300 bg-gray-100'">
                  <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div class="flex-1">
                  <span class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ selectedEvent.status === '1' ? '✅ Evento completado' : '⏳ Evento pendiente' }}
                  </span>
                  <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    {{ selectedEvent.status === '1' 
                      ? 'Este evento ha sido marcado como realizado' 
                      : 'Marca como completado cuando hayas realizado este evento' 
                    }}
                  </p>
                </div>
                
                <!-- Spinner de carga -->
                <div v-if="updatingEvent" class="flex items-center">
                  <svg class="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Barra de progreso -->
              <div v-if="selectedEvent.percentage !== undefined" class="flex items-center space-x-3">
                <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  Progreso:
                </span>
                <div class="flex-1 bg-gray-200 rounded-full h-2" :class="isDark ? 'bg-gray-600' : 'bg-gray-200'">
                  <div class="h-2 rounded-full transition-all duration-500" 
                       :class="selectedEvent.status === '1' ? 'bg-green-500' : 'bg-blue-500'"
                       :style="{ width: `${selectedEvent.percentage || 0}%` }">
                  </div>
                </div>
                <span class="text-xs font-medium min-w-[3rem] text-right" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                  {{ selectedEvent.percentage || 0 }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between p-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <!-- Botón de completar/descompletar -->
          <div class="flex space-x-3">
            <button 
              v-if="selectedEvent.status !== '1'"
              @click="markEventAsCompleted"
              :disabled="updatingEvent"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              :class="updatingEvent 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'"
            >
              <svg v-if="updatingEvent" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ updatingEvent ? 'Actualizando...' : 'Marcar como Completado' }}</span>
            </button>
            
            <button 
              v-else
              @click="markEventAsPending"
              :disabled="updatingEvent"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              :class="updatingEvent 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'"
            >
              <svg v-if="updatingEvent" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ updatingEvent ? 'Actualizando...' : 'Marcar como Pendiente' }}</span>
            </button>
          </div>
          
          <!-- Botón cerrar -->
          <button 
            @click="closeEventDetail"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../stores/auth'
import { useAgendaCounter } from '../composables/useAgendaCounter'
import http from '../utils/http'

const { isDark } = useTheme()
const authStore = useAuthStore()
const { incrementTodayCount, decrementTodayCount, incrementFromCompleted } = useAgendaCounter()

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

// Modal de detalle de evento
const showEventDetailModal = ref(false)
const selectedEvent = ref(null)
const updatingEvent = ref(false)
const newEvent = ref({
  type: 'AC_RDV',
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

// Métricas de eventos
const todayEvents = computed(() => {
  const today = new Date()
  
  // Inicio del día: hoy a las 00:00:01
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 1)
  
  // Final del día: hoy a las 23:59:59
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  
  return filteredEventos.value.filter(event => {
    const eventDateTime = new Date(event.datep * 1000)
    
    // Verificar si el evento está dentro del rango del día completo
    const isToday = eventDateTime >= startOfDay && eventDateTime <= endOfDay
    
    // TODOS los eventos del día (completados y no completados) - solo informativo
    return isToday
  })
})

const thisWeekEvents = computed(() => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Lunes
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6) // Domingo
  
  return filteredEventos.value.filter(event => {
    const eventDate = new Date(event.datep * 1000)
    // Solo contar eventos pendientes (no completados al 100%)
    const isPending = event.status !== '1' && (event.percentage || '0') !== '100'
    return eventDate >= weekStart && eventDate <= weekEnd && isPending
  })
})

const upcomingEvents = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  return filteredEventos.value.filter(event => {
    const eventDate = new Date(event.datep * 1000)
    // Solo contar eventos pendientes (no completados al 100%)
    const isPending = event.status !== '1' && (event.percentage || '0') !== '100'
    return eventDate > today && eventDate <= nextWeek && isPending
  })
})

const overdueEvents = computed(() => {
  const now = new Date()
  
  return filteredEventos.value.filter(event => {
    // Convertir timestamp a fecha/hora
    const eventDateTime = new Date(event.datep * 1000)
    
    // Verificar si el evento es anterior a la hora actual (now)
    const isOverdue = eventDateTime < now
    
    // Verificar si NO está completado al 100%
    const isNotCompleted = event.status !== '1' && (event.percentage || '0') !== '100'
    
    return isOverdue && isNotCompleted
  })
})

const pendingEvents = computed(() => {
  return filteredEventos.value.filter(event => {
    // Solo eventos pendientes (no completados al 100%)
    return event.status !== '1' && (event.percentage || '0') !== '100'
  })
})

// Verificar si una fecha está en el pasado
const isPastDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Resetear a medianoche para comparar solo fechas
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}

// Verificar si una hora específica en la vista semana está en el pasado
const isPastHour = (dayIndex, hour) => {
  const weekStart = getWeekStart(currentDate.value)
  const targetDate = new Date(weekStart)
  targetDate.setDate(weekStart.getDate() + dayIndex)
  targetDate.setHours(hour, 0, 0, 0)
  
  const now = new Date()
  return targetDate < now
}

// Verificar si una hora específica en la vista día está en el pasado
const isPastDayHour = (hour) => {
  const targetDateTime = new Date(selectedDate.value)
  targetDateTime.setHours(hour, 0, 0, 0)
  
  const now = new Date()
  return targetDateTime < now
}

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

// Formatear hora del evento
const formatEventTime = (event) => {
  if (!event.datep) return ''
  const eventDate = new Date(event.datep * 1000)
  return eventDate.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

// Mostrar detalle del evento
const showEventDetail = (event) => {
  selectedEvent.value = event
  showEventDetailModal.value = true
}

// Cerrar modal de detalle
const closeEventDetail = () => {
  showEventDetailModal.value = false
  selectedEvent.value = null
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
    
    // Obtener IDs únicos de terceros para consultar sus nombres
    const thirdpartyIds = [...new Set(
      eventos.value
        .map(event => event.fk_soc || event.id_soc || event.socid)
        .filter(id => id && id > 0)
    )]
    
    console.log('🏢 IDs de terceros encontrados:', thirdpartyIds)
    
    // Consultar nombres de terceros si hay IDs
    const thirdpartyNames = {}
    if (thirdpartyIds.length > 0) {
      try {
        for (const id of thirdpartyIds) {
          const thirdpartyResponse = await http.get(`/api/doli/thirdparties/${id}`)
          if (thirdpartyResponse.data && thirdpartyResponse.data.name) {
            thirdpartyNames[id] = thirdpartyResponse.data.name
          }
        }
        console.log('🏢 Nombres de terceros obtenidos:', thirdpartyNames)
      } catch (error) {
        console.warn('⚠️ Error obteniendo nombres de terceros:', error)
      }
    }

    // Procesar eventos para asegurar formato correcto
    eventos.value = eventos.value.map(event => {
      const thirdpartyId = event.fk_soc || event.id_soc || event.socid
      return {
        ...event,
        // Asegurar que tenemos un label
        label: event.label || event.title || event.note || 'Evento sin título',
        // Convertir datep si viene como timestamp
        datep: event.datep || event.datehour || event.date_creation,
        // Asegurar que tenemos una duración
        duration: event.duration || event.duree || '1h',
        // Información del tercero relacionado
        thirdparty_name: thirdpartyNames[thirdpartyId] || event.thirdparty_name || event.societe_nom || event.contact_name || null,
        thirdparty_id: thirdpartyId || null,
        // Ubicación del evento
        location: event.location || event.lieu || null,
        // Tipo de evento
        type: event.type || event.type_code || 'Evento',
        // Estado del evento
        status: event.status || event.statut || '0'
      }
    })
    
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
  // No permitir crear eventos en horas pasadas
  if (isPastHour(dayIndex, hour)) {
    return
  }
  
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
  // No permitir crear eventos en horas pasadas
  if (isPastDayHour(hour)) {
    return
  }
  
  // Verificar si ya hay eventos en esa hora
  const existingEvents = getEventsForSelectedDayHour(hour)
  if (existingEvents.length === 0) {
    openCreateEventModal(selectedDate.value, hour)
  }
}

// Manejar click en día de la vista mes
const handleDayClick = (date) => {
  // No permitir crear eventos en fechas pasadas
  if (isPastDate(date)) {
    // Si hay eventos, permitir ver detalles
    const existingEvents = getEventsForDay(date)
    if (existingEvents.length > 0) {
      selectDate(date)
    }
    return
  }
  
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
    // Basado en la estructura de eventos existentes de Dolibarr
    const eventData = {
      type_code: newEvent.value.type, // AC_OTH, AC_RDV, etc.
      label: newEvent.value.label,
      note_private: newEvent.value.note, // Dolibarr usa note_private
      location: newEvent.value.location,
      status: parseInt(newEvent.value.status),
      percentage: parseInt(newEvent.value.percentage),
      userownerid: parseInt(authStore.user?.id) || 1,
      transparency: "0",
      priority: "0",
      fulldayevent: newEvent.value.allDay ? "1" : "0",
      ponctuel: "1", // Evento puntual
      entity: "1" // Entidad por defecto
    }
    
     console.log('📤 Datos del evento preparados:', eventData)
     console.log('🔍 type_code específicamente:', eventData.type_code)
    
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
    
    // Si el evento es del día actual y futuro, incrementar el contador
    const today = new Date()
    const eventDateTime = new Date(eventData.datep * 1000)
    const isToday = eventDateTime.toDateString() === today.toDateString()
    
    if (isToday) {
      // Pasar el timestamp directamente al contador
      incrementTodayCount(eventData.datep)
    }
    
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

// Funciones para actualizar estado del evento
const markEventAsCompleted = async () => {
  await updateEventStatus('1')
}

const markEventAsPending = async () => {
  await updateEventStatus('0')
}

const updateEventStatus = async (newStatus) => {
  if (!selectedEvent.value?.id) {
    console.error('❌ No hay evento seleccionado para actualizar')
    return
  }

  try {
    updatingEvent.value = true
    
    console.log('🔄 Actualizando estado del evento:', {
      eventId: selectedEvent.value.id,
      currentStatus: selectedEvent.value.status,
      newStatus: newStatus
    })

    // Preparar datos para actualización
    const updateData = {
      status: newStatus,
      percentage: newStatus === '1' ? '100' : selectedEvent.value.percentage || '0'
    }

    // Realizar petición PUT al endpoint
    const response = await http.put(`/api/doli/agendaevents/${selectedEvent.value.id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })

    console.log('✅ Evento actualizado:', response.data)

    // Actualizar el evento localmente
    selectedEvent.value.status = newStatus
    selectedEvent.value.percentage = updateData.percentage

    // Actualizar en la lista de eventos
    const eventIndex = eventos.value.findIndex(e => e.id === selectedEvent.value.id)
    if (eventIndex !== -1) {
      eventos.value[eventIndex].status = newStatus
      eventos.value[eventIndex].percentage = updateData.percentage
    }

    // Actualizar contador de eventos pendientes si es evento de hoy
    const eventDate = new Date(selectedEvent.value.datep * 1000)
    const today = new Date()
    const isToday = eventDate.toDateString() === today.toDateString()
    
    if (isToday) {
      if (newStatus === '1') {
        // Evento marcado como completado - decrementar contador
        decrementTodayCount()
      } else {
        // Evento marcado como pendiente - incrementar contador
        incrementFromCompleted()
      }
    }

    // Mostrar mensaje de éxito
    const statusText = newStatus === '1' ? 'completado' : 'pendiente'
    console.log(`🎉 Evento marcado como ${statusText}`)

  } catch (error) {
    console.error('❌ Error actualizando evento:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    // Mostrar mensaje de error al usuario
    const statusText = newStatus === '1' ? 'completado' : 'pendiente'
    alert(`Error al marcar el evento como ${statusText}. Por favor, inténtalo de nuevo.`)
    
  } finally {
    updatingEvent.value = false
  }
}

onMounted(() => {
  loadEventos()
})
</script>

<style scoped>
/* Estilos personalizados para checkboxes en tema oscuro */
.dark input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.dark input[type="checkbox"]:focus {
  --tw-ring-color: rgb(59 130 246 / 0.5);
  box-shadow: 0 0 0 3px var(--tw-ring-color);
}

/* Mejorar contraste de placeholders en tema oscuro */
.dark input::placeholder,
.dark textarea::placeholder {
  color: #9ca3af;
}

/* Mejorar apariencia de selects en tema oscuro */
.dark select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
