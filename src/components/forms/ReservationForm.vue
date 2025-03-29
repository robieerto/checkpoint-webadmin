<template>
  <Teleport to="body">
    <v-sheet class="checkpoint-form h-75 fab-form" rounded="xl" style="max-height: 800px">
      <v-card
        append-icon="$close"
        class="mx-auto h-100 d-flex flex-column"
        elevation="16"
        rounded="xl"
        :title="$t('reservation')"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="closeForm"></v-btn>
        </template>

        <div class="px-5 d-flex flex-column flex-grow-1" style="width: 450px">
          <v-row class="flex-grow-0">
            <v-col class="w-100 d-flex align-start justify-center pb-0">
              <v-select
                v-model="selectedAction"
                :items="exclusiveReservationActions"
                item-title="internalName"
                :label="$t('service')"
                return-object
              >
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="w-100 d-flex align-start justify-center">
              <div v-if="reservation?.multipleTimeTypes" class="w-100">
                <p>{{ $t('reservationTime') }}:</p>
                <v-tabs v-model="tab" align-tabs="center" fixed-tabs>
                  <v-tab
                    v-for="(_, type) in reservationTimesGroupedByType"
                    :key="type"
                    :value="type"
                    readonly
                    >{{ type }}</v-tab
                  >
                </v-tabs>

                <v-row v-if="options?.selection">
                  <v-col v-for="(typeGroup, type) in reservationTimesGroupedByType" :key="type">
                    <v-radio-group v-model="selectedOptionId" color="#705d0d" class="radio-select">
                      <v-radio
                        v-for="option in typeGroup"
                        :label="formatTimeRange(option.id)"
                        :value="option.id"
                        :key="option.id"
                        :disabled="isOptionDisabled(option.id)"
                        @click="() => (tab = type)"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </div>

              <div v-else class="w-100">
                <p class="pb-2">{{ $t('reservationTime') }}:</p>
                <div v-if="options?.selection">
                  <v-radio-group v-model="selectedOptionId" color="#705d0d" class="radio-select">
                    <v-radio
                      v-for="(_, index) in reservationTimes"
                      :label="formatTimeRange(index)"
                      :value="index"
                      :key="index"
                      :disabled="isOptionDisabled(index)"
                    ></v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div id="bottom-bar" class="pa-4 text-end mt-auto">
          <v-btn
            class="secondary-btn mr-2"
            color="brown"
            min-width="92"
            variant="text"
            rounded
            @click="closeForm"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            :loading="sending"
            :disabled="!selectedAction"
            color="brown"
            min-width="92"
            variant="flat"
            rounded
            @click="saveForm"
          >
            {{ $t('save') }}
          </v-btn>
        </div>
      </v-card>
    </v-sheet>
    >
  </Teleport>
</template>

<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'
import { db, functions } from '@/firebase'
import { httpsCallable } from 'firebase/functions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  close: []
}>()

const { selectedBuilding, snackbar } = storeToRefs(useAppStore())

const feedbackActionsPath = `Buildings/${selectedBuilding.value?.id}/externalFeedbackActions`
const exclusiveReservationActions = useCollection(
  query(collection(db, feedbackActionsPath), where('reservation.exclusive', '==', true))
)

const sending = ref(false)
const tab = ref(null as any)
const selectedAction = ref(null as any)
const selectedOptionId = ref(null as number | null)

const options = computed(() => selectedAction.value?.options)
const reservation = computed(() => selectedAction.value?.reservation)
const reservationTimes = computed(() => reservation.value?.times)

const reservationDate = computed(() => {
  const date = new Date()
  if (reservation.value?.type === 'tomorrow') {
    date.setDate(date.getDate() + 1)
  }
  return date.toLocaleDateString('sk-SK').replace(/\s/g, '')
})

const reservationTimesGroupedByType = computed(() =>
  reservationTimes.value?.reduce(
    (acc: any, time: any, id: any) => {
      if (!acc[time.type]) {
        acc[time.type] = []
      }
      acc[time.type].push({ ...time, id })
      return acc
    },
    {} as Record<string, any[]>
  )
)

const formatTimeRange = (index: number) => {
  const time = reservationTimes.value?.[index]
  return time?.start + (time?.end ? ` - ${time.end}` : '')
}

const isOptionReserved = (index: number) =>
  reservationTimes.value?.[index]?.dateReserved === reservationDate.value

const isOptionAfterStartTime = (index: number) => {
  const optionStartTime = reservationTimes.value?.[index]?.start
  if (optionStartTime && reservation.value?.type === 'today') {
    const hoursInAdvance = reservation.value?.hoursInAdvance ?? 0
    const currentDatePlusAdvance = new Date()
    currentDatePlusAdvance.setHours(currentDatePlusAdvance.getHours() + hoursInAdvance)
    const currentTimePlusAdvance = currentDatePlusAdvance.getTime()
    const [hours, minutes] = optionStartTime.split(':')
    const optionDate = new Date()
    optionDate.setHours(Number(hours))
    optionDate.setMinutes(Number(minutes))
    const optionTime = optionDate.getTime()
    return currentTimePlusAdvance + hoursInAdvance > optionTime
  } else {
    return false
  }
}

const isOptionDisabled = (index: number) => {
  return isOptionReserved(index) || isOptionAfterStartTime(index)
}

const createReservation = httpsCallable(functions, 'createReservation')

const saveForm = () => {
  sending.value = true
  createReservation({
    extActionPath: `${feedbackActionsPath}/${selectedAction.value?.id}`,
    selectedOption: selectedOptionId.value,
  })
    .then(() => {
      snackbar.value = { value: true, text: t('reservationWasCreated'), color: 'success' }
      closeForm()
    })
    .catch((error) => {
      const errorMessage = `${error.code}, ${error.message}, ${error.details}`
      console.log(errorMessage)
      snackbar.value = { value: true, text: errorMessage, color: 'error' }
      error.value = true
    })
    .finally(() => {
      sending.value = false
    })
}

const closeForm = () => {
  emit('close')
}
</script>

<style scoped>
.v-list {
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.v-list-item {
  background-color: rgb(var(--v-theme-background)) !important;
}

#bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
