<template>
  <NModal
    :show="show"
    :mask-closable="false"
    :closable="false"
    preset="card"
    title="Fin de partie"
    style="width: 420px"
  >
    <NSpace vertical>
      <NResult
        :status="isVictory ? 'success' : 'error'"
        :title="isVictory ? 'Victoire' : 'Defaite'"
      >
        <template #footer>
          <NButton type="primary" @click="$emit('back-lobby')"
            >Retour au lobby</NButton
          >
        </template>
      </NResult>
    </NSpace>
  </NModal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  isVictory: boolean
}>()

defineEmits<{
  'back-lobby': []
}>()
</script>
