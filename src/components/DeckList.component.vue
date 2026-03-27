<template>
  <section class="deck-list">
    <div class="deck-list__header">
      <div>
        <p class="deck-list__eyebrow">Accueil</p>
        <h1>Mes decks</h1>
      </div>
      <NButton type="primary" @click="router.push(ROUTES.CREATE_DECK)">
        Nouveau deck
      </NButton>
    </div>

    <NSpin :show="loading">
      <div v-if="decks.length > 0" class="deck-list__grid">
        <NCard
          v-for="deck in decks"
          :key="deck.id"
          class="deck-list__card"
          :bordered="false"
        >
          <div class="deck-list__card-content">
            <div>
              <h2>{{ deck.name }}</h2>
              <p>{{ deck.cards.length }} cartes</p>
            </div>

            <div class="deck-list__preview" aria-hidden="true">
              <img
                v-for="deckCard in deck.cards.slice(0, 4)"
                :key="deckCard.id"
                :src="deckCard.card.imgUrl"
                :alt="deckCard.card.name"
              />
            </div>

            <div class="deck-list__actions">
              <NButton
                secondary
                @click="router.push(getDeckDetailPath(deck.id))"
              >
                Voir le détail
              </NButton>
              <NButton
                quaternary
                @click="router.push(getDeckUpdatePath(deck.id))"
              >
                Modifier
              </NButton>
              <NButton
                quaternary
                type="error"
                @click="handleDelete(deck.id, deck.name)"
              >
                Supprimer
              </NButton>
            </div>
          </div>
        </NCard>
      </div>

      <NEmpty
        v-else
        description="Aucun deck pour le moment. Créez votre premier deck."
      />
    </NSpin>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { getDeckDetailPath, getDeckUpdatePath, ROUTES } from '@/router'
import type { Deck } from '@/types'

defineProps<{
  decks: Deck[]
  loading?: boolean
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

const router = useRouter()

const handleDelete = (id: number, name: string) => {
  const confirmed = window.confirm(`Supprimer le deck "${name}" ?`)

  if (!confirmed) {
    return
  }

  emit('delete', id)
}
</script>

<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.deck-list__header {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
}

.deck-list__eyebrow {
  margin: 0 0 0.2rem;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.deck-list__header h1 {
  margin: 0;
  color: #172033;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
}

.deck-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.deck-list__card {
  border-radius: 24px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(244, 247, 250, 0.95)
    ),
    linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(249, 115, 22, 0.08));
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
}

.deck-list__card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deck-list__card-content h2 {
  margin: 0;
  color: #172033;
  font-size: 1.2rem;
}

.deck-list__card-content p {
  margin: 0.3rem 0 0;
  color: #52607a;
}

.deck-list__preview {
  display: flex;
  gap: 0.6rem;
}

.deck-list__preview img {
  width: 54px;
  height: 54px;
  border: 2px solid #fff;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.deck-list__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

@media (max-width: 640px) {
  .deck-list__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
