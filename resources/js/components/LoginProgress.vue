<template>
  <div v-if="authStore.loginStep" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <div class="text-center">
        <!-- Icono de progreso -->
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <svg v-if="authStore.loginStep !== 'complete'" class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Título del paso -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ getStepTitle() }}
        </h3>

        <!-- Descripción del paso -->
        <p class="text-sm text-gray-600 mb-4">
          {{ getStepDescription() }}
        </p>

        <!-- Barra de progreso -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            :style="{ width: authStore.loginProgress + '%' }"
          ></div>
        </div>

        <!-- Porcentaje -->
        <p class="text-xs text-gray-500">
          {{ authStore.loginProgress }}% completado
        </p>

        <!-- Lista de pasos -->
        <div class="mt-6 text-left">
          <div class="space-y-2">
            <div 
              v-for="(step, index) in steps" 
              :key="step.id"
              class="flex items-center text-sm"
              :class="getStepClass(step.id)"
            >
              <div class="flex-shrink-0 w-5 h-5 mr-3">
                <svg v-if="isStepComplete(step.id)" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="isStepCurrent(step.id)" class="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div v-else class="w-5 h-5 bg-gray-300 rounded-full"></div>
              </div>
              <span>{{ step.title }}</span>
            </div>
          </div>
        </div>

        <!-- Resumen de datos precargados -->
        <div v-if="hasSummary" class="mt-6 text-left border-t border-gray-200 pt-4">
          <h4 class="text-sm font-semibold text-gray-800 mb-3">
            Resumen de datos precargados
          </h4>
          <div class="space-y-3">
            <div
              v-for="item in summaryItems"
              :key="item.key"
              class="flex items-start gap-3 text-sm"
            >
              <div class="mt-0.5">
                <svg v-if="item.icon === 'check'" class="w-4 h-4" :class="item.iconClass" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="item.icon === 'minus'" class="w-4 h-4" :class="item.iconClass" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="item.icon === 'pause'" class="w-4 h-4" :class="item.iconClass" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 4a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V6a2 2 0 00-2-2H6zM13 4a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V6a2 2 0 00-2-2h-1z" />
                </svg>
                <svg v-else-if="item.icon === 'error'" class="w-4 h-4" :class="item.iconClass" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-.894.553L7.382 11H5a1 1 0 000 2h4a1 1 0 00.894-.553L12.618 9H15a1 1 0 100-2h-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-4 h-4" :class="item.iconClass" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 012 0v3a1 1 0 11-2 0v-3z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">{{ item.label }}</span>
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide" :class="item.badgeClass">
                    {{ item.badgeText }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ item.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const steps = [
  { id: 'authenticating', title: 'Verificando credenciales' },
  { id: 'loading_permissions', title: 'Cargando permisos' },
  { id: 'loading_data', title: 'Cargando datos adicionales' },
  { id: 'complete', title: 'Completado' }
]

const summaryLabels = {
  permissions: 'Permisos',
  thirdparties: 'Terceros',
  categories: 'Categorías',
  projects: 'Proyectos',
  tickets: 'Tickets asignados',
  tasks: 'Tareas asignadas',
  'additional-data': 'Datos adicionales'
}

const reasonMessages = {
  missing_permission: 'Sin permisos suficientes',
  missing_user: 'Falta identificar al usuario',
  no_request: 'No se pudo preparar la solicitud'
}

const formatDuration = (duration) => {
  if (typeof duration !== 'number' || Number.isNaN(duration)) return null
  if (duration >= 1000) {
    return `${(duration / 1000).toFixed(1)} s`
  }
  return `${Math.round(duration)} ms`
}

const summaryItems = computed(() => {
  return (authStore.loginDataSummary || []).map(item => {
    const status = item.status || 'loaded'
    const label = summaryLabels[item.key] || item.key
    let message = ''
    let badgeText = 'Pendiente'
    let badgeClass = 'bg-gray-100 text-gray-500'
    let icon = 'info'
    let iconClass = 'text-blue-500'

    if (item.key === 'permissions') {
      const count = typeof item.count === 'number' ? item.count : null
      if (status === 'loaded') {
        message = `${count ?? 0} permisos listos`
      } else if (status === 'empty') {
        message = 'No se encontraron permisos activos'
      }
    }

    switch (status) {
      case 'loaded': {
        const durationLabel = formatDuration(item.duration)
        badgeText = item.fromCache ? 'Desde caché' : 'Actualizado'
        badgeClass = item.fromCache ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        icon = 'check'
        iconClass = 'text-green-500'
        if (!message) {
          message = item.fromCache
            ? 'Datos reutilizados del caché reciente'
            : 'Datos precargados correctamente'
        }
        if (durationLabel) {
          message += ` • ${durationLabel}`
        }
        break
      }
      case 'empty': {
        badgeText = 'Sin datos'
        badgeClass = 'bg-amber-100 text-amber-700'
        icon = 'minus'
        iconClass = 'text-amber-500'
        if (!message) {
          message = 'No se encontraron registros recientes'
        }
        break
      }
      case 'skipped': {
        badgeText = 'Omitido'
        badgeClass = 'bg-gray-100 text-gray-500'
        icon = 'pause'
        iconClass = 'text-gray-400'
        message = reasonMessages[item.reason] || 'Requisito no cumplido'
        break
      }
      case 'error': {
        badgeText = 'Error'
        badgeClass = 'bg-red-100 text-red-700'
        icon = 'error'
        iconClass = 'text-red-500'
        message = item.error?.message || 'Error al precargar los datos'
        break
      }
      default: {
        badgeText = status
        badgeClass = 'bg-gray-100 text-gray-500'
        icon = 'info'
        iconClass = 'text-gray-400'
        message = message || 'Estado desconocido'
      }
    }

    return {
      ...item,
      label,
      status,
      message,
      badgeText,
      badgeClass,
      icon,
      iconClass
    }
  })
})

const getStepTitle = () => {
  switch (authStore.loginStep) {
    case 'authenticating':
      return 'Autenticando...'
    case 'loading_permissions':
      return 'Cargando permisos...'
    case 'loading_data':
      return 'Cargando datos...'
    case 'complete':
      return '¡Login completado!'
    default:
      return 'Iniciando sesión...'
  }
}

const getStepDescription = () => {
  switch (authStore.loginStep) {
    case 'authenticating':
      return 'Verificando tus credenciales con el servidor'
    case 'loading_permissions':
      return 'Obteniendo tus permisos y configuración'
    case 'loading_data':
      return 'Cargando tus datos e intervenciones'
    case 'complete':
      return 'Todo listo, redirigiendo al dashboard'
    default:
      return 'Preparando tu sesión...'
  }
}

const isStepComplete = (stepId) => {
  const stepOrder = ['authenticating', 'loading_permissions', 'loading_data', 'complete']
  const currentIndex = stepOrder.indexOf(authStore.loginStep)
  const stepIndex = stepOrder.indexOf(stepId)
  return stepIndex < currentIndex || authStore.loginStep === 'complete'
}

const isStepCurrent = (stepId) => {
  return authStore.loginStep === stepId
}

const getStepClass = (stepId) => {
  if (isStepComplete(stepId)) {
    return 'text-green-600'
  } else if (isStepCurrent(stepId)) {
    return 'text-blue-600 font-medium'
  } else {
    return 'text-gray-400'
  }
}

const hasSummary = computed(() => summaryItems.value.length > 0)
</script>
