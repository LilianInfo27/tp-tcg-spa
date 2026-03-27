<template>
  <main class="deck-detail-page">
    <NSpin :show="deckStore.loadingCurrentDeck">
      <section v-if="deckStore.currentDeck" class="deck-detail-page__content">
        <div class="deck-detail-page__header">
          <div>
            <p class="deck-detail-page__eyebrow">Détail du deck</p>
            <h1>{{ deckStore.currentDeck.name }}</h1>
            <p>{{ readonlyCards.length }} cartes en lecture seule</p>
          </div>

          <div class="deck-detail-page__actions">
            <NButton quaternary @click="router.push(ROUTES.HOME)">
              Retour à l'accueil
            </NButton>
            <NButton
              type="primary"
              @click="router.push(getDeckUpdatePath(deckId))"
            >
              Modifier le deck
            </NButton>
          </div>
        </div>

        <NCard :bordered="false" class="deck-detail-page__card">
          <CardGrid :cards="readonlyCards" size="md" />
        </NCard>
      </section>

      <NEmpty v-else description="Deck introuvable." />
    </NSpin>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/CardGrid.component.vue'
import { getDeckUpdatePath, ROUTES } from '@/router'
import { useDeckStore } from '@/stores/deck.store'

const deckStore = useDeckStore()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const deckId = Number(route.params.id)
const readonlyCards = computed(
  () => deckStore.currentDeck?.cards.map((deckCard) => deckCard.card) ?? [],
)

const loadDeck = async () => {
  if (!Number.isFinite(deckId)) {
    await router.push(ROUTES.HOME)
    return
  }

  try {
    await deckStore.fetchDeck(deckId)
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Impossible de charger le deck.',
    )
  }
}

onMounted(() => {
  void loadDeck()
})
</script>

<style scoped>
.deck-detail-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}

.deck-detail-page__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.deck-detail-page__header {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
}

.deck-detail-page__eyebrow {
  margin: 0 0 0.2rem;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.deck-detail-page__header h1 {
  margin: 0;
  color: #172033;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
}

.deck-detail-page__header p {
  margin: 0.45rem 0 0;
  color: #52607a;
}

.deck-detail-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.deck-detail-page__card {
  border-radius: 28px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(245, 247, 250, 0.96)
    ),
    linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(249, 115, 22, 0.08));
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.08);
}

@media (max-width: 640px) {
  .deck-detail-page__header {
    flex-direction: column;
    align-items: stretch;
  }

  .deck-detail-page__actions {
    justify-content: stretch;
  }
}
</style>
