<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0">
        <h2>Checkpointy</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="max-width: 360px">
        <v-card>
          <v-list height="80vh" :rounded="true">
            <PreviewItem
              v-for="checkpoint in checkpoints"
              :key="checkpoint.id"
              :title="checkpoint.name"
              :id="checkpoint.id"
              @select="selectItem"
            />
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <Detail
          v-if="selectedItemId !== null"
          :itemComponent="CheckpointDetail"
          :itemId="selectedItemId"
          @close="closeDetail"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CheckpointDetail from './CheckpointDetail.vue'

const { checkpoints } = storeToRefs(useAppStore())

const selectedItemId = ref<string | null>(null)
const detailVisible = ref(false)

const selectItem = (id: string) => {
  selectedItemId.value = id
  detailVisible.value = true
}

const closeDetail = () => {
  selectedItemId.value = null
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
