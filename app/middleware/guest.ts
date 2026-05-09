export default defineNuxtRouteMiddleware(async () => {
  const { requireGuest } = useAuthGuard()

  return requireGuest()
})
