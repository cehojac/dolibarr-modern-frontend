<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{{ $t('public.common.back') }}</span>
          </button>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">CH</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('public.tickets.createTicket.title') }}</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300"
              :class="[
                currentStep > index
                  ? 'bg-green-500 text-white'
                  : currentStep === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              ]"
            >
              <svg v-if="currentStep > index" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              class="ml-2 text-sm font-medium hidden sm:inline"
              :class="[
                currentStep >= index
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ step }}
            </span>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-1 mx-4"
            :class="[
              currentStep > index
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-700'
            ]"
          ></div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <!-- Step 1: Email -->
        <div v-show="currentStep === 0" class="space-y-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('public.tickets.createTicket.step1.title') }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ $t('public.tickets.createTicket.step1.subtitle') }}</p>
          </div>
          
          <div class="max-w-xl mx-auto">
            <input
              v-model="formData.email"
              type="email"
              required
              autofocus
              class="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :placeholder="$t('public.tickets.createTicket.step1.placeholder')"
              @keyup.enter="nextStep"
            />
            <p v-if="formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)" class="mt-2 text-sm text-red-500">
              {{ $t('public.tickets.createTicket.step1.invalidEmail') }}
            </p>
          </div>
        </div>

        <!-- Step 2: Empresa -->
        <div v-show="currentStep === 1" class="space-y-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Selecciona tu empresa</h2>
            <p class="text-gray-600 dark:text-gray-400">Empresas asociadas a tu email</p>
          </div>
          
          <div class="max-w-xl mx-auto">
            <div v-if="relatedCompanies.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-600 dark:text-gray-400">No se encontraron empresas asociadas</p>
            </div>
            
            <div v-else-if="relatedCompanies.length === 1" class="text-center py-8">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ relatedCompanies[0]?.name || 'Cargando...' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">{{ relatedCompanies[0]?.email || '' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">ID: {{ relatedCompanies[0]?.id }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2">Empresa seleccionada automáticamente</p>
            </div>
            
            <select
              v-else
              v-model="formData.socid"
              required
              @change="loadCompanyProjects(formData.socid)"
              class="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option :value="null">Selecciona una empresa</option>
              <option 
                v-for="company in relatedCompanies" 
                :key="company.id" 
                :value="company.id"
              >
                {{ company.name }}
              </option>
            </select>
          </div>
          
          <!-- Proyectos de la empresa -->
          <div v-if="formData.socid" class="max-w-xl mx-auto mt-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Proyecto (opcional)</h3>
            
            <div v-if="isLoadingProjects" class="text-center py-8">
              <svg class="animate-spin h-8 w-8 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Cargando proyectos...</p>
            </div>
            
            <div v-else-if="relatedProjects.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400 text-sm">No hay proyectos activos para esta empresa</p>
            </div>
            
            <div v-else-if="relatedProjects.length === 1" class="text-center py-4">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ relatedProjects[0].title }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ relatedProjects[0].ref }}</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">Proyecto seleccionado automáticamente</p>
            </div>
            
            <select
              v-else
              v-model="formData.fk_project"
              class="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option :value="null">Sin proyecto específico</option>
              <option 
                v-for="project in relatedProjects" 
                :key="project.id" 
                :value="project.id"
              >
                {{ project.ref }} - {{ project.title }}
              </option>
            </select>
          </div>
        </div>

        <!-- Step 3: Detalles del Ticket -->
        <div v-show="currentStep === 2" class="space-y-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cuéntanos más detalles</h2>
            <p class="text-gray-600 dark:text-gray-400">Proporciona información sobre tu solicitud</p>
          </div>
          
          <div class="max-w-2xl mx-auto space-y-6">
            <!-- Grupo de Ticket -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Tipo de Solicitud *
              </label>
              <select
                v-model="formData.ticketGroup"
                required
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Selecciona un tipo</option>
                <option value="question">Pregunta</option>
                <option value="problem">Problema Técnico</option>
                <option value="request">Solicitud de Servicio</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <!-- Gravedad -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Gravedad / Prioridad *
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="severity in priorities"
                  :key="severity.value"
                  @click="formData.severity = severity.value"
                  type="button"
                  class="px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm"
                  :class="[
                    formData.severity === severity.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ severity.label }}
                </button>
              </div>
            </div>

            <!-- Asunto -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Asunto *
              </label>
              <input
                v-model="formData.subject"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Resumen breve de tu solicitud"
              />
            </div>

            <!-- Mensaje -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Mensaje / Descripción *
              </label>
              <div v-if="editor" class="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                <!-- Toolbar -->
                <div class="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-2 flex flex-wrap gap-1">
                  <button
                    @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('bold') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold"
                    type="button"
                  >
                    B
                  </button>
                  <button
                    @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('italic') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 italic"
                    type="button"
                  >
                    I
                  </button>
                  <button
                    @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('strike') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 line-through"
                    type="button"
                  >
                    S
                  </button>
                  <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button
                    @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('bulletList') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    type="button"
                  >
                    • Lista
                  </button>
                  <button
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('orderedList') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    type="button"
                  >
                    1. Lista
                  </button>
                  <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('heading', { level: 2 }) }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold"
                    type="button"
                  >
                    H2
                  </button>
                  <button
                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('heading', { level: 3 }) }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold"
                    type="button"
                  >
                    H3
                  </button>
                  <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <button
                    @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('blockquote') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    type="button"
                  >
                    " Cita
                  </button>
                  <button
                    @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'bg-blue-100 dark:bg-blue-900': editor.isActive('codeBlock') }"
                    class="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono"
                    type="button"
                  >
                    &lt;/&gt; Código
                  </button>
                </div>
                <!-- Editor -->
                <EditorContent 
                  :editor="editor" 
                  class="prose prose-sm max-w-none dark:prose-invert text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Archivos -->
        <div v-show="currentStep === 3" class="space-y-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">¿Deseas adjuntar archivos?</h2>
            <p class="text-gray-600 dark:text-gray-400">Puedes subir imágenes, documentos o archivos relacionados (opcional)</p>
          </div>
          
          <div class="max-w-2xl mx-auto space-y-6">
            <!-- Zona de arrastre -->
            <div
              @drop="handleFileDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer bg-gray-50 dark:bg-gray-900/50"
              @click="$refs.fileInput.click()"
            >
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Arrastra archivos aquí o haz click para seleccionar
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, PDF, DOC, DOCX (máx. 10MB por archivo)
              </p>
            </div>

            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
              class="hidden"
              @change="handleFileSelect"
            />

            <!-- Lista de archivos subidos -->
            <div v-if="uploadedFiles.length > 0" class="space-y-3">
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Archivos adjuntos ({{ uploadedFiles.length }})
              </p>
              <div
                v-for="file in uploadedFiles"
                :key="file.id"
                class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                  <svg class="w-8 h-8 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeFile(file.id)"
                  class="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="submitted" class="max-w-2xl mx-auto">
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    ¡Ticket Creado Exitosamente!
                  </h3>
                  <p class="text-green-700 dark:text-green-300 mb-4">
                    Su ticket ha sido registrado con el ID de seguimiento:
                  </p>
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">ID de Seguimiento</p>
                    <p class="text-2xl font-mono font-bold text-gray-900 dark:text-white">{{ trackingId }}</p>
                  </div>
                  <p class="text-sm text-green-600 dark:text-green-400 mt-4">
                    Guarde este ID para consultar el estado de su ticket. También recibirá un email de confirmación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="currentStep > 0 && !submitted"
            @click="previousStep"
            class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Anterior
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < 3 && !submitted"
            @click="nextStep"
            :disabled="!canProceed || isCheckingEmail"
            class="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center space-x-2"
          >
            <svg v-if="isCheckingEmail" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isCheckingEmail ? 'Verificando...' : 'Continuar →' }}</span>
          </button>

          <button
            v-if="currentStep === 3 && !submitted"
            @click="submitTicket"
            :disabled="isSubmitting"
            class="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center space-x-2"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Enviando...' : 'Crear Ticket' }}</span>
          </button>

          <button
            v-if="submitted"
            @click="goToTrack"
            class="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Ver Mi Ticket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/utils/http'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

