<template>
  <div class="card-grid">
    <ShowCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :size="size"
      :selectable="selectable"
      :selected="selectedIds.includes(card.id)"
      :disabled="isDisabled(card.id)"
      :current-hp="currentHpByCardId[card.id]"
      @select="toggleCard"
    />
  </div>
</template>

<script setup lang="ts">
import ShowCard from '@/components/ShowCard.component.vue'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    size?: 'sm' | 'md'
    selectable?: boolean
    selectedIds?: number[]
    maxSelected?: number
    currentHpByCardId?: Record<number, number>
  }>(),
  {
    size: 'sm',
    selectable: false,
    selectedIds: () => [],
    maxSelected: 0,
    currentHpByCardId: () => ({}),
  },
)

const emit = defineEmits<{
  'update:selectedIds': [cardIds: number[]]
}>()

const isDisabled = (cardId: number) => {
  if (!props.selectable || props.maxSelected <= 0) {
    return false
  }

  const hasReachedMaximum = props.selectedIds.length >= props.maxSelected
  return hasReachedMaximum && !props.selectedIds.includes(cardId)
}

const toggleCard = (cardId: number) => {
  if (!props.selectable || isDisabled(cardId)) {
    return
  }

  if (props.selectedIds.includes(cardId)) {
    emit(
      'update:selectedIds',
      props.selectedIds.filter((selectedCardId) => selectedCardId !== cardId),
    )
    return
  }

  emit('update:selectedIds', [...props.selectedIds, cardId])
}
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 960px) {
  .card-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
