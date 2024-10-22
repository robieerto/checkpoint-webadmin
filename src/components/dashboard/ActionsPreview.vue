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
            :title="
              historyAction.occurrence.name +
              ' - ' +
              translateActionState(historyAction.action.type)
            "
            :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
            :note="historyAction.action.description"
            @click=""
          >
            <v-avatar
              v-if="historyAction.action.createdBy?.username"
              color="#d9d9d9"
              variant="flat"
              density="default"
              :border="0"
            >
              <span class="text-h6">{{
                getInitial(historyAction.action.createdBy?.username)
              }}</span>
            </v-avatar>
            <span v-else class="material-symbols-outlined mx-1" style="font-size: 30px">
              account_circle
            </span>
          </SmallPreviewItem>
        </SmallPreviewList>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp, getInitial, translateActionState } from '@/utils'

const appStore = useAppStore()
const { buildingActions, isLoadingBuildingActions } = storeToRefs(appStore)
</script>
