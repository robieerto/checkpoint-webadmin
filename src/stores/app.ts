// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loggedInUser: null as any,
    drawer: true,
  }),
})
