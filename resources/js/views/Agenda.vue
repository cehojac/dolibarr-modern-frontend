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
          @click="showOverdueEventsModal = true"
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
      <div class="rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" :class="isDark ? 'bg-gray-800' : 'bg-white'">
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
            <div class="col-span-3">
              <select 
                v-model="newEvent.userownerid" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                  {{ user.firstname }} {{ user.lastname }} ({{ user.login }})
                </option>
              </select>
            </div>
          </div>

          <!-- Recurrencia -->
          <div class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Recurrencia</label>
            <div class="col-span-3">
              <select 
                v-model="newEvent.recurrence" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="none">Una sola vez</option>
                <option value="daily">Cada día</option>
                <option value="weekly">Cada semana</option>
                <option value="monthly">Cada mes</option>
              </select>
            </div>
          </div>

          <!-- Empresa relacionada (buscador) -->
          <div class="grid grid-cols-4 gap-4 items-start">
            <label class="text-sm font-medium pt-2 text-gray-700 dark:text-gray-300">Empresa</label>
            <div class="col-span-3 relative">
              <!-- Input de búsqueda -->
              <div class="relative">
                <input 
                  v-model="companySearchTerm" 
                  @input="onCompanySearch"
                  @focus="showCompanyDropdown = true"
                  type="text" 
                  placeholder="Buscar empresa (mín. 3 caracteres)..."
                  class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                <div v-if="isSearchingCompany" class="absolute right-3 top-2.5">
                  <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Dropdown de resultados -->
              <div 
                v-if="showCompanyDropdown && companySearchResults.length > 0" 
                class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'"
              >
                <div 
                  v-for="company in companySearchResults" 
                  :key="company.id"
                  @click="selectCompany(company)"
                  class="px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-sm"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                >
                  <div class="font-medium">{{ company.name }}</div>
                  <div v-if="company.alias" class="text-xs text-gray-500 dark:text-gray-400">{{ company.alias }}</div>
                </div>
              </div>
              
              <!-- Empresa seleccionada -->
              <div v-if="selectedCompany" class="mt-2 flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span class="text-sm font-medium" :class="isDark ? 'text-blue-200' : 'text-blue-800'">
                  {{ selectedCompany.name }}
                </span>
                <button 
                  @click="clearCompanySelection" 
                  type="button"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Contacto (solo si hay empresa seleccionada) -->
          <div v-if="newEvent.socid" class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contacto</label>
            <div class="col-span-3">
              <select 
                v-model="newEvent.contactid" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                :disabled="loadingContacts"
              >
                <option :value="null">-- Sin contacto --</option>
                <option v-for="contact in companyContacts" :key="contact.id" :value="contact.id">
                  {{ contact.firstname }} {{ contact.lastname }}
                </option>
              </select>
            </div>
          </div>

          <!-- Proyecto (solo si hay empresa seleccionada) -->
          <div v-if="newEvent.socid" class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Proyecto</label>
            <div class="col-span-3">
              <select 
                v-model="newEvent.projectid" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                :disabled="loadingProjects"
              >
                <option :value="null">-- Sin proyecto --</option>
                <option v-for="project in companyProjects" :key="project.id" :value="project.id">
                  {{ project.ref }} - {{ project.title }}
                </option>
              </select>
            </div>
          </div>

          <!-- Tarea (solo si hay proyecto seleccionado) -->
          <div v-if="newEvent.projectid" class="grid grid-cols-4 gap-4 items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tarea</label>
            <div class="col-span-3">
              <select 
                v-model="newEvent.taskid" 
                class="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                :disabled="loadingTasks"
              >
                <option :value="null">-- Sin tarea --</option>
                <option v-for="task in projectTasks" :key="task.id" :value="task.id">
                  {{ task.ref }} - {{ task.label }}
                </option>
              </select>
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
              {{ editingEvent ? 'Editar Evento' : 'Detalle del Evento' }}
            </h3>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ formatEventTime(selectedEvent) }} - {{ new Date(selectedEvent.datep * 1000).toLocaleDateString('es-ES') }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              v-if="!editingEvent"
              @click="startEditEvent"
              class="p-2 rounded-lg transition-colors"
              :class="isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'"
              title="Editar evento"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
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
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-6">
          <!-- Título -->
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Título
            </label>
            <input 
              v-if="editingEvent"
              v-model="editableEvent.label"
              type="text"
              class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
            <div v-else class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
              {{ selectedEvent.label || 'Sin título' }}
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Fecha
              </label>
              <input 
                v-if="editingEvent"
                v-model="editableEvent.date"
                type="date"
                class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
              <div v-else class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
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
                Hora Inicio
              </label>
              <input 
                v-if="editingEvent"
                v-model="editableEvent.startTime"
                type="time"
                class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
              <div v-else class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
                {{ formatEventTime(selectedEvent) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
                Hora Fin
              </label>
              <input 
                v-if="editingEvent"
                v-model="editableEvent.endTime"
                type="time"
                class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              />
              <div v-else-if="selectedEvent.datef" class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
                {{ new Date(selectedEvent.datef * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}
              </div>
              <div v-else class="p-3 rounded-lg text-gray-500" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
                No especificada
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

          <!-- Teléfono (solo para llamadas telefónicas) -->
          <div v-if="selectedEvent.thirdparty_phone && isPhoneCall(selectedEvent)">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Teléfono
            </label>
            <div class="p-3 rounded-lg flex items-center space-x-3" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <!-- Link de llamada -->
              <a :href="`tel:${selectedEvent.thirdparty_phone}`" 
                 class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                 :class="isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="font-medium">{{ selectedEvent.thirdparty_phone }}</span>
              </a>
              
              <!-- Link de WhatsApp -->
              <a :href="`https://wa.me/${selectedEvent.thirdparty_phone.replace(/[^0-9]/g, '')}`" 
                 target="_blank"
                 class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                 :class="isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
                 title="Abrir en WhatsApp">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span class="font-medium">WhatsApp</span>
              </a>
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
          <div v-if="editingEvent || selectedEvent.note">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Descripción
            </label>
            <textarea 
              v-if="editingEvent"
              v-model="editableEvent.note"
              rows="4"
              placeholder="Descripción o notas del evento"
              class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'"
            ></textarea>
            <div v-else class="p-3 rounded-lg whitespace-pre-line" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'" v-html="selectedEvent.note">
            </div>
          </div>

          <!-- Ubicación -->
          <div v-if="editingEvent || selectedEvent.location">
            <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              Ubicación
            </label>
            <input 
              v-if="editingEvent"
              v-model="editableEvent.location"
              type="text"
              placeholder="Ubicación del evento"
              class="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'"
            />
            <div v-else class="p-3 rounded-lg" :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'">
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
          <!-- Botones de edición -->
          <div v-if="editingEvent" class="flex space-x-3">
            <button 
              @click="saveEventChanges"
              :disabled="updatingEvent"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              :class="updatingEvent 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'"
            >
              <svg v-if="updatingEvent" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ updatingEvent ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
            <button 
              @click="cancelEditEvent"
              :disabled="updatingEvent"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              Cancelar
            </button>
          </div>
          <!-- Botón de completar/descompletar -->
          <div v-else class="flex space-x-3">
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

    <!-- Modal de Eventos Vencidos -->
    <div v-if="showOverdueEventsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg" :class="isDark ? 'bg-gray-800' : 'bg-white'">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 class="text-xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Eventos Vencidos ({{ overdueEvents.length }})
            </h2>
          </div>
          <button @click="showOverdueEventsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabla de eventos vencidos -->
        <div class="p-6">
          <div v-if="overdueEvents.length === 0" class="text-center py-8">
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">No hay eventos vencidos</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
              <thead :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                    Evento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                    Tipo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                    Contacto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-500'">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'">
                <tr 
                  v-for="event in overdueEvents" 
                  :key="event.id"
                  class="cursor-pointer transition-colors"
                  :class="isDark ? 'bg-red-900/20 hover:bg-red-900/30' : 'bg-red-50 hover:bg-red-100'"
                  @click="openOverdueEventDetail(event)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div class="text-sm font-medium" :class="isDark ? 'text-red-300' : 'text-red-700'">
                          {{ formatEventDate(event.datep) }}
                        </div>
                        <div class="text-xs" :class="isDark ? 'text-red-400' : 'text-red-600'">
                          {{ formatEventTime(event.datep) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium" :class="isDark ? 'text-red-300' : 'text-red-700'">
                      {{ event.label || 'Sin título' }}
                    </div>
                    <div v-if="event.note" class="text-xs mt-1" :class="isDark ? 'text-red-400' : 'text-red-600'">
                      {{ truncateText(event.note, 50) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'">
                      {{ getEventTypeName(event.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm" :class="isDark ? 'text-red-300' : 'text-red-700'">
                      {{ event.thirdparty_name || '-' }}
                    </div>
                    <div v-if="event.phone" class="text-xs" :class="isDark ? 'text-red-400' : 'text-red-600'">
                      {{ event.phone }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click.stop="openOverdueEventDetail(event)"
                      class="inline-flex items-center px-3 py-1 rounded-lg font-medium transition-colors"
                      :class="isDark ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end p-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <button 
            @click="showOverdueEventsModal = false"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuthStore } from '../stores/auth'
import { useAgendaCounter } from '../composables/useAgendaCounter'
import { useNotificationStore } from '../stores/notifications'
import { useThirdpartySearch } from '../composables/useThirdpartySearch'
import http from '../utils/http'

const { isDark } = useTheme()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { incrementTodayCount, decrementTodayCount, incrementFromCompleted } = useAgendaCounter()

// Estado del calendario
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const currentView = ref('month')
const eventos = ref([])
const loading = ref(true)
const showSystemAuto = ref(false)

// Cache de terceros para enriquecimiento rápido
const terceros = ref([])

// Modal de creación de eventos
const showCreateEventModal = ref(false)
const creating = ref(false)

// Modal de detalle de evento
const showEventDetailModal = ref(false)
const selectedEvent = ref(null)
const updatingEvent = ref(false)
const editingEvent = ref(false)
const editableEvent = ref({
  label: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  note: '',
  type: ''
})

// Modal de eventos vencidos
const showOverdueEventsModal = ref(false)
const newEvent = ref({
  type: 'AC_RDV',
  label: '',
  date: '',
  startTime: '',
  endTime: '',
  allDay: false,
  recurrence: 'none', // Recurrencia del evento
  socid: null, // Empresa relacionada
  contactid: null, // Contacto relacionado
  projectid: null, // Proyecto relacionado
  taskid: null, // Tarea relacionada
  location: '',
  status: '0',
  percentage: 0,
  note: '',
  userownerid: null // Se establecerá al usuario actual por defecto
})

// Lista de usuarios disponibles
const availableUsers = ref([])
const loadingUsers = ref(false)

// Buscador de empresas
const { searchThirdparties, isSearching: isSearchingCompany } = useThirdpartySearch()
const companySearchTerm = ref('')
const companySearchResults = ref([])
const showCompanyDropdown = ref(false)
const selectedCompany = ref(null)

// Datos relacionados con la empresa seleccionada
const companyContacts = ref([])
const companyProjects = ref([])
const projectTasks = ref([])
const loadingContacts = ref(false)
const loadingProjects = ref(false)
const loadingTasks = ref(false)

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

// Detectar si el evento es una llamada telefónica
const isPhoneCall = (event) => {
  if (!event) return false
  
  const label = (event.label || '').toLowerCase()
  const type = (event.type || '').toLowerCase()
  const note = (event.note || '').toLowerCase()
  const code = (event.code || '').toLowerCase()
  
  // Palabras clave que indican una llamada telefónica
  const phoneKeywords = ['llamada', 'call', 'teléfono', 'telefono', 'phone', 'ac_tel']
  
  return phoneKeywords.some(keyword => 
    label.includes(keyword) || 
    type.includes(keyword) || 
    note.includes(keyword) ||
    code.includes(keyword)
  )
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
  editingEvent.value = false
}

// Funciones de edición de evento
const startEditEvent = () => {
  if (!selectedEvent.value) return
  
  // Preparar datos editables
  const eventDate = new Date(selectedEvent.value.datep * 1000)
  const startTime = eventDate.toTimeString().slice(0, 5)
  
  let endTime = ''
  if (selectedEvent.value.datef) {
    const endDate = new Date(selectedEvent.value.datef * 1000)
    endTime = endDate.toTimeString().slice(0, 5)
  }
  
  editableEvent.value = {
    label: selectedEvent.value.label || '',
    date: eventDate.toISOString().split('T')[0],
    startTime: startTime,
    endTime: endTime,
    location: selectedEvent.value.location || '',
    note: selectedEvent.value.note || '',
    type: selectedEvent.value.type || 'AC_OTH'
  }
  
  editingEvent.value = true
}

const cancelEditEvent = () => {
  editingEvent.value = false
}

const saveEventChanges = async () => {
  if (!selectedEvent.value?.id) return
  
  try {
    updatingEvent.value = true
    
    // Calcular timestamps
    const startDateTime = new Date(editableEvent.value.date + 'T' + editableEvent.value.startTime)
    const datep = Math.floor(startDateTime.getTime() / 1000)
    
    let datef = datep + 3600 // Por defecto 1 hora después
    if (editableEvent.value.endTime) {
      const endDateTime = new Date(editableEvent.value.date + 'T' + editableEvent.value.endTime)
      datef = Math.floor(endDateTime.getTime() / 1000)
    }
    
    // Preparar datos para actualización
    const updateData = {
      label: editableEvent.value.label,
      datep: datep,
      datef: datef,
      location: editableEvent.value.location,
      note_private: editableEvent.value.note,
      type_code: editableEvent.value.type
    }
    
    // Realizar petición PUT
    const response = await http.put(`/api/doli/agendaevents/${selectedEvent.value.id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
    
    // Actualizar evento local
    selectedEvent.value.label = editableEvent.value.label
    selectedEvent.value.datep = datep
    selectedEvent.value.datef = datef
    selectedEvent.value.location = editableEvent.value.location
    selectedEvent.value.note = editableEvent.value.note
    selectedEvent.value.type = editableEvent.value.type
    
    // Actualizar en la lista de eventos
    const eventIndex = eventos.value.findIndex(e => e.id === selectedEvent.value.id)
    if (eventIndex !== -1) {
      eventos.value[eventIndex] = { ...selectedEvent.value }
    }
    
    // Salir del modo edición
    editingEvent.value = false
    
    // Mostrar notificación de éxito
    notificationStore.success('El evento ha sido actualizado correctamente', 'Evento actualizado')
    
  } catch (error) {
    // console.error('❌ Error actualizando evento:', error)
    // Mostrar notificación de error
    notificationStore.error('No se pudo actualizar el evento. Por favor, inténtalo de nuevo.', 'Error al actualizar')
  } finally {
    updatingEvent.value = false
  }
}

// Cargar terceros una sola vez (cache)
const fetchTerceros = async () => {
  if (terceros.value.length > 0) return // Ya están cargados
  
  try {
    // console.log('🏢 Cargando terceros...')
    const response = await http.get('/api/doli/thirdparties?limit=5000&status=1')
    terceros.value = response.data || []
    // console.log('✅ Terceros cargados:', terceros.value.length)
  } catch (error) {
    // console.error('❌ Error cargando terceros:', error)
  }
}

// Cargar eventos
const loadEventos = async () => {
  try {
    // console.log('🔍 Cargando eventos de la agenda...')
    
    // Obtener el ID del usuario logueado
    const userId = authStore.user?.id || 1
    // console.log('👤 Usuario ID:', userId)
    
    // Llamar a la API de Dolibarr (límite ampliado a 500 eventos)
    const response = await http.get(`/api/doli/agendaevents?sortfield=t.id&sortorder=DESC&limit=500&user_ids=${userId}`)
    
    // console.log('📦 Respuesta de la API:', response.data)
    
    const eventosData = response.data || []
    // console.log('✅ Eventos cargados:', eventosData.length)

    // Procesar eventos para asegurar formato correcto y enriquecer con datos de terceros
    eventos.value = eventosData.map(event => {
      const thirdpartyId = event.fk_soc || event.id_soc || event.socid
      
      // Buscar tercero en cache (sin llamada API)
      let thirdpartyInfo = null
      if (thirdpartyId && terceros.value.length > 0) {
        const tercero = terceros.value.find(t => t.id == thirdpartyId)
        if (tercero) {
          thirdpartyInfo = {
            name: tercero.name,
            phone: tercero.phone || tercero.phone_pro || null
          }
        }
      }
      
      return {
        ...event,
        // Asegurar que tenemos un label
        label: event.label || event.title || event.note_public || 'Evento sin título',
        // Convertir datep si viene como timestamp
        datep: event.datep || event.datehour || event.date_creation,
        // Asegurar que tenemos una duración
        duration: event.duration || event.duree || '1h',
        // Información del tercero relacionado
        thirdparty_name: thirdpartyInfo?.name || event.thirdparty_name || event.societe_nom || event.contact_name || null,
        thirdparty_phone: thirdpartyInfo?.phone || null,
        thirdparty_id: thirdpartyId || null,
        // Ubicación del evento
        location: event.location || event.lieu || null,
        // Descripción/Notas del evento
        note: event.note_public || event.note_private || event.note || event.description || null,
        // Tipo de evento
        type: event.type || event.type_code || 'Evento',
        // Estado del evento
        status: event.status || event.statut || '0'
      }
    })
    
     // console.log('📅 Eventos procesados:', eventos.value.slice(0, 3)) // Mostrar primeros 3 para debug
    
    // Contar eventos systemauto para información
    const systemautoCount = eventos.value.filter(event => {
      const label = (event.label || '').toLowerCase()
      const note = (event.note || '').toLowerCase()
      const type = (event.type || '').toLowerCase()
      return label.includes('systemauto') || note.includes('systemauto') || type.includes('systemauto')
    }).length
    
    if (systemautoCount > 0) {
       // console.log(`🤖 Eventos systemauto encontrados: ${systemautoCount} (ocultos por defecto)`)
    }
    
    // Si no hay eventos, agregar algunos de ejemplo para mostrar funcionalidad
    if (eventos.value.length === 0) {
       // console.log('📝 No hay eventos, agregando ejemplos...')
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
    // console.error('❌ Error cargando eventos:', error)
    // console.error('Error details:', error.response?.data || error.message)
    
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
    recurrence: 'none', // Una sola vez por defecto
    socid: null,
    contactid: null,
    projectid: null,
    taskid: null,
    location: '',
    status: '0',
    percentage: 0,
    note: '',
    userownerid: authStore.user?.id || null // Usuario actual por defecto
  }
  
  // Resetear listas relacionadas
  companyContacts.value = []
  companyProjects.value = []
  projectTasks.value = []
  
  // Resetear buscador de empresas
  selectedCompany.value = null
  companySearchTerm.value = ''
  companySearchResults.value = []
  showCompanyDropdown.value = false
  
  showCreateEventModal.value = true
   // console.log('📅 Abriendo modal para crear evento:', { date: formattedDate, hour })
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
     // console.log('🔄 Creando evento...', newEvent.value)
    
    // Determinar cuántos eventos crear según la recurrencia
    const eventsToCreate = []
    const baseDate = new Date(newEvent.value.date)
    
    if (newEvent.value.recurrence === 'none') {
      // Un solo evento
      eventsToCreate.push(new Date(baseDate))
    } else {
      // Eventos recurrentes - crear los próximos 12 eventos
      const occurrences = 12
      for (let i = 0; i < occurrences; i++) {
        const eventDate = new Date(baseDate)
        
        switch (newEvent.value.recurrence) {
          case 'daily':
            eventDate.setDate(baseDate.getDate() + i)
            break
          case 'weekly':
            eventDate.setDate(baseDate.getDate() + (i * 7))
            break
          case 'monthly':
            eventDate.setMonth(baseDate.getMonth() + i)
            break
        }
        
        eventsToCreate.push(eventDate)
      }
    }
    
    // Crear cada evento
    for (const eventDate of eventsToCreate) {
      const formattedDate = eventDate.toISOString().split('T')[0]
      
      // Preparar los datos del evento para la API de Dolibarr
      const eventData = {
        type_code: newEvent.value.type, // AC_OTH, AC_RDV, etc.
        label: newEvent.value.label,
        note_private: newEvent.value.note, // Dolibarr usa note_private
        location: newEvent.value.location,
        status: parseInt(newEvent.value.status),
        percentage: parseInt(newEvent.value.percentage),
        userownerid: parseInt(newEvent.value.userownerid) || parseInt(authStore.user?.id) || 1,
        transparency: "0",
        priority: "0",
        fulldayevent: newEvent.value.allDay ? "1" : "0",
        ponctuel: "1", // Evento puntual
        entity: "1" // Entidad por defecto
      }
    
     // console.log('📤 Datos del evento preparados:', eventData)
     // console.log('🔍 type_code específicamente:', eventData.type_code)
    
      // Calcular timestamp para datep usando la fecha del evento actual
      if (newEvent.value.allDay) {
        // Para eventos de todo el día, usar medianoche
        const eventDateTime = new Date(formattedDate + 'T00:00:00')
        eventData.datep = Math.floor(eventDateTime.getTime() / 1000)
        eventData.datef = eventData.datep + 86400 // +24 horas
      } else {
        // Para eventos con hora específica
        const startDateTime = new Date(formattedDate + 'T' + newEvent.value.startTime)
        eventData.datep = Math.floor(startDateTime.getTime() / 1000)
        
        if (newEvent.value.endTime) {
          const endDateTime = new Date(formattedDate + 'T' + newEvent.value.endTime)
          eventData.datef = Math.floor(endDateTime.getTime() / 1000)
        } else {
          eventData.datef = eventData.datep + 3600 // +1 hora por defecto
        }
      }
      
       // console.log('📤 Enviando datos del evento:', eventData)
      
      // Llamar a la API de Dolibarr para crear el evento
      const response = await http.post('/api/doli/agendaevents', eventData)
      
       // console.log('✅ Evento creado exitosamente:', response.data)
      
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
    }
    
    // Cerrar el modal
    closeCreateEventModal()
    
    // Mostrar mensaje de éxito
    const eventCount = eventsToCreate.length
    const message = eventCount === 1 
      ? '🎉 Evento creado exitosamente' 
      : `🎉 ${eventCount} eventos recurrentes creados exitosamente`
    notificationStore.success(message)
    
  } catch (error) {
    // console.error('❌ Error creando evento:', error)
    // console.error('Error details:', error.response?.data || error.message)
    
    // Mostrar notificación de error
    notificationStore.error('No se pudo crear el evento. Por favor, inténtalo de nuevo.', 'Error al crear')
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
    // console.error('❌ No hay evento seleccionado para actualizar')
    return
  }

  try {
    updatingEvent.value = true
    
    // console.log('🔄 Actualizando estado del evento:', {
    //   eventId: selectedEvent.value.id,
    //   currentStatus: selectedEvent.value.status,
    //   newStatus: newStatus
    // })

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

    // console.log('✅ Evento actualizado:', response.data)

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
    // console.log(`🎉 Evento marcado como ${statusText}`)

  } catch (error) {
    // console.error('❌ Error actualizando evento:', error)
    // console.error('Error details:', error.response?.data || error.message)
    
    // Mostrar mensaje de error al usuario
    const statusText = newStatus === '1' ? 'completado' : 'pendiente'
    notificationStore.error(`No se pudo marcar el evento como ${statusText}. Por favor, inténtalo de nuevo.`, 'Error al actualizar')
    
  } finally {
    updatingEvent.value = false
  }
}

// Funciones auxiliares para el modal de eventos vencidos
const formatEventDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getEventTypeName = (type) => {
  const types = {
    'AC_TEL': 'Llamada',
    'AC_RDV': 'Reunión',
    'AC_EMAIL': 'Email',
    'AC_INT': 'Intervención',
    'AC_OTH': 'Otro'
  }
  return types[type] || type || 'Evento'
}

// Función para abrir detalle de evento vencido
const openOverdueEventDetail = (event) => {
  showOverdueEventsModal.value = false
  showEventDetail(event)
}

// Función para buscar empresas
const onCompanySearch = async () => {
  if (companySearchTerm.value.length < 3) {
    companySearchResults.value = []
    showCompanyDropdown.value = false
    return
  }
  
  const results = await searchThirdparties(companySearchTerm.value)
  companySearchResults.value = results
  showCompanyDropdown.value = true
}

// Función para seleccionar una empresa
const selectCompany = async (company) => {
  selectedCompany.value = company
  newEvent.value.socid = company.id
  companySearchTerm.value = company.name
  showCompanyDropdown.value = false
  
  // Cargar contactos y proyectos de la empresa
  await onCompanyChange()
}

// Función para limpiar la selección de empresa
const clearCompanySelection = () => {
  selectedCompany.value = null
  newEvent.value.socid = null
  companySearchTerm.value = ''
  companySearchResults.value = []
  showCompanyDropdown.value = false
  
  // Resetear campos dependientes
  newEvent.value.contactid = null
  newEvent.value.projectid = null
  newEvent.value.taskid = null
  companyContacts.value = []
  companyProjects.value = []
  projectTasks.value = []
}

// Función cuando cambia la empresa seleccionada
const onCompanyChange = async () => {
  // Resetear campos dependientes
  newEvent.value.contactid = null
  newEvent.value.projectid = null
  newEvent.value.taskid = null
  companyContacts.value = []
  companyProjects.value = []
  projectTasks.value = []
  
  if (!newEvent.value.socid) return
  
  // Cargar contactos y proyectos de la empresa en paralelo
  await Promise.all([
    loadCompanyContacts(newEvent.value.socid),
    loadCompanyProjects(newEvent.value.socid)
  ])
}

// Cargar contactos de una empresa
const loadCompanyContacts = async (socid) => {
  try {
    loadingContacts.value = true
    const response = await http.get('/api/doli/contacts', {
      params: {
        sortfield: 'lastname',
        sortorder: 'ASC',
        sqlfilters: `(t.fk_soc:=:${socid})`
      }
    })
    companyContacts.value = response.data || []
    console.log(`✅ Contactos cargados para empresa ${socid}:`, companyContacts.value.length)
  } catch (error) {
    console.error('❌ Error cargando contactos:', error)
  } finally {
    loadingContacts.value = false
  }
}

// Cargar proyectos de una empresa
const loadCompanyProjects = async (socid) => {
  try {
    loadingProjects.value = true
    const response = await http.get('/api/doli/projects', {
      params: {
        sortfield: 'ref',
        sortorder: 'ASC',
        sqlfilters: `(t.fk_soc:=:${socid})`
      }
    })
    companyProjects.value = response.data || []
    console.log(`✅ Proyectos cargados para empresa ${socid}:`, companyProjects.value.length)
  } catch (error) {
    console.error('❌ Error cargando proyectos:', error)
  } finally {
    loadingProjects.value = false
  }
}

// Cargar tareas de un proyecto
const loadProjectTasks = async (projectid) => {
  try {
    loadingTasks.value = true
    const response = await http.get('/api/doli/tasks', {
      params: {
        sortfield: 'ref',
        sortorder: 'ASC',
        sqlfilters: `(t.fk_projet:=:${projectid})`
      }
    })
    projectTasks.value = response.data || []
    console.log(`✅ Tareas cargadas para proyecto ${projectid}:`, projectTasks.value.length)
  } catch (error) {
    console.error('❌ Error cargando tareas:', error)
  } finally {
    loadingTasks.value = false
  }
}

// Cargar usuarios disponibles
const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const response = await http.get('/api/doli/users', {
      params: {
        sortfield: 'lastname',
        sortorder: 'ASC',
        limit: 100
      }
    })
    
    availableUsers.value = response.data || []
    
    // Establecer el usuario actual por defecto
    if (authStore.user?.id && !newEvent.value.userownerid) {
      newEvent.value.userownerid = authStore.user.id
    }
    
    console.log('✅ Usuarios cargados:', availableUsers.value.length)
  } catch (error) {
    console.error('❌ Error cargando usuarios:', error)
  } finally {
    loadingUsers.value = false
  }
}

// Watcher para cargar tareas cuando se selecciona un proyecto
watch(() => newEvent.value.projectid, async (newProjectId, oldProjectId) => {
  if (newProjectId && newProjectId !== oldProjectId) {
    newEvent.value.taskid = null
    projectTasks.value = []
    await loadProjectTasks(newProjectId)
  }
})

onMounted(async () => {
  // Cargar terceros, eventos y usuarios en paralelo
  await Promise.all([
    fetchTerceros(),
    loadEventos(),
    loadUsers()
  ])
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
