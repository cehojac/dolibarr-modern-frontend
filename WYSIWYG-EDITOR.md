# Editor WYSIWYG Reutilizable

Este proyecto incluye un editor WYSIWYG (What You See Is What You Get) completamente reutilizable y personalizable.

## 📦 Componentes Incluidos

### 1. **Composable: `useWysiwygEditor.js`**
Lógica reutilizable para cualquier editor WYSIWYG.

### 2. **Componente: `WysiwygEditor.vue`**
Componente Vue completo con barra de herramientas y área de edición.

---

## 🚀 Uso Básico

### Opción 1: Usar el Componente (Recomendado)

```vue
<template>
  <div>
    <WysiwygEditor 
      v-model="description"
      placeholder="Escribe la descripción aquí..."
      height="min-h-[300px]"
    />
    
    <button @click="saveContent">Guardar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const description = ref('<p>Contenido inicial</p>')

const saveContent = () => {
  console.log('HTML:', description.value)
}
</script>
```

### Opción 2: Usar el Composable (Personalizado)

```vue
<template>
  <div>
    <!-- Barra de herramientas personalizada -->
    <div class="toolbar">
      <button @click="commands.bold()">Negrita</button>
      <button @click="commands.italic()">Cursiva</button>
      <button @click="commands.insertUnorderedList()">Lista</button>
    </div>
    
    <!-- Área de edición -->
    <div
      :ref="el => editorRef = el"
      contenteditable="true"
      @input="updateContent"
      class="editor-area"
    ></div>
  </div>
</template>

<script setup>
import { useWysiwygEditor } from '@/composables/useWysiwygEditor'

const { 
  editorRef, 
  content, 
  updateContent, 
  commands,
  initEditor 
} = useWysiwygEditor()

// Inicializar con contenido
initEditor('<p>Contenido inicial</p>')
</script>
```

---

## 🎨 Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `modelValue` | String | `''` | Contenido HTML del editor (v-model) |
| `placeholder` | String | `'Escribe aquí...'` | Texto placeholder cuando está vacío |
| `height` | String | `'min-h-[200px]'` | Clase CSS para la altura del editor |

---

## 🛠️ Funciones del Composable

### Métodos Principales

```javascript
const {
  // Refs
  editorRef,      // Referencia al elemento DOM del editor
  content,        // Contenido HTML actual
  isEditing,      // Estado de edición
  
  // Métodos
  initEditor,     // Inicializar editor con contenido
  updateContent,  // Actualizar contenido (evento @input)
  formatText,     // Aplicar formato personalizado
  getContent,     // Obtener contenido HTML
  getPlainText,   // Obtener texto sin HTML
  clearEditor,    // Limpiar editor
  resetEditor,    // Resetear estado
  insertHTML,     // Insertar HTML en cursor
  commands,       // Comandos de formato predefinidos
} = useWysiwygEditor()
```

### Comandos Disponibles

```javascript
commands.bold()                    // Negrita
commands.italic()                  // Cursiva
commands.underline()               // Subrayado
commands.strikeThrough()           // Tachado
commands.insertUnorderedList()     // Lista con viñetas
commands.insertOrderedList()       // Lista numerada
commands.createLink(url)           // Crear enlace
commands.unlink()                  // Quitar enlace
commands.justifyLeft()             // Alinear izquierda
commands.justifyCenter()           // Centrar
commands.justifyRight()            // Alinear derecha
commands.justifyFull()             // Justificar
commands.indent()                  // Aumentar sangría
commands.outdent()                 // Reducir sangría
commands.removeFormat()            // Limpiar formato
commands.undo()                    // Deshacer
commands.redo()                    // Rehacer
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Editor de Descripción de Ticket

```vue
<template>
  <div v-if="editingDescription">
    <WysiwygEditor 
      v-model="editedDescription"
      placeholder="Descripción del ticket"
      height="min-h-[250px]"
    />
    
    <div class="mt-3 flex space-x-2">
      <button @click="saveDescription" class="btn-primary">
        Guardar
      </button>
      <button @click="cancelEdit" class="btn-secondary">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const editingDescription = ref(false)
