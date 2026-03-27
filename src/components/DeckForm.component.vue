<template>
  <section class="deck-form-page">
    <div class="deck-form-page__header">
      <NButton quaternary @click="router.back()">Retour</NButton>
      <div>
        <p class="deck-form-page__eyebrow">Gestion des decks</p>
        <h1>{{ title }}</h1>
      </div>
    </div>

    <NCard class="deck-form-card" :bordered="false">
      <NForm @submit.prevent="handleSubmit">
        <NSpace vertical :size="20">
          <NFormItem label="Nom du deck" required>
            <NInput
              v-model:value="name"
              type="text"
              maxlength="40"
              placeholder="Ex. deck eau rapide"
            />
          </NFormItem>

          <div class="deck-form__status">
            <div>
              <p class="deck-form__label">Sélection</p>
              <strong>{{ selectedIds.length }} / 10 cartes</strong>
            </div>
            <NTag
              :type="selectedIds.length === 10 ? 'success' : 'warning'"
              round
            >
              {{
                selectedIds.length === 10
                  ? 'Deck complet'
                  : '10 cartes requises'
              }}
            </NTag>
          </div>

          <NAlert type="info" :show-icon="false">
            Sélectionnez exactement 10 cartes. Quand la limite est atteinte, les
            autres cartes sont désactivées.
          </NAlert>

          <NSpin :show="loading">
            <CardGrid
              v-if="cards.length > 0"
              v-model:selected-ids="selectedIds"
              :cards="cards"
              size="sm"
              selectable
              :max-selected="10"
            />

            <NEmpty
              v-else
              description="Aucune carte disponible pour le moment."
            />
          </NSpin>

          <div class="deck-form__actions">
            <NButton
              attr-type="submit"
              type="primary"
              :disabled="!canSubmit"
              :loading="submitting"
            >
              {{ submitLabel }}
            </NButton>
          </div>
        </NSpace>
      </NForm>
    </NCard>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/CardGrid.component.vue'
import type { Card, DeckPayload } from '@/types'

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    cards: Card[]
    initialName?: string
    initialSelectedIds?: number[]
    loading?: boolean
    submitting?: boolean
  }>(),
  {
    initialName: '',
    initialSelectedIds: () => [],
    loading: false,
    submitting: false,
  },
)

const emit = defineEmits<{
  submit: [payload: DeckPayload]
}>()

const router = useRouter()
const name = ref(props.initialName)
const selectedIds = ref<number[]>([...props.initialSelectedIds])

watch(
  () => props.initialName,
  (value) => {
    name.value = value
  },
)

watch(
  () => props.initialSelectedIds,
  (value) => {
    selectedIds.value = [...value]
  },
  { deep: true },
)

const canSubmit = computed(() => {
  return name.value.trim().length > 0 && selectedIds.value.length === 10
})

const handleSubmit = () => {
  if (!canSubmit.value) {
    return
  }

  emit('submit', {
    name: name.value.trim(),
    cards: selectedIds.value,
  })
}
</script>

<style scoped>
.deck-form-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}

.deck-form-page__header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.deck-form-page__header h1 {
  margin: 0.15rem 0 0;
  color: #172033;
  font-size: clamp(1.8rem, 2.8vw, 2.6rem);
}

.deck-form-page__eyebrow {
  margin: 0;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.deck-form-card {
  border-radius: 28px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(245, 247, 250, 0.96)
    ),
    linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(251, 191, 36, 0.08));
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.08);
}

.deck-form__status {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
}

.deck-form__label {
  margin: 0 0 0.2rem;
  color: #52607a;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.deck-form__actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .deck-form-page__header,
  .deck-form__status {
    flex-direction: column;
    align-items: stretch;
  }

  .deck-form__actions :deep(button) {
    width: 100%;
  }
}
</style>
