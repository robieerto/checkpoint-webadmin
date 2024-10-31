<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="lg" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <img src="@/assets/occurrence-logo.png" style="width: 38px" />
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1 pl-1 pr-0">
              <v-list-item-title class="list text-h6">{{ occurrence.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                formatTimestamp(occurrence.dateTime.seconds)
              }}</v-list-item-subtitle>
              <div class="mt-2 text-right">
                <v-chip
                  v-if="occurrence.assignedTo"
                  variant="outlined"
                  rounded="xl"
                  class="mr-1"
                  prepend-icon="mdi-account"
                >
                  {{ occurrence.assignedTo?.username }}
                </v-chip>
                <ChipState :serviceType="serviceType" :entityState="occurrence.state"></ChipState>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'

const { userServices } = storeToRefs(useAppStore())

const props = defineProps<{
  occurrence?: any
  secondaryColor?: boolean
}>()

const service = ref(props.occurrence.service)
const serviceType = ref(props.occurrence.service?.type)

if (typeof service.value === 'string' || service.value instanceof String) {
  const serviceId = service.value.split('/')[1]
  service.value = userServices.value.find((s: any) => s.id === serviceId)
  serviceType.value = service.value?.type
}

// const emit = defineEmits<{
//   select: [id: string]
// }>()

// const selectItem = () => {
//   emit('select', props.id)
// }
</script>

<style scoped>
:deep(.v-list-item__overlay) {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
