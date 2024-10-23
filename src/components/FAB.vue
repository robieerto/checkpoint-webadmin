<template>
  <div v-if="!isFormOpen" class="speed-dial">
    <v-speed-dial
      location="top"
      transition="fade-transition"
      :offset="40"
      location-strategy="connected"
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

      <v-tooltip class="v-button-fab" left text="Žiadosť o upratanie">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            key="cleaning"
            class="v-button-fab"
            @click="isCleaningRequestFormOpen = true"
          >
            <v-img src="@/assets/concierge-icon.png" width="25"></v-img>
          </v-btn>
        </template>
      </v-tooltip>
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
const {
  isCleaningRequestFormOpen,
  isErrorReportFormOpen,
  isQuickActionFormOpen,
  isModalDetailOpen,
} = storeToRefs(useAppStore())

const isFormOpen = computed(
  () =>
    isCleaningRequestFormOpen.value || isErrorReportFormOpen.value || isQuickActionFormOpen.value
)

watchEffect(() => {
  if (isFormOpen.value) {
    isModalDetailOpen.value = false
  }
})
</script>
