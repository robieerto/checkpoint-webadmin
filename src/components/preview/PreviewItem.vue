<template>
  <v-list-item rounded="lg" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <v-img v-if="imgPath" src="@/assets/checkpoint-icon.png" width="45"></v-img>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1">
              <v-list-item-title class="text-h6">{{ title }}</v-list-item-title>
              <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
              <v-list-item-subtitle style="max-width: 246px" class="text-right"
                >Stav: {{ state }}</v-list-item-subtitle
              >
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
  state?: string
}>()

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
