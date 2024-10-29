export const useAppStore = defineStore('app', {
  state: () => ({
    // app
    drawer: true,
    snackbar: { value: false, text: '', color: '' },
    isLoadingBuildingActions: true,
    isModalCheckpointDetailOpen: false,
    isModalActionDetailOpen: false,
    isCleaningRequestFormOpen: false,
    isErrorReportFormOpen: false,
    isQuickActionFormOpen: false,
    searchText: '',

    // data
    user: null as any,
    userServices: null as any,
    buildings: null as any,
    selectedBuilding: null as any,
    selectedBuildingServices: null as any,
    userServicesForSelectedBuilding: null as any,
    checkpoints: null as any,
    sortedCheckpoints: null as any,
    sortedAndFilteredCheckpoints: null as any,
    selectedCheckpoint: null as any,
    employees: null as any,
    buildingActions: null as any,
    extUserActions: null as any,
  }),
})
