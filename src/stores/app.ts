export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    user: null as any,
    userServices: null as any,
    buildings: null as any,
    selectedBuilding: null as any,
    selectedBuildingServices: null as any,
    userServicesForSelectedBuilding: null as any,
    checkpoints: null as any,
    employees: null as any,
  }),
})
