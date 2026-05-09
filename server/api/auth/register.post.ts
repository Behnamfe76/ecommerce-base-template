export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string, email?: string, password?: string }>(event)

  return {
    user: registerUser(event, body)
  }
})
