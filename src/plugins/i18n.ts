import { createI18n } from 'vue-i18n'

import cz from '@/locales/cz.json'
import sk from '@/locales/sk.json'

export default createI18n({
  locale: 'cz',
  fallbackLocale: 'sk',
  messages: {
    cz,
    sk,
  },
})
