<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main style="overflow-x: auto; overflow-y: hidden">
      <router-view style="min-width: 900px" v-if="selectedBuilding" />
      <FAB
        v-show="!isModalCheckpointDetailOpen || isCleaningRequestFormOpen"
        v-if="selectedBuilding && !selectedBuilding?.onlyExternalView"
      />
      <v-snackbar v-model="snackbar.value" :timeout="3000" :color="snackbar.color">{{
        snackbar.text
      }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { isModalCheckpointDetailOpen, isCleaningRequestFormOpen, snackbar, selectedBuilding } =
  storeToRefs(useAppStore())
</script>