const steps = computed(() => [
  t('public.tickets.createTicket.steps.email'),
  t('public.tickets.createTicket.steps.company'),
  t('public.tickets.createTicket.steps.details'),
  t('public.tickets.createTicket.steps.files')
])
const currentStep = ref(0)
const submitted = ref(false)
const isSubmitting = ref(false)
const trackingId = ref('')
const fileInput = ref(null)
const uploadedFiles = ref([])
const isCheckingEmail = ref(false)
const contactData = ref(null)
const relatedCompanies = ref([])
const relatedProjects = ref([])
const isLoadingProjects = ref(false)

const formData = ref({
  email: '',
  socid: null, // ID de la empresa seleccionada
  fk_project: null, // ID del proyecto seleccionado
  ticketGroup: '',
  severity: 'normal',
  subject: '',
  message: ''
})

const priorities = [
  { value: 'low', label: 'Baja', color: 'gray' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'Alta', color: 'orange' },
  { value: 'urgent', label: 'Urgente', color: 'red' }
]

// Configurar TipTap editor
const editor = useEditor({
  content: formData.value.message,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    formData.value.message = editor.getHTML()
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3'
    }
  }
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    // Paso 1: Email
    return formData.value.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) && !isCheckingEmail.value
  }
  if (currentStep.value === 1) {
    // Paso 2: Empresa
    return formData.value.socid !== null
  }
  if (currentStep.value === 2) {
    // Paso 3: Detalles
    return formData.value.ticketGroup && formData.value.severity && formData.value.subject && formData.value.message
  }
  // Paso 4: Archivos (opcional)
  return true
})

