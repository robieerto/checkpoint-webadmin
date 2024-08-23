<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" align="center">
      <v-col>
        <v-card class="mx-auto px-6 py-8" max-width="344">
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="email"
              :readonly="loading"
              :rules="[required]"
              class="mb-2"
              label="Prihlasovacie meno"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="password"
              :readonly="loading"
              :rules="[required]"
              label="Heslo"
              placeholder="Zadajte vaše heslo"
              clearable
            ></v-text-field>

            <br />

            <v-btn
              :disabled="!form"
              :loading="loading"
              color="success"
              size="large"
              type="submit"
              variant="elevated"
              block
            >
              Prihlásiť sa
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<route lang="yaml">
meta:
  layout: blank
</route>

<script setup lang="ts">
definePage({
  meta: {},
})

import { ref } from 'vue'

const form = ref(false)
const email = ref<string | null>(null)
const password = ref<string | null>(null)
const loading = ref(false)

const required = (value: string) => !!value || 'Required.'

const onSubmit = () => {
  loading.value = true
  // Simulate an API call
  setTimeout(() => {
    loading.value = false
    alert(`Email: ${email.value}, Password: ${password.value}`)
  }, 1000)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
