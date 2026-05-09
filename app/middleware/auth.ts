export default defineNuxtRouteMiddleware(async () => {
  const { requireAuth } = useAuthGuard()

  return requireAuth()
})
