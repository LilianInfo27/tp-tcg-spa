import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Card, Deck, DeckPayload } from '@/types'

export const useDeckStore = defineStore('deck', () => {
  const api = useApi()

  const decks = ref<Deck[]>([])
  const cards = ref<Card[]>([])
  const currentDeck = ref<Deck | null>(null)
  const loadingDecks = ref(false)
  const loadingCards = ref(false)
  const loadingCurrentDeck = ref(false)

  const upsertDeck = (deck: Deck) => {
    const index = decks.value.findIndex((item) => item.id === deck.id)

    if (index === -1) {
      decks.value.unshift(deck)
      return
    }

    decks.value[index] = deck
  }

  const fetchDecks = async () => {
    loadingDecks.value = true

    try {
      decks.value = await api.getMyDecks()
      return decks.value
    } finally {
      loadingDecks.value = false
    }
  }

  const fetchCards = async (force = false) => {
    if (cards.value.length > 0 && !force) {
      return cards.value
    }

    loadingCards.value = true

    try {
      const allCards = await api.getCards()
      cards.value = allCards
        .filter((card) => card.pokedexNumber >= 1 && card.pokedexNumber <= 151)
        .sort((a, b) => a.pokedexNumber - b.pokedexNumber)
      return cards.value
    } finally {
      loadingCards.value = false
    }
  }

  const fetchDeck = async (id: number) => {
    loadingCurrentDeck.value = true

    try {
      const deck = await api.getDeck(id)
      currentDeck.value = deck
      upsertDeck(deck)
      return deck
    } finally {
      loadingCurrentDeck.value = false
    }
  }

  const createDeck = async (payload: DeckPayload) => {
    const deck = await api.createDeck(payload)
    upsertDeck(deck)
    return deck
  }

  const updateDeck = async (id: number, payload: DeckPayload) => {
    const deck = await api.updateDeck(id, payload)
    currentDeck.value = deck
    upsertDeck(deck)
    return deck
  }

  const deleteDeck = async (id: number) => {
    await api.deleteDeck(id)
    decks.value = decks.value.filter((deck) => deck.id !== id)

    if (currentDeck.value?.id === id) {
      currentDeck.value = null
    }
  }

  const resetCurrentDeck = () => {
    currentDeck.value = null
  }

  return {
    cards,
    currentDeck,
    decks,
    loadingCards,
    loadingCurrentDeck,
    loadingDecks,
    createDeck,
    deleteDeck,
    fetchCards,
    fetchDeck,
    fetchDecks,
    resetCurrentDeck,
    updateDeck,
  }
})
