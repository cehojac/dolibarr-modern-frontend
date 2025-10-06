<template>
  <div class="min-h-screen" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
    <!-- Header con navegación -->
    <div class="border-b" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
      <div class="px-6 py-4">
        <!-- Breadcrumb y botón volver -->
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center space-x-2 text-sm transition-colors"
            :class="isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al listado</span>
          </button>
          
          <!-- Navegación anterior/siguiente -->
          <div class="flex items-center space-x-2">
            <button 
              class="p-2 rounded-lg transition-colors"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              title="Anterior"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              class="p-2 rounded-lg transition-colors"
              :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'"
              title="Siguiente"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Información del tercero -->
        <div v-if="tercero" class="flex items-start justify-between mb-6">
          <div class="flex items-start space-x-4">
            <!-- Logo/Icono -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            <!-- Detalles -->
            <div>
              <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.name || 'Cargando...' }}
              </h1>
              
              <!-- Dirección y datos de contacto -->
              <div class="space-y-1 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                <div v-if="tercero.address" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ getFullAddress(tercero) }}</span>
                </div>
                <div v-if="tercero.email" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a :href="`mailto:${tercero.email}`" class="hover:underline">{{ tercero.email }}</a>
                </div>
                <div v-if="tercero.url" class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a :href="tercero.url" target="_blank" class="hover:underline flex items-center space-x-1">
                    <span>{{ tercero.url }}</span>
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Badge de estado y botones -->
          <div class="flex items-center space-x-3">
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="tercero.status == 1 
                ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                : (isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')"
            >
              {{ tercero.status == 1 ? 'Activo' : 'Inactivo' }}
            </span>
            
            <!-- Botones de acción -->
            <button 
              class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              :class="isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'"
            >
              Enviar E-mail
            </button>
            <button 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
            >
              Modificar
            </button>
            <button 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-500 hover:bg-gray-600 text-white'"
            >
              Fusión
            </button>
            <button 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- Tabs de navegación -->
        <div class="flex space-x-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === tab.key
              ? (isDark 
                ? 'border-blue-500 text-blue-400' 
                : 'border-blue-600 text-blue-600')
              : (isDark 
                ? 'border-transparent text-gray-400 hover:text-gray-300' 
                : 'border-transparent text-gray-600 hover:text-gray-800')"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" 
                  class="ml-2 px-2 py-0.5 text-xs rounded-full"
                  :class="activeTab === tab.key
                    ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                    : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="p-6">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Pestaña: Detalle/Tercero -->
      <div v-else-if="activeTab === 'tercero'" class="max-w-6xl mx-auto">
        <!-- Sección: Información General -->
        <div class="rounded-lg border p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Información General
            </h2>
            <span class="flex items-center space-x-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Empresa</span>
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Tipo de tercero con badges grandes -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Tipo de tercero
              </label>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-if="tercero.client"
                  class="px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                  :class="isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Cliente</span>
                </span>
                <span 
                  v-if="tercero.fournisseur"
                  class="px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                  :class="isDark ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Proveedor</span>
                </span>
                <span 
                  v-if="!tercero.client && !tercero.fournisseur"
                  class="px-4 py-2 rounded-lg text-sm font-medium"
                  :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
                >
                  Personal
                </span>
              </div>
            </div>
            
            <!-- Códigos -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Código de Cliente
              </label>
              <p class="text-lg font-semibold font-mono" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.code_client || '-' }}
              </p>
            </div>
            
            <!-- Capital -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Capital Social
              </label>
              <p class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ formatCurrency(tercero.capital) }}
              </p>
            </div>
          </div>
          
          <!-- Categorías -->
          <div v-if="tercero.categories && tercero.categories.length > 0" class="mt-6 pt-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <label class="text-xs font-medium uppercase tracking-wider block mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Categorías
            </label>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(cat, index) in tercero.categories" 
                :key="index"
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sección: Datos Fiscales e Identificación -->
        <div class="rounded-lg border p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <h2 class="text-lg font-semibold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">
            Datos Fiscales e Identificación
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- CIF/NIF -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                CIF/NIF
              </label>
              <div class="flex items-center space-x-2">
                <p class="text-base font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ tercero.idprof1 || tercero.tva_intra || '-' }}
                </p>
                <button 
                  v-if="tercero.idprof1 || tercero.tva_intra" 
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDark ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                >
                  Verificar
                </button>
              </div>
            </div>
            
            <!-- CIF Intracomunitario -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                CIF Intracomunitario
              </label>
              <p class="text-base font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.tva_intra || '-' }}
              </p>
            </div>
            
            <!-- Seguridad Social -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Núm. Seguridad Social
              </label>
              <p class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.idprof2 || '-' }}
              </p>
            </div>
            
            <!-- CNAE -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                CNAE
              </label>
              <p class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.idprof3 || '-' }}
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Código de Barras -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Código de Barras
              </label>
              <p class="text-base font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.barcode || '-' }}
              </p>
            </div>
            
            <!-- EORI -->
            <div>
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Número EORI
              </label>
              <p class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ tercero.idprof4 || '-' }}
              </p>
            </div>
          </div>
          
          <!-- Opciones fiscales -->
          <div class="mt-6 pt-6 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <div class="flex items-center space-x-6">
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="tercero.tva_assuj == 1"
                  disabled
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                >
                <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Sujeto a IRPF</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :checked="!tercero.no_email"
                  disabled
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                >
                <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">Recibir e-mails masivos</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Sección: Información Comercial -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Información del negocio -->
          <div class="rounded-lg border p-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
            <h3 class="text-base font-semibold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">
              Información del Negocio
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start justify-between pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                <div>
                  <label class="text-xs font-medium uppercase tracking-wider block mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    Sector
                  </label>
                  <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ tercero.sector || 'No especificado' }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-start justify-between pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                <div>
                  <label class="text-xs font-medium uppercase tracking-wider block mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    Tipo de Entidad
                  </label>
                  <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ tercero.typent || 'No especificado' }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-start justify-between">
                <div>
                  <label class="text-xs font-medium uppercase tracking-wider block mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                    Localización Fiscal
                  </label>
                  <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ tercero.localtax2 || '+15.000' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Persona de contacto -->
          <div class="rounded-lg border p-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
            <h3 class="text-base font-semibold mb-6" :class="isDark ? 'text-white' : 'text-gray-900'">
              Asignación Comercial
            </h3>
            
            <div v-if="tercero.commercial_name" class="flex items-center space-x-4 p-4 rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span class="text-sm font-bold text-white">
                  {{ getInitials(tercero.commercial_name) }}
                </span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ tercero.commercial_name }}
                </p>
                <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  Comercial asignado
                </p>
              </div>
              <button 
                class="p-2 rounded-lg transition-colors"
                :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                title="Cambiar comercial"
              >
                <svg class="w-4 h-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div v-else class="p-8 text-center rounded-lg" :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <svg class="w-12 h-12 mx-auto mb-3" :class="isDark ? 'text-gray-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p class="text-sm font-medium mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                Sin comercial asignado
              </p>
              <button 
                class="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
              >
                Asignar comercial
              </button>
            </div>
          </div>
        </div>

        <!-- Sección: Historial de Eventos -->
        <div class="rounded-lg border p-6 mt-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Últimos 10 eventos vinculados
            </h2>
            <div class="flex items-center space-x-2">
              <button 
                class="p-2 rounded-lg transition-colors"
                :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
                title="Comentarios"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                class="p-2 rounded-lg transition-colors"
                :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
                title="Más opciones"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <button 
                class="p-2 rounded-lg transition-colors"
                :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
                title="Nuevo evento"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Tabla de eventos -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="border-b" :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                    Ref.
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                    Fecha
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                    Por
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                    Tipo
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
                    Título
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
                <tr v-if="loadingEvents" class="transition-colors" :class="isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'">
                  <td colspan="5" class="px-4 py-8 text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando eventos...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="!events || events.length === 0" class="transition-colors" :class="isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'">
                  <td colspan="5" class="px-4 py-8 text-center">
                    <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">No hay eventos registrados</span>
                  </td>
                </tr>
                <tr 
                  v-else
                  v-for="event in events" 
                  :key="event.id"
                  class="transition-colors cursor-pointer"
                  :class="isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'"
                >
                  <!-- Ref -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span class="text-sm font-medium" :class="isDark ? 'text-purple-400' : 'text-purple-600'">
                        {{ event.ref }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Fecha -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                      {{ formatEventDate(event.date) }}
                    </span>
                  </td>
                  
                  <!-- Usuario/Por -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-bold text-white">
                          {{ getInitials(event.user) }}
                        </span>
                      </div>
                      <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                        {{ event.user }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Tipo -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <!-- Icono según tipo -->
                      <svg v-if="event.type === 'Mensaje'" class="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <svg v-else-if="event.type === 'Ticket'" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                        {{ event.type }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Título -->
                  <td class="px-4 py-3">
                    <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-900'">
                      {{ event.title }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer con paginación -->
          <div v-if="events && events.length > 0" class="mt-4 pt-4 border-t flex items-center justify-between" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button 
              class="text-sm px-3 py-1 rounded transition-colors"
              :class="isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'"
            >
              Más...
            </button>
            <div class="flex items-center space-x-2">
              <button 
                class="p-1 rounded transition-colors"
                :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
                title="Anterior"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                class="p-1 rounded transition-colors"
                :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'"
                title="Siguiente"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Otras pestañas (placeholder por ahora) -->
      <div v-else class="text-center py-12">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          Contenido de "{{ tabs.find(t => t.key === activeTab)?.label }}" en desarrollo...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import http from '../../utils/http'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const loading = ref(true)
const tercero = ref(null)
const activeTab = ref('tercero')
const loadingEvents = ref(false)
const events = ref([
  { id: 14496, ref: '14496', date: '03/03/25 12:56', user: 'Arturo', type: 'Mensaje', title: '[CARLOS EDMUNDO HERRERA]' },
  { id: 14495, ref: '14495', date: '28/02/25 18:47', user: 'Arturo', type: 'Mensaje', title: '[CARLOS EDMUNDO HERRERA]' },
  { id: 14475, ref: '14475', date: '26/02/25 11:31', user: 'Sistema', type: 'Otro', title: 'Ticket TS2502-1104 creado' },
  { id: 14458, ref: '14458', date: '24/02/25 21:20', user: 'Sistema', type: 'Otro', title: 'Ticket TS2502-1102 creado' },
  { id: 14447, ref: '14447', date: '18/02/25 21:01', user: 'Sistema', type: 'Otro', title: 'Ticket TS2502-1100 creado' },
  { id: 14130, ref: '14130', date: '26/12/24 16:42', user: 'Arturo', type: 'Otro', title: 'Ticket TS2412-1073 cerrado' },
  { id: 14129, ref: '14129', date: '26/12/24 16:42', user: 'Arturo', type: 'Mensaje', title: '[CARLOS EDMUNDO HERRERA]' },
  { id: 14128, ref: '14128', date: '26/12/24 16:39', user: 'Arturo', type: 'Otro', title: 'Ticket TS2412-1073 creado' },
  { id: 14125, ref: '14125', date: '23/12/24 22:03', user: 'CARLOS', type: 'Otro - Recepción', title: 'Recepción de Email - De administracion@' },
  { id: 14124, ref: '14124', date: '23/12/24 21:03', user: 'CARLOS', type: 'Otro - Recepción', title: 'Recepción de Email - De administracion@' }
])

const tabs = computed(() => [
  { key: 'tercero', label: 'Tercero' },
  { key: 'contactos', label: 'Contactos/Direcciones', count: 3 },
  { key: 'cliente', label: 'Cliente' },
  { key: 'proyectos', label: 'Proyectos', count: 2 },
  { key: 'items', label: 'Ítems relacionados' },
  { key: 'pagos', label: 'Métodos de pago' },
  { key: 'asociaciones', label: 'Asociaciones' },
  { key: 'tickets', label: 'Tickets', count: 34 },
  { key: 'notificaciones', label: 'Notificaciones' },
  { key: 'notas', label: 'Notas' },
  { key: 'documentos', label: 'Documentos' },
  { key: 'agenda', label: 'Eventos/Agenda' },
])

const loadTercero = async () => {
  try {
    loading.value = true
    const terceroId = route.params.id
    const response = await http.get(`/api/doli/thirdparties/${terceroId}`)
    tercero.value = response.data
  } catch (error) {
    console.error('Error cargando tercero:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/terceros/clientes')
}

const getFullAddress = (tercero) => {
  const parts = []
  if (tercero.address) parts.push(tercero.address)
  if (tercero.zip) parts.push(tercero.zip)
  if (tercero.town) parts.push(tercero.town)
  if (tercero.state) parts.push(tercero.state)
  if (tercero.country) parts.push(tercero.country)
  return parts.join(', ') || '-'
}

const formatCurrency = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
}

const formatEventDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr
}

onMounted(() => {
  loadTercero()
})
</script>
