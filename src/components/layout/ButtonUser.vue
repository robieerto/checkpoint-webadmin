<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

const auth = useFirebaseAuth()!

const user = useCurrentUser()

const router = useRouter()

const logOut = () => {
  signOut(auth)
  router.push('/login')
}
</script>
<template>
  <v-btn size="large" class="mx-10">
    <v-icon class="mr-3">mdi-account</v-icon>
    {{ user?.displayName }}
    <v-menu activator="parent">
      <v-list class="py-0">
        <v-list-item prepend-icon="mdi-logout" @click="logOut">
          <v-list-item-title link>Odhlásiť sa</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>
