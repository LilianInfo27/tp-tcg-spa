<template>
  <div class="auth-page">
    <NCard class="auth-card" title="Inscription">
      <NForm @submit.prevent="handleSignUp">
        <NFormItem label="Nom utilisateur" required>
          <NInput
            v-model:value="username"
            type="text"
            placeholder="Nom de l'utilisateur"
          />
        </NFormItem>
        <NFormItem label="Email" required>
          <NInput v-model:value="email" type="text" placeholder="Email" />
        </NFormItem>
        <NFormItem label="Mot de passe" required>
          <NInput
            v-model:value="password"
            type="password"
            show-password-on="mousedown"
            placeholder="Mot de passe"
          />
        </NFormItem>
        <NButton type="primary" attr-type="submit" block @click="handleSignUp">
          S'inscrire
        </NButton>
        <div class="footer">
          <p>
            Vous avez déjà un compte ?
            <RouterLink to="/sign-in">Connectez-vous</RouterLink>
          </p>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  authStore.signUp({
    username: username.value,
    email: email.value,
    password: password.value,
  })
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px);
  padding: 16px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>
