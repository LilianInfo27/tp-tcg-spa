<template>
  <NCard title="Lobby" class="lobby-card">
    <NSpace vertical :size="16">
      <NAlert
        v-if="gameStore.errorMessage"
        type="error"
        closable
        @close="gameStore.clearError"
      >
        {{ gameStore.errorMessage }}
      </NAlert>

      <NText depth="3">
        Selectionnez un deck puis creez une room ou rejoignez-en une existante.
      </NText>

      <NSpace align="end" wrap>
        <NSelect
          v-model:value="selectedDeckId"
          class="deck-select"
          :options="deckOptions"
          placeholder="Choisir un deck"
        />
        <NButton
          type="primary"
          :disabled="!selectedDeckId"
          @click="handleCreateRoom"
        >
          Creer une room
        </NButton>
        <NButton tertiary @click="gameStore.fetchRooms">Rafraichir</NButton>
      </NSpace>

      <NDivider />

      <NText strong>Rooms disponibles</NText>

      <NEmpty
        v-if="gameStore.rooms.length === 0"
        description="Aucune room en attente"
      />

      <NList v-else bordered>
        <NListItem v-for="room in gameStore.rooms" :key="room.roomId">
          <NSpace justify="space-between" align="center" style="width: 100%">
            <NSpace vertical :size="4">
              <NText strong>Room #{{ room.roomId }}</NText>
              <NText depth="3">Hote: {{ room.player1Username }}</NText>
            </NSpace>
            <NButton
              size="small"
              :disabled="!selectedDeckId"
              @click="handleJoinRoom(room.roomId)"
            >
              Rejoindre
            </NButton>
          </NSpace>
        </NListItem>
      </NList>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/stores/game.store'

interface DeckOption {
  label: string
  value: number
}

const gameStore = useGameStore()
const api = useApi()
const message = useMessage()

const selectedDeckId = ref<number | null>(null)
const decks = ref<{ id: number; name: string }[]>([])
let roomsRefreshInterval: ReturnType<typeof setInterval> | null = null

// On transforme les decks chargés en options pour le select
const deckOptions = computed<DeckOption[]>(() => {
  return decks.value.map((deck) => ({
    label: `${deck.name} (#${deck.id})`,
    value: deck.id,
  }))
})

const loadDecks = async () => {
  try {
    const response = await api.getMyDecks()
    decks.value = response.map((deck) => ({ id: deck.id, name: deck.name }))
  } catch {
    message.error('Impossible de charger vos decks.')
  }
}

const handleCreateRoom = () => {
  if (!selectedDeckId.value) {
    return
  }

  gameStore.createRoom(selectedDeckId.value)
}

const handleJoinRoom = (roomId: number) => {
  if (!selectedDeckId.value) {
    return
  }

  gameStore.joinRoom(roomId, selectedDeckId.value)
}

onMounted(async () => {
  await loadDecks()
  gameStore.connect()
  gameStore.fetchRooms()

  // On rafraichit la liste des rooms toutes les 5 secondes pour voir les nouvelles rooms créées
  roomsRefreshInterval = setInterval(() => {
    gameStore.fetchRooms()
  }, 5000)
})

onUnmounted(() => {
  if (roomsRefreshInterval) {
    clearInterval(roomsRefreshInterval)
  }
})
</script>

<style scoped>
.lobby-card {
  width: min(100%, 920px);
  margin: 32px auto;
}

.deck-select {
  min-width: 260px;
}
</style>
