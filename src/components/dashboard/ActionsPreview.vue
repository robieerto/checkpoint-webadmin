<template>
  <v-card class="px-5" rounded="xl" style="width: 450px">
    <v-row>
      <v-col class="pb-0 ml-5 mt-5">
        <h2>Aktuálny prehľad</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list v-if="isLoadingBuildingActions" height="80vh">
          <v-row justify="center" align="center" height="80vh" class="fill-height w-100">
            <v-progress-circular indeterminate :size="70" color="primary" />
          </v-row>
        </v-list>
        <v-infinite-scroll v-else height="80vh" @load="load">
          <template
            v-for="historyAction in buildingActionsVirtual"
            :key="historyAction?.action?.id"
          >
            <SmallPreviewItem
              :id="historyAction.action.id"
              :title="
                historyAction.occurrence.name +
                ' - ' +
                translateActionState(historyAction.action.type)
              "
              :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
              :note="historyAction.action.description"
              @click="selectItem(historyAction)"
            >
              <Avatar :username="historyAction.action?.createdBy?.username" />
            </SmallPreviewItem>
          </template>
        </v-infinite-scroll>
      </v-col>
    </v-row>
    <Modal v-if="isModalActionDetailOpen" @close="closeDetail">
      <Detail v-if="selectedAction !== null" @close="closeDetail">
        <ActionFullDetail :historyAction="selectedAction" />
      </Detail>
    </Modal>
  </v-card>
</template>

<script setup lang="ts">
import { formatTimestamp, translateActionState } from '@/utils'

const appStore = useAppStore()
const { buildingActions, isLoadingBuildingActions, isModalActionDetailOpen, selectedCheckpoint } =
  storeToRefs(appStore)

const pageSize = 10
const page = ref(1)
const buildingActionsVirtual = ref(
  !buildingActions.value?.length ? ([] as any[]) : buildingActions.value.slice(0, pageSize)
)
const selectedAction = ref(null)

watch(
  () => buildingActions.value,
  () => {
    if (!buildingActions.value?.length) return
    page.value = 1
    buildingActionsVirtual.value = buildingActions.value.slice(0, pageSize)
  },
  { deep: true }
)

async function api(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buildingActions.value?.slice(page.value * pageSize, (page.value + 1) * pageSize))
    }, 100)
  })
}

async function load({ done }: { done: (arg: any) => void }) {
  const res = await api()
  if (res?.length) {
    page.value++
    buildingActionsVirtual.value.push(...res)
  }
  done('ok')
}

const selectItem = (item: any) => {
  selectedCheckpoint.value = item?.checkpoint
  selectedAction.value = item
  isModalActionDetailOpen.value = true
}

const closeDetail = () => {
  selectedCheckpoint.value = null
  isModalActionDetailOpen.value = false
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
