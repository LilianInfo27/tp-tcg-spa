<template>
  <div class="container">
    <NH2>Mes decks</NH2>
    <NSpin v-if="deckStore.loading || cardStore.loading" />
    <NAlert v-else-if="deckStore.error" type="error">{{
      deckStore.error
    }}</NAlert>
    <NEmpty v-else-if="deckStore.decks.length === 0" description="Aucun deck" />
    <div v-else class="deck-list">
      <DeckListItem
        v-for="deck in deckStore.decks"
        :key="deck.id"
        :deck="deck"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import DeckListItem from '@/components/game/DeckListItem.vue'
import { useCardStore } from '@/stores/card.store'
import { useDeckStore } from '@/stores/deck.store'

const cardStore = useCardStore()
const deckStore = useDeckStore()

onMounted(async () => {
  await Promise.all([cardStore.fetchCards(), deckStore.fetchMyDecks()])
})
</script>

<style scoped>
.container {
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
}

.deck-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
