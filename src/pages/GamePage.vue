<template>
  <div v-if="myBoard && opponentBoard" class="game-layout">
    <PlayerZone title="Zone adversaire" :board="opponentBoard" />

    <ActionBar
      :is-my-turn="gameStore.isMyTurn"
      :draw-disabled="drawDisabled"
      :attack-disabled="attackDisabled"
      :end-turn-disabled="endTurnDisabled"
      :realtime-message="gameStore.realtimeMessage"
      @draw="gameStore.drawCards"
      @attack="gameStore.attack"
      @end-turn="gameStore.endTurn"
    />

    <PlayerZone title="Votre zone" :board="myBoard">
      <PlayerHand
        :cards="myBoard.hand"
        :deck-size="myBoard.deckSize"
        :can-play-card="canPlayCard"
        @play="gameStore.playCard"
      />
    </PlayerZone>

    <GameOverModal
      :show="gameStore.isGameOver"
      :is-victory="isVictory"
      @back-lobby="gameStore.resetGame"
    />
  </div>

  <NResult
    v-else
    status="info"
    title="En attente de la partie"
    description="Retour au lobby si aucune partie active."
  >
    <template #footer>
      <NButton @click="goHome">Retour au lobby</NButton>
    </template>
  </NResult>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ActionBar from '@/components/game/ActionBar.vue'
import GameOverModal from '@/components/game/GameOverModal.vue'
import PlayerHand from '@/components/game/PlayerHand.vue'
import PlayerZone from '@/components/game/PlayerZone.vue'
import { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useGameStore } from '@/stores/game.store'

const router = useRouter()
const authStore = useAuthStore()
const gameStore = useGameStore()

const myBoard = computed(() => gameStore.myBoard)
const opponentBoard = computed(() => gameStore.opponentBoard)

// Permet de jouer une carte de la main si c'est son tour et qu'on n'a pas déjà une carte active
const canPlayCard = computed(() => {
  if (!myBoard.value) {
    return false
  }

  return gameStore.isMyTurn && !myBoard.value.activeCard
})

// On peut piocher si c'est son tour, que la main n'est pas pleine et qu'il reste des cartes dans le deck
const drawDisabled = computed(() => {
  if (!myBoard.value) {
    return true
  }

  return (
    !gameStore.isMyTurn ||
    myBoard.value.hand.length >= 5 ||
    myBoard.value.deckSize <= 0
  )
})

// On peut attaquer si c'est son tour, qu'on a une carte active et que l'adversaire en a une aussi
const attackDisabled = computed(() => {
  if (!myBoard.value || !opponentBoard.value) {
    return true
  }

  return (
    !gameStore.isMyTurn ||
    !myBoard.value.activeCard ||
    !opponentBoard.value.activeCard
  )
})

const endTurnDisabled = computed(() => !gameStore.isMyTurn)

// On peut vérifier si le joueur a gagné
const isVictory = computed(() => {
  return gameStore.gameResult?.winner?.userId === authStore.user?.id
})

const goHome = async () => {
  await router.push(ROUTES.HOME)
}

// On se connecte au socket à l'ouverture de la page et on redirige vers le lobby si aucune partie active
onMounted(() => {
  gameStore.connect()

  if (!gameStore.currentRoomId) {
    router.push(ROUTES.HOME)
  }
})
</script>

<style scoped>
.game-layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 0 30px;
}
</style>
