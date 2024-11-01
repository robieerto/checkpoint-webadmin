<template>
  <!-- <v-icon  class="ml-2 mr-4">mdi-account</v-icon> -->
  <v-avatar v-if="username" color="background" variant="flat" density="default" :border="0">
    <span class="text-h6">{{ getInitial(username) }}</span>
  </v-avatar>
  <v-avatar
    v-else
    :color="secondaryColor ? 'brown' : 'background'"
    variant="flat"
    density="default"
  >
    <span class="material-symbols-outlined mx-1" style="font-size: 22px"> </span>
  </v-avatar>
</template>

<script setup lang="ts">
import { getInitial } from '@/utils'

defineProps<{
  username?: string
  secondaryColor?: boolean
}>()
</script>
