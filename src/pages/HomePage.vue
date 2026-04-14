<template>
  <div class="container">
    <NCard title="Accueil">
      <NSpace vertical size="large">
        <NButton type="primary" @click="goToDeckBuilder">
          Creer un deck
        </NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDeckBuilder = async () => {
  await router.push('/decks/new')
}
</script>

<style scoped>
.container {
  padding: 16px 0;
}
</style>
