<template>
  <v-list-item :class="secondaryColor && 'secondary-color'" rounded="lg" class="mb-2">
    <v-container>
      <v-row>
        <v-col style="max-width: 50px" class="pl-0 py-3" align-self="center">
          <img :src="logo" style="width: 38px" />
        </v-col>
        <v-col>
          <v-row>
            <v-col class="py-1 pl-1 pr-0">
              <div v-if="extUserAction.type === 'occurrence'">
                <v-list-item-title class="list text-h6">{{
                  $t('guestCleaningRequest')
                }}</v-list-item-title>
                <v-list-item-subtitle class="my-1">{{
                  formatTimestamp(extUserAction?.dateTime.seconds)
                }}</v-list-item-subtitle>
                <div class="text-right">
                  <ChipState
                    class="mb-1"
                    :serviceType="extUserAction?.occurrence?.service.type"
                    :entityState="extUserAction?.occurrence?.state"
                  ></ChipState>
                  <v-chip variant="flat" rounded="lg" color="blue" class="ml-1 mb-1">
                    <img class="mr-1" src="@/assets/checkpoint-logo.png" width="15" />
                    {{ extUserAction?.checkpoint?.name }}</v-chip
                  >
                </div>
              </div>

              <div v-if="extUserAction.type === 'order'">
                <v-list-item-title class="list text-h6">{{ texts?.title }}</v-list-item-title>
                <v-list-item-subtitle class="my-1">{{ reservationText }}</v-list-item-subtitle>
                <div class="d-flex justify-space-between align-center">
                  <v-list-item-subtitle class="my-1">{{
                    formatTimestamp(extUserAction?.dateTime.seconds)
                  }}</v-list-item-subtitle>
                  <v-chip variant="flat" rounded="lg" color="blue">
                    <img class="mr-1" src="@/assets/checkpoint-logo.png" width="15" />
                    {{ extUserAction?.checkpoint?.name }}</v-chip
                  >
                </div>
              </div>

              <div v-if="extUserAction.type === 'question'">
                <v-list-item-title class="list text-h6">{{ $t('question') }}</v-list-item-title>
                <v-list-item-subtitle class="my-1">{{ extUserAction?.text }}</v-list-item-subtitle>
                <div class="d-flex justify-space-between align-center">
                  <v-list-item-subtitle class="my-1">{{
                    formatTimestamp(extUserAction?.dateTime.seconds)
                  }}</v-list-item-subtitle>
                  <v-chip variant="flat" rounded="lg" color="blue">
                    <img class="mr-1" src="@/assets/checkpoint-logo.png" width="15" />
                    {{ extUserAction?.checkpoint?.name }}</v-chip
                  >
                </div>
              </div>

              <div v-if="extUserAction.type === 'review'">
                <v-list-item-title class="list text-h6">{{ $t('review') }}</v-list-item-title>
                <v-rating v-model="extUserAction.score" density="compact" readonly></v-rating>
                <div class="d-flex justify-space-between align-center">
                  <v-list-item-subtitle class="my-1">{{
                    formatTimestamp(extUserAction?.dateTime.seconds)
                  }}</v-list-item-subtitle>
                  <v-chip variant="flat" rounded="lg" color="blue">
                    <img class="mr-1" src="@/assets/checkpoint-logo.png" width="15" />
                    {{ extUserAction?.checkpoint?.name }}</v-chip
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-list-item>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'
import { useI18n } from 'vue-i18n'

import OccurrenceLogo from '@/assets/occurrence-logo.png'
import OrderLogo from '@/assets/order-logo.png'
import QuestionLogo from '@/assets/question-logo.png'
import ReviewLogo from '@/assets/review-logo.png'

const props = defineProps<{
  extUserAction?: any
  secondaryColor?: boolean
}>()

const { locale } = useI18n()
const texts = computed(() => props.extUserAction?.template?.appTexts?.[locale.value])
const reservationText = computed(() => {
  let text = texts.value?.text ?? ''
  props.extUserAction?.inputs?.forEach((input: string, index: number) => {
    text = text.replace(`$${index + 1}`, input ?? '')
  })
  return text
})

const logo = computed(() => {
  if (props.extUserAction.type === 'occurrence') {
    return OccurrenceLogo
  } else if (props.extUserAction.type === 'order') {
    return OrderLogo
  } else if (props.extUserAction.type === 'question') {
    return QuestionLogo
  } else if (props.extUserAction.type === 'review') {
    return ReviewLogo
  }
})
</script>

<style scoped>
:deep(.v-list-item__overlay) {
  background: none !important;
}

.v-list-item.secondary-color {
  background-color: rgb(var(--v-theme-background)) !important;
}

.v-chip {
  max-width: 135px;
}
</style>
