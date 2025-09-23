<template>
  <!-- Componente que muestra contenido solo si el usuario tiene los permisos necesarios -->
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback && !loading">
    <slot name="fallback">
      <div class="p-4 rounded-lg border" :class="isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-sm">No tienes permisos para ver este contenido</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePermissions } from '../composables/usePermissions'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  // Permiso único requerido
  permission: {
    type: String,
    default: null
  },
  
  // Lista de permisos (OR - cualquiera de ellos)
  anyPermissions: {
    type: Array,
    default: () => []
  },
  
  // Lista de permisos (AND - todos requeridos)
  allPermissions: {
    type: Array,
    default: () => []
  },
  
  // Mostrar mensaje de fallback cuando no tiene permisos
  showFallback: {
    type: Boolean,
    default: false
  },
  
  // Verificar permisos de forma asíncrona (consulta al servidor)
  async: {
    type: Boolean,
    default: false
  }
})

const { isDark } = useTheme()
const { hasPermission, hasAnyPermission, hasAllPermissions, checkPermission, loading } = usePermissions()

// Computed para verificar acceso
const hasAccess = computed(() => {
  // Si hay un permiso único
  if (props.permission) {
    return hasPermission(props.permission)
  }
  
  // Si hay permisos con OR
  if (props.anyPermissions.length > 0) {
    return hasAnyPermission(props.anyPermissions)
  }
  
  // Si hay permisos con AND
  if (props.allPermissions.length > 0) {
    return hasAllPermissions(props.allPermissions)
  }
  
  // Si no se especifica ningún permiso, permitir acceso
  return true
})

// Verificación asíncrona si es necesario
onMounted(async () => {
  if (props.async && props.permission) {
    try {
      const granted = await checkPermission(props.permission)
      if (!granted) {
        console.warn(`Permiso '${props.permission}' denegado por el servidor`)
      }
    } catch (error) {
      console.error('Error verificando permiso:', error)
    }
  }
})
</script>
