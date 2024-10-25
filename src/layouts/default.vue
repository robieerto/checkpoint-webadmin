<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main style="overflow-x: auto; overflow-y: hidden">
      <router-view style="min-width: 900px" />
      <FAB v-if="!isModalCheckpointDetailOpen || isCleaningRequestFormOpen" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { isModalCheckpointDetailOpen, isCleaningRequestFormOpen } = storeToRefs(useAppStore())
</script>
