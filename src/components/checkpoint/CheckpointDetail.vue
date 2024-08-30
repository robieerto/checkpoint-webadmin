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
        <h4 class="pb-2">Udalosti</h4>
        <v-list height="60vh" class="py-0" :border="false" :rounded="true">
          <PreviewItem
            v-for="occurence in occurences"
            :id="occurence.id"
            :key="occurence.id"
            :imgPath="'@/assets/checkpoint-icon.png'"
            :title="occurence.name"
            :subtitle="formatTimestamp(occurence.dateTime.seconds)"
            :state="occurence.state"
            @click=""
          />
        </v-list>
      </v-col>
      <v-col cols="6">
        <h4 class="pb-2">História</h4>
        <h4>TODO</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from '@/firebase'
import { formatTimestamp } from '@/utils'

const props = defineProps<{
  checkpoint: any
}>()

const appStore = useAppStore()

const path = computed(
  () => `Buildings/${appStore.selectedBuilding.id}/checkpoints/${props.checkpoint.id}`
)
const occurencesPath = computed(() => `${path.value}/occurrences`)

const occurences = useCollection(() => collection(db, occurencesPath.value))
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.v-list-item {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
