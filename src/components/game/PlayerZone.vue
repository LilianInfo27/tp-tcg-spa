<template>
  <NCard class="zone-card" :title="title">
    <NSpace vertical :size="14">
      <NSpace justify="space-between" align="center">
        <NText strong>{{ board.username }}</NText>
        <NTag type="info">KOs: {{ board.score }}/3</NTag>
      </NSpace>

      <NCard v-if="board.activeCard" size="small">
        <NSpace justify="space-between" align="center">
          <NText strong>{{ board.activeCard.card.name }}</NText>
          <NText depth="3"
            >HP {{ board.activeCard.currentHp }}/{{
              board.activeCard.card.hp
            }}</NText
          >
        </NSpace>
        <NProgress
          type="line"
          :show-indicator="false"
          :percentage="hpPercentage"
          status="success"
          style="margin-top: 8px"
        />
      </NCard>

      <NEmpty v-else description="Aucune carte active" />

      <slot />
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { GameBoardState } from '@/types'

const props = defineProps<{
  title: string
  board: GameBoardState
}>()

const hpPercentage = computed(() => {
  if (!props.board.activeCard) {
    return 0
  }

  const { currentHp, card } = props.board.activeCard
  return Math.max(0, Math.round((currentHp / card.hp) * 100))
})
</script>

<style scoped>
.zone-card {
  width: min(100%, 960px);
  margin: 0 auto;
}
</style>
