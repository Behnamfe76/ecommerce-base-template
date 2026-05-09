import { createError, deleteCookie, getCookie, setCookie } from 'h3'

const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'
const ACCESS_TTL_SECONDS = 60 * 15
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30

interface StoredUser {
  id: number
  name: string
  email: string
  password: string
  emailVerifiedAt: string | null
}

interface SessionRecord {
  userId: number
  expiresAt: number
}

interface OtpChallengeRecord {
  userId: number
  code: string
  expiresAt: number
}

const users = new Map<number, StoredUser>([[
  1,
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    emailVerifiedAt: new Date().toISOString()
  }
]])

const userIdsByEmail = new Map<string, number>([
  ['demo@example.com', 1]
])

let nextUserId = 2

const accessSessions = new Map<string, SessionRecord>()
const refreshSessions = new Map<string, SessionRecord>()
const otpChallenges = new Map<string, OtpChallengeRecord>()

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  }
}

function createToken() {
  return crypto.randomUUID()
}

function createOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt)
  }
}

function getUserById(userId: number) {
  const user = users.get(userId)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return user
}

function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const userId = userIdsByEmail.get(normalizedEmail)

  if (!userId) {
    return null
  }

  return getUserById(userId)
}

function createSession(userId: number) {
  const accessToken = createToken()
  const refreshToken = createToken()

  accessSessions.set(accessToken, {
    userId,
    expiresAt: Date.now() + ACCESS_TTL_SECONDS * 1000
  })

  refreshSessions.set(refreshToken, {
    userId,
    expiresAt: Date.now() + REFRESH_TTL_SECONDS * 1000
  })

  return {
    accessToken,
    refreshToken
  }
}

function deleteSessionToken(
  store: Map<string, SessionRecord>,
  token: string | undefined
) {
  if (token) {
    store.delete(token)
  }
}

function setSessionCookies(event: Parameters<typeof setCookie>[0], tokens: ReturnType<typeof createSession>) {
  setCookie(event, ACCESS_COOKIE, tokens.accessToken, cookieOptions(ACCESS_TTL_SECONDS))
  setCookie(event, REFRESH_COOKIE, tokens.refreshToken, cookieOptions(REFRESH_TTL_SECONDS))
}

function readValidSession(
  store: Map<string, SessionRecord>,
  token: string | undefined
) {
  if (!token) {
    return null
  }

  const session = store.get(token)

  if (!session) {
    return null
  }

  if (session.expiresAt <= Date.now()) {
    store.delete(token)
    return null
  }

  return session
}

export function clearAuthCookies(event: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(event, ACCESS_COOKIE, { path: '/' })
  deleteCookie(event, REFRESH_COOKIE, { path: '/' })
}

export function logoutUser(event: Parameters<typeof getCookie>[0]) {
  deleteSessionToken(accessSessions, getCookie(event, ACCESS_COOKIE))
  deleteSessionToken(refreshSessions, getCookie(event, REFRESH_COOKIE))
  clearAuthCookies(event)
}

export function getAuthenticatedUser(event: Parameters<typeof getCookie>[0]) {
  const accessToken = getCookie(event, ACCESS_COOKIE)
  const session = readValidSession(accessSessions, accessToken)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  return sanitizeUser(getUserById(session.userId))
}

export function refreshUserSession(event: Parameters<typeof getCookie>[0]) {
  const refreshToken = getCookie(event, REFRESH_COOKIE)
  const session = readValidSession(refreshSessions, refreshToken)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  deleteSessionToken(refreshSessions, refreshToken)

  const tokens = createSession(session.userId)
  setSessionCookies(event, tokens)

  return sanitizeUser(getUserById(session.userId))
}

export function loginUser(
  event: Parameters<typeof getCookie>[0],
  credentials: { email?: string, password?: string }
) {
  if (!credentials.email || !credentials.password) {
    throw createError({
      statusCode: 422,
      message: 'Email and password are required'
    })
  }

  const user = getUserByEmail(credentials.email)

  if (!user || user.password !== credentials.password) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  const tokens = createSession(user.id)
  setSessionCookies(event, tokens)

  return sanitizeUser(user)
}

export function registerUser(
  event: Parameters<typeof getCookie>[0],
  payload: { name?: string, email?: string, password?: string }
) {
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password?.trim()

  if (!name || !email || !password) {
    throw createError({
      statusCode: 422,
      message: 'Name, email and password are required'
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 422,
      message: 'Password must be at least 8 characters'
    })
  }

  if (userIdsByEmail.has(email)) {
    throw createError({
      statusCode: 409,
      message: 'Email already registered'
    })
  }

  const user: StoredUser = {
    id: nextUserId++,
    name,
    email,
    password,
    emailVerifiedAt: null
  }

  users.set(user.id, user)
  userIdsByEmail.set(user.email, user.id)

  const tokens = createSession(user.id)
  setSessionCookies(event, tokens)

  return sanitizeUser(user)
}

export function requestOtpChallenge(payload: { email?: string }) {
  if (!payload.email) {
    throw createError({
      statusCode: 422,
      message: 'Email is required'
    })
  }

  const user = getUserByEmail(payload.email)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'No account found for this email'
    })
  }

  const challengeId = createToken()
  const code = createOtpCode()
  const expiresIn = 60 * 5

  otpChallenges.set(challengeId, {
    userId: user.id,
    code,
    expiresAt: Date.now() + expiresIn * 1000
  })

  return {
    challengeId,
    expiresIn,
    devCode: process.env.NODE_ENV !== 'production' ? code : undefined
  }
}

export function verifyOtpChallenge(
  event: Parameters<typeof getCookie>[0],
  payload: { email?: string, code?: string }
) {
  if (!payload.email || !payload.code) {
    throw createError({
      statusCode: 422,
      message: 'Email and code are required'
    })
  }

  const user = getUserByEmail(payload.email)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'No account found for this email'
    })
  }

  const challenge = [...otpChallenges.values()].find(item =>
    item.userId === user.id && item.code === payload.code
  )

  if (!challenge || challenge.expiresAt <= Date.now()) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired verification code'
    })
  }

  for (const [challengeId, record] of otpChallenges.entries()) {
    if (record.userId === user.id) {
      otpChallenges.delete(challengeId)
    }
  }

  const tokens = createSession(user.id)
  setSessionCookies(event, tokens)

  return sanitizeUser(user)
}
