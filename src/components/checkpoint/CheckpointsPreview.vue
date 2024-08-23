<template>
  <v-container class="pr-10" fluid>
    <v-row>
      <v-col class="pb-0">
        <h2>Checkpointy</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="max-width: 360px">
        <v-card>
          <v-list height="80vh" :rounded="true">
            <PreviewItem
              v-for="item in items"
              :key="item.id"
              :title="item.title"
              :id="item.id"
              @select="selectItem"
            />
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <Detail v-if="selectedItemId !== null" :itemId="selectedItemId" @close="closeDetail" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref(
  Array.from({ length: 30 }, (k, v) => ({ id: v + 1, title: `Checkpoint ${v + 1}` }))
)

const selectedItemId = ref<number | null>(null)
const detailVisible = ref(false)

const selectItem = (id: number) => {
  selectedItemId.value = id
  detailVisible.value = true
}

const closeDetail = () => {
  selectedItemId.value = null
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
