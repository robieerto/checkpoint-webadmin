/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import i18n from './i18n'
import pinia from '../stores'
import router from '../router'
import { VueFire, VueFireAuth } from 'vuefire'

import { firebaseApp } from '@/firebase'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app
    .use(VueFire, {
      // imported above but could also just be created here
      firebaseApp,
      modules: [
        // we will see other modules later on
        VueFireAuth(),
      ],
    })
    .use(i18n)
    .use(pinia)
    .use(vuetify)
    .use(router)
}
