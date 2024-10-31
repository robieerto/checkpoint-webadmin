<template>
  <v-card height="100%">
    <v-card-text>
      <v-container class="py-0">
        <v-row>
          <v-list-item-title class="text-h6 mx-auto mt-3 mb-1">{{ $t('event') }}</v-list-item-title>
        </v-row>
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-img src="@/assets/occurrence-logo.png" width="45"></v-img>
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
            <h3>{{ $t('responsiblePerson') }}</h3>
            <v-chip
              v-if="occurrence.assignedTo?.username"
              variant="flat"
              rounded="lg"
              color="yellow"
              prepend-icon="mdi-account"
              class="mr-1 mt-1 py-6"
            >
              <div class="ml-1">
                <v-list-item-title class="font-weight-medium">
                  {{ occurrence.assignedTo?.username }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ occurrence.assignedTo?.services?.[0].name }}
                </v-list-item-subtitle>
              </div>
            </v-chip>
            <p v-else class="mt-1">{{ $t('notAssigned') }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <h3>{{ $t('process') }}</h3>
            <SmallPreviewList :secondaryColor="true" height="40vh">
              <SmallPreviewItem
                v-for="historyAction in actions"
                :id="historyAction.id"
                :key="historyAction.id"
                :title="occurrence.name + ' - ' + translateActionState(historyAction.type)"
                :subtitle="formatTimestamp(historyAction.dateTime?.seconds)"
                :note="historyAction.description"
                :secondaryColor="true"
                :checkpoint="historyAction.checkpoint?.name"
                :user="historyAction?.createdBy?.username"
                @click="selectItem(historyAction)"
              >
                <Avatar />
              </SmallPreviewItem>
            </SmallPreviewList>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp, translateActionState } from '@/utils'

const props = defineProps<{
  occurrenceRef?: any
}>()

const emit = defineEmits<{
  select: [item: string]
}>()

const selectItem = (item: any) => {
  emit('select', item)
}

const occurrence = ref(props.occurrenceRef.occurrence)
const actions = ref(props.occurrenceRef.actions)

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
