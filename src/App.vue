<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="authStore.isAuthenticated" />
        <NLayoutContent>
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
body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(251, 191, 36, 0.18), transparent 26%),
    linear-gradient(180deg, #fffdf8, #eef5f7 55%, #f6f8fb);
  color: #172033;
}

body {
  padding: 0 20px;
}

#app {
  min-height: 100vh;
}
</style>
