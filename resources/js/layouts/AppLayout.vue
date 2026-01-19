<template>
  <div class="min-h-screen flex" :class="isDark ? 'bg-black' : 'bg-gray-100'">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 shadow-xl flex flex-col transition-all duration-300" 
         :class="[
           isDark ? 'bg-gradient-to-b from-blue-600 to-blue-800' : 'bg-gradient-to-b from-blue-500 to-blue-600',
           sidebarCollapsed ? 'w-20' : 'w-64 xl:w-80 2xl:w-96'
         ]">
      <!-- Logo -->
      <div class="flex items-center h-16 xl:h-20 2xl:h-24 border-b border-opacity-30 flex-shrink-0 transition-all duration-300" 
           :class="[
             isDark ? 'border-blue-500' : 'border-blue-300',
             sidebarCollapsed ? 'px-2 justify-center' : 'px-4 xl:px-6 2xl:px-8'
           ]">
        <div class="bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300"
             :class="sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 mr-3'">
          <span class="text-blue-600 font-bold" :class="sidebarCollapsed ? 'text-base' : 'text-lg xl:text-xl 2xl:text-2xl'">D</span>
        </div>
        <div v-if="!sidebarCollapsed" class="flex flex-col">
          <h1 class="text-lg xl:text-xl 2xl:text-2xl font-bold text-white leading-tight">Dolibarr</h1>
          <p class="text-xs xl:text-sm 2xl:text-base text-blue-100 opacity-80">Modern Frontend</p>
        </div>
        <!-- Toggle Button -->
        <button 
          v-if="!sidebarCollapsed"
          @click="toggleSidebar"
          class="ml-auto p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          title="Contraer menú"
        >
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Expand Button (when collapsed) -->
      <button 
        v-if="sidebarCollapsed"
        @click="toggleSidebar"
        class="mx-2 mt-4 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors flex items-center justify-center"
        title="Expandir menú"
      >
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Navigation -->
      <nav class="mt-8 flex-1 overflow-y-auto transition-all duration-300" :class="sidebarCollapsed ? 'px-2' : 'px-4 xl:px-6 2xl:px-8'">
        <div class="space-y-2">
          <!-- Regular navigation items -->
          <template v-for="item in navigation" :key="item.name">
            <!-- Items with submenu -->
            <div v-if="item.submenu" class="space-y-1">
              <button
                @click="sidebarCollapsed ? null : toggleSubmenu(item.name)"
                class="group flex items-center w-full transition-all duration-200"
                :class="[
                  isSubmenuActive(item) 
                    ? 'bg-white text-blue-700 shadow-lg font-semibold' 
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-25 hover:text-blue-700',
                  sidebarCollapsed 
                    ? 'px-2 py-2 rounded-lg justify-center' 
                    : 'px-4 xl:px-5 2xl:px-6 py-3 xl:py-4 2xl:py-5 text-sm xl:text-base 2xl:text-lg font-medium rounded-xl'
                ]"
                :title="sidebarCollapsed ? item.name : ''"
              >
                <svg class="flex-shrink-0 transition-all duration-200" 
                     :class="sidebarCollapsed ? 'h-5 w-5' : 'mr-3 xl:mr-4 2xl:mr-5 h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7'" 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
                </svg>
                <span v-if="!sidebarCollapsed" class="flex-1">{{ item.name }}</span>
                <svg 
                  v-if="!sidebarCollapsed"
                  class="ml-auto h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 transform transition-transform duration-200"
                  :class="openSubmenus.includes(item.name) ? 'rotate-180' : ''"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Submenu items -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-show="!sidebarCollapsed && openSubmenus.includes(item.name)" class="ml-8 xl:ml-10 2xl:ml-12 space-y-1 mt-2">
                  <router-link
                    v-for="subitem in item.submenu"
                    :key="subitem.name"
                    :to="subitem.href"
                    class="group flex items-center px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg font-medium rounded-lg transition-all duration-200"
                    :class="route.path === subitem.href 
                      ? 'bg-white text-blue-800 shadow-md border-l-4 border-blue-800 font-semibold' 
                      : 'text-blue-200 hover:bg-white hover:bg-opacity-30 hover:text-blue-800 focus:bg-white focus:bg-opacity-30 focus:text-blue-800 hover:border-l-2 hover:border-blue-300'"
                  >
                    <svg class="mr-3 xl:mr-4 2xl:mr-5 h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="subitem.iconPath" />
                    </svg>
                    {{ subitem.name }}
                  </router-link>
                </div>
              </transition>
            </div>
            
            <!-- Regular items without submenu -->
            <router-link
              v-else
              :to="item.href"
              class="group flex items-center transition-all duration-200 relative"
              :class="[
                route.path === item.href 
                  ? 'bg-white text-blue-700 shadow-lg font-semibold' 
                  : 'text-blue-100 hover:bg-white hover:bg-opacity-25 hover:text-blue-700',
                sidebarCollapsed 
                  ? 'px-2 py-2 rounded-lg justify-center' 
                  : 'px-4 xl:px-5 2xl:px-6 py-3 xl:py-4 2xl:py-5 text-sm xl:text-base 2xl:text-lg font-medium rounded-xl'
              ]"
              :title="sidebarCollapsed ? item.name : ''"
            >
              <svg class="flex-shrink-0 transition-all duration-200" 
                   :class="sidebarCollapsed ? 'h-5 w-5' : 'mr-3 xl:mr-4 2xl:mr-5 h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7'" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
              </svg>
              <span v-if="!sidebarCollapsed" class="flex-1">{{ item.name }}</span>
              <!-- Badge for counts -->
              <span v-if="item.count && item.count > 0" 
                    class="bg-white text-blue-600 font-bold rounded-full transition-all duration-200"
                    :class="sidebarCollapsed 
                      ? 'absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center' 
                      : 'ml-auto text-xs xl:text-sm 2xl:text-base px-2 xl:px-3 2xl:px-4 py-1 xl:py-1.5 2xl:py-2'">
                {{ item.count }}
              </span>
            </router-link>
          </template>
        </div>
      </nav>

      <!-- User info at bottom - Always visible -->
      <div v-if="authStore.user" class="border-t border-blue-300 border-opacity-30 flex-shrink-0 mt-auto transition-all duration-300" 
           :class="sidebarCollapsed ? 'p-2' : 'p-4 xl:p-6 2xl:p-8'">
        <div v-if="!sidebarCollapsed" class="flex items-center space-x-3 xl:space-x-4 2xl:space-x-5 mb-4">
          <div class="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span class="text-blue-900 font-bold text-lg xl:text-xl 2xl:text-2xl">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm xl:text-base 2xl:text-lg font-semibold text-white truncate">
              {{ authStore.user.firstname || authStore.user.login }}
            </p>
            <p class="text-xs xl:text-sm 2xl:text-base text-blue-100 opacity-80 truncate">
              {{ authStore.user.email || 'Usuario activo' }}
            </p>
          </div>
        </div>
        <div v-else class="flex justify-center mb-2">
          <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span class="text-blue-900 font-bold text-base">{{ userInitials }}</span>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full rounded-xl transition-all duration-200 font-medium shadow-sm"
          :class="[
            isDark ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50',
            sidebarCollapsed ? 'px-2 py-2 text-xs' : 'px-4 xl:px-5 2xl:px-6 py-2 xl:py-3 2xl:py-4 text-sm xl:text-base 2xl:text-lg'
          ]"
          :title="sidebarCollapsed ? 'Cerrar sesión' : ''"
        >
          <span v-if="!sidebarCollapsed">Cerrar sesión</span>
          <svg v-else class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden transition-all duration-300" 
         :class="[
           isDark ? 'bg-black' : 'bg-white',
           sidebarCollapsed ? 'ml-20' : 'ml-64 xl:ml-80 2xl:ml-96'
         ]">
      <!-- Top bar -->
      <div class="relative z-10 flex-shrink-0 flex h-16 xl:h-20 2xl:h-24 shadow-lg border-b" 
           :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
        <div class="flex-1 px-6 xl:px-8 2xl:px-12 flex justify-between items-center">
          <div class="flex-1 flex">
            <h1 class="text-2xl xl:text-3xl 2xl:text-4xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ route.name }}
            </h1>
          </div>
          <div class="ml-4 xl:ml-6 2xl:ml-8 flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
            <button 
              class="px-4 xl:px-6 2xl:px-8 py-2 xl:py-3 2xl:py-4 rounded-xl font-medium transition-colors text-sm xl:text-base 2xl:text-lg"
              :class="isDark ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-blue-600 hover:bg-blue-50'"
            >
              + Añadir nuevo
            </button>
            <button
              @click="toggleTheme"
              class="p-2 xl:p-3 2xl:p-4 rounded-xl focus:outline-none transition-colors"
              :class="isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800'"
            >
              <!-- Sun icon for dark mode (when clicked will switch to light) -->
              <svg v-if="isDark" class="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon icon for light mode (when clicked will switch to dark) -->
              <svg v-else class="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none" :class="isDark ? 'bg-black' : 'bg-gray-50'">
        <div class="py-8 xl:py-10 2xl:py-12">
          <div class="max-w-7xl xl:max-w-full 2xl:max-w-full mx-auto px-6 xl:px-8 2xl:px-12">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'
