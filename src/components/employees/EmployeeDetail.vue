<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
        <v-icon class="mr-3">mdi-account</v-icon>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="py-1 pl-1 pr-0">
            <v-list-item-title class="text-h6">{{ employee.username }}</v-list-item-title>
            <v-chip
              v-for="serviceType in serviceTypes"
              variant="flat"
              rounded="lg"
              color="primary"
              class="mr-1"
            >
              {{ serviceType }}
            </v-chip>
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
            <v-chip
              v-if="employee.email"
              variant="flat"
              rounded="lg"
              color="brown"
              prepend-icon="mdi-email-outline"
            >
              {{ employee.email }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-1">
        <h3>Úkony</h3>
        <SmallPreviewList
          v-if="isLoadingBuildingActions || userActions.length"
          :loading="isLoadingBuildingActions"
          height="65vh"
        >
          <SmallPreviewItem
            v-for="historyAction in userActions"
            :id="historyAction.action.id"
            :key="historyAction.action.id"
            :title="
              historyAction.occurrence.name +
              ' - ' +
              translateActionState(historyAction.action.type)
            "
            :subtitle="formatTimestamp(historyAction.action.dateTime?.seconds)"
            :note="historyAction.action.description"
            @click=""
          >
            <v-avatar
              v-if="historyAction.action.createdBy?.username"
              color="#d9d9d9"
              variant="flat"
              density="default"
              :border="0"
            >
              <span class="text-h6">{{
                getInitial(historyAction.action.createdBy?.username)
              }}</span>
            </v-avatar>
            <span v-else class="material-symbols-outlined mx-1" style="font-size: 30px">
              account_circle
            </span>
          </SmallPreviewItem>
        </SmallPreviewList>
        <div v-else>
          <p class="mt-5">Užívateľ nemá žiadne úkony</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { formatTimestamp, getInitial, translateActionState } from '@/utils'

const props = defineProps<{
  employee?: any
}>()

const appStore = useAppStore()
const { buildingActions, isLoadingBuildingActions } = storeToRefs(appStore)

const serviceTypes = computed(
  () => new Set(props.employee.services.map((service: any) => service.type))
)
const userActions = computed(() =>
  buildingActions.value.filter((action: any) => action.action.createdBy?.id === props.employee.id)
)
console.log(userActions.value)
</script>
