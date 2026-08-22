<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Preferencias de Notificaciones
          </h2>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Canales y reglas de envío automático de correos para este cliente
          </p>
        </div>
      </div>
    </div>

    <!-- Opciones de Notificación -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="space-y-4">
        <!-- E-mails masivos -->
        <div class="flex items-center justify-between p-4 rounded-xl border" :class="isDark ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50 border-gray-200'">
          <div>
            <h4 class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Campañas y E-mails Masivos (EMailing)</h4>
            <p class="text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Permite incluir al cliente en envíos de marketing y circulares generales.</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="!tercero.no_email ? (isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700') : (isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700')">
            {{ !tercero.no_email ? 'Permitido' : 'Bloqueado' }}
          </span>
        </div>

        <!-- Notificaciones de Tickets -->
        <div class="flex items-center justify-between p-4 rounded-xl border" :class="isDark ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50 border-gray-200'">
          <div>
            <h4 class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Notificaciones de Soporte y Tickets</h4>
            <p class="text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Notificar automáticamente a los contactos del cliente cuando se actualiza un ticket.</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700'">
            Activo
          </span>
        </div>

        <!-- Notificaciones de Facturación -->
        <div class="flex items-center justify-between p-4 rounded-xl border" :class="isDark ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50 border-gray-200'">
          <div>
            <h4 class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">Avisos de Facturación y Vencimiento</h4>
            <p class="text-[11px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Envío de facturas en PDF y recordatorios automáticos de pago.</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700'">
            Activo
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../../../composables/useTheme'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const { isDark } = useTheme()
</script>
