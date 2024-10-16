<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
        <v-img src="@/assets/order-logo.png" width="45"></v-img>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-col class="py-1 pl-1 pr-0">
            <v-list-item-title class="text-h6">Upratovanie na žiadosť hosťa</v-list-item-title>
            <v-list-item-subtitle class="my-1">{{
              formatTimestamp(extUserAction?.dateTime.seconds)
            }}</v-list-item-subtitle>
            <div class="text-right">
              <ChipState
                :serviceType="extUserAction?.occurrence?.service.type"
                :entityState="extUserAction?.occurrence?.state"
              ></ChipState>
              <v-chip variant="flat" rounded="lg" color="primary" class="ml-1">{{
                extUserAction?.checkpoint?.name
              }}</v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-1">
        <h3>Priebeh</h3>
        <SmallPreviewList :secondaryColor="false" height="30vh">
          <SmallPreviewItem
            v-for="historyAction in occurrenceActions"
            :id="historyAction.id"
            :key="historyAction.id"
            :title="extUserAction?.occurrence.name + ' - ' + historyAction.type"
            :subtitle="formatTimestamp(historyAction.dateTime?.seconds)"
            :note="historyAction.description"
            :secondaryColor="false"
            @click=""
          >
            <v-icon class="mr-3">mdi-account</v-icon>
          </SmallPreviewItem>
        </SmallPreviewList>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'
import { collection, query, orderBy } from 'firebase/firestore'
import { useCollection } from 'vuefire'
import { db } from '@/firebase'

const props = defineProps<{
  extUserAction?: any
}>()

const appStore = useAppStore()

const checkpointPath = computed(
  () =>
    `Buildings/${appStore.selectedBuilding.id}/checkpoints/${props.extUserAction?.checkpoint?.id}`
)
const occurrencesPath = computed(() => `${checkpointPath.value}/occurrences`)

const occurrenceActions = useCollection(() =>
  query(
    collection(db, `${occurrencesPath.value}/${props.extUserAction?.occurrence?.id}/actions`),
    orderBy('dateTime', 'asc')
  )
)
</script>
