<template>
  <v-list height="60vh" class="py-0" :border="false" :rounded="true">
    <v-row v-if="loading" justify="center" align="center" class="fill-height w-100">
      <v-progress-circular indeterminate :size="70" color="primary" />
    </v-row>
    <slot v-else></slot>
  </v-list>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
