<template>
  <v-card class="px-5" rounded="xl" style="width: 450px">
    <v-row>
      <v-col class="pb-0 ml-5 mt-5">
        <h2>{{ $t('actionOverview') }}</h2>
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
                historyAction.occurrence?.name +
                ' - ' +
                translateActionState(historyAction.action.type)
              "
              :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
              :note="historyAction.action.description"
              :checkpoint="historyAction.checkpoint?.name"
              :user="historyAction.action?.createdBy?.username"
              @click="selectItem(historyAction)"
            >
              <Avatar />
            </SmallPreviewItem>
          </template>
          <template v-slot:empty> </template>
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
import { db } from '@/firebase'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { formatTimestamp, translateActionState } from '@/utils'

const appStore = useAppStore()
const {
  buildingActions,
  isLoadingBuildingActions,
  isModalActionDetailOpen,
  selectedBuilding,
  selectedCheckpoint,
  checkpoints,
  occurrences,
} = storeToRefs(appStore)

const pageSize = 10
const page = ref(1)
const buildingActionsVirtual = ref(null as any)
const selectedAction = ref(null)

const getUser = (user: any) => {
  if (typeof user === 'string' || user instanceof String) {
    const userId = user.split('/')[1]
    return appStore.employees.find((e: any) => e.id === userId)
  }
  return user
}

const findCheckpoint = (checkpointId: string) => {
  return checkpoints.value.find((c: any) => c.id === checkpointId)
}

const findOccurrence = (occurrenceId: string, checkpointId: string) => {
  const occurrence = occurrences.value.find((o: any) => o.id === occurrenceId)
  if (!occurrence) {
    // Get occurrence
    return useDocument(
      doc(
        db,
        `Buildings/${selectedBuilding.value?.id}/checkpoints/${checkpointId}/occurrences/${occurrenceId}`
      )
    )
  } else {
    return occurrence
  }
}

watch(
  () => buildingActions.value,
  () => {
    if (!buildingActions.value) return
    page.value = 1
    const actions = !buildingActions.value?.length
      ? ([] as any[])
      : buildingActions.value.slice(0, pageSize).map((action: any) => {
          return {
            action: { ...action, createdBy: getUser(action.createdBy) } as any,
            checkpoint: findCheckpoint(action.checkpointId),
            occurrence: findOccurrence(action.occurrenceId, action.checkpointId),
          }
        })
    buildingActionsVirtual.value = actions
  },
  { immediate: true, deep: true }
)

async function api(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        buildingActions.value
          ?.slice(page.value * pageSize, (page.value + 1) * pageSize)
          .map((action: any) => {
            return {
              action,
              checkpoint: findCheckpoint(action.checkpointId),
              occurrence: findOccurrence(action.occurrenceId, action.checkpointId),
            }
          })
      )
    }, 100)
  })
}

async function load({ done }: { done: (arg: any) => void }) {
  const res = await api()
  if (res?.length) {
    page.value++
    buildingActionsVirtual.value?.push(...res)
    done('ok')
  } else {
    done('empty')
  }
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
