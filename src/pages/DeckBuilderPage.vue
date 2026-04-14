<template>
  <div class="container">
    <NCard title="Créer un deck">
      <NSpace vertical size="large">
        <NInput
          v-model:value="search"
          clearable
          placeholder="Rechercher une carte par nom..."
        />

        <NSpace justify="space-between" align="center">
          <NTag type="info"
            >{{ filteredCards.length }} carte(s) affichée(s)</NTag
          >
          <NTag type="success"
            >{{ selectedCardIds.length }} carte(s) sélectionnée(s)</NTag
          >
        </NSpace>

        <NSpin :show="isLoading">
          <NAlert v-if="error" type="error" :title="error" />

          <NEmpty
            v-else-if="!isLoading && filteredCards.length === 0"
            description="Aucune carte ne correspond à la recherche"
          />

          <NGrid
            v-else
            cols="1 s:2 m:3 l:4"
            responsive="screen"
            :x-gap="12"
            :y-gap="12"
          >
            <NGridItem v-for="card in filteredCards" :key="card.id">
              <NCard
                hoverable
                :class="{ 'card--selected': isSelected(card.id) }"
                @click="toggleCardSelection(card.id)"
              >
                <template #header>
                  <NSpace justify="space-between" align="center">
                    <span class="card-title">{{ card.name }}</span>
                    <NTag
                      size="small"
                      :type="isSelected(card.id) ? 'success' : 'default'"
                    >
                      {{ isSelected(card.id) ? 'Selectionnee' : 'Choisir' }}
                    </NTag>
                  </NSpace>
                </template>

                <img :src="card.imgUrl" :alt="card.name" class="card-image" />

                <NSpace size="small" wrap>
                  <NTag size="small">Type: {{ card.type }}</NTag>
                  <NTag size="small">HP: {{ card.hp }}</NTag>
                  <NTag size="small">ATK: {{ card.attack }}</NTag>
                </NSpace>
              </NCard>
            </NGridItem>
          </NGrid>
        </NSpin>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import type { Card } from '../types/index.js'

const api = useApi()

const cards = ref<Card[]>([])
const search = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedCardIds = ref<number[]>([])

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const filteredCards = computed(() => {
  if (!normalizedSearch.value) {
    return cards.value
  }

  return cards.value.filter((card) =>
    card.name.toLowerCase().includes(normalizedSearch.value),
  )
})

const isSelected = (cardId: number): boolean =>
  selectedCardIds.value.includes(cardId)

const toggleCardSelection = (cardId: number) => {
  if (isSelected(cardId)) {
    selectedCardIds.value = selectedCardIds.value.filter((id) => id !== cardId)
    return
  }

  selectedCardIds.value = [...selectedCardIds.value, cardId]
}

const fetchCards = async () => {
  isLoading.value = true
  error.value = null

  try {
    cards.value = await api.getCards()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Erreur lors du chargement des cartes'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCards)
</script>

<style scoped>
.container {
  padding: 16px 0;
}

.card-title {
  font-weight: 600;
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 12px;
}

.card--selected {
  border: 2px solid #18a058;
}
</style>
