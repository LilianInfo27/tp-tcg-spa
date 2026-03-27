import { createRouter, createWebHistory } from 'vue-router'

import CreateDeckPage from './pages/CreateDeckPage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import UpdateDeckPage from './pages/UpdateDeckPage.vue'
import { useAuthStore } from './stores/auth.store'

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  CREATE_DECK: '/decks/create',
  DECK_DETAILS: '/decks/:id',
  UPDATE_DECK: '/decks/update/:id',
} as const

export const getDeckDetailPath = (id: number | string) => `/decks/${id}`
export const getDeckUpdatePath = (id: number | string) => `/decks/update/${id}`

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  { path: ROUTES.SIGN_IN, component: SignInPage },
  {
    path: ROUTES.CREATE_DECK,
    component: CreateDeckPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_DETAILS,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.UPDATE_DECK,
    component: UpdateDeckPage,
    meta: { requiresAuth: true },
  },
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
