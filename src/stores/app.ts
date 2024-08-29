import { _RefFirestore } from 'vuefire'
import { DocumentData } from 'firebase/firestore'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    user: null as any,
    services: null as any,
    buildings: null as any,
    selectedBuilding: null as any,
    checkpoints: null as any,
  }),
})
