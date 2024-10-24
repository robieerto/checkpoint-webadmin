<template>
  <v-card height="100%">
    <v-card-text>
      <v-container class="py-0">
        <v-row>
          <v-list-item-title class="text-h6 mx-auto">Úkon</v-list-item-title>
        </v-row>
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-img src="@/assets/action-logo.png" width="45"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1">
                <v-list-item-title class="text-h6">{{
                  occurrence.name + ' - ' + translateActionState(action.type)
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  formatTimestamp(action.dateTime.seconds)
                }}</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <h3>Úkon vytvoril užívateľ</h3>
            <v-chip
              v-if="action.createdBy?.username"
              variant="flat"
              rounded="lg"
              color="yellow"
              prepend-icon="mdi-account"
              class="mr-1 mt-1 py-6"
            >
              <div class="ml-1">
                <v-list-item-title class="font-weight-medium">
                  {{ action.createdBy?.username }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ action.createdBy?.services?.[0].name }}
                </v-list-item-subtitle>
              </div>
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <h3>Popis</h3>
            <p class="mt-1">{{ action.description }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp, translateActionState } from '@/utils'

const props = defineProps<{
  actionRef?: any
}>()

const occurrence = ref(props.actionRef.occurrence)
const action = ref(props.actionRef.action)

watch(
  () => props.actionRef.occurrence,
  () => {
    occurrence.value = props.actionRef.occurrence
  }
)

watch(
  () => props.actionRef.action,
  () => {
    action.value = props.actionRef.action
  }
)
</script>

<style scoped>
.v-card {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
