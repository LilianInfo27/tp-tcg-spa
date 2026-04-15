<template>
  <div class="decks-page">
    <NSpace justify="space-between" align="center" style="margin-bottom: 24px">
      <NH2 style="margin: 0">Mes decks</NH2>
      <NButton type="primary" tag="RouterLink" to="/decks/create">
        Créer un deck
      </NButton>
    </NSpace>

    <NSpin :show="loading">
      <NEmpty
        v-if="!loading && decks.length === 0"
        description="Aucun deck trouvé"
        style="padding: 40px 0"
      />

      <NGrid
        v-else
        responsive="screen"
        cols="1 s:2 m:3"
        :x-gap="16"
        :y-gap="16"
      >
        <NGridItem v-for="deck in decks" :key="deck.id">
          <NCard :title="deck.name" style="height: 100%">
            <NText depth="3">{{ deck.cards.length }} carte(s)</NText>
            <template #footer>
              <NSpace>
                <NButton
                  size="small"
                  tag="RouterLink"
                  :to="`/decks/${deck.id}/edit`"
                >
                  Modifier
                </NButton>
                <NButton
                  size="small"
                  type="error"
                  :loading="deletingId === deck.id"
                  @click="handleDelete(deck.id)"
                >
                  Supprimer
                </NButton>
              </NSpace>
            </template>
          </NCard>
        </NGridItem>
      </NGrid>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const api = useApi()
const message = useMessage()

const decks = ref<Deck[]>([])
const loading = ref(false)
const deletingId = ref<number | null>(null)

const fetchDecks = async () => {
  loading.value = true
  try {
    decks.value = await api.getMyDecks()
  } catch (err) {
    message.error((err as Error).message ?? 'Erreur lors du chargement')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  deletingId.value = id
  try {
    await api.deleteDeck(id)
    decks.value = decks.value.filter((d) => d.id !== id)
    message.success('Deck supprimé')
  } catch (err) {
    message.error((err as Error).message ?? 'Erreur lors de la suppression')
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchDecks)
</script>

<style scoped>
.decks-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
