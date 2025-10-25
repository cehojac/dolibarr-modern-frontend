import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'
import ca from './locales/ca.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'es',
  fallbackLocale: 'es',
  globalInjection: true,
  warnHtmlMessage: false,
  escapeParameter: false,
  messages: {
    es,
    en,
    ca
  }
})

export default i18n
