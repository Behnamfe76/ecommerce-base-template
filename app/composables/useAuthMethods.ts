import type { AuthMethod, AuthProvider } from '~/types'

export function useAuthMethods() {
  const availableMethods = computed<AuthMethod[]>(() => ['password', 'otp'])
  const availableProviders = computed<AuthProvider[]>(() => ['google', 'github'])

  return {
    availableMethods,
    availableProviders,
    canUsePassword: computed(() => availableMethods.value.includes('password')),
    canUseOtp: computed(() => availableMethods.value.includes('otp')),
    canUsePasskey: computed(() => availableMethods.value.includes('passkey')),
    canUseAuthenticator: computed(() => false)
  }
}
