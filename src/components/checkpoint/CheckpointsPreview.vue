<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0 ml-5">
        <h2>{{ $t('checkpoints') }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="max-width: 360px">
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <CheckpointPreviewItem
            v-for="checkpoint in sortedAndFilteredCheckpoints?.tasks"
            :id="checkpoint.id"
            :key="checkpoint.id"
            :checkpoint="checkpoint"
            :secondaryColor="false"
            @click="selectItem(checkpoint)"
          />
          <div v-for="checkpointFloor in sortedAndFilteredCheckpoints?.okByFloors">
            <v-row class="align-center w-100 mx-0">
              <v-col cols="auto" class="pl-0 pr-2">
                <v-list-item-title class="text-h6 ml-5 pt-2 pb-1">{{
                  checkpointFloor?.name
                }}</v-list-item-title>
              </v-col>
              <v-col class="pr-1">
                <hr class="my-0" />
              </v-col>
            </v-row>
            <CheckpointPreviewItem
              v-for="checkpoint in checkpointFloor?.checkpoints"
              :id="checkpoint.id"
              :key="checkpoint.id"
              :checkpoint="checkpoint"
              :secondaryColor="false"
              @click="selectItem(checkpoint)"
            />
          </div>
        </v-list>
      </v-col>
      <v-col>
        <Detail v-if="selectedCheckpoint !== null" @close="closeDetail">
          <CheckpointDetail :checkpoint="selectedCheckpoint" />
        </Detail>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { sortedAndFilteredCheckpoints, selectedCheckpoint } = storeToRefs(useAppStore())

const detailVisible = ref(false)

const selectItem = (item: any) => {
  selectedCheckpoint.value = item
  detailVisible.value = true
}

const closeDetail = () => {
  selectedCheckpoint.value = null
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-background)) !important;
}

hr {
  border: 0;
  border-top: 1px solid #705d0d;
}
</style>
