<script setup lang="ts">
import router from '@/router'
import { routes } from 'vue-router/auto-routes'

const appStore = useAppStore()
const { drawer: drawerStored, selectedBuilding } = storeToRefs(appStore)

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

const buildingDialog = ref(false)

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
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-domain"
          class="py-5"
          active-class="text-primary"
          :title="selectedBuilding?.name"
          :link="true"
          @click="buildingDialog = true"
        />
      </v-list>
    </template>
    <v-list nav density="compact">
      <AppDrawerItem v-for="route in routes" :key="route.name" :item="route" />
    </v-list>
    <v-spacer />
    <template #append>
      <v-list-item
        v-if="!rail || !hideTitle"
        class="drawer-footer px-0 d-flex flex-column justify-center"
      >
        <div class="text-caption pt-6 pb-1 pt-md-0 text-center text-no-wrap">Test v0.1</div>
      </v-list-item>
    </template>
  </v-navigation-drawer>

  <v-dialog v-model="buildingDialog" max-width="320">
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item
        v-for="building in appStore.buildings"
        :key="building.id"
        prepend-icon="mdi-domain"
        class="py-5"
        active-class="text-primary"
        :title="building?.name"
        :link="true"
        @click="
          () => {
            appStore.selectedBuilding = building
            buildingDialog = false
            router.push('/')
          }
        "
      >
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
