<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="start">
            <v-img src="@/assets/occurrence-logo.png" width="45"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1 pl-1">
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
          <v-col class="py-1">
            <h3>Priebeh</h3>
            <SmallPreviewList :secondaryColor="false" height="60vh">
              <SmallPreviewItem
                v-for="action in occurrenceActions"
                :id="action.id"
                :key="action.id"
                :title="extUserAction?.occurrence.name + ' - ' + translateActionState(action.type)"
                :subtitle="formatTimestamp(action.dateTime?.seconds)"
                :note="action.description"
                :secondaryColor="false"
                @click="selectAction(action)"
              >
                <v-avatar
                  v-if="action.createdBy?.username"
                  color="#d9d9d9"
                  variant="flat"
                  density="default"
                  :border="0"
                >
                  <span class="text-h6">{{ getInitial(action.createdBy?.username) }}</span>
                </v-avatar>
                <span v-else class="material-symbols-outlined mx-1" style="font-size: 30px">
                  account_circle
                </span>
              </SmallPreviewItem>
            </SmallPreviewList>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <ActionDetail v-if="selectedAction" :actionRef="selectedAction" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { formatTimestamp, getInitial, translateActionState } from '@/utils'
import { collection, query, orderBy } from 'firebase/firestore'
import { useCollection } from 'vuefire'
import { db } from '@/firebase'

const props = defineProps<{
  extUserAction?: any
}>()

const appStore = useAppStore()

const selectedAction = ref(null as any)

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

const selectAction = (action: any) => {
  selectedAction.value = { action, occurrence: props.extUserAction.occurrence }
}
</script>
