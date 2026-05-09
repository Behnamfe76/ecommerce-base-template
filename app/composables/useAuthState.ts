import type { AuthStatus, AuthUser } from '~/types'

interface AuthStateShape {
  user: AuthUser | null
  status: AuthStatus
  initialized: boolean
}

export function useAuthState() {
  const state = useState<AuthStateShape>('auth.state', () => ({
    user: null,
    status: 'unknown',
    initialized: false
  }))

  function setAuthenticated(user: AuthUser) {
    state.value.user = user
    state.value.status = 'authenticated'
    state.value.initialized = true
  }

  function setAnonymous() {
    state.value.user = null
    state.value.status = 'anonymous'
    state.value.initialized = true
  }

  function reset() {
    state.value.user = null
    state.value.status = 'unknown'
    state.value.initialized = false
  }

  return {
    state,
    user: computed(() => state.value.user),
    status: computed(() => state.value.status),
    initialized: computed(() => state.value.initialized),
    isAuthenticated: computed(() => state.value.status === 'authenticated'),
    setAuthenticated,
    setAnonymous,
    reset
  }
}
