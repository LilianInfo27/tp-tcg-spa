<template>
  <div class="deck-form-page">
    <NH2 style="margin-bottom: 24px">
      {{ isEditing ? 'Modifier le deck' : 'Créer un deck' }}
    </NH2>

    <div class="form-section">
      <NFormItem label="Nom du deck" required>
        <NInput
          v-model:value="deckName"
          placeholder="Nom du deck"
          :disabled="saving"
        />
      </NFormItem>
    </div>

    <NSpace align="center" style="margin-bottom: 16px">
      <NInput
        v-model:value="search"
        placeholder="Rechercher une carte..."
        clearable
        style="max-width: 320px; width: 100%"
      />
      <NTag :type="selectedIds.length === MAX_CARDS ? 'success' : 'default'">
        {{ selectedIds.length }} / {{ MAX_CARDS }} cartes
      </NTag>
    </NSpace>

    <NSpin :show="loading">
      <NGrid responsive="screen" cols="2 s:3 m:4 l:5" :x-gap="8" :y-gap="8">
        <NGridItem v-for="card in filteredCards" :key="card.id">
          <div
            class="card-item"
            :class="{
              'card-item--selected': selectedIds.includes(card.id),
              'card-item--disabled':
                !selectedIds.includes(card.id) &&
                selectedIds.length >= MAX_CARDS,
            }"
            @click="toggleCard(card.id)"
          >
            <img :src="card.imgUrl" :alt="card.name" class="card-item__img" />
            <div class="card-item__info">
              <NText class="card-item__name" strong>{{ card.name }}</NText>
              <NSpace :size="4" style="margin-top: 2px">
                <NTag
                  size="tiny"
                  :color="{
                    color: getTypeColor(card.type),
                    textColor: '#fff',
                    borderColor: 'transparent',
                  }"
                >
                  {{ card.type }}
                </NTag>
              </NSpace>
              <NSpace :size="8" style="margin-top: 4px">
                <NText depth="3" style="font-size: 11px">
                  PV {{ card.hp }}
                </NText>
                <NText depth="3" style="font-size: 11px">
                  ATQ {{ card.attack }}
                </NText>
              </NSpace>
            </div>
            <div v-if="selectedIds.includes(card.id)" class="card-item__badge">
              ✓
            </div>
          </div>
        </NGridItem>
      </NGrid>
    </NSpin>

    <NSpace style="margin-top: 24px">
      <NButton
        type="primary"
        :loading="saving"
        :disabled="selectedIds.length !== MAX_CARDS || !deckName.trim()"
        @click="handleSave"
      >
        {{ isEditing ? 'Enregistrer les modifications' : 'Créer le deck' }}
      </NButton>
      <NButton tag="RouterLink" to="/decks">Annuler</NButton>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const MAX_CARDS = 10

const api = useApi()
const { getTypeColor } = useColors()
const message = useMessage()
const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)

const cards = ref<Card[]>([])
const loading = ref(false)
const saving = ref(false)
const deckName = ref('')
const search = ref('')
const selectedIds = ref<number[]>([])

const filteredCards = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return cards.value
  return cards.value.filter((c) => c.name.toLowerCase().includes(q))
})

const toggleCard = (id: number) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx !== -1) {
    selectedIds.value.splice(idx, 1)
  } else if (selectedIds.value.length < MAX_CARDS) {
    selectedIds.value.push(id)
  }
}

const fetchCards = async () => {
  loading.value = true
  try {
    cards.value = await api.getCards()
  } catch (err) {
    message.error((err as Error).message ?? 'Erreur lors du chargement')
  } finally {
    loading.value = false
  }
}

const fetchDeck = async (id: string) => {
  try {
    const deck = await api.getDeck(id)
    deckName.value = deck.name
    selectedIds.value = deck.cards.map((dc) => dc.cardId)
  } catch (err) {
    message.error((err as Error).message ?? 'Deck introuvable')
    router.push('/decks')
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload = { name: deckName.value, cards: selectedIds.value }
    if (isEditing.value) {
      await api.updateDeck(route.params.id as string, payload)
      message.success('Deck modifié')
    } else {
      await api.createDeck(payload)
      message.success('Deck créé')
    }
    router.push('/decks')
  } catch (err) {
    message.error((err as Error).message ?? 'Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchCards()
  if (isEditing.value) {
    await fetchDeck(route.params.id as string)
  }
})
</script>

<style scoped>
.deck-form-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* RG3 : Formulaire contraint sur grand écran */
.form-section {
  max-width: 480px;
  width: 100%;
  margin-bottom: 16px;
}

.card-item {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.15s,
    opacity 0.15s;
  background: var(--n-color);
  user-select: none;
}

.card-item:hover:not(.card-item--disabled) {
  border-color: var(--n-primary-color);
}

.card-item--selected {
  border-color: var(--n-primary-color);
}

.card-item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.card-item__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}

.card-item__info {
  padding: 6px 8px 8px;
}

.card-item__name {
  display: block;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-item__badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: var(--n-primary-color);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
