<script setup lang="ts">
import router from '@/router'
import { routes } from 'vue-router/auto-routes'

const appStore = useAppStore()
const { drawer: drawerStored, selectedBuilding, buildings, user } = storeToRefs(appStore)
const notSelectedBuildings = computed({
  get() {
    return buildings.value?.filter((b: any) => b.id !== selectedBuilding.value?.id)
  },
  set(val: any) {
    notSelectedBuildings.value = val
  },
})
const buildingSelector = ref<ComponentPublicInstance | null>(null)

const { mobile, lgAndUp, width } = useDisplay()
const drawer = computed({
  get() {
    return drawerStored.value || !mobile.value
  },
  set(val: boolean) {
    drawerStored.value = val
  },
})
const rail = computed(() => !drawerStored.value && !mobile.value)
const hideTitle = ref(true)
routes.sort((a, b) => Number(a.meta?.drawerIndex ?? 99) - Number(b.meta?.drawerIndex ?? 98))

const managerPagesNums = [4]

const filteredRoutes = computed(() =>
  routes.filter(
    (route) =>
      !managerPagesNums.includes(route.meta?.drawerIndex!) || user.value?.roles?.includes('manager')
  )
)

drawerStored.value = lgAndUp.value && width.value !== 1280

function updateDrawerHover(railChanged: boolean) {
  hideTitle.value = railChanged
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    @update:rail="updateDrawerHover"
    floating
  >
    <template #prepend>
      <v-list>
        <v-list-item class="pa-1">
          <v-list-item-title
            v-if="!rail || !hideTitle"
            class="text-h5 font-weight-bold ml-6"
            style="line-height: 2rem; text-overflow: clip"
          >
            Checkpoint <span class="text-primary">Admin</span>
          </v-list-item-title>
          <v-row v-else justify="center">
            <v-col cols="auto">
              <img src="@/assets/logo.png" width="24" />
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-group v-if="selectedBuilding" prepend-icon="mdi-domain">
          <template #activator="{ props: vProps }">
            <v-list-item
              v-bind="vProps"
              ref="buildingSelector"
              class="py-5"
              active-class="text-primary"
              :title="selectedBuilding?.name"
              :link="true"
            />
          </template>
          <v-list-item
            v-for="building in notSelectedBuildings"
            nav
            prepend-icon="mdi-domain"
            class="py-4"
            active-class="text-primary"
            :title="building?.name"
            :link="true"
            @click="
              () => {
                appStore.selectedBuilding = building
                buildingSelector!.$el.click()
                router.push('/dashboard')
              }
            "
          />
        </v-list-group>
      </v-list>
    </template>
    <v-list nav density="compact">
      <AppDrawerItem v-for="route in filteredRoutes" :key="route.name" :item="route" />
    </v-list>
    <v-spacer />
    <template #append>
      <v-list-item
        v-if="!rail || !hideTitle"
        class="drawer-footer px-0 d-flex flex-column justify-center"
      >
        <div class="text-caption pt-6 pb-1 pt-md-0 text-center text-no-wrap">v1.1</div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: calc(var(--indent-padding)) !important;
}
</style>
