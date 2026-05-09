export default defineEventHandler((event) => {
  return {
    user: refreshUserSession(event)
  }
})
