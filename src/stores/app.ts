export const useAppStore = defineStore('app', {
  state: () => ({
    // app
    drawer: true,
    isLoadingBuildingActions: true,
    isModalDetailOpen: false,
    isCleaningRequestFormOpen: false,
    isErrorReportFormOpen: false,
    isQuickActionFormOpen: false,

    // data
    user: null as any,
    userServices: null as any,
    buildings: null as any,
    selectedBuilding: null as any,
    selectedBuildingServices: null as any,
    userServicesForSelectedBuilding: null as any,
    checkpoints: null as any,
    sortedCheckpoints: null as any,
    selectedCheckpoint: null as any,
    employees: null as any,
    buildingActions: null as any,
    extUserActions: null as any,
  }),
})
