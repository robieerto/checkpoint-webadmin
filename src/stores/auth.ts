import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const setUser = (newUser: any) => {
    user.value = newUser
  }

  return { user, setUser }
})