const nextStep = async () => {
  if (!canProceed.value) return
  
  // Si estamos en el paso 0 (email), verificar el email antes de continuar
  if (currentStep.value === 0) {
    await checkEmailAndLoadCompanies()
  }
  
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// Verificar si el email existe y cargar empresas relacionadas
const checkEmailAndLoadCompanies = async () => {
  isCheckingEmail.value = true
  
  // Limpiar datos anteriores
  relatedCompanies.value = []
  contactData.value = null
  formData.value.socid = null
  
  // console.log('🧹 Limpiando datos anteriores...')
  
  try {
    // console.log('🔍 Verificando email:', formData.value.email)
    
    // Buscar contactos por email usando sqlfilters
    // Esto nos devuelve los contactos con información de la empresa incluida
    const sqlfilter = `(t.email:=:'${formData.value.email}')`
    
    const contactResponse = await http.get('/api/doli/contacts', {
      params: {
        sqlfilters: sqlfilter,
        sortfield: 't.rowid',
        sortorder: 'ASC',
        limit: 100
      },
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    // console.log('📦 Respuesta de contactos:', contactResponse.data)
    
    if (contactResponse.data && Array.isArray(contactResponse.data) && contactResponse.data.length > 0) {
      // console.log(`✅ Se encontraron ${contactResponse.data.length} contacto(s)`)
      
      // Filtrar solo contactos con empresas activas (statut = 1)
      const activeContacts = contactResponse.data.filter(contact => {
        return contact.statut === '1' || contact.statut === 1
      })
      
      // console.log(`✅ Contactos con empresas activas: ${activeContacts.length}`)
      
      if (activeContacts.length === 0) {
        // console.log('⚠️ No se encontraron contactos con empresas activas')
        alert('No se encontraron empresas activas asociadas a este email. Por favor, contacte con el administrador.')
        throw new Error('Sin empresas activas')
      }
      
      // Guardar el primer contacto
      contactData.value = activeContacts[0]
      
      // Extraer empresas únicas de los contactos activos
      const companiesMap = new Map()
      
      activeContacts.forEach(contact => {
        const socid = contact.fk_soc || contact.socid
        const socname = contact.socname
        
        if (socid && socname && !companiesMap.has(socid)) {
          companiesMap.set(socid, {
            id: socid,
            name: socname,
            email: contact.email || ''
          })
          
          // console.log(`🏢 Empresa encontrada: ${socname} (ID: ${socid})`)
        }
      })
      
      // Convertir el Map a array
      relatedCompanies.value = Array.from(companiesMap.values())
      
      // console.log(`✅ Total de empresas únicas: ${relatedCompanies.value.length}`)
      
      // Seleccionar automáticamente la empresa si solo hay una
      if (relatedCompanies.value.length === 1) {
        formData.value.socid = relatedCompanies.value[0].id
        // console.log('✅ Empresa seleccionada automáticamente:', relatedCompanies.value[0].name)
        
        // Cargar proyectos de la empresa seleccionada
        await loadCompanyProjects(formData.value.socid)
      }
      
      // Cargar idioma por defecto de la primera empresa
      if (relatedCompanies.value.length > 0) {
        const savedLocale = localStorage.getItem('locale')
        if (!savedLocale) {
          try {
            const companyId = relatedCompanies.value[0].id
            const companyResponse = await http.get(`/api/doli/thirdparties/${companyId}`, {
              headers: {
                'X-Public-Request': 'true'
              }
            })
            
            if (companyResponse.data && companyResponse.data.default_lang) {
              const langMap = {
                'es_ES': 'es',
                'en_US': 'en',
                'ca_ES': 'ca',
                'es': 'es',
                'en': 'en',
                'ca': 'ca'
              }
              
              const mappedLang = langMap[companyResponse.data.default_lang] || 'es'
              locale.value = mappedLang
              localStorage.setItem('locale', mappedLang)
              console.log('🌍 Idioma establecido desde empresa:', mappedLang, '(desde', companyResponse.data.default_lang + ')')
            }
          } catch (error) {
            console.error('⚠️ Error al cargar idioma de empresa:', error)
          }
        }
      }
      
      // console.log('📋 Empresas disponibles:', relatedCompanies.value)
      
    } else {
      // console.log('⚠️ No se encontró contacto con ese email')
      alert('No se encontró un contacto registrado con ese email. Por favor, contacte con el administrador para registrarse.')
      throw new Error('Email no encontrado')
    }
  } catch (error) {
    console.error('❌ Error al verificar email:', error)
    if (error.message !== 'Email no encontrado') {
      alert('Error al verificar el email. Por favor, intente nuevamente.')
    }
    throw error
  } finally {
    isCheckingEmail.value = false
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Cargar proyectos de la empresa seleccionada
const loadCompanyProjects = async (socid) => {
  if (!socid) {
    relatedProjects.value = []
    return
  }
  
  isLoadingProjects.value = true
  relatedProjects.value = []
  formData.value.fk_project = null
  
  try {
    // console.log('📁 Cargando proyectos de la empresa:', socid)
    
    // Obtener proyectos activos de la empresa
    const response = await http.get('/api/doli/projects', {
      params: {
        thirdparty_ids: socid,
        sqlfilters: "(t.fk_statut:=:1)" // Solo proyectos activos (status = 1)
      },
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    // console.log('📦 Respuesta de proyectos:', response.data)
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      relatedProjects.value = response.data.map(project => ({
        id: project.id,
        ref: project.ref,
        title: project.title || project.ref,
        description: project.description
      }))
      
      // console.log(`✅ ${relatedProjects.value.length} proyecto(s) encontrado(s)`)
      
      // Si solo hay un proyecto, seleccionarlo automáticamente
      if (relatedProjects.value.length === 1) {
        formData.value.fk_project = relatedProjects.value[0].id
        // console.log('✅ Proyecto seleccionado automáticamente:', relatedProjects.value[0].title)
      }
    } else {
      // console.log('⚠️ No se encontraron proyectos activos para esta empresa')
    }
  } catch (error) {
    console.error('❌ Error al cargar proyectos:', error)
  } finally {
    isLoadingProjects.value = false
  }
}

const submitTicket = async () => {
  isSubmitting.value = true
  
  try {
    // console.log('📝 Creando ticket...')
    // console.log('Datos del formulario:', formData.value)
    
    // Mapear tipo de ticket
    const typeCodeMap = {
      'question': 'QUESTION',
      'problem': 'ISSUE',
      'request': 'REQUEST',
      'other': 'OTHER'
    }
    
    // Mapear severidad
    const severityCodeMap = {
      'low': 'LOW',
      'normal': 'NORMAL',
      'high': 'HIGH',
      'urgent': 'URGENT'
    }
    
    // Preparar payload para crear ticket
    const ticketPayload = {
      fk_soc: formData.value.socid,
      fk_project: formData.value.fk_project || null,
      subject: formData.value.subject,
      message: formData.value.message,
      type_code: typeCodeMap[formData.value.ticketGroup] || 'OTHER',
      severity_code: severityCodeMap[formData.value.severity] || 'NORMAL',
      origin_email: formData.value.email,
      notify_tiers_at_create: 0,
      fk_user_assign: null // Sin asignar inicialmente
    }
    
    // console.log('📦 Payload del ticket:', ticketPayload)
    
    // Crear ticket
    const ticketResponse = await http.post('/api/doli/tickets', ticketPayload, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    // console.log('✅ Ticket creado, ID:', ticketResponse.data)
    
    const ticketId = ticketResponse.data
    
    // Obtener los datos completos del ticket para obtener track_id y ref
    // console.log('🔍 Obteniendo datos completos del ticket...')
    const ticketDetailsResponse = await http.get(`/api/doli/tickets/${ticketId}`, {
      headers: {
        'X-Public-Request': 'true'
      }
    })
    
    // console.log('📦 Datos completos del ticket:', ticketDetailsResponse.data)
    
    const ticketData = ticketDetailsResponse.data
    trackingId.value = ticketData.track_id || ticketData.ref || `TK${ticketId}`
    const ticketRef = ticketData.ref
    
    // console.log('✅ Track ID:', trackingId.value)
    // console.log('✅ Ref:', ticketRef)
    
    // Subir archivos si hay usando el endpoint del módulo personalizado
    if (uploadedFiles.value.length > 0) {
      // console.log(`📎 Subiendo ${uploadedFiles.value.length} archivo(s)...`)
      
      for (const fileData of uploadedFiles.value) {
        try {
          // Convertir archivo a base64
          const base64Content = await fileToBase64(fileData.file)
          
          const uploadPayload = {
            filename: fileData.name,
            file_content: base64Content
          }
          
          // console.log(`📤 Subiendo archivo: ${fileData.name}`)
          
          const uploadResponse = await http.post(`/api/doli/dolibarmodernfrontendapi/ticket/${ticketId}/documents`, uploadPayload, {
            headers: {
              'Content-Type': 'application/json',
              'X-Public-Request': 'true'
            }
          })
          
          // console.log(`✅ Archivo subido: ${fileData.name}`, uploadResponse.data)
        } catch (uploadError) {
          console.error(`❌ Error al subir archivo ${fileData.name}:`, uploadError)
          // Continuar con los demás archivos aunque uno falle
        }
      }
    }
    
    submitted.value = true
    // console.log('🎉 Ticket creado exitosamente con ID:', trackingId.value)
    
  } catch (error) {
    console.error('❌ Error al crear ticket:', error)
    
    let errorMessage = 'Error al crear el ticket. Por favor, intente nuevamente.'
    
    if (error.response) {
      console.error('Respuesta de error:', error.response.data)
      errorMessage = error.response.data.error?.message || errorMessage
    }
    
    alert(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/new-ticket')
}

const goToTrack = () => {
  router.push(`/new-ticket/track?id=${trackingId.value}`)
}

const getTypeLabel = (type) => {
  const types = {
    question: 'Pregunta',
    problem: 'Problema Técnico',
    request: 'Solicitud de Servicio',
    other: 'Otro'
  }
  return types[type] || type
}

const getPriorityLabel = (priority) => {
  const p = priorities.find(p => p.value === priority)
  return p ? p.label : priority
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    normal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }
  return classes[priority] || classes.normal
}

// Manejo de archivos
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleFileDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`)
      return
    }
    
    // Validar tipo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert(`El tipo de archivo ${file.name} no está permitido.`)
      return
    }
    
    uploadedFiles.value.push({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    })
  })
  
  // Limpiar input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (fileId) => {
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== fileId)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Convertir archivo a base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remover el prefijo "data:*/*;base64," para obtener solo el contenido base64
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}
</script>
