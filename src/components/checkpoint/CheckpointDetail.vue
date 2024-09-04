<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
        <v-img src="@/assets/checkpoint-icon.png" width="45"></v-img>
      </v-col>
      <v-col style="max-width: 246px">
        <v-row>
          <v-col class="py-1">
            <v-list-item-title class="text-h6">{{ checkpoint?.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ checkpoint?.floor?.name }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-right"
              >Stav: {{ checkpoint?.state }}</v-list-item-subtitle
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-tabs v-model="tab">
          <v-tab value="occurrences">Udalosti</v-tab>
          <v-tab value="history">História</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="pt-1">
          <v-tabs-window-item value="occurrences">
            <PreviewList :loading="occurrencesLoading">
              <PreviewItem
                v-for="occurrence in occurrences"
                :id="occurrence.id"
                :key="occurrence.id"
                :imgPath="'@/assets/checkpoint-icon.png'"
                :title="occurrence.name"
                :subtitle="formatTimestamp(occurrence.dateTime.seconds)"
                :state="occurrence.state"
                :secondaryColor="true"
                @click=""
              />
            </PreviewList>
          </v-tabs-window-item>

          <v-tabs-window-item value="history">
            <SmallPreviewList :loading="occurrencesLoading">
              <SmallPreviewItem
                v-for="historyAction in historyActions"
                :id="historyAction.action.id"
                :key="historyAction.action.id"
                :imgPath="'@/assets/checkpoint-icon.png'"
                :title="historyAction.occurrence.name + ' - ' + historyAction.action.type"
                :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
                :note="historyAction.action.description"
                @click=""
              >
                <v-icon class="mr-3">mdi-account</v-icon>
              </SmallPreviewItem>
            </SmallPreviewList>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { _RefFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, DocumentData } from 'firebase/firestore'
import { db } from '@/firebase'
import { formatTimestamp } from '@/utils'

const props = defineProps<{
  checkpoint: any
}>()

const appStore = useAppStore()

const tab = ref(null)

const checkpointPath = computed(
  () => `Buildings/${appStore.selectedBuilding.id}/checkpoints/${props.checkpoint?.id}`
)
const occurrencesPath = computed(() => `${checkpointPath.value}/occurrences`)

const occurrencesLoading = ref(true)
const occurrences = useCollection(() => collection(db, occurrencesPath.value))
var occurrenceActionsRefs = [] as Array<_RefFirestore<DocumentData[]> | null>
var historyActions = ref([] as any) // { action: Ref<DocumentData>; occurrence: any }[]

watch(
  () => props.checkpoint,
  () => {
    occurrencesLoading.value = true
  }
)

watch(occurrences, () => {
  occurrencesLoading.value = false
  getHistory()
})

const getHistory = async () => {
  historyActions.value = []
  occurrenceActionsRefs.forEach((occurrenceActionsRef) => {
    occurrenceActionsRef?.stop()
  })

  // For each occurrence
  for (const occurrence of occurrences.value) {
    // Get its actions
    const occurrenceActions = useCollection(
      collection(db, `${occurrencesPath.value}/${occurrence.id}/actions`)
    )
    occurrenceActionsRefs.push(occurrenceActions)

    const occurrenceRef = ref(occurrence)

    // Wait for the actions to load
    await occurrenceActions.promise.value.then(() => {
      // For each action
      occurrenceActions.value.forEach(async (action: any) => {
        const actionDoc = useDocument(
          doc(db, `${occurrencesPath.value}/${occurrence.id}/actions/${action.id}`)
        )
        await actionDoc.promise.value.then(() => {
          // Add it to the history
          historyActions.value.push({ action: actionDoc, occurrence: occurrenceRef })
        })
      })

      var previousOccurrenceActions = [...occurrenceActions.value]

      // Watch for changes in actions
      watch(
        occurrenceActions,
        (newOccurrenceActions, oldOccurrenceActions) => {
          if (newOccurrenceActions.length > previousOccurrenceActions.length) {
            const newActions = newOccurrenceActions.filter(
              (action: any) =>
                !previousOccurrenceActions.some((oldAction: any) => oldAction.id === action.id)
            )
            newActions.forEach((action: any) => {
              const actionRef = ref(action)
              const occurrenceRef = ref(occurrence)
              historyActions.value.unshift({ action: actionRef, occurrence: occurrenceRef })
            })
          } else if (newOccurrenceActions.length < previousOccurrenceActions.length) {
            const removedActions = previousOccurrenceActions.filter(
              (oldAction: any) =>
                !newOccurrenceActions.some((action: any) => action.id === oldAction.id)
            )
            removedActions.forEach((action: any) => {
              historyActions.value = historyActions.value.filter(
                (historyAction: any) => historyAction.action.id !== action.id
              )
            })
          }
          previousOccurrenceActions = [...occurrenceActions.value]
        },
        { deep: true }
      )
    })
  }
}
</script>

<style scoped></style>
