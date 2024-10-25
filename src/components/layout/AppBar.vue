<script setup lang="ts">
const { drawer, searchText } = storeToRefs(useAppStore())
const route = useRoute()

const searchTypedText = ref('')

const breadcrumbs = computed<any>(() => {
  return route!.matched
    .slice(1)
    .filter((item) => item.meta && item.meta.title && !(item.meta?.breadcrumb === 'hidden'))
    .map((r) => ({
      title: r.meta.title!,
      disabled: r.meta?.breadcrumb === 'disabled' || r.path === route.path || false,
      to: r.path,
    }))
})

const startSearch = () => {
  searchText.value = searchTypedText.value
}

const clearSearch = () => {
  searchTypedText.value = ''
  searchText.value = ''
}
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <!-- <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer /> -->
    <v-text-field
      v-model="searchTypedText"
      class="ml-16 search-field"
      label="Vyhľadávanie"
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
    <v-spacer />
    <div id="app-bar" />
    <ButtonUser />
  </v-app-bar>
</template>

<style scoped>
:deep(.v-switch__thumb .v-icon) {
  --v-icon-size-multiplier: 1.2 !important;
}
</style>
