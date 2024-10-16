<template>
  <v-chip
    v-if="props.serviceType === 'cleaning' && props.entityState === 'todo'"
    class="pl-1"
    variant="flat"
    rounded="lg"
    :color="state.color"
  >
    <span class="material-symbols-outlined mx-1">concierge</span>
    {{ state.label }}
  </v-chip>
  <v-chip
    v-else-if="
      props.serviceType === 'cleaning' &&
      (props.entityState === 'workInProgress' || props.entityState === 'toCheck')
    "
    class="pl-1"
    variant="flat"
    rounded="lg"
    :color="state.color"
  >
    <span class="material-symbols-outlined mx-1">cleaning_services</span>
    {{ state.label }}
  </v-chip>
  <v-chip v-else variant="flat" rounded="lg" :color="state.color" :prepend-icon="state.icon">{{
    state.label
  }}</v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
  isCheckpoint?: boolean
  serviceType?: string
  entityState?: string
}>()

const state = reactive({
  label: '',
  color: '',
  icon: '',
})

const stateToLabel = () => {
  if (props.serviceType === 'cleaning') {
    switch (props.entityState) {
      case 'done':
        if (props.isCheckpoint) {
          return 'V poriadku'
        } else {
          return 'Upratané'
        }
      case 'todo':
        return 'Na upratanie'
      case 'toCheck':
        return 'Na kontrolu'
      case 'workInProgress':
        return 'Upratuje sa'
      case 'checkInProgress':
        return 'Kontroluje sa'
      case 'event':
        return 'Udalosť'
      default:
        return 'Nedefinovaný'
    }
  } else {
    switch (props.entityState) {
      case 'done':
        if (props.isCheckpoint) {
          return 'V poriadku'
        } else {
          return 'Opravené'
        }
      case 'todo':
        return 'Chyba'
      case 'toCheck':
        return 'Na kontrolu'
      case 'workInProgress':
        return 'Opravuje sa'
      case 'checkInProgress':
        return 'Kontroluje sa'
      case 'event':
        return 'Udalosť'
      default:
        return 'Nedefinovaný'
    }
  }
}

watch(
  () => props.entityState,
  () => {
    state.label = stateToLabel()

    switch (props.entityState) {
      case 'done':
        state.color = 'green'
        state.icon = 'mdi-check'
        break

      case 'todo': {
        state.color = 'red'
        if (props.serviceType === 'cleaning') {
          state.icon = 'mdi-room-service-outline'
        } else {
          state.icon = 'mdi-alert-decagram-outline'
        }
        break
      }
      case 'toCheck': {
        state.color = 'orange'
        if (props.serviceType === 'cleaning') {
          state.icon = 'mdi-broom'
        } else {
          state.icon = 'mdi-wrench'
        }
        break
      }
      case 'workInProgress': {
        state.color = 'orange'
        if (props.serviceType === 'cleaning') {
          state.icon = 'mdi-broom'
        } else {
          state.icon = 'mdi-wrench'
        }
        break
      }
      case 'event': {
        state.color = 'orange'
        state.icon = 'mdi-clipboard-alert-outline'
        break
      }
      case 'checkInProgress': {
        state.color = 'orange'
        state.icon = 'mdi-progress-clock'
        break
      }
      default:
        break
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.bg-orange {
  color: white !important;
}
</style>
