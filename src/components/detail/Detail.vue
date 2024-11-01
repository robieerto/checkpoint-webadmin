<template>
  <v-card :height="height ?? '80vh'" rounded="xl">
    <v-card-title class="pb-0 d-flex justify-end">
      <v-btn color="secondary" density="compact" @click="closeDetail" icon flat slim>
        <v-icon color="text">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  height?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const closeDetail = () => {
  emit('close')
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
