<template>
  <div id="app">
    <router-view />
    <NotificationContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePermissionsStore } from './composables/usePermissions'
import NotificationContainer from './components/NotificationContainer.vue'

const authStore = useAuthStore()
const permissionsStore = usePermissionsStore()

onMounted(async () => {
  // console.log('🚀 App iniciándose...')
  
  // Inicializar sesión desde localStorage al cargar la app
  await authStore.initializeFromStorage()
  
  // Debug: mostrar estado después de inicializar
  // console.log('📊 Estado después de inicializar:')
  // console.log('  - Autenticado:', authStore.isAuthenticated)
  // console.log('  - Usuario:', authStore.user?.login)
  // console.log('  - Permisos cargados:', permissionsStore.hasPermissions)
  // console.log('  - Total permisos:', permissionsStore.permissions.length)
  
  if (permissionsStore.permissions.length > 0) {
    // console.log('  - Primeros 10 permisos:', permissionsStore.permissions.slice(0, 10))
  }
})
</script>
