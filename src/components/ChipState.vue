<template>
  <div class="text-center">
    <!-- <v-chip class="mx-2" color="#45664d" v-if="state === 'done'">V poriadku</v-chip>
    <v-chip class="mx-2" color="#ba1a1a" v-else-if="state === 'todo'">Na upratanie</v-chip>
    <v-chip class="mx-2" color="warning" v-else-if="state === 'maintenance'">Údržba</v-chip>
    <v-chip class="mx-2" color="success" v-else-if="state === 'done'">Dokončený</v-chip>
    <v-chip class="mx-2" color="grey" v-else>Neznámy</v-chip> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isCheckPoint?: boolean
  isOccurrence?: boolean
  userServiceType?: string
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
      case 'todo':
        return 'Na upratanie'
      case 'toCheck':
        return 'Na kontrolu'
      case 'done':
        return 'V poriadku'
      case 'workInProgress':
        return 'Upratuje sa'
      case 'checkInProgress':
        return 'Kontroluje sa'
      case 'occurrence':
        return 'Udalosť'
      default:
        return 'Nedefinovaný'
    }
  } else {
    switch (props.entityState) {
      case 'todo':
        return 'Chyba'
      case 'toCheck':
        return 'Na kontrolu'
      case 'done':
        return 'Opravené'
      case 'workInProgress':
        return 'Opravuje sa'
      case 'checkInProgress':
        return 'Kontroluje sa'
      case 'occurrence':
        return 'Udalosť'
      default:
        return 'Nedefinovaný'
    }
  }
}

// watch(
//   () => props.entityState,
//   () => {
//     state.label = stateToLabel()
//     if (props.entityState === 'todo') {
//       state.color = '#ba1a1a'
//       state.icon = 'mdi-alert'
//     }
//     switch (props.entityState) {
//       case 'done':
//         state.name = 'V poriadku'
//         state.color = '#45664d'
//         state.icon = 'mdi-check'
//         break
//       case 'todo':
//         state.name = 'Na upratanie'
//         state.color = '#ba1a1a'
//         state.icon = 'mdi-alert'
//         break
//       case 'maintenance':
//         state.name = 'Údržba'
//         state.color = 'warning'
//         state.icon = 'mdi-wrench'
//         break
//       case 'done':
//         state.name = 'Dokončený'
//         state.color = 'success'
//         state.icon = 'mdi-check'
//         break
//       default:
//         state.name = 'Neznámy'
//         state.color = 'grey'
//         state.icon = 'mdi-help'
//         break
//     }
//   }
// )
</script>
