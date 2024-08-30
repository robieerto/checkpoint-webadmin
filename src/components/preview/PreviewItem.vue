<template>
  <v-list-item rounded="lg" class="mb-2">
    <slot></slot>
  </v-list-item>
</template>

<script setup lang="ts">
// const props = defineProps<{
//   id: string
// }>()

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
</style>
