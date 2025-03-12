<template>
  <v-container class="py-0">
    <v-row>
      <v-col style="max-width: 50px" class="pl-0 py-3" align-self="start">
        <img src="@/assets/review-logo.png" style="width: 38px" />
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-col class="py-1 pl-1">
            <v-list-item-title class="text-h6">{{ $t('review') }}</v-list-item-title>
            <v-rating v-model="extUserAction.score" density="compact" readonly></v-rating>
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
    <v-row v-if="extUserAction?.note">
      <v-col cols="6" class="py-1">
        <h3>{{ $t('description') }}</h3>
        <div>
          <p class="mt-1">
            {{ extUserAction?.note }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="extUserAction?.questionnaire">
      <v-col cols="6" class="py-1">
        <h3 class="pb-1">{{ $t('questionnaire') }}</h3>
        <div v-for="(question, index) in extUserAction?.questionnaire" class="py-2" :key="index">
          <h3 v-if="question?.answers?.length" class="font-weight-bold">
            {{ question?.question }}
          </h3>
          <ul class="ml-4">
            <li v-for="(answer, index) in question?.answers" :key="index" class="mt-1">
              <h3>
                {{ answer.choice }}{{ answer.input ? ':' : '' }} <i>{{ answer.input }}</i>
              </h3>
            </li>
            <li v-if="question.otherInput" class="mt-1">
              <h3>
                {{ $t('userAnswer') }}: <i>{{ question.otherInput }}</i>
              </h3>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="extUserAction?.email">
      <v-col cols="6" class="py-1">
        <h3>{{ $t('email') }}</h3>
        <div>
          <p class="mt-1">
            {{ extUserAction?.email }}
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
