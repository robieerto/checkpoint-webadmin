<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useCurrentUser } from 'vuefire'
import { getUser, getUserBuildings, getUserServices } from '@/api/user'
import { attachCheckpointsListener } from './api/collections'

const user = useCurrentUser()
const appStore = useAppStore()
const { buildings, selectedBuilding } = storeToRefs(appStore)

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
  } else {
    console.log('User logged out')
  }
})

watch(selectedBuilding, (building) => {
  if (building) {
    console.log('Selected building:', building)
    attachCheckpointsListener(building.id)
  }
})
</script>
