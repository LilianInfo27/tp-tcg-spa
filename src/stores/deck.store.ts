import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

export const useDeckStore = defineStore('deck', () => {
  const api = useApi()

  const decks = ref<Deck[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMyDecks = async () => {
    loading.value = true
    error.value = null
    try {
      decks.value = await api.getMyDecks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  return { decks, loading, error, fetchMyDecks }
})
