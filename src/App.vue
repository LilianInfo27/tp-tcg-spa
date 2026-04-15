<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout style="min-height: 100vh">
        <HeaderBar v-if="authStore.isAuthenticated" />
        <NLayoutContent :content-style="{ padding: '16px' }">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './stores/auth.store'

const authStore = useAuthStore()
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
