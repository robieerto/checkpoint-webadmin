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
      // if the document doesn't exist, return null
      if (!data) return null
      // add anything custom to the returned object
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
      // Set selected building
      selectedBuilding.value = buildings.value?.length && buildings.value?.[0]
    }
  }
})

watch(selectedBuilding, async (currentBuilding) => {
  appStore.isLoadingBuildingActions = true

  buildingActions.value = []
  occurrences.value = []

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

watch(
  () => actions.value,
  (actions) => {
    if (!actions || !actions.length) return
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

// watch(checkpoints, async (buildingCheckpoints) => {
//   if (buildingCheckpoints && buildingCheckpoints.length) {
//     appStore.isLoadingBuildingActions = true

//     const buildingHistory = [] as any

//     const buildingRef = doc(db, buildingPath.value)
//     const actions = query(
//       collectionGroup(db, 'actions'),
//       orderBy(documentId()),
//       startAt(buildingPath.value),
//       endAt(buildingPath.value + '\uf8ff')
//     )

//     // Get data
//     const querySnapshot = await getDocs(actions)

//     const promises = querySnapshot.docs.map(async (actionDoc) => {
//       const action = { ...actionDoc.data(), id: actionDoc.id }

//       // get reference to checkpoint
//       const checkpointDoc = actionDoc?.ref.parent.parent?.parent.parent
//       const checkpointDocId = checkpointDoc?.id
//       const checkpoint = buildingCheckpoints.find(
//         (checkpoint: any) => checkpoint.id === checkpointDocId
//       )

//       // get reference to occurrence
//       const parentDoc = actionDoc.ref.parent.parent
//       const parentDocId = parentDoc?.id
//       var occurrence = occurrences.value.find((occurrence: any) => occurrence.id === parentDocId)
//       if (!occurrence) {
//         // Get occurrence
//         const occurrenceRef = doc(
//           db,
//           `${buildingPath.value}/checkpoints/${checkpointDocId}/occurrences/${parentDocId}`
//         )
//         const occurrenceDocSnap = await getDoc(occurrenceRef)
//         if (occurrenceDocSnap.exists()) {
//           occurrence = { ...occurrenceDocSnap.data(), id: occurrenceDocSnap.id }
//           occurrences.value.push(occurrence)
//         }
//       }

//       buildingHistory.push({ action, occurrence, checkpoint })
//     })

//     await Promise.all(promises)
//     await sortAndAssignActions(buildingHistory)

//     // const buildingHistory = [] as any
//     // appStore.isLoadingBuildingActions = true

//     // const occurrencePromises = buildingCheckpoints.map(async (checkpoint: any) => {
//     //   const occurrencePath = `${checkpointsPath.value}/${checkpoint.id}/occurrences`
//     //   const checkpointOccurrences = useCollection(collection(db, occurrencePath), { once: true })

//     //   // Get checkpoint occurrences
//     //   await checkpointOccurrences.promise.value

//     //   const actionPromises = checkpointOccurrences.value.map(async (occurrence: any) => {
//     //     const actionsPath = `${occurrencePath}/${occurrence.id}/actions`
//     //     const actions = useCollection(collection(db, actionsPath), { once: true })

//     //     // Get actions for each occurrence
//     //     await actions.promise.value

//     //     // Save actions
//     //     actions.value.forEach((action: any) => {
//     //       buildingHistory.push({ action, occurrence, checkpoint })
//     //     })
//     //   })

//     //   await Promise.all(actionPromises)
//     // })

//     // await Promise.all(occurrencePromises)

//     // sortAndAssignActions(buildingHistory)
//   }
// })
</script>
