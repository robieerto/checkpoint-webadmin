<template>
  <!-- <v-icon  class="ml-2 mr-4">mdi-account</v-icon> -->
  <v-avatar v-if="username" color="#d9d9d9" variant="flat" density="default" :border="0">
    <span class="text-h6">{{ getInitial(username) }}</span>
  </v-avatar>
  <span v-else class="material-symbols-outlined mx-1" style="font-size: 30px">
    account_circle
  </span>
</template>

<script setup lang="ts">
import { getInitial } from '@/utils'

defineProps<{
  username?: string
}>()
</script>
