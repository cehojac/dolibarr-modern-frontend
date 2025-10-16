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
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' : 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Enviar E-mail</span>
            </button>
            <button 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Modificar</span>
            </button>
            <button 
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Fusión</span>
            </button>
            <button 
              @click="showDeleteModal = true"
              :disabled="deletingThirdparty"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="isDark ? 'border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed'"
              title="Eliminar cliente"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        <!-- Tabs de navegación -->
        <div v-if="tabs.length > 0" class="flex space-x-1 overflow-x-auto">
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
        
        <!-- Mensaje si no hay pestañas disponibles -->
        <div v-else class="px-4 py-3">
          <div class="flex items-center space-x-2 text-sm" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No tienes permisos para ver ninguna sección de este tercero.</span>
          </div>
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
                  v-for="badge in getThirdpartyBadges(tercero)" 
                  :key="badge.label"
                  class="px-4 py-2 rounded-lg text-sm font-medium" 
                  :class="badge.class"
                >
                  {{ badge.label }}
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
                <a 
                  v-if="tercero.idprof1 || tercero.tva_intra" 
                  :href="getValidationUrl(tercero.idprof1 || tercero.tva_intra)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2 py-1 text-xs rounded transition-colors inline-block"
                  :class="isDark ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                  title="Verificar CIF/NIF en fuente oficial"
                >
                  Verificar
                </a>
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

        <!-- Sección: Campos Adicionales (array_options) -->
        <div v-if="filteredArrayOptions.length > 0" class="rounded-lg border p-6 mb-6" :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Campos Adicionales
            </h2>
            <span class="flex items-center space-x-2 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              <svg class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>Campos personalizados</span>
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="field in filteredArrayOptions" 
              :key="field.key"
              class="p-4 rounded-lg border transition-colors"
              :class="isDark ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'"
            >
              <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                {{ field.label }}
              </label>
              <div class="flex items-center space-x-2">
                <!-- Icono según tipo de campo -->
                <!-- Date -->
                <svg v-if="field.type === 'date' || field.type === 'datetime'" class="w-4 h-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <!-- Boolean/Checkbox -->
                <svg v-else-if="field.type === 'boolean' || field.type === 'checkbox'" class="w-4 h-4 flex-shrink-0" :class="(field.value === '1' || field.value === 1) ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="field.value === '1' || field.value === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <!-- Number/Price -->
                <svg v-else-if="field.type === 'int' || field.type === 'integer' || field.type === 'double' || field.type === 'price'" class="w-4 h-4 flex-shrink-0 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <!-- Email -->
                <svg v-else-if="field.type === 'mail'" class="w-4 h-4 flex-shrink-0 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <!-- Phone -->
                <svg v-else-if="field.type === 'phone'" class="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <!-- URL -->
                <svg v-else-if="field.type === 'url'" class="w-4 h-4 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <!-- Select/List -->
                <svg v-else-if="field.type === 'select' || field.type === 'sellist'" class="w-4 h-4 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <!-- Text/HTML -->
                <svg v-else-if="field.type === 'text' || field.type === 'html'" class="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <!-- Default -->
                <svg v-else class="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                
                <!-- Valor formateado según tipo -->
                <p class="text-sm font-medium break-words" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ getFormattedValue(field) }}
                </p>
              </div>
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

  <!-- Modal de confirmación para eliminar cliente -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showDeleteModal = false">
    <div class="rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'" @click.stop>
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
          Eliminar Cliente
        </h3>
      </div>
      
      <p class="text-sm mb-4" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        Esta acción es <strong class="text-red-600">permanente</strong> y no se puede deshacer. Se eliminarán todos los datos asociados al cliente, incluyendo contactos, proyectos, tickets y documentos.
      </p>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6" :class="isDark ? 'bg-red-900/20 border-red-800' : ''">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="text-xs font-medium" :class="isDark ? 'text-red-400' : 'text-red-800'">¡Advertencia!</p>
            <p class="text-xs mt-1" :class="isDark ? 'text-red-300' : 'text-red-700'">
              Para confirmar, escribe el nombre del cliente: <strong>{{ tercero?.name || 'N/A' }}</strong>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Input de confirmación -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          Nombre del cliente
        </label>
        <input
          v-model="deleteConfirmationText"
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          :placeholder="`Escribe: ${tercero?.name || 'N/A'}`"
          @keyup.enter="deleteThirdparty"
        />
      </div>
      
      <!-- Modal Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteModal = false; deleteConfirmationText = ''"
          :disabled="deletingThirdparty"
          class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
          :class="isDark ? 'text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50' : 'text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'"
        >
          Cancelar
        </button>
        <button
          @click="deleteThirdparty"
          :disabled="deletingThirdparty || deleteConfirmationText.trim() !== (tercero?.name || '')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-2"
        >
          <svg v-if="deletingThirdparty" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ deletingThirdparty ? 'Eliminando...' : 'Sí, eliminar cliente' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'
