<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="start">
        <v-img src="@/assets/order-logo.png" width="45"></v-img>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-col class="py-1 pl-1">
            <v-list-item-title class="text-h6">{{ $t('tomorrowBreakfast') }}</v-list-item-title>
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
        <h3>{{ $t('guestWants') }}</h3>
        <div>
          <p class="mt-1">
            {{ extUserAction?.inputs?.[0] }}x {{ $t('breakfastOn') }}
            {{ extUserAction?.inputs?.[1] }}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { formatTimestamp } from '@/utils'

defineProps<{
  extUserAction?: any
}>()
</script>
