<template>
  <DeckForm
    v-if="deckStore.currentDeck"
    title="Modifier le deck"
    submit-label="Enregistrer"
    :cards="deckStore.cards"
    :initial-name="deckStore.currentDeck.name"
    :initial-selected-ids="selectedCardIds"
    :loading="deckStore.loadingCards || deckStore.loadingCurrentDeck"
    :submitting="submitting"
    @submit="handleUpdateDeck"
  />

  <main v-else class="update-page">
    <NSpin :show="deckStore.loadingCurrentDeck">
      <NEmpty description="Deck introuvable." />
    </NSpin>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DeckForm from '@/components/DeckForm.component.vue'
import { getDeckDetailPath, ROUTES } from '@/router'
import { useDeckStore } from '@/stores/deck.store'
import type { DeckPayload } from '@/types'

const deckStore = useDeckStore()
const route = useRoute()
const router = useRouter()
const message = useMessage()
const submitting = ref(false)

const deckId = computed(() => Number(route.params.id))
const selectedCardIds = computed(
  () => deckStore.currentDeck?.cards.map((deckCard) => deckCard.cardId) ?? [],
)

const loadPage = async () => {
  if (!Number.isFinite(deckId.value)) {
    await router.push(ROUTES.HOME)
    return
  }

  try {
    await Promise.all([
      deckStore.fetchCards(),
      deckStore.fetchDeck(deckId.value),
    ])
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Impossible de charger le deck.',
    )
  }
}

const handleUpdateDeck = async (payload: DeckPayload) => {
  submitting.value = true

  try {
    await deckStore.updateDeck(deckId.value, payload)
    message.success('Deck mis à jour.')
    await router.push(getDeckDetailPath(deckId.value))
  } catch (error) {
    message.error(
      error instanceof Error
        ? error.message
        : 'Impossible de mettre à jour le deck.',
    )
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  void loadPage()
})
</script>

<style scoped>
.update-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}
</style>
