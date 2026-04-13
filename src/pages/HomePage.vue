<template>
  <div class="container">
    <LobbyPanel />
  </div>
</template>

<script setup lang="ts">
import LobbyPanel from '@/components/game/LobbyPanel.vue'
</script>

<style scoped>
.container {
  min-height: calc(100vh - 100px);
}
</style>