import { useTicketsCounter } from '../composables/useTicketsCounter'
import { useTasksCounter } from '../composables/useTasksCounter'
import { useAgendaCounter } from '../composables/useAgendaCounter'
import { usePermissions } from '../composables/usePermissions'
import { useApiCache } from '../composables/useApiCache'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleTheme, initTheme } = useTheme()
const { assignedTicketsCount, fetchAssignedTicketsCount, startAutoRefresh: startTicketsAutoRefresh } = useTicketsCounter()
const { assignedTasksCount, fetchAssignedTasksCount, startAutoRefresh: startTasksAutoRefresh } = useTasksCounter()
const { overdueEventsCount, fetchOverdueEventsCount, startAutoRefresh: startAgendaAutoRefresh } = useAgendaCounter()
const { hasAnyPermission } = usePermissions()
const { cachedFetch, hasCache } = useApiCache()
const prefetchPromises = {
  projects: null,
  thirdparties: null,
  categories: null
}

// Configuración de permisos por módulo del menú
const menuPermissions = {
  'Dashboard': null, // Siempre visible
  'Terceros': ['societe->lire'],
  'Comercial': ['propal->lire', 'commande->lire', 'contrat->lire'],
  'Financiera': ['facture->lire', 'fournisseur->facture->lire'],
  'Productos / Servicios': ['produit->lire', 'service->lire'],
  'Proyectos': ['projet->lire'],
  'Documentos': ['ecm->read'],
  'Agenda': ['agenda->myactions->read'],
  'Tickets': ['ticket->lire', 'ticket->read', 'tickets->lire', 'tickets->read'],
  'Tareas': ['projet->lire']
}

