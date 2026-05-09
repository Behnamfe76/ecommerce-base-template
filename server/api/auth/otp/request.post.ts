export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)

  return requestOtpChallenge(body)
})
