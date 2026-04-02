<template>
  <NSpace vertical :size="12" class="hand-container">
    <NSpace justify="space-between" align="center">
      <NText strong>Main ({{ cards.length }}/5)</NText>
      <NText depth="3">Deck restant: {{ deckSize }}</NText>
    </NSpace>

    <NEmpty v-if="cards.length === 0" description="Aucune carte en main" />

    <NGrid v-else :x-gap="12" :y-gap="12" :cols="5" responsive="screen">
      <NGi v-for="(card, index) in cards" :key="`${card.id}-${index}`">
        <NCard
          size="small"
          class="hand-card"
          :class="{ clickable: canPlayCard }"
          @click="onCardClick(index)"
        >
          <NSpace vertical :size="4">
            <NText strong>{{ card.name }}</NText>
            <NText depth="3">HP {{ card.hp }} | ATK {{ card.attack }}</NText>
            <NTag size="small">{{ card.type }}</NTag>
          </NSpace>
        </NCard>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import type { Card } from '@/types'

const props = defineProps<{
  cards: Card[]
  deckSize: number
  canPlayCard: boolean
}>()

const emit = defineEmits<{
  play: [index: number]
}>()

const onCardClick = (index: number) => {
  if (!props.canPlayCard) {
    return
  }

  emit('play', index)
}
</script>

<style scoped>
.hand-container {
  width: 100%;
}

.hand-card {
  cursor: default;
  min-height: 110px;
}

.hand-card.clickable {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.hand-card.clickable:hover {
  transform: translateY(-3px);
}
</style>
