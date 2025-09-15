<template>
  <div class="min-h-screen flex" :class="isDark ? 'bg-black' : 'bg-gray-100'">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 shadow-xl flex flex-col" :class="isDark ? 'bg-gradient-to-b from-blue-600 to-blue-800' : 'bg-gradient-to-b from-blue-400 to-blue-500'">
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 border-b border-opacity-30 flex-shrink-0" :class="isDark ? 'border-blue-500' : 'border-blue-300'">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <span class="text-blue-600 font-bold text-lg">D</span>
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-white leading-tight">Dolibarr</h1>
          <p class="text-xs text-blue-100 opacity-80">Modern Frontend</p>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-8 px-4 flex-1 overflow-y-auto">
        <div class="space-y-2">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="$route.path === item.href 
              ? 'bg-white bg-opacity-20 text-blue-600 shadow-lg backdrop-blur-sm' 
              : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-blue-600 focus:bg-white focus:bg-opacity-10 focus:text-blue-600'"
          >
            <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
            </svg>
            {{ item.name }}
            <span v-if="item.count && item.count > 0" class="ml-auto bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              {{ item.count }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- User info at bottom - Always visible -->
      <div v-if="authStore.user" class="p-4 border-t border-blue-300 border-opacity-30 flex-shrink-0 mt-auto">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span class="text-white font-bold text-lg">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">
              {{ authStore.user.firstname || authStore.user.login }}
            </p>
            <p class="text-xs text-blue-100 opacity-80 truncate">
              {{ authStore.user.email || 'Usuario activo' }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium shadow-sm"
          :class="isDark ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50'"
        >
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden ml-64" :class="isDark ? 'bg-black' : 'bg-white'">
      <!-- Top bar -->
      <div class="relative z-10 flex-shrink-0 flex h-16 shadow-lg border-b" 
           :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex-1 px-6 flex justify-between items-center">
          <div class="flex-1 flex">
            <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ $route.name }}
            </h1>
          </div>
          <div class="ml-4 flex items-center space-x-4">
            <button 
              class="px-4 py-2 rounded-xl font-medium transition-colors"
              :class="isDark ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50'"
            >
              + Añadir nuevo
            </button>
            <button
              @click="toggleTheme"
              class="p-2 rounded-xl focus:outline-none transition-colors"
              :class="isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800'"
            >
              <!-- Sun icon for dark mode (when clicked will switch to light) -->
              <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon icon for light mode (when clicked will switch to dark) -->
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none" :class="isDark ? 'bg-black' : 'bg-gray-50'">
        <div class="py-8">
          <div class="max-w-7xl mx-auto px-6">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'
import { useTicketsCounter } from '../composables/useTicketsCounter'
import { useTasksCounter } from '../composables/useTasksCounter'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme, initTheme } = useTheme()
const { assignedTicketsCount, fetchAssignedTicketsCount, startAutoRefresh: startTicketsAutoRefresh } = useTicketsCounter()
const { assignedTasksCount, fetchAssignedTasksCount, startAutoRefresh: startTasksAutoRefresh } = useTasksCounter()

// Debug the counter value
watch(assignedTicketsCount, (newValue) => {
  console.log('Assigned tickets count changed:', newValue)
}, { immediate: true })

let stopTicketsAutoRefresh = null
let stopTasksAutoRefresh = null

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!authStore.user) return 'U'
  const firstname = authStore.user.firstname || ''
  const lastname = authStore.user.lastname || ''
  const login = authStore.user.login || ''
  
  if (firstname && lastname) {
    return (firstname[0] + lastname[0]).toUpperCase()
  } else if (firstname) {
    return firstname[0].toUpperCase()
  } else if (login) {
    return login[0].toUpperCase()
  }
  return 'U'
})

const navigation = computed(() => [
  { name: 'Dashboard', href: '/', iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
  { name: 'Terceros', href: '/terceros', iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
  { name: 'Productos', href: '/productos', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { name: 'Servicios', href: '/servicios', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Proyectos', href: '/proyectos', iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { name: 'Documentos', href: '/documentos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Agenda', href: '/agenda', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Tickets', href: '/tickets', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', count: assignedTicketsCount.value },
  { name: 'Tareas', href: '/tareas', iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', count: assignedTasksCount.value }
])

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  initTheme()
  await fetchAssignedTicketsCount()
  await fetchAssignedTasksCount()
  stopTicketsAutoRefresh = startTicketsAutoRefresh()
  stopTasksAutoRefresh = startTasksAutoRefresh()
})

onUnmounted(() => {
  if (stopTicketsAutoRefresh) {
    stopTicketsAutoRefresh()
  }
  if (stopTasksAutoRefresh) {
    stopTasksAutoRefresh()
  }
})
</script>
