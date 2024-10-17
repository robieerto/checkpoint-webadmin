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
            v-for="checkpoint in checkpoints"
            :id="checkpoint.id"
            :key="checkpoint.id"
            :checkpoint="checkpoint"
            :secondaryColor="true"
            @click=""
          />
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const { checkpoints } = storeToRefs(useAppStore())
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
