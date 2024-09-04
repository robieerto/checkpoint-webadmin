<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useCurrentUser, useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from '@/firebase'
import { getUser, getUserBuildings, getUserServices } from '@/api/user'

const user = useCurrentUser()
const appStore = useAppStore()
const {
  buildings,
  userServices,
  selectedBuilding,
  userServiceTypesForSelectedBuilding,
  checkpoints,
} = storeToRefs(appStore)

const checkpointsPath = computed(() => `Buildings/${selectedBuilding.value?.id}/checkpoints`)

checkpoints.value = useCollection(() => collection(db, checkpointsPath.value))

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
      // Set user service types for selected building
      userServiceTypesForSelectedBuilding.value = userServices.value
        .filter((service: any) => service.building.id === selectedBuilding.value.id)
        .map((service: any) => service.type)
    }
  }
})
</script>
