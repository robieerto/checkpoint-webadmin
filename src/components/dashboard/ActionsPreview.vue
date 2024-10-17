<template>
  <v-card class="px-5" rounded="xl" style="min-width: 300px">
    <v-row>
      <v-col class="pb-0 ml-5 mt-5">
        <h2>Aktuálny prehľad</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <SmallPreviewList :loading="isLoadingBuildingActions" height="80vh">
          <SmallPreviewItem
            v-for="historyAction in buildingActions"
            :id="historyAction.action.id"
            :key="historyAction.action.id"
            :title="historyAction.occurrence.name + ' - ' + historyAction.action.type"
            :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
            :note="historyAction.action.description"
            @click=""
          >
            <v-icon class="mr-3">mdi-circle</v-icon>
          </SmallPreviewItem>
        </SmallPreviewList>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'

const appStore = useAppStore()
const { buildingActions, isLoadingBuildingActions } = storeToRefs(appStore)
</script>
