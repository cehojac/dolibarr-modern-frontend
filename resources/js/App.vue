<template>
  <div id="app">
    <router-view />
    <NotificationContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NotificationContainer from './components/NotificationContainer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Inicializar sesión desde localStorage al cargar la app
  authStore.initializeFromStorage()
})
</script>
