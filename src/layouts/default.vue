<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main style="overflow-x: auto; overflow-y: hidden">
      <router-view style="min-width: 900px" v-if="selectedBuilding" />
      <FAB v-show="!isModalCheckpointDetailOpen || isFormOpen" v-if="showFAB" />
      <v-snackbar v-model="snackbar.value" :timeout="3000" :color="snackbar.color">{{
        snackbar.text
      }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const { isModalCheckpointDetailOpen, forms, snackbar, selectedBuilding } =
  storeToRefs(useAppStore())

const showFAB = computed(
  () =>
    selectedBuilding.value &&
    (!selectedBuilding.value.onlyExternalView || selectedBuilding.value.reservations)
)
const isFormOpen = computed(() => Object.values(forms.value).some((form) => form === true))
</script>
