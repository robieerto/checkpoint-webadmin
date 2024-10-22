<template>
  <v-card class="px-5" rounded="xl" style="min-width: 300px">
    <v-row>
      <v-col class="pb-0 ml-5 mt-5">
        <h2>Checkpointy</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <CheckpointPreviewItem
            v-for="checkpoint in sortedCheckpoints?.tasks"
            :id="checkpoint.id"
            :key="checkpoint.id"
            :checkpoint="checkpoint"
            :secondaryColor="true"
            @click="selectItem(checkpoint)"
          />
          <div v-for="(checkpoints, floor) in sortedCheckpoints?.okByFloors">
            <v-row class="align-center w-100 mx-0">
              <v-col cols="auto" class="pl-0 pr-2">
                <v-list-item-title class="text-h6 ml-5 pt-2 pb-1">{{ floor }}</v-list-item-title>
              </v-col>
              <v-col class="">
                <hr class="my-0" />
              </v-col>
            </v-row>
            <CheckpointPreviewItem
              v-for="checkpoint in checkpoints"
              :id="checkpoint.id"
              :key="checkpoint.id"
              :checkpoint="checkpoint"
              :secondaryColor="true"
              @click="selectItem(checkpoint)"
            />
          </div>
        </v-list>
      </v-col>
    </v-row>
    <v-dialog v-model="detailVisible" max-width="1000px" :scrollable="true">
      <Detail v-if="selectedCheckpoint !== null" @close="closeDetail">
        <CheckpointDetail :checkpoint="selectedCheckpoint" />
      </Detail>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
const { sortedCheckpoints, selectedCheckpoint } = storeToRefs(useAppStore())

const detailVisible = ref(false)

const selectItem = (item: any) => {
  selectedCheckpoint.value = item
  detailVisible.value = true
}

const closeDetail = () => {
  selectedCheckpoint.value = null
  detailVisible.value = false
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

hr {
  border: 0;
  border-top: 1px solid #ccc6bf;
}
</style>
