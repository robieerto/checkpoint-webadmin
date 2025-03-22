<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="start">
        <img src="@/assets/order-logo.png" style="width: 38px" />
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-col class="py-1 pl-1">
            <v-list-item-title class="text-h6">{{ texts?.title }}</v-list-item-title>
            <div class="d-flex justify-space-between align-center">
              <v-list-item-subtitle class="my-1">{{
                formatTimestamp(extUserAction?.dateTime.seconds)
              }}</v-list-item-subtitle>
              <v-chip variant="flat" rounded="lg" color="primary" class="mr-1">{{
                extUserAction?.checkpoint?.name
              }}</v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-1">
        <h3>{{ $t('reservation') }}</h3>
        <div>
          <p class="mt-1">
            {{ reservationText }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="extUserAction?.note">
      <v-col cols="6" class="py-1">
        <h3>{{ $t('note') }}</h3>
        <div>
          <p class="mt-1">
            {{ extUserAction?.note }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="extUserAction?.phone">
      <v-col cols="6" class="py-1">
        <h3>{{ $t('phone') }}</h3>
        <div>
          <p class="mt-1">
            {{ extUserAction?.phone }}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  extUserAction?: any
}>()

const { locale } = useI18n()
const texts = computed(() => props.extUserAction?.template?.appTexts?.[locale.value])
const reservationText = computed(() => {
  let text = texts.value?.text
  props.extUserAction?.inputs?.forEach((input: string, index: number) => {
    text = text.replace(`$${index + 1}`, input ?? '')
  })
  return text
})
</script>
