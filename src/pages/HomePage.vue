<template>
  <div class="game-page">
    <NH2 style="margin-bottom: 24px">Jouer</NH2>

    <div class="game-layout">
      <!-- Panneau de gauche : créer une partie -->
      <NCard title="Créer une partie" class="panel">
        <NSpace vertical>
          <NFormItem label="Choisir un deck">
            <NSelect
              v-model:value="selectedDeckId"
              :options="deckOptions"
              :loading="loadingDecks"
              placeholder="Sélectionner un deck"
            />
          </NFormItem>
          <NButton
            type="primary"
            block
            :disabled="!selectedDeckId"
            :loading="creatingGame"
            @click="handleCreateGame"
          >
            Créer une partie
          </NButton>
          <RouterLink to="/decks/create" class="create-deck-link">
            <NButton block secondary>Créer un nouveau deck</NButton>
          </RouterLink>
        </NSpace>
      </NCard>

      <!-- Panneau de droite : parties disponibles -->
      <NCard title="Parties disponibles" class="panel">
        <NSpin :show="loadingGames">
          <NEmpty
            v-if="!loadingGames && availableGames.length === 0"
            description="Aucune partie disponible"
          />
          <NList v-else>
            <NListItem v-for="game in availableGames" :key="game.id">
              <NSpace justify="space-between" align="center">
                <NText>Partie de {{ game.hostName }}</NText>
                <NButton
                  size="small"
                  type="primary"
                  :disabled="!selectedDeckId"
                  @click="handleJoinGame(game.id)"
                >
                  Rejoindre
                </NButton>
              </NSpace>
            </NListItem>
          </NList>
        </NSpin>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

interface AvailableGame {
  id: string
  hostName: string
}

const api = useApi()
const message = useMessage()

const decks = ref<Deck[]>([])
const loadingDecks = ref(false)
const selectedDeckId = ref<number | null>(null)
const creatingGame = ref(false)

const availableGames = ref<AvailableGame[]>([])
const loadingGames = ref(false)

const deckOptions = computed(() =>
  decks.value.map((d) => ({ label: d.name, value: d.id })),
)

const fetchDecks = async () => {
  loadingDecks.value = true
  try {
    decks.value = await api.getMyDecks()
    if (decks.value.length === 1) {
      selectedDeckId.value = decks.value[0].id
    }
  } catch (err) {
    message.error((err as Error).message ?? 'Erreur lors du chargement')
  } finally {
    loadingDecks.value = false
  }
}

const handleCreateGame = () => {
  if (!selectedDeckId.value) return
  creatingGame.value = true
  message.info('Création de partie via socket.io à venir')
  creatingGame.value = false
}

const handleJoinGame = (gameId: string) => {
  if (!selectedDeckId.value) return
  message.info(`Rejoindre la partie ${gameId} via socket.io à venir`)
}

onMounted(fetchDecks)
</script>

<style scoped>
.game-page {
  max-width: 1200px;
  margin: 0 auto;
}

.game-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .game-layout {
    grid-template-columns: 320px 1fr;
  }
}

.panel {
  height: fit-content;
}

.create-deck-link {
  text-decoration: none;
}
</style>