const editedDescription = ref('')

const saveDescription = async () => {
  // Guardar en API
  await api.updateTicket({ description: editedDescription.value })
  editingDescription.value = false
}

const cancelEdit = () => {
  editingDescription.value = false
  editedDescription.value = ''
}
</script>
```

### Ejemplo 2: Editor de Comentarios

```vue
<template>
  <div>
    <WysiwygEditor 
      v-model="newComment"
      placeholder="Escribe un comentario..."
      height="min-h-[150px]"
    />
    
    <button @click="postComment">Publicar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const newComment = ref('')

const postComment = async () => {
  await api.createComment({ content: newComment.value })
  newComment.value = '' // Limpiar después de publicar
}
</script>
```

### Ejemplo 3: Editor de Notas

```vue
<template>
  <div>
    <h3>Nota Privada</h3>
    <WysiwygEditor 
      v-model="privateNote"
      placeholder="Nota privada..."
      height="min-h-[200px]"
    />
    
    <h3>Nota Pública</h3>
    <WysiwygEditor 
      v-model="publicNote"
      placeholder="Nota pública..."
      height="min-h-[200px]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const privateNote = ref('')
const publicNote = ref('')
</script>
```

---

## 🎯 Características

✅ **Completamente reutilizable** - Usa el componente en cualquier parte  
✅ **v-model support** - Binding bidireccional automático  
✅ **Tema claro/oscuro** - Se adapta automáticamente al tema  
✅ **Barra de herramientas completa** - Negrita, cursiva, listas, alineación, etc.  
✅ **Personalizable** - Altura, placeholder, estilos personalizados  
✅ **Composable incluido** - Para casos de uso avanzados  
✅ **Atajos de teclado** - Ctrl+B, Ctrl+I, Ctrl+U, etc.  
✅ **HTML limpio** - Genera HTML semántico  
✅ **Sin dependencias externas** - Solo Vue 3  

---

## 🔧 Personalización Avanzada

### Crear Barra de Herramientas Personalizada

```vue
<template>
  <div>
    <!-- Solo los botones que necesitas -->
    <div class="custom-toolbar">
      <button @click="commands.bold()">B</button>
      <button @click="commands.italic()">I</button>
      <button @click="handleLink()">🔗</button>
    </div>
    
    <div
      :ref="el => editorRef = el"
      contenteditable="true"
      @input="updateContent"
    ></div>
  </div>
</template>

<script setup>
import { useWysiwygEditor } from '@/composables/useWysiwygEditor'

const { editorRef, updateContent, commands } = useWysiwygEditor()

const handleLink = () => {
  const url = prompt('URL:')
  if (url) commands.createLink(url)
}
</script>
```

### Agregar Validación

```vue
<script setup>
import { ref, computed } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const content = ref('')

const isValid = computed(() => {
  const plainText = content.value.replace(/<[^>]*>/g, '').trim()
  return plainText.length >= 10
})

const errorMessage = computed(() => {
  return isValid.value ? '' : 'Mínimo 10 caracteres'
})
</script>
```

---

## 📚 Integración con Formularios

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Título</label>
      <input v-model="form.title" type="text" />
    </div>
    
    <div class="form-group">
      <label>Descripción</label>
      <WysiwygEditor v-model="form.description" />
    </div>
    
    <button type="submit">Enviar</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import WysiwygEditor from '@/components/WysiwygEditor.vue'

const form = reactive({
  title: '',
  description: ''
})

const handleSubmit = async () => {
  await api.submit(form)
}
</script>
```

---

## 🐛 Solución de Problemas

### El contenido no se actualiza
Asegúrate de usar `v-model` correctamente:
```vue
<WysiwygEditor v-model="myContent" />
```

### Estilos no se aplican
El componente usa Tailwind CSS. Asegúrate de que Tailwind esté configurado.

### Comandos no funcionan
Algunos navegadores pueden bloquear `document.execCommand`. Verifica la consola.

---

## 📄 Licencia

Este componente es parte del proyecto Dolibarr Modern Frontend.
