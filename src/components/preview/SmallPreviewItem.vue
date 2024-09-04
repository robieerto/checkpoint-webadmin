<template>
  <v-list-item rounded="none" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <slot></slot>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1">
              <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
              <v-list-item-title class="font-weight-medium">{{ title }}</v-list-item-title>
              <v-list-item-subtitle style="max-width: 246px">{{ note }}</v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
  imgPath?: string
  title?: string
  subtitle?: string
  note?: string
}>()
</script>

<style scoped>
:deep(.v-list-item__overlay) {
  background: none !important;
}
</style>
