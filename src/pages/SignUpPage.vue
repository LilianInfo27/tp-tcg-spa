<template>
  <NForm @submit.prevent="handleSignUp">
    <NFormItem label="Nom utilisateur" required style="width: 100%">
      <NInput
        v-model:value="username"
        type="text"
        placeholder="Nom de l'utilisateur"
      />
    </NFormItem>
    <NFormItem label="Email" required style="width: 100%">
      <NInput v-model:value="email" type="text" placeholder="Email" />
    </NFormItem>
    <NFormItem label="Mot de passe" required style="width: 100%">
      <NInput
        v-model:value="password"
        type="password"
        show-password-on="mousedown"
        placeholder="Password"
      />
    </NFormItem>
    <NButton type="primary" attr-type="submit" :loading="isLoading"
      >S'inscrire</NButton
    >
    <div class="footer">
      <p>
        Vous avez déjà un compte ?
        <RouterLink to="/sign-in">Connectez-vous</RouterLink>
      </p>
    </div>
  </NForm>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSignUp = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  try {
    await authStore.signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    message.success('Compte cree avec succes.')
    await router.push(ROUTES.HOME)
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Impossible de creer le compte.',
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
}

.footer span {
  text-decoration: none;
}
</style>
