<template>
  <div class="p-6" :class="isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">Pedidos Facturables</h1>
      <p class="text-sm text-gray-500 mt-1">Gestión de pedidos pendientes de facturación</p>
    </div>
    
    <div class="bg-white rounded-lg border p-8 text-center" :class="isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'">
      <div class="text-6xl mb-4">🛒</div>
      <h2 class="text-xl font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">Pedidos Facturables</h2>
      <p class="text-gray-500">Esta página está en desarrollo. Aquí podrás gestionar los pedidos pendientes de facturación.</p>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme'
const { isDark } = useTheme()
</script>
