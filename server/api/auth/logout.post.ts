export default defineEventHandler((event) => {
  logoutUser(event)

  return {
    success: true
  }
})
