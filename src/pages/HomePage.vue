<template>
  <main class="home-page">
    <DeckList
      :decks="deckStore.decks"
      :loading="deckStore.loadingDecks"
      @delete="handleDeleteDeck"
    />
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted } from 'vue'

import DeckList from '@/components/DeckList.component.vue'
import { useDeckStore } from '@/stores/deck.store'

const deckStore = useDeckStore()
const message = useMessage()

const loadDecks = async () => {
  try {
    await deckStore.fetchDecks()
  } catch (error) {
    message.error(
      error instanceof Error
        ? error.message
        : 'Impossible de charger les decks.',
    )
  }
}

const handleDeleteDeck = async (id: number) => {
  try {
    await deckStore.deleteDeck(id)
    await deckStore.fetchDecks()
    message.success('Deck supprimé.')
  } catch (error) {
    message.error(
      error instanceof Error
        ? error.message
        : 'Impossible de supprimer le deck.',
    )
  }
}

onMounted(() => {
  void loadDecks()
})
</script>

<style scoped>
.home-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}
</style>
