import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

export const useCardStore = defineStore('card', () => {
  const api = useApi()

  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const cardsById = computed(
    () => new Map(cards.value.map((card) => [card.id, card])),
  )

  const fetchCards = async () => {
    if (cards.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      cards.value = await api.getCards()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  return { cards, cardsById, loading, error, fetchCards }
})
