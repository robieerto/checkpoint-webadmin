<template>
  <div class="mt-2 text-right">
    <ChipState
      v-for="state in states"
      class="mr-1 mb-1"
      :isCheckpoint="true"
      :serviceType="state.serviceType"
      :entityState="state.entityState"
    ></ChipState>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  checkpointStates?: any
}>()

const appStore = useAppStore()
const { userServicesForSelectedBuilding } = storeToRefs(appStore)

const states = ref<any[]>([])
const isAdmin = computed(() => userServicesForSelectedBuilding.value.length > 1)

watch(
  () => props.checkpointStates,
  () => {
    const newStates = []
    if (isAdmin.value) {
      for (const userService of userServicesForSelectedBuilding.value) {
        const checkpointServiceState = props.checkpointStates[userService]
        if (checkpointServiceState) {
          newStates.push({
            serviceType: userService,
            entityState: checkpointServiceState,
          })
        }
      }
    } else {
      const userService = userServicesForSelectedBuilding.value[0]
      const checkpointServiceState = props.checkpointStates?.[userService]
      if (checkpointServiceState && checkpointServiceState !== 'done') {
        newStates.push({
          serviceType: userService,
          entityState: checkpointServiceState,
        })
      } else {
        const isAnyUndoneState = props.checkpointStates?.find?.((state: string) => state !== 'done')
        if (isAnyUndoneState) {
          newStates.push({
            serviceType: userService,
            entityState: 'event',
          })
        } else {
          newStates.push({
            serviceType: userService,
            entityState: 'done',
          })
        }
      }
    }
    states.value = newStates
  },
  { immediate: true }
)
</script>
