<template>
  <div class="wysiwyg-editor">
    <!-- Editor Container -->
    <div 
      class="border rounded-lg overflow-hidden" 
      :class="isDark ? 'border-gray-600' : 'border-gray-300'"
    >
      <!-- Toolbar -->
      <div 
        class="flex items-center space-x-1 p-2 border-b flex-wrap gap-1" 
        :class="isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'"
      >
        <!-- Text Formatting -->
        <button 
          @click="commands.bold()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Negrita (Ctrl+B)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.5 4h-5v12h5a4 4 0 000-8 4 4 0 000-8zm-2 6V6h2a2 2 0 110 4h-2zm0 2h2a2 2 0 110 4h-2v-4z"/>
          </svg>
        </button>
        
        <button 
          @click="commands.italic()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Cursiva (Ctrl+I)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 4h6v2h-2l-4 8h2v2H6v-2h2l4-8H10V4z"/>
          </svg>
        </button>
        
        <button 
          @click="commands.underline()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Subrayado (Ctrl+U)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v4a6 6 0 0012 0V8a6 6 0 00-6-6zM4 8a4 4 0 118 0v4a4 4 0 11-8 0V8zm0 10h12v2H4v-2z"/>
          </svg>
        </button>

        <button 
          @click="commands.strikeThrough()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Tachado"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm-3 5h6v2H7V9z"/>
          </svg>
        </button>
        
        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <!-- Lists -->
        <button 
          @click="commands.insertUnorderedList()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Lista con viñetas"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
          </svg>
        </button>
        
        <button 
          @click="commands.insertOrderedList()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Lista numerada"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm0 4h14v2H3V8zm0 4h14v2H3v-2zm0 4h14v2H3v-2z"/>
          </svg>
        </button>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Alignment -->
        <button 
          @click="commands.justifyLeft()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Alinear izquierda"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h10v2H3v-2z"/>
          </svg>
        </button>

        <button 
          @click="commands.justifyCenter()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Centrar"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm2 4h10v2H5V8zm-2 4h14v2H3v-2zm2 4h10v2H5v-2z"/>
          </svg>
        </button>

        <button 
          @click="commands.justifyRight()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Alinear derecha"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z"/>
          </svg>
        </button>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Remove Format -->
        <button 
          @click="commands.removeFormat()" 
          type="button" 
          class="p-2 rounded transition-colors"
          :class="isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
          title="Limpiar formato"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7h4v2H8V7zm0 4h4v2H8v-2z"/>
          </svg>
        </button>
      </div>
      
      <!-- Editor Area -->
      <div
        :ref="el => editorRef = el"
        contenteditable="true"
        @input="updateContent"
        class="p-3 focus:outline-none overflow-y-auto"
        :class="[
          isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
          heightClass
        ]"
        :placeholder="placeholder"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useWysiwygEditor } from '../composables/useWysiwygEditor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Escribe aquí...'
  },
  height: {
    type: String,
    default: 'min-h-[200px]'
  }
})

const emit = defineEmits(['update:modelValue'])

const { isDark } = useTheme()
const { editorRef, content, updateContent, commands } = useWysiwygEditor()

const heightClass = props.height

// Watch para cambios en modelValue (desde el padre)
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value && editorRef.value) {
    editorRef.value.innerHTML = newValue
    content.value = newValue
  }
}, { immediate: true })

// Watch para cambios en content (desde el editor)
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
/* Estilos para el editor WYSIWYG */
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: #9CA3AF;
  font-style: italic;
}

[contenteditable="true"]:focus {
  outline: none;
}

/* Estilos para el contenido del editor */
[contenteditable="true"] p {
  margin: 0.5rem 0;
}

[contenteditable="true"] ul,
[contenteditable="true"] ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

[contenteditable="true"] li {
  margin: 0.25rem 0;
}

[contenteditable="true"] strong {
  font-weight: bold;
}

[contenteditable="true"] em {
  font-style: italic;
}

[contenteditable="true"] u {
  text-decoration: underline;
}

[contenteditable="true"] s {
  text-decoration: line-through;
}
</style>
