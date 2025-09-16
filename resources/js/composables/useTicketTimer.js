import { ref, computed, onUnmounted } from 'vue'

// Global timer state
const activeTimers = ref(new Map())
const intervals = ref(new Map())

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
    
    // Create interval for this timer
    const interval = setInterval(() => {
      const timer = activeTimers.value.get(ticketId)
      if (timer && timer.isRunning) {
        timer.elapsed = Date.now() - timer.startTime
        // Trigger reactivity
        activeTimers.value = new Map(activeTimers.value)
      }
    }, 1000)
    
    intervals.value.set(ticketId, interval)
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
  
  // Cleanup function
  const cleanup = () => {
    intervals.value.forEach(interval => clearInterval(interval))
    intervals.value.clear()
    activeTimers.value.clear()
  }
  
  // Auto cleanup on unmount
  onUnmounted(cleanup)
  
  return {
    startTimer,
    stopTimer,
    getTimer,
    isTimerRunning,
    getElapsedTime,
    formatElapsedTime,
    activeTimers: computed(() => activeTimers.value),
    cleanup
  }
}
