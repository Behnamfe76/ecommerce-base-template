export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)

  return {
    user: loginUser(event, body)
  }
})
