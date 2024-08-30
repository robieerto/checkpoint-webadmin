<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height" align="center">
      <v-col>
        <v-card class="mx-auto px-6 pt-6 pb-8" max-width="344">
          <div class="d-flex justify-center pb-5">
            <h5 class="text-h5 font-weight-bold">
              Checkpoint <span class="text-primary">Admin</span>
            </h5>
          </div>
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="email"
              :readonly="loading"
              :rules="[required]"
              class="mb-2"
              label="Email"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :readonly="loading"
              :rules="[required]"
              label="Heslo"
              placeholder="Zadajte vaše heslo"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePasswordVisibility"
            ></v-text-field>

            <br />

            <v-btn
              :disabled="!form"
              :loading="loading"
              color="primary"
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

    <v-snackbar v-model="snackbar" :timeout="3000" color="error">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>
<route lang="yaml">
meta:
  layout: empty
</route>

<script setup lang="ts">
definePage({
  meta: {},
})

import router from '@/router'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'

const auth = useFirebaseAuth()!

const form = ref(false)
const email = ref<string | null>(null)
const password = ref<string | null>(null)
const loading = ref(false)
const showPassword = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')

const required = (value: string) => !!value || 'Povinné'

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onSubmit = async () => {
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value!, password.value!)
    router.push('/')
  } catch (error) {
    snackbarMessage.value = 'Nesprávne prihlasovacie údaje'
    snackbar.value = true
  }
  loading.value = false
}
</script>

<style scoped>
:deep(.v-icon--size-default) {
  margin-left: 12px;
}
</style>
