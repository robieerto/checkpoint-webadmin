<template>
  <div v-if="!isFormOpen" class="speed-dial">
    <v-speed-dial
      location="top"
      transition="fade-transition"
      :offset="40"
      location-strategy="static"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" size="large" icon="mdi-square-rounded-badge-outline"></v-fab>
      </template>

      <!-- <v-btn
        key="quickAction"
        size="default"
        icon="mdi-plus"
        @click="isQuickActionFormOpen = true"
      ></v-btn>
      <v-btn
        key="error"
        size="default"
        icon="mdi-alert-decagram-outline"
        @click="isErrorReportFormOpen = true"
      ></v-btn> -->
      <v-btn
        key="cleaning"
        size="default"
        icon="mdi-room-service-outline"
        @click="isCleaningRequestFormOpen = true"
      ></v-btn>
    </v-speed-dial>
  </div>
  <CleaningRequestForm
    v-if="isCleaningRequestFormOpen"
    @close="isCleaningRequestFormOpen = false"
  />
  <ErrorReportForm v-if="isErrorReportFormOpen" @close="isErrorReportFormOpen = false" />
  <QuickActionForm v-if="isQuickActionFormOpen" @close="isQuickActionFormOpen = false" />
</template>

<script setup lang="ts">
const isCleaningRequestFormOpen = ref(false)
const isErrorReportFormOpen = ref(false)
const isQuickActionFormOpen = ref(false)

const isFormOpen = computed(
  () =>
    isCleaningRequestFormOpen.value || isErrorReportFormOpen.value || isQuickActionFormOpen.value
)
</script>
