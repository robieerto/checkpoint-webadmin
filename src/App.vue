<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useCurrentUser, useCollection } from 'vuefire'
import { collection, query, orderBy } from 'firebase/firestore'
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
  buildingActions,
  extUserActions,
} = storeToRefs(appStore)

const checkpointsPath = computed(() => `Buildings/${selectedBuilding.value?.id}/checkpoints`)
const extUserActionsPath = computed(
  () => `Buildings/${selectedBuilding.value?.id}/externalUserActions`
)

checkpoints.value = useCollection(() => collection(db, checkpointsPath.value))
extUserActions.value = useCollection(() =>
  query(collection(db, extUserActionsPath.value), orderBy('dateTime', 'desc'))
)

watch(
  () => checkpoints.value,
  async (checkpoints) => {
    if (!checkpoints || !checkpoints.length) return
    const sortedNyName = checkpoints.sort((a: any, b: any) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    )
    const taskCheckpoints = sortedNyName
      .filter((checkpoint: any) => checkpoint.state === 'task')
      .sort((a: any, b: any) => {
        const aToCheck = Object.values(a.states).some((state) => state === 'toCheck')
        const bToCheck = Object.values(b.states).some((state) => state === 'toCheck')
        if (aToCheck && !bToCheck) return -1
        else if (!aToCheck && bToCheck) return 1
        else return 0
      })
    const okCheckpoints = sortedNyName.filter((checkpoint: any) => checkpoint.state === 'ok')
    // Split into groups according to name property of each checkpoint
    const groupedOkCheckpoints = okCheckpoints.reduce((acc: any, checkpoint: any) => {
      const key = checkpoint.floor?.name
      if (!acc[key]) acc[key] = []
      acc[key].push(checkpoint)
      return acc
    }, {})
    sortedCheckpoints.value = { tasks: taskCheckpoints, okByFloors: groupedOkCheckpoints }
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
      // Set selected building
      selectedBuilding.value = buildings.value?.length && buildings.value?.[0]
    }
  }
})

watch(selectedBuilding, async (currentBuilding) => {
  buildingActions.value = null

  if (currentBuilding) {
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

watch(checkpoints, async (buildingCheckpoints) => {
  if (buildingCheckpoints && buildingCheckpoints.length) {
    const buildingHistory = [] as any
    appStore.isLoadingBuildingActions = true

    const occurrencePromises = buildingCheckpoints.map(async (checkpoint: any) => {
      const occurrencePath = `${checkpointsPath.value}/${checkpoint.id}/occurrences`
      const checkpointOccurrences = useCollection(collection(db, occurrencePath), { once: true })

      // Get checkpoint occurrences
      await checkpointOccurrences.promise.value

      const actionPromises = checkpointOccurrences.value.map(async (occurrence: any) => {
        const actionsPath = `${occurrencePath}/${occurrence.id}/actions`
        const actions = useCollection(collection(db, actionsPath), { once: true })

        // Get actions for each occurrence
        await actions.promise.value

        // Save actions
        actions.value.forEach((action: any) => {
          buildingHistory.push({ action, occurrence, checkpoint })
        })
      })

      await Promise.all(actionPromises)
    })

    await Promise.all(occurrencePromises)

    sortAndAssignActions(buildingHistory)
  }
})

const sortAndAssignActions = (buildingHistory: any) => {
  buildingHistory.sort((a: any, b: any) => b.action.dateTime.seconds - a.action.dateTime.seconds)
  buildingActions.value = buildingHistory
  appStore.isLoadingBuildingActions = false
  // console.log('buildingActions', buildingActions.value)
}
</script>
