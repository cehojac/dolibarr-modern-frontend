import { ref, onMounted } from 'vue'

const isDark = ref(true)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      // Set cookie for theme persistence (expires in 1 year)
      document.cookie = `theme=dark; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      // Set cookie for theme persistence (expires in 1 year)
      document.cookie = `theme=light; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
    }
  }

  const getCookieTheme = () => {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'theme') {
        return value
      }
    }
    return null
  }

  const initTheme = () => {
    // Priority: Cookie -> LocalStorage -> System Preference
    const cookieTheme = getCookieTheme()
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let theme = 'light'
    if (cookieTheme) {
      theme = cookieTheme
    } else if (savedTheme) {
      theme = savedTheme
    } else if (prefersDark) {
      theme = 'dark'
    }
    
    isDark.value = theme === 'dark'
    updateTheme()
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
    getCookieTheme
  }
}
