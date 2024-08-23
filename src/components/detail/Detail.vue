<template>
  <v-card height="80vh">
    <v-card-title class="pb-0 d-flex justify-end">
      <v-btn color="secondary" density="compact" icon flat slim>
        <v-icon color="text" @click="closeDetail">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- Detail content goes here -->
      <h2>Detail for item with ID: {{ props.itemId }}</h2>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  itemId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeDetail = () => {
  emit('close')
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
