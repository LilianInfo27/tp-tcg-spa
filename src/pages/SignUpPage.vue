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
    <NButton type="primary" attr-type="submit" @click="handleSignUp"
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

const authStore = useAuthStore()
const router = useRouter()
const message = useMessage()

const username = ref('')
const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  try {
    await authStore.signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    await router.push(ROUTES.HOME)
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : 'Inscription impossible.',
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
