<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Dolibarr Frontend
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Accede con tus credenciales de Dolibarr
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <FormInput
            id="login"
            v-model="data.login"
            type="text"
            label="Usuario"
            placeholder="Nombre de usuario"
            :error="errors.login"
            required
            @blur="validate('login')"
          />
          
          <FormInput
            id="password"
            v-model="data.password"
            type="password"
            label="Contraseña"
            placeholder="Contraseña"
            :error="errors.password"
            required
            @blur="validate('password')"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Verificando...</span>
            <span v-else>Acceder</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useValidation } from '../composables/useValidation'
import FormInput from '../components/FormInput.vue'

const router = useRouter()
const authStore = useAuthStore()

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
