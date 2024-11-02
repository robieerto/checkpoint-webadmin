<script setup lang="ts">
const { searchText, currentPage } = storeToRefs(useAppStore())

const isBarVisible = ref(false)
const searchTypedText = ref('')
const debounceTimeout = ref(null as number | null)

const startSearch = () => {
  searchText.value = searchTypedText.value
}

const clearSearch = () => {
  searchTypedText.value = ''
  searchText.value = ''
}

watch(
  () => currentPage.value,
  (page) => {
    clearSearch()
    if (page == 'guests') {
      isBarVisible.value = false
    } else {
      isBarVisible.value = true
    }
  },
  { immediate: true }
)

watch(searchTypedText, () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  debounceTimeout.value = setTimeout(() => {
    startSearch()
  }, 300)
})
</script>

<template>
  <v-text-field
    v-if="isBarVisible"
    v-model="searchTypedText"
    class="ml-16 search-field"
    :label="$t('search')"
    style="max-width: 500px"
    @keydown.enter="startSearch"
    rounded
    hide-details
    single-line
    density="comfortable"
  >
    <template v-slot:append-inner>
      <v-btn
        v-if="searchTypedText.length"
        color="secondary"
        class="mr-2"
        density="compact"
        @click="clearSearch"
        icon
        flat
        slim
      >
        <v-icon color="text">mdi-close</v-icon>
      </v-btn>
      <v-btn color="secondary" density="compact" @click="startSearch" icon flat slim>
        <v-icon color="text">mdi-magnify</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>
