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
    <NButton type="primary" attr-type="submit" @click="handleSignIn"
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

const authStore = useAuthStore()
const router = useRouter()
const message = useMessage()

const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  try {
    await authStore.signIn({
      email: email.value,
      password: password.value,
    })
    await router.push(ROUTES.HOME)
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Connexion impossible.',
    )
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
