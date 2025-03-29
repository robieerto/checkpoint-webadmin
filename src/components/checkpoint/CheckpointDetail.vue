<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="6">
        <v-row class="ml-0">
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <img src="@/assets/checkpoint-logo.png" style="width: 38px" />
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
        <!-- <v-row>
          <h3>Popis</h3>
          <v-list class="pt-0 mt-0 mr-3" style="max-height: 160px">
            <v-col class="py-1">
              <span
                v-for="(line, lineNumber) of checkpoint.description?.split('\\n')"
                v-bind:key="lineNumber"
              >
                {{ line }}<br />
              </span>
            </v-col>
          </v-list>
        </v-row> -->
        <v-row>
          <v-col class="py-0">
            <v-tabs v-model="tab">
              <v-tab value="occurrences">{{ $t('events') }}</v-tab>
              <v-tab value="history">{{ $t('history') }}</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab" class="pt-1">
              <v-tabs-window-item value="occurrences">
                <PreviewList
                  v-if="occurrencesLoading || !noOccurrences"
                  :loading="occurrencesLoading"
                >
                  <OccurrencePreviewItem
                    v-for="occurrence in occurrences"
                    :id="occurrence.id"
                    :key="occurrence.id"
                    :occurrence="occurrence"
                    :secondaryColor="true"
                    @click="selectOccurrence(occurrence)"
                  />
                </PreviewList>
                <div v-else>
                  <p class="mt-5">{{ $t('noEventsOnCheckpoint') }}</p>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item value="history">
                <SmallPreviewList v-if="historyLoading || !noHistory" :loading="historyLoading">
                  <SmallPreviewItem
                    v-for="historyAction in historyActions"
                    :id="historyAction.action.id"
                    :key="historyAction.action.id"
                    :title="
                      historyAction.occurrence?.name +
                      ' - ' +
                      translateActionState(historyAction.action.type)
                    "
                    :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
                    :note="historyAction.action.description"
                    :checkpoint="checkpoint?.name"
                    :user="historyAction.action?.createdBy?.username"
                    @click="selectAction(historyAction)"
                  >
                    <Avatar />
                  </SmallPreviewItem>
                </SmallPreviewList>
                <div v-else>
                  <p class="mt-5">{{ $t('noActionsOnCheckpoint') }}</p>
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
  <FAB v-if="!appStore.forms.isCleaningRequestOpen" />
</template>

<script setup lang="ts">
import { firestoreDefaultConverter, useDocument } from 'vuefire'
import { _RefFirestore, useCollection } from 'vuefire'
import {
  collection,
  collectionGroup,
  orderBy,
  startAt,
  endAt,
  query,
  documentId,
  doc,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { formatTimestamp, translateActionState } from '@/utils'

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

const historyActions = ref(null as any)

const actions = useCollection(() =>
  occurrences.value?.length > 0
    ? query(
        collectionGroup(db, 'actions'),
        orderBy(documentId()),
        startAt(checkpointPath.value),
        endAt(checkpointPath.value + '\uf8ff')
      ).withConverter({
        toFirestore: firestoreDefaultConverter.toFirestore,
        fromFirestore: (snapshot, options) => {
          const data = firestoreDefaultConverter.fromFirestore(snapshot, options)
          if (!data) return null
          data.occurrenceId = snapshot.ref?.parent.parent?.id
          data.checkpointId = snapshot.ref?.parent.parent?.parent.parent?.id
          return data
        },
      })
    : null
)

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

watch(
  () => occurrences.value,
  () => {
    if (occurrences.value) {
      occurrencesLoading.value = false
    }
  }
)

watch(
  () => actions.value,
  (actions) => {
    if (!actions) return
    sortAndAssignActions(actions)
  },
  { deep: true }
)

// Functions
const selectOccurrence = (occurrence: any) => {
  selectedAction.value = null
  const occurrenceActions = actions.value.filter(
    (action: any) => action.occurrenceId === occurrence.id
  )
  occurrenceActions.sort((a: any, b: any) => a.dateTime.seconds - b.dateTime.seconds)

  selectedOccurrence.value = { occurrence, actions: occurrenceActions }
}

const selectAction = (action: any) => {
  selectedOccurrence.value = null
  selectedAction.value = action
}

const findOccurrence = (occurrenceId: string, checkpointId: string) => {
  const occurrence = occurrences.value.find((o: any) => o.id === occurrenceId)
  if (!occurrence) {
    // Get occurrence
    console.log('fallback loading occurrence')
    return useDocument(
      doc(
        db,
        `Buildings/${appStore.selectedBuilding.id}/checkpoints/${checkpointId}/occurrences/${occurrenceId}`
      )
    )
  } else {
    return occurrence
  }
}

const sortAndAssignActions = async (actions: any) => {
  actions.sort((a: any, b: any) => b.dateTime.seconds - a.dateTime.seconds)
  historyActions.value = actions.map((action: any) => {
    const occurrence = findOccurrence(action.occurrenceId, action.checkpointId)
    return {
      action,
      occurrence,
    }
  })
  historyLoading.value = false
}

// on unmount
onUnmounted(() => {
  appStore.selectedCheckpoint = null
})
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
