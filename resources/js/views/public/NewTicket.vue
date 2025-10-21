<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                v-if="companyLogo" 
                :src="companyLogo" 
                :alt="companyName"
                class="w-full h-full object-contain"
                @error="(e) => { console.error('❌ Error al cargar imagen:', companyLogo, e); companyLogo = null }"
                @load="() => console.log('✅ Imagen cargada exitosamente')"
              />
              <span v-else class="text-white font-bold text-xl">{{ companyInitials }}</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('public.tickets.title') }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ companyName }}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Welcome Message -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('public.tickets.welcome') }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{ $t('public.tickets.welcomeSubtitle') }}
        </p>
      </div>

      <!-- Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <!-- Crear Ticket -->
        <button
          @click="navigateTo('create')"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-blue-500"
        >
          <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.newTicket') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('public.tickets.newTicketDesc') }}
              </p>
            </div>
          </div>
        </button>

        <!-- Ver Lista -->
        <button
          @click="navigateTo('list')"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-green-500"
        >
          <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.listTickets') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('public.tickets.listTicketsDesc') }}
              </p>
            </div>
          </div>
        </button>

        <!-- Mostrar por ID -->
        <button
          @click="navigateTo('track')"
          class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-2 border-transparent hover:border-purple-500"
        >
          <div class="flex flex-col items-center text-center space-y-4">
            <div class="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.trackTicket') }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('public.tickets.trackTicketDesc') }}
              </p>
            </div>
          </div>
        </button>
      </div>

      <!-- Info Section -->
      <div class="mt-16 bg-blue-50 dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.needHelp') }}</h4>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              {{ $t('public.tickets.needHelpDesc') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()
const companyName = ref('CH CONSULTING') // Valor por defecto
const companyLogo = ref(null) // Logo de la empresa
const companyInitials = ref('CH') // Iniciales por defecto

const navigateTo = (action) => {
  if (action === 'create') {
    router.push('/new-ticket/create')
  } else if (action === 'track') {
    router.push('/new-ticket/track')
  } else if (action === 'list') {
    router.push('/new-ticket/list')
  }
}

// Cargar nombre y logo de la empresa
const loadCompanyInfo = async () => {
  try {
    console.log('🏢 Obteniendo información de la empresa')
    const response = await http.get('/api/doli/setup/company', {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    if (response.data) {
      // Cargar nombre
      if (response.data.name) {
        companyName.value = response.data.name
        console.log('✅ Nombre de empresa cargado:', companyName.value)
        
        // Calcular iniciales del nombre
        const words = response.data.name.split(' ')
        if (words.length >= 2) {
          companyInitials.value = words[0][0] + words[1][0]
        } else if (words.length === 1 && words[0].length >= 2) {
          companyInitials.value = words[0].substring(0, 2)
        }
        console.log('✅ Iniciales calculadas:', companyInitials.value)
      }
      
      // Cargar idioma por defecto
      if (response.data.default_lang) {
        // Solo establecer si no hay idioma guardado en localStorage
        const savedLocale = localStorage.getItem('locale')
        if (!savedLocale) {
          // Mapear el código de idioma de Dolibarr a nuestros códigos
          const langMap = {
            'es_ES': 'es',
            'en_US': 'en',
            'ca_ES': 'ca',
            'es': 'es',
            'en': 'en',
            'ca': 'ca'
          }
          
          const mappedLang = langMap[response.data.default_lang] || 'es'
          locale.value = mappedLang
          localStorage.setItem('locale', mappedLang)
          console.log('🌍 Idioma por defecto establecido:', mappedLang, '(desde', response.data.default_lang + ')')
        } else {
          console.log('🌍 Usando idioma guardado:', savedLocale)
        }
      }
      
      // Cargar logo
      console.log('📦 Respuesta completa de la API:', response.data)
      if (response.data.logo) {
        // Usar un endpoint proxy en el backend para obtener la imagen
        companyLogo.value = `/api/doli-image?modulepart=mycompany&file=${encodeURIComponent(response.data.logo)}`
        console.log('✅ Logo de empresa configurado:', companyLogo.value)
        console.log('📄 Logo original de API:', response.data.logo)
      } else {
        console.log('⚠️ No se encontró logo en la respuesta de la API')
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar información de empresa:', error)
    // Mantener valores por defecto
  }
}

// Cargar información de empresa al montar el componente
loadCompanyInfo()
</script>
