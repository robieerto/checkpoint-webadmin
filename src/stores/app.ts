export const useAppStore = defineStore('app', {
  state: () => ({
    // app
    drawer: true,
    snackbar: { value: false, text: '', color: '' },
    currentPage: '',
    isLoadingBuildingActions: true,
    isModalCheckpointDetailOpen: false,
    isModalActionDetailOpen: false,
    searchText: '',
    selectedId: null as any,

    // forms
    forms: {
      isCleaningRequestOpen: false,
      isErrorReportOpen: false,
      isQuickActionOpen: false,
      isReservationOpen: false,
    },

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
    occurrences: null as any,
    employees: null as any,
    filteredEmployees: null as any,
    buildingActions: null as any,
    extUserActions: null as any,
  }),
})
