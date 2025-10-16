import { ref, nextTick } from 'vue'

export function useWysiwygEditor() {
  const editorRef = ref(null)
  const content = ref('')
  const isEditing = ref(false)

  /**
   * Inicializar el editor con contenido HTML
   */
  const initEditor = (initialContent = '') => {
    isEditing.value = true
    content.value = initialContent
    
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.innerHTML = initialContent
        editorRef.value.focus()
      }
    })
  }

  /**
   * Actualizar el contenido cuando el usuario edita
   */
  const updateContent = (event) => {
    content.value = event.target.innerHTML
  }

  /**
   * Aplicar formato de texto (negrita, cursiva, etc.)
   */
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.value?.focus()
  }

  /**
   * Obtener el contenido HTML actual
   */
  const getContent = () => {
    return content.value
  }

  /**
   * Obtener el contenido como texto plano (sin HTML)
   */
  const getPlainText = () => {
    const div = document.createElement('div')
    div.innerHTML = content.value
    return div.textContent || div.innerText || ''
  }

  /**
   * Limpiar el editor
   */
  const clearEditor = () => {
    content.value = ''
    if (editorRef.value) {
      editorRef.value.innerHTML = ''
    }
  }

  /**
   * Resetear el editor
   */
  const resetEditor = () => {
    isEditing.value = false
    content.value = ''
  }

  /**
   * Insertar HTML en la posición del cursor
   */
  const insertHTML = (html) => {
    formatText('insertHTML', html)
  }

  /**
   * Comandos de formato disponibles
   */
  const commands = {
    bold: () => formatText('bold'),
    italic: () => formatText('italic'),
    underline: () => formatText('underline'),
    strikeThrough: () => formatText('strikeThrough'),
    insertUnorderedList: () => formatText('insertUnorderedList'),
    insertOrderedList: () => formatText('insertOrderedList'),
    createLink: (url) => formatText('createLink', url),
    unlink: () => formatText('unlink'),
    justifyLeft: () => formatText('justifyLeft'),
    justifyCenter: () => formatText('justifyCenter'),
    justifyRight: () => formatText('justifyRight'),
    justifyFull: () => formatText('justifyFull'),
    indent: () => formatText('indent'),
    outdent: () => formatText('outdent'),
    removeFormat: () => formatText('removeFormat'),
    undo: () => formatText('undo'),
    redo: () => formatText('redo'),
  }

  return {
    // Refs
    editorRef,
    content,
    isEditing,
    
    // Métodos
    initEditor,
    updateContent,
    formatText,
    getContent,
    getPlainText,
    clearEditor,
    resetEditor,
    insertHTML,
    commands,
  }
}
