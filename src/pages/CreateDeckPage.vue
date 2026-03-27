<template>
  <DeckForm
    title="Créer un deck"
    submit-label="Créer le deck"
    :cards="deckStore.cards"
    :loading="deckStore.loadingCards"
    :submitting="submitting"
    @submit="handleCreateDeck"
  />
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DeckForm from '@/components/DeckForm.component.vue'
import { ROUTES } from '@/router'
import { useDeckStore } from '@/stores/deck.store'
import type { DeckPayload } from '@/types'

const deckStore = useDeckStore()
const router = useRouter()
const message = useMessage()
const submitting = ref(false)

const loadCards = async () => {
  try {
    const cards = await deckStore.fetchCards(true)
    deckStore.resetCurrentDeck()

    if (cards.length === 0) {
      message.warning(
        'Aucune carte reçue par l’API. Lancez un reseed backend avec npm run api:reset.',
      )
    }
  } catch (error) {
    message.error(
      error instanceof Error
        ? error.message
        : 'Impossible de charger les cartes.',
    )
  }
}

const handleCreateDeck = async (payload: DeckPayload) => {
  submitting.value = true

  try {
    await deckStore.createDeck(payload)
    message.success('Deck créé.')
    await router.push(ROUTES.HOME)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session expirée')) {
      message.error(error.message)
      await router.push(ROUTES.SIGN_IN)
    } else {
      message.error(
        error instanceof Error ? error.message : 'Impossible de créer le deck.',
      )
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  void loadCards()
})
</script>
