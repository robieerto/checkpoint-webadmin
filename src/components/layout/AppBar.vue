<script setup lang="ts">
const { drawer, currentPage } = storeToRefs(useAppStore())
const route = useRoute()

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
currentPage.value = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1]?.title)
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <!-- <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer /> -->
    <SearchBar />
    <v-spacer />
    <div id="app-bar" />
    <ButtonLocale />
    <ButtonUser />
  </v-app-bar>
</template>

<style scoped>
:deep(.v-switch__thumb .v-icon) {
  --v-icon-size-multiplier: 1.2 !important;
}
</style>