// Función para verificar si se debe mostrar un elemento del menú
const shouldShowMenuItem = (itemName) => {
  const requiredPermissions = menuPermissions[itemName]
  
  // Si no hay permisos definidos, siempre mostrar
  if (!requiredPermissions) {
    return true
  }
  
  // Verificar si tiene al menos uno de los permisos requeridos
  const hasPermission = hasAnyPermission(requiredPermissions)
  
  // Debug detallado para ver qué está pasando
  if (itemName !== 'Dashboard') {
    const allPermissions = usePermissions().permissions.value
    // console.log(`🔐 Verificando menú "${itemName}":`, {
    //   requiredPermissions,
    //   hasPermission,
    //   totalPermissions: allPermissions.length,
    //   samplePermissions: allPermissions.slice(0, 10),
    //   // Buscar permisos específicos
    //   hasSpecificPermissions: requiredPermissions.map(perm => ({
    //     permission: perm,
    //     found: allPermissions.includes(perm)
    //   }))
    // })
  }
  
  return hasPermission
}

// Sidebar collapse state - Load from localStorage
const sidebarCollapsed = ref(JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false'))

// Submenu state - Load from localStorage
const openSubmenus = ref(JSON.parse(localStorage.getItem('openSubmenus') || '[]'))

// Debug the counter values
watch(assignedTicketsCount, (newValue) => {
   // console.log('🎫 Assigned tickets count changed:', newValue)
}, { immediate: true })

watch(assignedTasksCount, (newValue) => {
   // console.log('📋 Assigned tasks count changed:', newValue)
}, { immediate: true })

watch(overdueEventsCount, (newValue) => {
   // console.log('⏰ Overdue events count changed:', newValue)
}, { immediate: true })

// Debug navigation computed (movido después de la definición de navigation)

let stopTicketsAutoRefresh = null
let stopTasksAutoRefresh = null
let stopAgendaAutoRefresh = null

const prefetchProjects = async () => {
  try {
    const cacheKey = 'projects:list'
    if (hasCache(cacheKey)) {
      return prefetchPromises.projects
    }

    prefetchPromises.projects = cachedFetch('/api/doli/projects', {
      params: { limit: 500, sortfield: 'datec', sortorder: 'DESC' },
      ttl: 600000,
      cacheKey
    })
    return prefetchPromises.projects
  } catch (error) {
    console.warn('⚠️ Background project prefetch failed', error)
  }
}

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

const navigation = computed(() => {
   // console.log('🔄 Navigation computed - Tasks count:', assignedTasksCount.value, 'Tickets count:', assignedTicketsCount.value, 'Overdue events count:', overdueEventsCount.value)
  const allMenuItems = [
    { name: 'Dashboard', href: '/', iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { 
      name: 'Terceros', 
      iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
      submenu: [
        { name: 'Clientes', href: '/terceros/clientes', iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'Proveedores', href: '/terceros/proveedores', iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Contactos', href: '/terceros/contactos', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Socios', href: '/terceros/socios', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
      ]
    },
    { 
      name: 'Comercial', 
      iconPath: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      submenu: [
        { name: 'Clientes Potenciales', href: '/comercial/clientes-potenciales', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Presupuestos', href: '/comercial/presupuestos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Contratos', href: '/comercial/contratos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
      ]
    },
    { 
      name: 'Financiera', 
      iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      submenu: [
        { name: 'Facturas a Clientes', href: '/financiera/facturas-clientes', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Facturas de Proveedor', href: '/financiera/facturas-proveedores', iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Pedidos Facturables', href: '/financiera/pedidos-facturables', iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { name: 'Donaciones', href: '/financiera/donaciones', iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { name: 'Impuestos', href: '/financiera/impuestos', iconPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
        { name: 'Préstamos', href: '/financiera/prestamos', iconPath: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Pagos Varios', href: '/financiera/pagos-varios', iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { name: 'Márgenes', href: '/financiera/margenes', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
      ]
    },
    { name: 'Productos / Servicios', href: '/productos', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Proyectos', href: '/proyectos', iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Documentos', href: '/documentos', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Agenda', href: '/agenda', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', count: overdueEventsCount.value },
    { name: 'Tickets', href: '/tickets', iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', count: assignedTicketsCount.value },
    { name: 'Tareas', href: '/tareas', iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', count: assignedTasksCount.value }
  ]
  
  // Filtrar elementos del menú según permisos
  return allMenuItems.filter(item => shouldShowMenuItem(item.name))
})

// Navigation computed is working correctly

// Sidebar toggle function
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // Save to localStorage
  localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed.value))
}

// Submenu functions
const toggleSubmenu = (menuName) => {
  const index = openSubmenus.value.indexOf(menuName)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(menuName)
  }
  // Save to localStorage
  localStorage.setItem('openSubmenus', JSON.stringify(openSubmenus.value))
}

const isSubmenuActive = (item) => {
  if (!item.submenu) return false
  return item.submenu.some(subitem => route.path === subitem.href)
}

// Auto-open submenu if we're on one of its pages
watch(route, (newRoute) => {
  navigation.value.forEach(item => {
    if (item.submenu) {
      const isActive = item.submenu.some(subitem => newRoute.path === subitem.href)
      if (isActive && !openSubmenus.value.includes(item.name)) {
        openSubmenus.value.push(item.name)
      }
    }
  })
}, { immediate: true })

const handleLogout = async () => {
  // console.log('🔄 Iniciando proceso de logout...')
  await authStore.logout()
  // console.log('🔄 Redirigiendo al login...')
  router.push('/login')
}

onMounted(async () => {
  initTheme()
  await fetchAssignedTicketsCount()
  await fetchAssignedTasksCount()
  await fetchOverdueEventsCount()
  stopTicketsAutoRefresh = startTicketsAutoRefresh()
  stopTasksAutoRefresh = startTasksAutoRefresh()
  stopAgendaAutoRefresh = startAgendaAutoRefresh()
  prefetchProjects()
})

onUnmounted(() => {
  if (stopTicketsAutoRefresh) {
    stopTicketsAutoRefresh()
  }
  if (stopTasksAutoRefresh) {
    stopTasksAutoRefresh()
  }
  if (stopAgendaAutoRefresh) {
    stopAgendaAutoRefresh()
  }
})
</script>
