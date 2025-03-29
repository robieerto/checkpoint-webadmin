<template>
  <div v-if="!isFormOpen" class="speed-dial">
    <v-speed-dial
      location="top"
      transition="fade-transition"
      :offset="40"
      location-strategy="connected"
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-tooltip class="v-button-fab" left :text="$t('newAction')">
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <v-fab
                v-bind="activatorProps"
                size="large"
                icon="mdi-square-rounded-badge-outline"
              ></v-fab>
            </div>
          </template>
        </v-tooltip>
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

      <v-tooltip v-if="selectedBuilding.reservations" left :text="$t('reservation')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            key="reservation"
            size="default"
            class="v-button-fab"
            icon="mdi-calendar-clock"
            @click="forms.isReservationOpen = true"
          >
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="!selectedBuilding.onlyExternalView" left :text="$t('cleaningRequest')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            key="cleaning"
            class="v-button-fab"
            @click="forms.isCleaningRequestOpen = true"
          >
            <img src="@/assets/concierge-icon.png" width="25" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-speed-dial>
  </div>
  <CleaningRequestForm
    v-if="forms.isCleaningRequestOpen"
    @close="forms.isCleaningRequestOpen = false"
  />
  <ErrorReportForm v-if="forms.isErrorReportOpen" @close="forms.isErrorReportOpen = false" />
  <QuickActionForm v-if="forms.isQuickActionOpen" @close="forms.isQuickActionOpen = false" />
  <ReservationForm v-if="forms.isReservationOpen" @close="forms.isReservationOpen = false" />
</template>

<script setup lang="ts">
const { forms, selectedBuilding } = storeToRefs(useAppStore())

const isFormOpen = computed(() => Object.values(forms.value).some((form) => form === true))
</script>