import { usePermissions } from '../../composables/usePermissions'
import { useExtrafields } from '../../composables/useExtrafields'
import http from '../../utils/http'
import { getThirdpartyType, getThirdpartyBadges } from '../../utils/thirdpartyHelpers'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()
const { hasPermission, hasAnyPermission } = usePermissions()
const { getExtrafields, formatExtrafieldValue } = useExtrafields()

const loading = ref(true)
const tercero = ref(null)
const activeTab = ref('tercero')
const loadingEvents = ref(false)
const extrafieldsConfig = ref({})
const extrafieldsFormattedValues = ref({})

// Delete thirdparty state
const showDeleteModal = ref(false)
const deletingThirdparty = ref(false)
const deleteConfirmationText = ref('')
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

const tabs = computed(() => {
  const allTabs = [
    { 
      key: 'tercero', 
      label: 'Tercero',
      permission: 'societe->lire' // Permiso para ver terceros
    },
    { 
      key: 'contactos', 
      label: 'Contactos/Direcciones', 
      count: 3,
      permission: 'societe->contact->lire' // Permiso para ver contactos
    },
    { 
      key: 'cliente', 
      label: 'Cliente',
      permission: 'societe->lire' // Permiso para ver información de cliente
    },
    { 
      key: 'proyectos', 
      label: 'Proyectos', 
      count: 2,
      permission: 'projet->lire' // Permiso para ver proyectos
    },
    { 
      key: 'items', 
      label: 'Ítems relacionados',
      permission: 'produit->lire' // Permiso para ver productos/servicios
    },
    { 
      key: 'pagos', 
      label: 'Métodos de pago',
      permission: 'banque->lire' // Permiso para ver métodos de pago
    },
    { 
      key: 'asociaciones', 
      label: 'Asociaciones',
      permission: 'societe->lire' // Permiso para ver asociaciones
    },
    { 
      key: 'tickets', 
      label: 'Tickets', 
      count: 34,
      permission: 'ticket->lire' // Permiso para ver tickets
    },
    { 
      key: 'notificaciones', 
      label: 'Notificaciones',
      permission: 'societe->lire' // Permiso básico para notificaciones
    },
    { 
      key: 'notas', 
      label: 'Notas',
      permission: 'societe->lire' // Permiso para ver notas
    },
    { 
      key: 'documentos', 
      label: 'Documentos',
      permission: 'societe->lire' // Permiso para ver documentos
    },
    { 
      key: 'agenda', 
      label: 'Eventos/Agenda',
      permission: 'agenda->myactions->read' // Permiso para ver eventos
    },
  ]
  
  // Filtrar pestañas según permisos del usuario
  const filteredTabs = allTabs.filter(tab => {
    // Si no tiene permiso definido, mostrar siempre
    if (!tab.permission) return true
    
    // Verificar si el usuario tiene el permiso
    return hasPermission(tab.permission)
  })
  
  console.log('🔐 Pestañas filtradas por permisos:', {
    total: allTabs.length,
    visibles: filteredTabs.length,
    ocultas: allTabs.length - filteredTabs.length,
    tabs: filteredTabs.map(t => t.label)
  })
  
  return filteredTabs
})

// Computed property to filter non-null array_options with extrafield configuration
const filteredArrayOptions = computed(() => {
  if (!tercero.value?.array_options) {
    return []
  }
  
  // La configuración viene anidada en 'societe'
  const fieldsConfig = extrafieldsConfig.value.societe || extrafieldsConfig.value
  
  // Filter out null, undefined, and empty string values
  return Object.entries(tercero.value.array_options)
    .filter(([key, value]) => {
      // Keep the field if value is not null, undefined, or empty string
      if (value === null || value === undefined || value === '') return false
      
      // Para campos select, verificar que la opción exista
      const fieldKey = key.replace(/^options_/, '')
      const fieldConfig = fieldsConfig[fieldKey]
      
      if (fieldConfig?.type === 'select') {
        const options = fieldConfig.param?.options
        // Solo mostrar si la opción existe
        return options && options[value]
      }
      
      return true
    })
    .map(([key, value]) => {
      // Obtener configuración del extrafield
      const fieldKey = key.replace(/^options_/, '')
      const fieldConfig = fieldsConfig[fieldKey]
      
      return {
        key,
        value,
        config: fieldConfig,
        label: fieldConfig?.label || formatFieldName(key),
        type: fieldConfig?.type || 'varchar'
      }
    })
})

