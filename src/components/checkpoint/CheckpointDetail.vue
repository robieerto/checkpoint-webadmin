<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-img src="@/assets/checkpoint-icon.png" width="45"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1">
                <v-list-item-title class="text-h6">{{ checkpoint?.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ checkpoint?.floor?.name }}</v-list-item-subtitle>
                <div v-if="checkpoint.states" class="text-right">
                  <CheckpointChipStates
                    :checkpointStates="checkpoint.states"
                  ></CheckpointChipStates>
                </div>
                <div v-else class="text-right">
                  <ChipState :serviceType="'cleaning'" :entityState="checkpoint.state"></ChipState>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-tabs v-model="tab">
              <v-tab value="occurrences">Udalosti</v-tab>
              <v-tab value="history">História</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab" class="pt-1">
              <v-tabs-window-item value="occurrences">
                <PreviewList
                  v-if="occurrencesLoading || !noOccurrences"
                  :loading="occurrencesLoading"
                >
                  <PreviewItem
                    v-for="occurrence in occurrences"
                    :id="occurrence.id"
                    :key="occurrence.id"
                    :imgPath="'@/assets/checkpoint-icon.png'"
                    :title="occurrence.name"
                    :subtitle="formatTimestamp(occurrence.dateTime.seconds)"
                    :state="occurrence.state"
                    :serviceType="occurrence.service.type"
                    :secondaryColor="true"
                    @click="selectOccurrence(occurrence)"
                  />
                </PreviewList>
                <div v-else>
                  <p class="mt-5">Na tomto checkpointe nie sú žiadne udalosti</p>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item value="history">
                <SmallPreviewList v-if="historyLoading || !noHistory" :loading="historyLoading">
                  <SmallPreviewItem
                    v-for="historyAction in historyActions"
                    :id="historyAction.action.id"
                    :key="historyAction.action.id"
                    :imgPath="'@/assets/checkpoint-icon.png'"
                    :title="historyAction.occurrence.name + ' - ' + historyAction.action.type"
                    :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
                    :note="historyAction.action.description"
                    @click="selectAction(historyAction)"
                  >
                    <v-icon class="mr-3">mdi-account</v-icon>
                  </SmallPreviewItem>
                </SmallPreviewList>
                <div v-else>
                  <p class="mt-5">Na tomto checkpointe nie sú žiadne úkony</p>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <OccurrenceDetail v-if="selectedOccurrence" :occurrenceRef="selectedOccurrence" />
        <ActionDetail v-if="selectedAction" :actionRef="selectedAction" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { _RefFirestore, useCollection, useDocument } from 'vuefire'
import { query, collection, doc, DocumentData, orderBy } from 'firebase/firestore'
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
const historyLoading = ref(true)
const selectedOccurrence = ref(null as any)
const selectedAction = ref(null as any)

const occurrences = useCollection(() =>
  query(collection(db, occurrencesPath.value), orderBy('dateTime', 'desc'))
)
var occurrencesRefs = [] as Array<{
  actions: _RefFirestore<DocumentData[]>
  occurrence: any
} | null>
var historyActions = ref([] as { action: Ref<DocumentData>; occurrence: any }[])

const noOccurrences = computed(() => !occurrences.value.length)
const noHistory = computed(() => !historyActions.value.length)

watch(
  () => props.checkpoint,
  () => {
    occurrencesLoading.value = true
    selectedOccurrence.value = null
    selectedAction.value = null
  }
)

watch(occurrences, () => {
  occurrencesLoading.value = false
  getHistory()
})

// Functions
const selectOccurrence = (occurrence: any) => {
  selectedAction.value = null
  selectedOccurrence.value = occurrencesRefs.find(
    (ref) => ref?.occurrence.value.id === occurrence.id
  )
}

const selectAction = (action: any) => {
  selectedOccurrence.value = null
  selectedAction.value = action
}

const sortHistory = () => {
  historyActions.value = historyActions.value.sort((a: any, b: any) => {
    return b.action.dateTime.seconds - a.action.dateTime.seconds
  })
}

const getHistory = async () => {
  historyLoading.value = true
  historyActions.value = []
  occurrencesRefs.forEach((occurrenceActionsRef) => {
    occurrenceActionsRef?.actions?.stop()
  })

  // For each occurrence
  for (const occurrence of occurrences.value) {
    // Get its actions
    const occurrenceActions = useCollection(
      collection(db, `${occurrencesPath.value}/${occurrence.id}/actions`)
    )

    // Save reference
    const occurrenceRef = ref(occurrence)
    occurrencesRefs.push({ actions: occurrenceActions, occurrence: occurrenceRef })

    // Wait for the actions to load
    occurrenceActions.promise.value.then(() => {
      // If the last occurrence and no actions
      if (
        occurrence.id === occurrences.value[occurrences.value.length - 1].id &&
        occurrenceActions.value.length === 0
      ) {
        sortHistory()
        historyLoading.value = false
      }

      // For each action
      occurrenceActions.value.forEach(async (action: any) => {
        // historyActions.value.push({ action: action, occurrence: occurrenceRef })
        const actionDoc = useDocument(
          doc(db, `${occurrencesPath.value}/${occurrence.id}/actions/${action.id}`)
        )
        actionDoc.promise.value.then(() => {
          // Add it to the history
          historyActions.value.push({ action: actionDoc, occurrence: occurrenceRef })
          // If the last occurrence and the last action
          if (
            occurrence.id === occurrences.value[occurrences.value.length - 1].id &&
            action.id === occurrenceActions.value[occurrenceActions.value.length - 1].id
          ) {
            sortHistory()
            historyLoading.value = false
          }
        })
      })

      var previousOccurrenceActions = [...occurrenceActions.value]

      // Watch for changes in actions
      watch(
        occurrenceActions,
        (newOccurrenceActions) => {
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
