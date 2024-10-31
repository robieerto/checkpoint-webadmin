<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useCurrentUser, useCollection } from 'vuefire'
import { firestoreDefaultConverter } from 'vuefire'
import {
  collection,
  collectionGroup,
  orderBy,
  startAt,
  endAt,
  query,
  documentId,
} from 'firebase/firestore'
import { db } from '@/firebase'
import {
  getSelectedBuildingEmployees,
  getSelectedBuildingServices,
  getUser,
  getUserBuildings,
  getUserServices,
} from '@/api/get'

const user = useCurrentUser()
const appStore = useAppStore()
const {
  buildings,
  userServices,
  selectedBuilding,
  userServicesForSelectedBuilding,
  checkpoints,
  sortedCheckpoints,
  sortedAndFilteredCheckpoints,
  buildingActions,
  occurrences,
  searchText,
} = storeToRefs(appStore)

const buildingPath = computed(() => `Buildings/${selectedBuilding.value?.id}`)
const checkpointsPath = computed(() => `${buildingPath.value}/checkpoints`)

checkpoints.value = useCollection(() => collection(db, checkpointsPath.value))

const actions = useCollection(() =>
  query(
    collectionGroup(db, 'actions'),
    orderBy(documentId()),
    startAt(buildingPath.value),
    endAt(buildingPath.value + '\uf8ff')
  ).withConverter({
    toFirestore: firestoreDefaultConverter.toFirestore,
    fromFirestore: (snapshot, options) => {
      const data = firestoreDefaultConverter.fromFirestore(snapshot, options)
      if (!data) return null
      data.occurrenceId = snapshot.ref?.parent.parent?.id
      data.checkpointId = snapshot.ref?.parent.parent?.parent.parent?.id
      return data
    },
  })
)

watch(
  () => checkpoints.value,
  async (checkpoints) => {
    if (!checkpoints || !checkpoints.length) return
    const sortedNyName = checkpoints.sort((a: any, b: any) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    )
    const taskCheckpoints = sortedNyName
      .filter((checkpoint: any) =>
        Object.values(checkpoint.states).some((state: any) => state !== 'done')
      )
      .sort((a: any, b: any) => {
        const aToCheck = Object.values(a.states).some((state) => state === 'toCheck')
        const bToCheck = Object.values(b.states).some((state) => state === 'toCheck')
        if (aToCheck && !bToCheck) return -1
        else if (!aToCheck && bToCheck) return 1
        else return 0
      })
    const okCheckpoints = sortedNyName.filter((checkpoint: any) =>
      Object.values(checkpoint.states).every((state: any) => state === 'done')
    )
    // Split into groups according to name property of each checkpoint
    const groupedOkCheckpoints = okCheckpoints.reduce((acc: any, checkpoint: any) => {
      const key = checkpoint.floor?.number
      if (!acc[key]) acc[key] = { name: checkpoint.floor?.name, checkpoints: [] }
      acc[key].checkpoints.push(checkpoint)
      return acc
    }, {})
    sortedCheckpoints.value = { tasks: taskCheckpoints, okByFloors: groupedOkCheckpoints }
    filterCheckpoints()
  }
)

watch(user, async (currentUser) => {
  if (currentUser) {
    // Get logged in user
    if (await getUser(currentUser.uid)) {
      // Get user's services
      await getUserServices()
      // Get user's buildings
      await getUserBuildings()
      // Get selected building from local storage, if not set, select first building
      const selectedBuildingId = localStorage.getItem('selectedBuildingId')
      const selectedBuildingStorage = buildings.value?.find(
        (building: any) => building.id === selectedBuildingId
      )
      selectedBuilding.value =
        selectedBuildingStorage || (buildings.value?.length && buildings.value?.[0])
    }
  }
})

watch(selectedBuilding, async (currentBuilding) => {
  appStore.isLoadingBuildingActions = true

  buildingActions.value = []
  occurrences.value = []

  if (currentBuilding) {
    // Save selected building to local storage
    localStorage.setItem('selectedBuildingId', currentBuilding.id)

    // Set user service types for selected building
    userServicesForSelectedBuilding.value = userServices.value
      .filter((service: any) => service.building.id === currentBuilding.id)
      .map((service: any) => service.type)

    // Get services for selected building
    await getSelectedBuildingServices()

    // Get employees for selected building
    await getSelectedBuildingEmployees()
  }
})

watch(
  () => actions.value,
  (actions) => {
    if (!actions) return
    sortAndAssignActions(actions)
  },
  { deep: true }
)

const sortAndAssignActions = async (buildingHistory: any) => {
  buildingHistory.sort((a: any, b: any) => b.dateTime.seconds - a.dateTime.seconds)
  buildingActions.value = buildingHistory
  appStore.isLoadingBuildingActions = false
}

watch(searchText, () => {
  filterCheckpoints()
})

function filterCheckpoints() {
  if (searchText.value === '') {
    sortedAndFilteredCheckpoints.value = sortedCheckpoints.value
    return
  }

  const filteredTasks = sortedCheckpoints.value.tasks.filter((checkpoint: any) =>
    checkpoint.name.toLowerCase().includes(searchText.value.toLowerCase())
  )

  const filteredOkByFloors = Object.keys(sortedCheckpoints.value.okByFloors).reduce(
    (acc: any, floorNumber: any) => {
      const checkpointFloor = sortedCheckpoints.value.okByFloors[floorNumber]
      const filteredCheckpoints = checkpointFloor.checkpoints.filter((checkpoint: any) =>
        checkpoint.name.toLowerCase().includes(searchText.value.toLowerCase())
      )
      if (filteredCheckpoints.length) {
        acc[floorNumber] = {
          name: checkpointFloor.name,
          checkpoints: filteredCheckpoints,
        }
      }
      return acc
    },
    {}
  )
  sortedAndFilteredCheckpoints.value = { tasks: filteredTasks, okByFloors: filteredOkByFloors }
}
</script>