const loadTercero = async () => {
  try {
    loading.value = true
    const terceroId = route.params.id
    
    // Cargar datos del tercero y extrafields en paralelo
    const [terceroResponse, extrafields] = await Promise.all([
      http.get(`/api/doli/thirdparties/${terceroId}`),
      getExtrafields('thirdparty')
    ])
    
    tercero.value = terceroResponse.data
    extrafieldsConfig.value = extrafields
    
    console.log('✅ Tercero y extrafields cargados:', {
      tercero: tercero.value.name,
      extrafieldsCount: Object.keys(extrafields).length
    })
    
    // Formatear valores de extrafields (especialmente para sellist que necesitan llamadas API)
    await formatExtrafieldsValues()
    
    // Verificar que la pestaña activa esté disponible después de filtrar por permisos
    const availableTabs = tabs.value
    if (availableTabs.length > 0 && !availableTabs.find(t => t.key === activeTab.value)) {
      // Si la pestaña activa no está disponible, cambiar a la primera disponible
      activeTab.value = availableTabs[0].key
      console.log(`⚠️ Pestaña activa no disponible, cambiando a: ${availableTabs[0].label}`)
    }
  } catch (error) {
    console.error('Error cargando tercero:', error)
  } finally {
    loading.value = false
  }
}

// Obtener valor formateado de un campo
const getFormattedValue = (field) => {
  const formattedValue = extrafieldsFormattedValues.value[field.key]
  
  console.log(`🔍 getFormattedValue para ${field.key}:`, {
    hasFormatted: !!formattedValue,
    formattedValue,
    originalValue: field.value,
    type: field.type
  })
  
  if (formattedValue !== undefined && formattedValue !== null) {
    return formattedValue
  }
  
  return field.value
}

// Formatear valores de extrafields
const formatExtrafieldsValues = async () => {
  if (!tercero.value?.array_options) {
    console.log('⚠️ No hay array_options para formatear')
    return
  }
  
  console.log('🔄 Iniciando formateo de extrafields...')
  console.log('📋 Array options:', tercero.value.array_options)
  console.log('⚙️ Extrafields config:', extrafieldsConfig.value)
  
  // La configuración viene anidada en 'societe'
  const fieldsConfig = extrafieldsConfig.value.societe || extrafieldsConfig.value
  console.log('⚙️ Configuración de campos societe:', fieldsConfig)
  
  const formattedValues = {}
  
  // Procesar cada extrafield
  for (const [key, value] of Object.entries(tercero.value.array_options)) {
    if (value === null || value === undefined || value === '') continue
    
    // Limpiar el key: quitar "options_" del inicio
    const fieldKey = key.replace(/^options_/, '')
    
    // Buscar la configuración del campo
    const fieldConfig = fieldsConfig[fieldKey]
    
    if (!fieldConfig) {
      console.warn(`⚠️ No se encontró configuración para el campo: ${fieldKey}`)
      formattedValues[key] = value
      continue
    }
    
    console.log(`🔍 Procesando campo: ${key}`, {
      fieldKey,
      value,
      type: fieldConfig.type,
      label: fieldConfig.label
    })
    
    try {
      // Formatear según el tipo
      if (fieldConfig.type === 'date') {
        // Convertir timestamp a fecha
        const date = new Date(value * 1000)
        formattedValues[key] = date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        console.log(`✅ Fecha formateada: ${value} → ${formattedValues[key]}`)
        
      } else if (fieldConfig.type === 'select') {
        // Para select, buscar la etiqueta en las opciones
        const options = fieldConfig.param?.options
        if (options && options[value]) {
          formattedValues[key] = options[value]
          console.log(`✅ Select resuelto: ${value} → ${formattedValues[key]}`)
        } else {
          // Si no se encuentra la opción, no mostrar el campo (no agregar a formattedValues)
          console.log(`⚠️ No se encontró opción para: ${value}, campo omitido`)
          continue
        }
        
      } else if (fieldConfig.type === 'sellist') {
        // Para sellist, buscar el nombre del elemento
        const param = fieldConfig.param?.options || fieldConfig.param
        
        // Si es una referencia a societe
        if (fieldConfig.elementtype === 'societe' || String(param).includes('societe')) {
          try {
            const response = await http.get(`/api/doli/thirdparties/${value}`)
            formattedValues[key] = response.data?.name || value
            console.log(`✅ Tercero resuelto: ${value} → ${formattedValues[key]}`)
          } catch (error) {
            console.error(`❌ Error obteniendo tercero ${value}:`, error)
            formattedValues[key] = value
          }
        } else {
          formattedValues[key] = value
        }
        
      } else if (fieldConfig.type === 'checkbox' || fieldConfig.type === 'boolean') {
        // Para checkbox/boolean, mostrar Sí/No
        formattedValues[key] = (value === '1' || value === 1 || value === true) ? 'Sí' : 'No'
        console.log(`✅ Boolean formateado: ${value} → ${formattedValues[key]}`)
        
      } else if (fieldConfig.type === 'double' || fieldConfig.type === 'price') {
        // Para números decimales
        formattedValues[key] = parseFloat(value).toFixed(2)
        console.log(`✅ Número formateado: ${value} → ${formattedValues[key]}`)
        
      } else {
        // Para otros tipos, usar el valor directo
        formattedValues[key] = value
      }
    } catch (error) {
      console.error(`❌ Error formateando campo ${key}:`, error)
      formattedValues[key] = value
    }
  }
  
  extrafieldsFormattedValues.value = formattedValues
  console.log('✅ Todos los valores formateados:', formattedValues)
}

