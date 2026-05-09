export function useAuthGuard() {
  const { fetchSession } = useAuthSession()

  async function requireAuth(redirectTo = '/login') {
    const user = await fetchSession()

    if (!user) {
      return navigateTo(redirectTo)
    }
  }

  async function requireGuest(redirectTo = '/dashboard') {
    const user = await fetchSession()

    if (user) {
      return navigateTo(redirectTo)
    }
  }

  return {
    requireAuth,
    requireGuest
  }
}
