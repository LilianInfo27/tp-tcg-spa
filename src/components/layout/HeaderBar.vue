<template>
  <NLayoutHeader
    bordered
    style="padding: 0 16px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="12">
        <RouterLink to="/" class="app-title">TCG SPA</RouterLink>
        <NButton tag="RouterLink" to="/" quaternary size="small">
          Jouer
        </NButton>
        <NButton tag="RouterLink" to="/decks" quaternary size="small">
          Mes decks
        </NButton>
        <NButton
          class="hide-mobile"
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          class="hide-mobile"
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="12">
        <NText class="hide-mobile" depth="3">{{
          authStore.user?.username
        }}</NText>
        <NButton size="small" @click="handleSignOut">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

const handleSignOut = async () => {
  authStore.signOut()
  await router.push('/sign-in')
}
</script>

<style scoped>
.app-title {
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .hide-mobile {
    display: none;
  }
}
</style>
