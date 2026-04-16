<template>
  <NCard :title="deck.name" size="small">
    <div class="thumbnails">
      <img
        v-for="deckCard in deck.cards"
        :key="deckCard.cardId"
        :src="cardsById.get(deckCard.cardId)?.imgUrl"
        :alt="cardsById.get(deckCard.cardId)?.name"
        class="thumbnail"
      />
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useCardStore } from '@/stores/card.store'
import type { Deck } from '@/types'

defineProps<{ deck: Deck }>()

const cardStore = useCardStore()
const { cardsById } = storeToRefs(cardStore)
</script>

<style scoped>
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.thumbnail {
  width: 52px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
