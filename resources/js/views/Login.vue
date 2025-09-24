<template>
  <div class="min-h-screen flex">
    <!-- Theme Toggle Button -->
    <button
      @click="toggleTheme"
      class="fixed top-6 right-6 z-50 p-3 rounded-lg transition-colors duration-200"
      :class="isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'"
    >
      <svg v-if="isDark" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>

    <!-- Left Panel - Login Form (40% width for 4K 4:3) -->
    <div class="w-full lg:w-2/5 xl:w-2/5 2xl:w-2/5 flex items-center justify-center px-6 sm:px-8 lg:px-16 xl:px-20 2xl:px-32 transition-colors duration-200"
         :class="isDark ? 'bg-gray-900' : 'bg-white'">
      <div class="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <!-- Logo -->
        <div class="flex justify-center mb-10 lg:mb-12 xl:mb-16">
          <img :src="DolibarrLogo" alt="Dolibarr Logo" class="h-16 lg:h-20 xl:h-24 2xl:h-28 object-contain">
        </div>

        <!-- Welcome Message -->
        <div class="text-center mb-10 lg:mb-12 xl:mb-16">
          <span class="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold transition-colors duration-200"
          :class="isDark ? 'text-white' : 'text-gray-900'">DOLIBARR MODERN FRONTEND</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-8 lg:space-y-10 xl:space-y-12">
          <div class="space-y-6 lg:space-y-8">
            <div>
              <input
                id="login"
                v-model="data.login"
                type="text"
                placeholder="Correo electrónico o usuario"
                class="w-full px-4 py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-5 border rounded-lg text-base lg:text-lg xl:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                :class="[
                  errors.login ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300'),
                  isDark ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
                ]"
                required
                @blur="validate('login')"
              />
              <p v-if="errors.login" class="mt-2 text-base lg:text-lg text-red-600">{{ errors.login }}</p>
            </div>
            
            <div>
              <input
                id="password"
                v-model="data.password"
                type="password"
                placeholder="Contraseña"
                class="w-full px-4 py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-5 border rounded-lg text-base lg:text-lg xl:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                :class="[
                  errors.password ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300'),
                  isDark ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
                ]"
                required
                @blur="validate('password')"
              />
              <p v-if="errors.password" class="mt-2 text-base lg:text-lg text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" class="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-3 lg:ml-4 text-base lg:text-lg xl:text-xl transition-colors duration-200"
                    :class="isDark ? 'text-gray-400' : 'text-gray-600'">¿Recordar mi contraseña?</span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 px-6 lg:py-4 lg:px-8 xl:py-5 xl:px-10 rounded-lg text-base lg:text-lg xl:text-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            :class="isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'"
          >
            <span v-if="loading">Verificando...</span>
            <span v-else>Acceder</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Right Panel - Modern Office Background (60% width for 4K 4:3) -->
    <div class="hidden lg:block relative w-3/5 bg-blue-600">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/office.png')"
      >
      </div>
      
      <!-- Overlay for better contrast -->
    <!-- <div class="absolute inset-0 transition-colors duration-200"
           :class="isDark ? 'bg-black bg-opacity-40' : 'bg-blue-900 bg-opacity-30'">
      </div> -->
      
      <!-- Subtle gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
    </div>

    <!-- Componente de progreso de login -->
    <LoginProgress />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useValidation } from '../composables/useValidation'
import { useTheme } from '../composables/useTheme'
import FormInput from '../components/FormInput.vue'
import LoginProgress from '../components/LoginProgress.vue'
import DolibarrLogo from '../assets/Dolibarr_logo.png'
// import OfficeImage from '../assets/2db07771-ae62-4d3d-8c3d-10a087a9a5ef.png'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme, initTheme } = useTheme()

// Initialize theme on component mount
onMounted(() => {
  initTheme()
})

const validation = useValidation(
  { 
    login: '',
    password: ''
  },
  {
    login: ['required'],
    password: [
      'required',
      {
        type: 'minLength',
        value: 4,
        message: 'La contraseña debe tener al menos 4 caracteres'
      }
    ]
  }
)

const { data, errors, validate, isValid } = validation
const loading = ref(false)

const handleLogin = async () => {
  validate()
  if (!isValid.value) return
  
  loading.value = true
  
  try {
    await authStore.login(data.login, data.password)
    router.push('/')
  } catch (err) {
    // Error handling is done by the global interceptor
  } finally {
    loading.value = false
  }
}
</script>
