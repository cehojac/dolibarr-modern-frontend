import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import i18n from './i18n'
import App from './App.vue'

// Silenciar console.log/info/warn/debug/trace excepto en debug local
const isDebug = import.meta.env.APP_DEBUG === 'true' && import.meta.env.APP_ENV === 'local'
if (!isDebug) {
  const noop = () => {}
  console.log = noop
  console.info = noop
  console.warn = noop
  console.debug = noop
  console.trace = noop
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')