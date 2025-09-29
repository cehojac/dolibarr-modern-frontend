<template>
  <button 
    @click.stop="handleClick"
    :class="buttonClasses"
    :title="isRunning ? 'Parar cronómetro' : 'Iniciar cronómetro'"
    :disabled="disabled"
  >
    <div class="flex items-center" :class="showTime && isRunning ? 'space-x-1' : ''">
      <!-- Play/Pause Icon -->
      <svg :class="iconClasses" fill="currentColor" viewBox="0 0 24 24">
        <path v-if="!isRunning" d="M8 5v14l11-7z"/>
        <path v-else d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
      
      <!-- Timer Display (conditional) -->
      <span 
        v-if="showTime && isRunning" 
        :class="timeClasses"
      >
        {{ formattedTime }}
      </span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTicketTimer } from '@/composables/useTicketTimer'

// Props
const props = defineProps({
  entityId: {
    type: [String, Number],
    required: true
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'table', // table, modal
    validator: (value) => ['table', 'modal'].includes(value)
  },
  showTime: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // Optional custom timer functions (for compatibility with different timer systems)
  customIsRunning: {
    type: Function,
    default: null
  },
  customFormatTime: {
    type: Function,
    default: null
  }
})

// Emits
const emit = defineEmits(['started', 'stopped', 'click'])

// Timer composable (fallback to useTicketTimer if no custom functions provided)
const { startTimer, stopTimer, isTimerRunning, formatElapsedTime } = useTicketTimer()

// Computed properties with fallback to custom functions
const isRunning = computed(() => {
  if (props.customIsRunning) {
    return props.customIsRunning(props.entityId)
  }
  return isTimerRunning(props.entityId)
})

const formattedTime = computed(() => {
  if (props.customFormatTime) {
    return props.customFormatTime(props.entityId)
  }
  return formatElapsedTime(props.entityId)
})

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      button: 'px-1 py-1 text-xs',
      icon: 'w-3 h-3',
      time: 'text-xs'
    },
    md: {
      button: 'px-2 py-1 text-xs sm:text-sm',
      icon: 'w-3 h-3 sm:w-4 sm:h-4',
      time: 'text-xs'
    },
    lg: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      time: 'text-sm'
    }
  }
  return sizes[props.size]
})

// Variant classes
const variantClasses = computed(() => {
  if (props.variant === 'modal') {
    return {
      button: 'flex items-center space-x-2 rounded-lg border',
      time: 'font-mono font-bold bg-red-100 dark:bg-red-900 px-2 py-1 rounded'
    }
  }
  
  // Default table variant - same style as original tickets
  return {
    button: 'transition-colors rounded-md border',
    time: 'font-mono font-bold hidden sm:inline'
  }
})

// Button classes
const buttonClasses = computed(() => {
  const baseClasses = [
    sizeClasses.value.button,
    variantClasses.value.button
  ]
  
  if (props.disabled) {
    baseClasses.push('opacity-50 cursor-not-allowed')
  } else if (isRunning.value) {
    baseClasses.push('text-red-500 hover:text-red-400 bg-red-50 hover:bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-700 dark:hover:bg-red-900/30')
  } else {
    baseClasses.push('text-green-500 hover:text-green-400 bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:hover:bg-green-900/30')
  }
  
  return baseClasses.join(' ')
})

// Icon classes
const iconClasses = computed(() => {
  return sizeClasses.value.icon
})

// Time classes
const timeClasses = computed(() => {
  return [
    sizeClasses.value.time,
    variantClasses.value.time
  ].join(' ')
})

// Methods
const handleClick = () => {
  if (props.disabled) return
  
  emit('click', { entityId: props.entityId, isRunning: isRunning.value })
  
  if (isRunning.value) {
    // Stop timer - use default timer system if no custom functions
    if (props.customIsRunning) {
      // For custom timer systems, just emit the event
      emit('stopped', { entityId: props.entityId, isRunning: true })
    } else {
      // Use default useTicketTimer system
      const elapsedSeconds = stopTimer(props.entityId)
      emit('stopped', { entityId: props.entityId, elapsedSeconds })
    }
  } else {
    // Start timer
    if (props.customIsRunning) {
      // For custom timer systems, just emit the event
      emit('started', { entityId: props.entityId })
    } else {
      // Use default useTicketTimer system
      startTimer(props.entityId)
      emit('started', { entityId: props.entityId })
    }
  }
}
</script>
