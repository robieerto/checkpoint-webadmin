<template>
  <v-card height="100%">
    <v-card-text>
      <v-container class="py-0">
        <v-row>
          <v-list-item-title class="text-h6 mx-auto">Udalosť</v-list-item-title>
        </v-row>
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-img src="@/assets/checkpoint-icon.png" width="45"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1">
                <v-list-item-title class="text-h6">{{ occurrence.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  formatTimestamp(occurrence.dateTime.seconds)
                }}</v-list-item-subtitle>
                <div class="mt-2 text-right">
                  <ChipState
                    :serviceType="occurrence.service.type"
                    :entityState="occurrence.state"
                  ></ChipState>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <h3>Priebeh</h3>
            <SmallPreviewList :secondaryColor="true" height="53vh">
              <SmallPreviewItem
                v-for="historyAction in actions"
                :id="historyAction.id"
                :key="historyAction.id"
                :imgPath="'@/assets/checkpoint-icon.png'"
                :title="occurrence.name + ' - ' + historyAction.type"
                :subtitle="formatTimestamp(historyAction.dateTime?.seconds)"
                :note="historyAction.description"
                :secondaryColor="true"
                @click=""
              >
                <v-icon class="mr-3">mdi-account</v-icon>
              </SmallPreviewItem>
            </SmallPreviewList>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'

const props = defineProps<{
  occurrenceRef?: any
}>()

const occurrence = ref(props.occurrenceRef.occurrence)
const actions = ref(props.occurrenceRef.actions)
const tab = ref(null)

watch(
  () => props.occurrenceRef.occurrence,
  () => {
    occurrence.value = props.occurrenceRef.occurrence
  }
)

watch(
  () => props.occurrenceRef.actions,
  () => {
    actions.value = props.occurrenceRef.actions
  }
)
</script>

<style scoped>
.v-card {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
