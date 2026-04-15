import { createRouter, createWebHistory } from 'vue-router'

import DeckFormPage from './pages/DeckFormPage.vue'
import DecksPage from './pages/DecksPage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './stores/auth.store'

export const ROUTES = {
  HOME: '/',
  DECKS: '/decks',
  DECK_CREATE: '/decks/create',
  DECK_EDIT: '/decks/:id/edit',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.DECKS, component: DecksPage, meta: { requiresAuth: true } },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_EDIT,
    component: DeckFormPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  { path: ROUTES.SIGN_IN, component: SignInPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next(ROUTES.SIGN_IN)
  } else if (
    (to.path === ROUTES.SIGN_IN || to.path === ROUTES.SIGN_UP) &&
    authStore.isAuthenticated
  ) {
    next(ROUTES.HOME)
  } else {
    next()
  }
})

export default router
