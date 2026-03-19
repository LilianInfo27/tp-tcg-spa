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
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  authStore.signIn({
    email: email.value,
    password: password.value,
  })
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
