/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify, ThemeDefinition } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

const checkpointTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#0d3b66',
    secondary: '#fff8ef',
    background: '#efe2bb',
    text: '#000000',
    button: '#fce186',
    green: '#45664d',
    red: '#ba1a1a',
    orange: '#ee964a',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'checkpointTheme',
    themes: {
      checkpointTheme,
    },
  },
  display: {
    mobileBreakpoint: 'md',
  },
})
