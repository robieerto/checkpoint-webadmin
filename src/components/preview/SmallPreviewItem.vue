<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="none" class="mb-2">
    <v-container>
      <v-row>
        <v-col cols="1" style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <slot></slot>
        </v-col>
        <v-col cols="9">
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
  secondaryColor?: boolean
}>()
</script>

<style scoped>
.v-list-item__overlay {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
