<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="lg" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <v-img src="@/assets/checkpoint-logo.png" width="45"></v-img>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1 pl-1 pr-0">
              <v-list-item-title class="list text-h6">{{ checkpoint.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ checkpoint.floor.name }}</v-list-item-subtitle>
              <div v-if="checkpoint.states" class="text-right">
                <CheckpointChipStates :checkpointStates="checkpoint.states"></CheckpointChipStates>
              </div>
              <div v-else class="text-right">
                <ChipState :serviceType="'cleaning'" :entityState="checkpoint.state"></ChipState>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
  checkpoint?: any
  secondaryColor?: boolean
}>()

// const emit = defineEmits<{
//   select: [id: string]
// }>()

// const selectItem = () => {
//   emit('select', props.id)
// }
</script>

<style scoped>
:deep(.v-list-item__overlay) {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
