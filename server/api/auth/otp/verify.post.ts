export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, code?: string }>(event)

  return {
    user: verifyOtpChallenge(event, body)
  }
})
