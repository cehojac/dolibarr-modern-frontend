<template>
  <div class="space-y-6">
    <!-- Sección 1: Información General -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center justify-between mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Información General
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Datos principales de la empresa y tipología</p>
          </div>
        </div>
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" :class="isDark ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
          Empresa
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tipo de tercero -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Tipo de Tercero
          </label>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="badge in badges" 
              :key="badge.label"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide" 
              :class="badge.class"
            >
              {{ badge.label }}
            </span>
          </div>
        </div>
        
        <!-- Código de Cliente -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Código de Cliente
          </label>
          <p class="text-base font-semibold font-mono tracking-tight" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.code_client || '-' }}
          </p>
        </div>
        
        <!-- Capital Social -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Capital Social
          </label>
          <p class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ formatCurrency(tercero.capital) }}
          </p>
        </div>
      </div>
      
      <!-- Sección de Etiquetas / Categorías -->
      <div class="mt-6 pt-6 border-t" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
        <div class="flex items-center justify-between mb-3">
          <label class="text-xs font-medium uppercase tracking-wider block" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Etiquetas / Categorías Asignadas
          </label>
          <button 
            @click="openCategoryModal"
            class="inline-flex items-center space-x-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Gestionar etiquetas</span>
          </button>
        </div>
        
        <div v-if="loadingCategories" class="flex items-center space-x-2 py-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Cargando categorías...</span>
        </div>
        
        <div v-else-if="assignedCategories.length > 0" class="flex flex-wrap gap-2">
          <span 
            v-for="cat in assignedCategories" 
            :key="cat.id || cat.label"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all"
            :style="getCategoryBadgeStyle(cat)"
          >
            <svg class="w-3 h-3 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ cat.label || cat.name || cat }}
            <button 
              @click.stop="removeCategory(cat.id)"
              class="ml-1.5 hover:opacity-100 opacity-60 focus:outline-none"
              title="Quitar etiqueta"
            >
              &times;
            </button>
          </span>
        </div>
        
        <p v-else class="text-xs italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          No tiene etiquetas o categorías asignadas actualmente.
        </p>
      </div>
    </div>

    <!-- Sección 2: Datos Fiscales e Identificación -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-3 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <div class="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Datos Fiscales e Identificación
          </h2>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Identificación legal, registros fiscales y opciones de tributación</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- CIF/NIF -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            CIF / NIF
          </label>
          <div class="flex items-center space-x-2">
            <p class="text-sm font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ tercero.idprof1 || tercero.tva_intra || '-' }}
            </p>
            <a 
              v-if="tercero.idprof1 || tercero.tva_intra" 
              :href="getValidationUrl(tercero.idprof1 || tercero.tva_intra)"
              target="_blank"
              rel="noopener noreferrer"
              class="px-2 py-0.5 text-xs rounded font-medium transition-colors inline-flex items-center space-x-1"
              :class="isDark ? 'bg-blue-900/40 text-blue-300 border border-blue-700 hover:bg-blue-800/60' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'"
              title="Verificar CIF/NIF en fuente oficial"
            >
              <span>Verificar</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <!-- CIF Intracomunitario -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            CIF Intracomunitario
          </label>
          <p class="text-sm font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.tva_intra || '-' }}
          </p>
        </div>
        
        <!-- Seguridad Social -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Núm. Seguridad Social
          </label>
          <p class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.idprof2 || '-' }}
          </p>
        </div>
        
        <!-- CNAE -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            CNAE
          </label>
          <p class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.idprof3 || '-' }}
          </p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
        <!-- Código de Barras -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Código de Barras
          </label>
          <p class="text-sm font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.barcode || '-' }}
          </p>
        </div>
        
        <!-- EORI -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Número EORI
          </label>
          <p class="text-sm font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            {{ tercero.idprof4 || '-' }}
          </p>
        </div>

        <!-- Sujeto a IVA / IRPF -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Sujeto a IVA / IRPF
          </label>
          <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" :class="tercero.tva_assuj == 1 ? (isDark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')">
            {{ tercero.tva_assuj == 1 ? 'Sí, Sujeto' : 'No Sujeto (Exento)' }}
          </span>
        </div>

        <!-- E-mails masivos -->
        <div>
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            Recepción E-mails
          </label>
          <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" :class="!tercero.no_email ? (isDark ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200') : (isDark ? 'bg-amber-900/40 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200')">
            {{ !tercero.no_email ? 'Permite envíos masivos' : 'No recibir masivos' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Sección 3: Campos Adicionales (Extrafields) -->
    <div v-if="filteredArrayOptions.length > 0" class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center space-x-3 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <div class="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
            Campos Adicionales
          </h2>
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Atributos personalizados y extensiones del modelo de datos</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="field in filteredArrayOptions" 
          :key="field.key"
          class="p-4 rounded-lg border transition-all"
          :class="isDark ? 'bg-gray-750/60 border-gray-700 hover:border-gray-600' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'"
        >
          <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            {{ field.label }}
          </label>
          <div class="flex items-center space-x-2.5">
            <span class="p-1.5 rounded-md text-xs" :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-xs'">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <p class="text-sm font-semibold break-words" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ getFormattedValue(field) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección 4: Información Comercial y Negocio -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Información del negocio -->
      <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center space-x-3 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <div class="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Información del Negocio
            </h3>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Sector, tipo de entidad y parámetros regionales</p>
          </div>
        </div>
        
        <div class="space-y-4 text-sm">
          <div class="flex items-center justify-between pb-3 border-b" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">Sector / Actividad</span>
            <span class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ tercero.sector || 'No especificado' }}</span>
          </div>
          
          <div class="flex items-center justify-between pb-3 border-b" :class="isDark ? 'border-gray-700/80' : 'border-gray-100'">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tipo de Entidad Legal</span>
            <span class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ tercero.typent || 'Sociedad / Empresa' }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">Impuesto Local 2 (IRPF)</span>
            <span class="font-mono font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">{{ tercero.localtax2 ? `${tercero.localtax2}%` : '0%' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Asignación Comercial -->
      <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
        <div class="flex items-center space-x-3 mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <div class="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Asignación Comercial
            </h3>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Representante y ejecutivo de cuenta asignado</p>
          </div>
        </div>
        
        <div v-if="tercero.commercial_name || commercialUser" class="flex items-center space-x-4 p-4 rounded-xl border transition-all" :class="isDark ? 'bg-gray-750/60 border-gray-700' : 'bg-gray-50/80 border-gray-200'">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md text-white font-bold text-base">
            {{ getInitials(tercero.commercial_name || commercialUser?.name || 'Comercial') }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ tercero.commercial_name || commercialUser?.name || 'Comercial Asignado' }}
            </p>
            <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              Responsable de la cuenta del cliente
            </p>
          </div>
        </div>
        
        <div v-else class="p-6 text-center rounded-xl border border-dashed" :class="isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/60 border-gray-300'">
          <svg class="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <p class="text-xs font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            Sin comercial específico asignado
          </p>
          <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            Gestionado por el equipo comercial general
          </p>
        </div>
      </div>
    </div>

    <!-- Sección 5: Últimos 10 Eventos Vinculados (Reales de Dolibarr) -->
    <div class="rounded-xl border p-6 transition-all" :class="isDark ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-black/20' : 'bg-white border-gray-200 shadow-sm'">
      <div class="flex items-center justify-between mb-6 pb-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              Últimos Eventos Vinculados
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Actividad reciente registrada en la agenda de Dolibarr</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('switch-tab', 'agenda')"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors inline-flex items-center space-x-1.5"
            :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            <span>Ver todos en Agenda</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tabla de eventos -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDark ? 'divide-gray-700' : 'divide-gray-200'">
          <thead>
            <tr :class="isDark ? 'bg-gray-750/50' : 'bg-gray-50'">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Ref.</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Fecha</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Autor</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tipo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Título / Asunto</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDark ? 'divide-gray-700/60' : 'divide-gray-200'">
            <!-- Loading state -->
            <tr v-if="loadingEvents">
              <td colspan="5" class="px-4 py-8 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">Cargando eventos vinculados...</span>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr v-else-if="!events || events.length === 0">
              <td colspan="5" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center space-y-1.5">
                  <svg class="w-8 h-8 text-gray-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-600'">No hay eventos registrados para este cliente</span>
                </div>
              </td>
            </tr>
            
            <!-- Real Event rows -->
            <tr 
              v-else
              v-for="event in events" 
              :key="event.id"
              class="transition-colors"
              :class="isDark ? 'hover:bg-gray-750/60' : 'hover:bg-gray-50'"
            >
              <!-- Ref -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {{ event.ref || event.id }}
                </span>
              </td>
              
              <!-- Fecha -->
              <td class="px-4 py-3 whitespace-nowrap text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-800'">
                {{ formatEventDate(event.datep || event.datea || event.datec) }}
              </td>
              
              <!-- Autor -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-bold">
                    {{ getInitials(event.user_author || event.author || 'U') }}
                  </div>
                  <span class="text-xs" :class="isDark ? 'text-gray-300' : 'text-gray-800'">
                    {{ event.user_author || event.author || 'Sistema' }}
                  </span>
                </div>
              </td>
              
              <!-- Tipo -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                  :class="getEventTypeBadgeClass(event.type_code || event.type)"
                >
                  {{ event.type_label || event.type || event.type_code || 'Evento' }}
                </span>
              </td>
              
              <!-- Título / Asunto -->
              <td class="px-4 py-3 text-xs max-w-md truncate font-medium" :class="isDark ? 'text-gray-200' : 'text-gray-900'">
                {{ event.label || event.title || event.note || 'Sin título' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Asignar / Gestionar Categorías -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" @click.self="showCategoryModal = false">
      <div class="rounded-xl p-6 w-full max-w-md shadow-2xl border transition-all" :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'">
        <div class="flex items-center justify-between mb-4 pb-3 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h3 class="text-base font-bold">Gestionar Etiquetas / Categorías</h3>
          <button @click="showCategoryModal = false" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            &times;
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium uppercase tracking-wider block mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              Seleccionar Categoría de Cliente
            </label>
            <select 
              v-model="selectedCategoryToAdd"
              class="w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
              <option :value="null">-- Seleccionar categoría --</option>
              <option 
                v-for="cat in availableCategories" 
                :key="cat.id" 
                :value="cat.id"
                :disabled="isCategoryAlreadyAssigned(cat.id)"
              >
                {{ cat.label || cat.name }} {{ isCategoryAlreadyAssigned(cat.id) ? '(Ya asignada)' : '' }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 pt-3">
            <button 
              @click="showCategoryModal = false"
              class="px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors"
              :class="isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              Cerrar
            </button>
            <button 
              @click="addCategory"
              :disabled="!selectedCategoryToAdd || addingCategory"
              class="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors inline-flex items-center space-x-1.5"
            >
              <div v-if="addingCategory" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
              <span>{{ addingCategory ? 'Guardando...' : 'Asignar Etiqueta' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../../composables/useTheme'
import { usePermissions } from '../../../composables/usePermissions'
import http from '../../../utils/http'
import { getThirdpartyBadges } from '../../../utils/thirdpartyHelpers'

const props = defineProps({
  tercero: {
    type: Object,
    required: true
  },
  filteredArrayOptions: {
    type: Array,
    default: () => []
  },
  getFormattedValue: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['switch-tab'])

const { isDark } = useTheme()
const { hasPermission, hasAnyPermission } = usePermissions()

// Permisos para categorías
const canReadCategories = computed(() => hasAnyPermission(['categorie->lire', 'categorie->read', 'category->read', 'societe->lire']))
const canManageCategories = computed(() => hasAnyPermission(['categorie->creer', 'categorie->creer_tous', 'societe->creer']))

// Estados locales
const loadingEvents = ref(false)
const events = ref([])
const loadingCategories = ref(false)
const assignedCategories = ref([])
const availableCategories = ref([])
const showCategoryModal = ref(false)
const selectedCategoryToAdd = ref(null)
const addingCategory = ref(false)
const commercialUser = ref(null)

const badges = computed(() => getThirdpartyBadges(props.tercero))

// Formateo de moneda
const formatCurrency = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Iniciales
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

// Formateo de fecha de evento
const formatEventDate = (dateVal) => {
  if (!dateVal) return '-'
  try {
    const timestamp = typeof dateVal === 'number' ? dateVal * 1000 : new Date(dateVal).getTime()
    if (isNaN(timestamp)) return dateVal
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateVal
  }
}

// Clases para badge de tipo de evento
const getEventTypeBadgeClass = (type) => {
  const t = String(type || '').toLowerCase()
  if (t.includes('mail') || t.includes('mensaje')) {
    return isDark.value ? 'bg-pink-900/40 text-pink-300 border border-pink-800' : 'bg-pink-50 text-pink-700 border border-pink-200'
  }
  if (t.includes('call') || t.includes('tel')) {
    return isDark.value ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }
  if (t.includes('ticket')) {
    return isDark.value ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
  }
  return isDark.value ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
}

// Normalizar color de categoría (Dolibarr puede devolver #hex, hex sin #, rgb, nombre...)
const normalizeColor = (color) => {
  if (!color) return null
  let c = String(color).trim()
  if (c.startsWith('#')) {
    if (c.length === 4) {
      // #RGB -> #RRGGBB
      c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]
    }
    return c
  }
  if (/^[0-9A-Fa-f]{6}$/.test(c)) return '#' + c
  if (/^[0-9A-Fa-f]{3}$/.test(c)) {
    return '#' + c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  }
  if (c.startsWith('rgb') || c.startsWith('hsl')) return c
  return c // named color, fallback
}

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Estilo de etiqueta de categoría usando el color real de Dolibarr
const getCategoryBadgeStyle = (cat) => {
  const baseColor = normalizeColor(cat.color)
  if (baseColor) {
    if (baseColor.startsWith('#') && baseColor.length === 7) {
      return {
        backgroundColor: hexToRgba(baseColor, isDark.value ? 0.18 : 0.14),
        color: baseColor,
        border: `1px solid ${hexToRgba(baseColor, 0.45)}`
      }
    }
    // rgb/hsl/named colors: usar opacidad reducida con color de texto contrastado
    return {
      backgroundColor: isDark.value ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      color: baseColor,
      border: `1px solid ${baseColor}`
    }
  }
  return isDark.value
    ? { backgroundColor: 'rgba(147, 197, 253, 0.12)', color: '#93c5fd', border: '1px solid rgba(96, 165, 250, 0.45)' }
    : { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }
}

const isCategoryAlreadyAssigned = (catId) => {
  return assignedCategories.value.some(c => c.id === catId || c.rowid === catId)
}

// URL oficial para verificación fiscal
const getValidationUrl = (idprof) => {
  if (!idprof) return '#'
  const cleanIdprof = String(idprof).replace(/\s+/g, '')
  return `http://www.e-informa.es/servlet/app/portal/ENTP/screen/SProducto/prod/ETIQUETA_EMPRESA/nif/${cleanIdprof}`
}

// Cargar eventos vinculados reales desde la API de Dolibarr
const loadLinkedEvents = async () => {
  if (!props.tercero?.id) return
  loadingEvents.value = true
  try {
    const response = await http.get('/api/doli/agendaevents', {
      params: {
        sqlfilters: `(t.fk_soc:=:${props.tercero.id})`,
        limit: 10,
        sortfield: 't.datec',
        sortorder: 'DESC'
      }
    })
    const data = response.data
    events.value = Array.isArray(data) ? data : (data ? Object.values(data) : [])
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar los eventos de agenda:', error.message)
    events.value = []
  } finally {
    loadingEvents.value = false
  }
}

// Extraer categorías asignadas del objeto tercero (fallback si el endpoint de categorías falla)
const loadCategoriesFromTercero = () => {
  const rawCategories = props.tercero?.categories || []
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    return rawCategories.map(c => {
      if (typeof c === 'string') return { id: c, label: c }
      if (typeof c === 'object' && c !== null) return { id: c.id || c.rowid, label: c.label || c.name || c.title || 'Categoría', color: c.color }
      return { id: c, label: String(c) }
    })
  }
  if (props.tercero?.array_options?.options_categories && Array.isArray(props.tercero.array_options.options_categories)) {
    return props.tercero.array_options.options_categories.map(c => ({ id: c, label: String(c) }))
  }
  return []
}

// Cargar categorías asignadas y disponibles
const loadCategories = async () => {
  if (!props.tercero?.id) return

  loadingCategories.value = true
  try {
    // 1. Intentar obtener categorías asignadas directamente desde Dolibarr (no pasa por caché de terceros)
    // El tipo correcto en la API de Dolibarr para clientes es 'customer', no 'thirdparty'
    let assignedData = []
    try {
      const assignedRes = await http.get(`/api/doli/categories/object/customer/${props.tercero.id}`)
      if (Array.isArray(assignedRes.data)) {
        assignedData = assignedRes.data
      }
    } catch (apiError) {
      console.warn('⚠️ No se pudieron cargar categorías desde el endpoint de categorías:', apiError.message)
      // Fallback al objeto tercero recibido
      assignedData = loadCategoriesFromTercero()
    }

    if (assignedData.length > 0) {
      assignedCategories.value = assignedData.map(c => ({
        id: c.id || c.rowid,
        label: c.label || c.name || c.title || 'Categoría',
        color: c.color
      }))
    } else {
      assignedCategories.value = loadCategoriesFromTercero()
    }

    // 2. Cargar lista de categorías customer disponibles para enriquecer y gestionar
    try {
      const availableRes = await http.get('/api/doli/categories', {
        params: { type: 'customer', limit: 100 }
      })
      const availableData = Array.isArray(availableRes.data) ? availableRes.data : []
      availableCategories.value = availableData

      // Enriquecer categorías asignadas con labels/colores reales
      if (availableData.length > 0 && assignedCategories.value.length > 0) {
        assignedCategories.value = assignedCategories.value.map(assigned => {
          const matched = availableData.find(avail => avail.id == assigned.id || avail.rowid == assigned.id || avail.label == assigned.label)
          if (matched) {
            return {
              id: matched.id || matched.rowid,
              label: matched.label || matched.name || assigned.label,
              color: matched.color || assigned.color
            }
          }
          return assigned
        })
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener categorías disponibles de Dolibarr:', error.message)
    }
  } catch (error) {
    console.warn('⚠️ Error al cargar categorías:', error.message)
    assignedCategories.value = loadCategoriesFromTercero()
  } finally {
    loadingCategories.value = false
  }
}

const openCategoryModal = () => {
  selectedCategoryToAdd.value = null
  showCategoryModal.value = true
}

const addCategory = async () => {
  if (!selectedCategoryToAdd.value || !props.tercero?.id) return
  addingCategory.value = true
  try {
    await http.post(`/api/doli/categories/${selectedCategoryToAdd.value}/objects/${props.tercero.id}?type=customer`)
    await loadCategories()
    showCategoryModal.value = false
  } catch (error) {
    console.error('❌ Error asignando categoría:', error)
    alert('Error al asignar categoría: ' + (error.response?.data?.message || error.message))
  } finally {
    addingCategory.value = false
  }
}

const removeCategory = async (catId) => {
  if (!catId || !props.tercero?.id) return
  if (!confirm('¿Deseas desvincular esta etiqueta de categoría del cliente?')) return
  try {
    await http.delete(`/api/doli/categories/${catId}/objects/${props.tercero.id}?type=customer`)
    await loadCategories()
  } catch (error) {
    console.error('❌ Error quitando categoría:', error)
  }
}

watch(() => props.tercero, () => {
  loadCategories()
}, { deep: true })

onMounted(() => {
  loadLinkedEvents()
  loadCategories()
})
</script>
