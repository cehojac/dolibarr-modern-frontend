<template>
  <div class="space-y-6">
    <!-- Métricas Comerciales y Financieras (KPI Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Saldo Pendiente -->
      <div class="rounded-xl border p-5 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Saldo Pendiente</span>
          <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold font-mono" :class="Number(tercero.outstanding || 0) > 0 ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-white' : 'text-gray-900')">
          {{ formatCurrency(tercero.outstanding) }}
        </p>
        <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Importe pendiente de cobro</p>
      </div>

      <!-- Límite de Crédito -->
      <div class="rounded-xl border p-5 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Límite de Crédito</span>
          <div class="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold font-mono" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ formatCurrency(tercero.outstanding_limit) }}
        </p>
        <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Riesgo comercial máximo autorizado</p>
      </div>

      <!-- Descuento Relativo -->
      <div class="rounded-xl border p-5 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Descuento Fijo</span>
          <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold font-mono" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ tercero.remise_client ? `${tercero.remise_client}%` : '0%' }}
        </p>
        <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Descuento automático en ventas</p>
      </div>

      <!-- Nivel de Precios -->
      <div class="rounded-xl border p-5 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tarifa / Nivel</span>
          <div class="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ tercero.price_level ? `Nivel ${tercero.price_level}` : 'Estándar' }}
        </p>
        <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tarifa de precios asignada</p>
      </div>
    </div>

    <!-- Condiciones Comerciales y de Pago -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-3 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <div class="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Condiciones de Facturación y Pago
          </h3>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Plazos de vencimiento y modalidades de liquidación</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Condiciones de Pago
          </label>
          <p class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.cond_reglement_doc || tercero.cond_reglement_label || 'A la recepción de la factura' }}
          </p>
        </div>
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Forma de Pago Habitual
          </label>
          <p class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.mode_reglement_doc || tercero.mode_reglement_label || 'Transferencia Bancaria' }}
          </p>
        </div>
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-1.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Cuenta Contable Cliente
          </label>
          <p class="font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.code_compta || '430000' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Sección con Selector de Documentos Comerciales: Facturas / Presupuestos / Pedidos -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <!-- Subtabs -->
        <div class="flex space-x-2">
          <button 
            @click="activeSubTab = 'invoices'"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            :class="activeSubTab === 'invoices' ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (isDark ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
          >
            Facturas ({{ invoices.length }})
          </button>
          <button 
            @click="activeSubTab = 'proposals'"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            :class="activeSubTab === 'proposals' ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (isDark ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
          >
            Presupuestos ({{ proposals.length }})
          </button>
          <button 
            @click="activeSubTab = 'orders'"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all"
            :class="activeSubTab === 'orders' ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (isDark ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
          >
            Pedidos ({{ orders.length }})
          </button>
        </div>

        <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          Mostrando los últimos registros
        </span>
      </div>

      <!-- Loading Documentos -->
      <div v-if="loadingDocuments" class="py-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Cargando documentos comerciales...</p>
      </div>

      <!-- Subtab: Facturas -->
      <div v-else-if="activeSubTab === 'invoices'">
        <div v-if="invoices.length === 0" class="py-8 text-center text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          No hay facturas registradas para este cliente.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
            <thead>
              <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Ref.</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Vencimiento</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Base Imp.</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total</th>
                <th class="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
              <tr v-for="inv in invoices" :key="inv.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'">
                <td class="px-4 py-3 whitespace-nowrap text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{{ inv.ref }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs">{{ formatDate(inv.date || inv.datec) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs">{{ formatDate(inv.date_lim_reglement) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono">{{ formatCurrency(inv.total_ht) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono font-bold">{{ formatCurrency(inv.total_ttc) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold" :class="getInvoiceStatusClass(inv.statut || inv.status, inv.paye)">
                    {{ getInvoiceStatusLabel(inv.statut || inv.status, inv.paye) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Subtab: Presupuestos -->
      <div v-else-if="activeSubTab === 'proposals'">
        <div v-if="proposals.length === 0" class="py-8 text-center text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          No hay presupuestos registrados para este cliente.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
            <thead>
              <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Ref.</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fin Validez</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Base Imp.</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total</th>
                <th class="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
              <tr v-for="prop in proposals" :key="prop.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'">
                <td class="px-4 py-3 whitespace-nowrap text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{{ prop.ref }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs">{{ formatDate(prop.date || prop.datec) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs">{{ formatDate(prop.fin_validite) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono">{{ formatCurrency(prop.total_ht) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono font-bold">{{ formatCurrency(prop.total_ttc) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold" :class="getProposalStatusClass(prop.statut || prop.status)">
                    {{ getProposalStatusLabel(prop.statut || prop.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Subtab: Pedidos -->
      <div v-else-if="activeSubTab === 'orders'">
        <div v-if="orders.length === 0" class="py-8 text-center text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          No hay pedidos registrados para este cliente.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
            <thead>
              <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Ref.</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Base Imp.</th>
                <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Total</th>
                <th class="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
              <tr v-for="ord in orders" :key="ord.id" class="transition-colors" :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'">
                <td class="px-4 py-3 whitespace-nowrap text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{{ ord.ref }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs">{{ formatDate(ord.date || ord.date_commande || ord.datec) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono">{{ formatCurrency(ord.total_ht) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-xs text-right font-mono font-bold">{{ formatCurrency(ord.total_ttc) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold" :class="getOrderStatusClass(ord.statut || ord.status)">
                    {{ getOrderStatusLabel(ord.statut || ord.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../../composables/useTheme'
import { usePermissions } from '../../../composables/usePermissions'
import http from '../../../utils/http'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  }
})

const { isDark } = useTheme()
const { hasAnyPermission } = usePermissions()

// Permisos por tipo de documento comercial
const canReadInvoices = computed(() => hasAnyPermission(['facture->lire', 'facture->read', 'invoice->lire', 'invoices->lire']))
const canReadProposals = computed(() => hasAnyPermission(['propal->lire', 'propal->read', 'proposal->lire', 'proposals->lire']))
const canReadOrders = computed(() => hasAnyPermission(['commande->lire', 'commande->read', 'order->lire', 'orders->lire']))

const activeSubTab = ref('invoices')
const loadingDocuments = ref(false)
const invoices = ref([])
const proposals = ref([])
const orders = ref([])

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(amount) || 0)
}

const formatDate = (val) => {
  if (!val) return '-'
  try {
    const timestamp = typeof val === 'number' ? val * 1000 : new Date(val).getTime()
    if (isNaN(timestamp)) return val
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return val
  }
}

const getInvoiceStatusClass = (status, paye) => {
  if (paye == 1 || status == 2) return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (status == 1) return isDark.value ? 'bg-amber-900/40 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
  if (status == 0) return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
  return isDark.value ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
}

const getInvoiceStatusLabel = (status, paye) => {
  if (paye == 1 || status == 2) return 'Cobrada'
  if (status == 1) return 'Pendiente'
  if (status == 0) return 'Borrador'
  return 'Cancelada'
}

const getProposalStatusClass = (status) => {
  if (status == 2) return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (status == 1) return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
  if (status == 0) return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
  return isDark.value ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
}

const getProposalStatusLabel = (status) => {
  if (status == 2) return 'Firmado / Aceptado'
  if (status == 1) return 'Abierto'
  if (status == 0) return 'Borrador'
  return 'Rechazado'
}

const getOrderStatusClass = (status) => {
  if (status == 3) return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (status == 1 || status == 2) return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
  if (status == 0) return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
  return isDark.value ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
}

const getOrderStatusLabel = (status) => {
  if (status == 3) return 'Procesado'
  if (status == 1 || status == 2) return 'En proceso'
  if (status == 0) return 'Borrador'
  return 'Cancelado'
}

const loadCommercialDocs = async () => {
  if (!props.tercero?.id) return
  loadingDocuments.value = true
  try {
    const requests = []
    if (canReadInvoices.value) {
      requests.push(http.get('/api/doli/invoices', { params: { sqlfilters: `(t.fk_soc:=:${props.tercero.id})`, limit: 10, sortfield: 't.datef', sortorder: 'DESC' } }).catch(() => ({ data: [] })))
    } else {
      requests.push(Promise.resolve({ data: [] }))
    }
    if (canReadProposals.value) {
      requests.push(http.get('/api/doli/proposals', { params: { sqlfilters: `(t.fk_soc:=:${props.tercero.id})`, limit: 10, sortfield: 't.datec', sortorder: 'DESC' } }).catch(() => ({ data: [] })))
    } else {
      requests.push(Promise.resolve({ data: [] }))
    }
    if (canReadOrders.value) {
      requests.push(http.get('/api/doli/orders', { params: { sqlfilters: `(t.fk_soc:=:${props.tercero.id})`, limit: 10, sortfield: 't.datec', sortorder: 'DESC' } }).catch(() => ({ data: [] })))
    } else {
      requests.push(Promise.resolve({ data: [] }))
    }

    const [invRes, propRes, ordRes] = await Promise.all(requests)

    invoices.value = Array.isArray(invRes.data) ? invRes.data : []
    proposals.value = Array.isArray(propRes.data) ? propRes.data : []
    orders.value = Array.isArray(ordRes.data) ? ordRes.data : []
  } catch (error) {
    console.warn('⚠️ Error al cargar documentos comerciales:', error.message)
  } finally {
    loadingDocuments.value = false
  }
}

onMounted(() => {
  loadCommercialDocs()
})
</script>
