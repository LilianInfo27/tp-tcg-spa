<template>
  <NCard class="action-card">
    <NSpace vertical :size="12">
      <NText strong>
        {{ isMyTurn ? 'Votre tour' : "Tour de l'adversaire" }}
      </NText>

      <NSpace wrap>
        <NButton type="primary" :disabled="drawDisabled" @click="$emit('draw')"
          >Piocher</NButton
        >
        <NButton
          type="warning"
          :disabled="attackDisabled"
          @click="$emit('attack')"
          >Attaquer</NButton
        >
        <NButton :disabled="endTurnDisabled" @click="$emit('end-turn')"
          >Fin de tour</NButton
        >
      </NSpace>

      <NAlert type="info" :show-icon="false">
        {{ realtimeMessage || 'En attente des actions de partie...' }}
      </NAlert>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
// Props pour contrôler l'état des boutons et afficher les messages en temps réel
defineProps<{
  isMyTurn: boolean
  drawDisabled: boolean
  attackDisabled: boolean
  endTurnDisabled: boolean
  realtimeMessage: string
}>()

// On émet des événements pour les actions de jeu
defineEmits<{
  draw: []
  attack: []
  'end-turn': []
}>()
</script>

<style scoped>
.action-card {
  width: min(100%, 960px);
  margin: 0 auto;
}
</style>
