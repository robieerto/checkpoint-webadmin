<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0 ml-5">
        <h2>Checkpointy</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="max-width: 360px">
        <v-list height="80vh" class="py-0" :border="false" :rounded="true">
          <PreviewItem
            v-for="checkpoint in checkpoints"
            :id="checkpoint.id"
            :key="checkpoint.id"
            :imgPath="'@/assets/checkpoint-icon.png'"
            :title="checkpoint.name"
            :subtitle="checkpoint.floor.name"
            :state="checkpoint.state"
            @click="selectItem(checkpoint)"
          />
        </v-list>
      </v-col>
      <v-col>
        <Detail v-if="selectedItem !== null" @close="closeDetail">
          <CheckpointDetail :checkpoint="selectedItem" />
        </Detail>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { checkpoints } = storeToRefs(useAppStore())

const selectedItem = ref(null)
const detailVisible = ref(false)

const selectItem = (item: any) => {
  selectedItem.value = item
  detailVisible.value = true
}

const closeDetail = () => {
  selectedItem.value = null
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
