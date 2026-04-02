<template>
  <NForm @submit.prevent="handleSignIn">
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
      >Se connecter</NButton
    >
    <div class="footer">
      <p>
        Vous n'avez pas de compte ?
        <RouterLink to="/sign-up">Inscrivez-vous</RouterLink>
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

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSignIn = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  try {
    await authStore.signIn({
      email: email.value,
      password: password.value,
    })
    message.success('Connexion reussie.')
    await router.push(ROUTES.HOME)
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Impossible de se connecter.',
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
