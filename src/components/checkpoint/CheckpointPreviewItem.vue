<template>
  <v-container>
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
        <v-img src="@/assets/checkpoint-icon.png" width="45"></v-img>
      </v-col>
      <v-col style="max-width: 246px">
        <v-row>
          <v-col class="py-1">
            <v-list-item-title class="text-h6">{{ props.data?.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ props.data?.floor?.name }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text-right"
              >Stav: {{ props.data?.state }}</v-list-item-subtitle
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any
}>()
</script>

<style scoped>
/* Add any custom styles here */
</style>
