<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
            <v-icon class="mr-3">mdi-account</v-icon>
          </v-col>
          <v-col>
            <v-row>
              <v-col class="py-1 pl-1 pr-0">
                <v-list-item-title class="text-h6">{{ employee.username }}</v-list-item-title>
                <!-- <v-chip
                  v-for="serviceType in serviceTypes"
                  variant="flat"
                  rounded="lg"
                  color="primary"
                  class="mr-1"
                >
                  {{ serviceType }}
                </v-chip> -->
                <v-chip
                  v-if="employee.phone"
                  variant="flat"
                  rounded="lg"
                  color="yellow"
                  prepend-icon="mdi-phone-outline"
                  class="mr-1"
                >
                  {{ employee.phone }}
                </v-chip>
                <!-- <v-chip
              v-if="employee.email"
              variant="flat"
              rounded="lg"
              color="brown"
              prepend-icon="mdi-email-outline"
            >
              {{ employee.email }}
            </v-chip> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-1">
            <h3>Úkony</h3>
            <v-infinite-scroll
              v-if="isLoadingBuildingActions || userActionsVirtual.length"
              height="65vh"
              @load="load"
            >
              <template
                v-for="historyAction in userActionsVirtual"
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
                  @click="selectAction(historyAction)"
                >
                  <Avatar />
                </SmallPreviewItem>
              </template>
              <template v-slot:empty> </template>
            </v-infinite-scroll>
            <div v-else>
              <p class="mt-5">{{ $t('noActionsUser') }}</p>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <ActionDetail v-if="selectedAction" :actionRef="selectedAction" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { db } from '@/firebase'
import { formatTimestamp, translateActionState } from '@/utils'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'

const props = defineProps<{
  employee?: any
}>()

const appStore = useAppStore()
const { buildingActions, isLoadingBuildingActions, checkpoints, occurrences, selectedBuilding } =
  storeToRefs(appStore)

const pageSize = 10
const page = ref(1)
const userActionsVirtual = ref(null as any)

const selectedAction = ref(null as any)

// const serviceTypes = computed(
//   () => new Set(props.employee.services.map((service: any) => service.type))
// )

const selectAction = (action: any) => {
  selectedAction.value = action
}

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
  () => props.employee,
  () => {
    page.value = 1
    selectAction(null)

    const actions = !buildingActions.value?.length
      ? ([] as any[])
      : buildingActions.value
          .filter((action: any) => getUser(action.createdBy)?.id === props.employee.id)
          .slice(0, pageSize)
          .map((action: any) => {
            return {
              action,
              checkpoint: findCheckpoint(action.checkpointId),
              occurrence: findOccurrence(action.occurrenceId, action.checkpointId),
            }
          })

    userActionsVirtual.value = actions
  },
  { immediate: true, deep: true }
)

async function api(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        buildingActions.value
          .filter((action: any) => action.createdBy?.id === props.employee.id)
          .slice(page.value * pageSize, (page.value + 1) * pageSize)
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
    userActionsVirtual.value?.push(...res)
    done('ok')
  } else {
    done('empty')
  }
}
</script>
