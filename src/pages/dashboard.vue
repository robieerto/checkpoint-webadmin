<template>
  <div v-if="selectedBuilding">
    <v-container v-if="!selectedBuilding.onlyExternalView" fluid>
      <!-- style="min-width: 900px; white-space: nowrap; overflow-x: auto; overflow-y: hidden" -->
      <v-row>
        <v-col v-if="!searchText" cols="auto">
          <ActionsPreview />
        </v-col>
        <v-col cols="auto">
          <CheckpointsBasicPreview />
        </v-col>
        <!-- <v-col cols="4">
        <EmployeesBasicPreview />
      </v-col> -->
      </v-row>
    </v-container>
    <ExtUserActionsPreview v-else />
  </div>
</template>

<script lang="ts" setup>
definePage({
  meta: {
    icon: 'mdi-monitor-dashboard',
    title: 'dashboard',
    drawerIndex: 1,
  },
})

const appStore = useAppStore()
const { searchText, selectedBuilding } = storeToRefs(appStore)
</script>