// Generar URL de validación para CIF/NIF
const getValidationUrl = (idprof) => {
  if (!idprof) return '#'
  
  // Limpiar el ID profesional (quitar espacios)
  const cleanIdprof = idprof.replace(/\s+/g, '')
  
  // URL template para España (por defecto)
  // Puedes configurar esto según el país del tercero si es necesario
  const urlTemplate = 'http://www.e-informa.es/servlet/app/portal/ENTP/screen/SProducto/prod/ETIQUETA_EMPRESA/nif/{IDPROF}'
  
  // Reemplazar {IDPROF} con el valor real
  const validationUrl = urlTemplate.replace('{IDPROF}', cleanIdprof)
  
  console.log('🔍 URL de verificación CIF/NIF:', {
    idprof: cleanIdprof,
    url: validationUrl
  })
  
  return validationUrl
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

// Format field name from array_options key
const formatFieldName = (key) => {
  // Remove 'options_' prefix if exists
  let name = key.replace(/^options_/, '')
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ')
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  return name
}

// Format field value based on type
const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  
  // Boolean
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  
  // Number
  if (typeof value === 'number') {
    return value.toLocaleString('es-ES')
  }
  
  // Date (check if it's a timestamp or date string)
  if (isDate(value)) {
    return formatDate(value)
  }
  
  // String
  return value
}

// Check if value is a date
const isDate = (value) => {
  if (!value) return false
  
  // Check if it's a timestamp (number > 1000000000)
  if (typeof value === 'number' && value > 1000000000) {
    return true
  }
  
  // Check if it's a date string (YYYY-MM-DD or similar)
  if (typeof value === 'string') {
    const datePattern = /^\d{4}-\d{2}-\d{2}/
    return datePattern.test(value)
  }
  
  return false
}

// Format date value
const formatDate = (value) => {
  try {
    let date
    
    // If it's a timestamp
    if (typeof value === 'number') {
      date = new Date(value * 1000) // Convert to milliseconds
    } else {
      date = new Date(value)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return value
    }
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch (error) {
    return value
  }
}

// Delete thirdparty function
const deleteThirdparty = async () => {
  try {
    // Validar que el nombre del cliente coincida
    if (deleteConfirmationText.value.trim() !== (tercero.value?.name || '')) {
      alert('El nombre del cliente no coincide. Por favor, verifica e intenta nuevamente.')
      return
    }
    
    deletingThirdparty.value = true
    const terceroId = route.params.id
    
    if (!terceroId) {
      throw new Error('No se encontró el ID del cliente')
    }
    
    console.log('🗑️ Eliminando cliente:', terceroId)
    
    // Enviar DELETE request para eliminar el cliente
    const response = await http.delete(`/api/doli/thirdparties/${terceroId}`)
    console.log('✅ Cliente eliminado exitosamente:', response.data)
    
    // Cerrar modal
    showDeleteModal.value = false
    deleteConfirmationText.value = ''
    
    // Mostrar mensaje de éxito
    alert('Cliente eliminado exitosamente')
    
    // Redirigir al listado de clientes
    router.push('/terceros/clientes')
    
  } catch (error) {
    console.error('❌ Error eliminando cliente:', error)
    console.error('❌ Error details:', error.response?.data)
    alert('Error al eliminar cliente: ' + (error.response?.data?.message || error.message))
  } finally {
    deletingThirdparty.value = false
  }
}

onMounted(() => {
  // Scroll al inicio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadTercero()
})
</script>
