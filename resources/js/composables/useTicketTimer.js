import { ref, computed, onUnmounted, onMounted } from 'vue'

// Global timer state
const activeTimers = ref(new Map())
const intervals = ref(new Map())
let isInitialized = false

// LocalStorage key for persisting timers
const STORAGE_KEY = 'dolibarr_active_timers'

// Load timers from localStorage
const loadTimersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const timersData = JSON.parse(stored)
      const now = Date.now()
      
      // Restore active timers and recalculate elapsed time
      Object.entries(timersData).forEach(([ticketId, timerData]) => {
        if (timerData.isRunning) {
          // Calculate elapsed time since last save
          const elapsedSinceStart = now - timerData.startTime
          
          activeTimers.value.set(ticketId, {
            startTime: timerData.startTime,
            elapsed: elapsedSinceStart,
            isRunning: true
          })
          
          // Restart the interval
          const interval = setInterval(() => {
            const timer = activeTimers.value.get(ticketId)
            if (timer && timer.isRunning) {
              timer.elapsed = Date.now() - timer.startTime
              // Trigger reactivity
              activeTimers.value = new Map(activeTimers.value)
              // Save to localStorage
              saveTimersToStorage()
            }
          }, 1000)
          
          intervals.value.set(ticketId, interval)
        }
      })
      
      //  console.log('🔄 Timers restaurados desde localStorage:', timersData)
    }
  } catch (error) {
    // console.error('❌ Error cargando timers desde localStorage:', error)
  }
}

// Save timers to localStorage
const saveTimersToStorage = () => {
  try {
    const timersData = {}
    activeTimers.value.forEach((timer, ticketId) => {
      timersData[ticketId] = {
        startTime: timer.startTime,
        elapsed: timer.elapsed,
        isRunning: timer.isRunning
      }
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timersData))
  } catch (error) {
    console.error('❌ Error guardando timers en localStorage:', error)
  }
}

// Save timers before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    saveTimersToStorage()
  })
}

export function useTicketTimer() {
  
  const startTimer = (ticketId) => {
    if (activeTimers.value.has(ticketId)) {
      return // Timer already running
    }
    
    const startTime = Date.now()
    activeTimers.value.set(ticketId, {
      startTime,
      elapsed: 0,
      isRunning: true
    })
    
    // Save to localStorage immediately
    saveTimersToStorage()
    
    // Create interval for this timer
    let saveCounter = 0
    const interval = setInterval(() => {
      const timer = activeTimers.value.get(ticketId)
      if (timer && timer.isRunning) {
        timer.elapsed = Date.now() - timer.startTime
        // Trigger reactivity
        activeTimers.value = new Map(activeTimers.value)
        
        // Save to localStorage every 10 seconds to reduce overhead
        saveCounter++
        if (saveCounter >= 10) {
          saveTimersToStorage()
          saveCounter = 0
        }
      }
    }, 1000)
    
    intervals.value.set(ticketId, interval)
    //  console.log('⏱️ Timer iniciado para ticket:', ticketId)
  }
  
  const stopTimer = (ticketId) => {
    const timer = activeTimers.value.get(ticketId)
    if (!timer) return null
    
    // Clear interval
    const interval = intervals.value.get(ticketId)
    if (interval) {
      clearInterval(interval)
      intervals.value.delete(ticketId)
    }
    
    // Calculate final elapsed time
    const finalElapsed = timer.isRunning ? Date.now() - timer.startTime : timer.elapsed
    
    // Remove from active timers
    activeTimers.value.delete(ticketId)
    activeTimers.value = new Map(activeTimers.value)
    
    // Update localStorage
    saveTimersToStorage()
    
    //  console.log('⏹️ Timer detenido para ticket:', ticketId, 'Tiempo:', Math.floor(finalElapsed / 1000), 'segundos')
    return Math.floor(finalElapsed / 1000) // Return seconds
  }
  
  const getTimer = (ticketId) => {
    return activeTimers.value.get(ticketId)
  }
  
  const isTimerRunning = (ticketId) => {
    const timer = activeTimers.value.get(ticketId)
    return timer && timer.isRunning
  }
  
  const getElapsedTime = (ticketId) => {
    const timer = activeTimers.value.get(ticketId)
    if (!timer) return 0
    
    return timer.isRunning ? Date.now() - timer.startTime : timer.elapsed
  }
  
  const formatElapsedTime = (ticketId) => {
    const elapsed = getElapsedTime(ticketId)
    const seconds = Math.floor(elapsed / 1000)
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Initialize timers from localStorage on first use
  const initializeTimers = () => {
    loadTimersFromStorage()
  }
  
  // Cleanup function
  const cleanup = () => {
    intervals.value.forEach(interval => clearInterval(interval))
    intervals.value.clear()
    activeTimers.value.clear()
    // Clear localStorage when cleaning up
    localStorage.removeItem(STORAGE_KEY)
  }
  
  // Auto cleanup on unmount
  onUnmounted(cleanup)
  
  // Load timers on first initialization
  if (!isInitialized) {
    initializeTimers()
    isInitialized = true
  }
  
  return {
    startTimer,
    stopTimer,
    getTimer,
    isTimerRunning,
    getElapsedTime,
    formatElapsedTime,
    activeTimers: computed(() => activeTimers.value),
    initializeTimers,
    cleanup
  }
}
