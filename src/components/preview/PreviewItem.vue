<template>
  <v-list-item @click="selectItem">
    <v-list-item-title>{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  id: string
}>()

const emit = defineEmits<{
  //   (e: 'select', id: number): void
  select: [id: string]
}>()

const selectItem = () => {
  emit('select', props.id)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
