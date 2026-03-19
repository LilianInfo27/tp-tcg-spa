import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignInPayload, SignUpPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const { get, set } = useStorage()
  const useAPI = useApi()
  const token = ref(get<string>('token'))
  const user = ref(get<User>('user'))

  const isAuthenticated = computed((): boolean => {
    return token.value && user.value ? true : false
  })

  const signUp = async (payload: SignUpPayload) => {
    const response = await useAPI.signUp(payload)
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
  }

  const signIn = async (payload: SignInPayload) => {
    const response = await useAPI.signIn(payload)
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
  }

  const signOut = () => {
    set('token', null)
    set('user', null)
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, signUp, signIn, signOut }
})
