<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="6">
        <v-row class="ml-0">
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-img src="@/assets/checkpoint-logo.png" width="45"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1">
                <v-list-item-title class="text-h6">{{
                  historyAction?.checkpoint?.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  historyAction?.checkpoint?.floor?.name
                }}</v-list-item-subtitle>
                <div v-if="historyAction?.checkpoint.states" class="text-right">
                  <CheckpointChipStates
                    :checkpointStates="historyAction?.checkpoint.states"
                  ></CheckpointChipStates>
                </div>
                <div v-else class="text-right">
                  <ChipState
                    :serviceType="'cleaning'"
                    :entityState="historyAction?.checkpoint.state"
                  ></ChipState>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <OccurrenceDetail :occurrenceRef="occurrenceRef" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <ActionDetail :actionRef="actionRef" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { _RefFirestore, useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from '@/firebase'

const props = defineProps<{
  historyAction: any
}>()

const appStore = useAppStore()

const occurrenceRef = ref({ actions: [], occurrence: props.historyAction?.occurrence } as any)
const actionRef = ref({
  action: props.historyAction?.action,
  occurrence: props.historyAction?.occurrence,
} as any)

const checkpointPath = computed(
  () =>
    `Buildings/${appStore.selectedBuilding.id}/checkpoints/${props.historyAction?.checkpoint?.id}`
)
const occurrencesPath = computed(() => `${checkpointPath.value}/occurrences`)

const occurrenceActions = useCollection(
  collection(db, `${occurrencesPath.value}/${props.historyAction?.occurrence?.id}/actions`)
)

watch(
  () => occurrenceActions.value,
  () => {
    if (occurrenceActions.value) {
      occurrenceRef.value = {
        actions: occurrenceActions.value,
        occurrence: props.historyAction?.occurrence,
      }
    }
  }
)

// on mount
onMounted(() => {
  appStore.selectedCheckpoint = props.historyAction?.checkpoint
})

// on unmount
onUnmounted(() => {
  appStore.selectedCheckpoint = null
})
</script>

<style scoped></style>
