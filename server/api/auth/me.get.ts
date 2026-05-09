export default defineEventHandler((event) => {
  return {
    user: getAuthenticatedUser(event)
  }
})
