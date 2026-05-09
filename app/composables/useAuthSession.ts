import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload,
  RegisterCredentials
} from '~/types'

let sessionPromise: Promise<AuthUser | null> | null = null

export function useAuthSession() {
  const api = useApiClient()
  const authState = useAuthState()

  async function fetchSession(force = false): Promise<AuthUser | null> {
    if (authState.initialized.value && !force) {
      return authState.user.value
    }

    if (!sessionPromise || force) {
      sessionPromise = api.request<AuthResponse>('/auth/me', {
        method: 'GET'
      })
        .then((response) => {
          authState.setAuthenticated(response.user)
          return response.user
        })
        .catch(() => {
          authState.setAnonymous()
          return null
        })
        .finally(() => {
          sessionPromise = null
        })
    }

    return sessionPromise
  }

  async function login(credentials: LoginCredentials) {
    const response = await api.request<AuthResponse, LoginCredentials>('/auth/login', {
      method: 'POST',
      body: credentials,
      skipAuthRefresh: true
    })

    authState.setAuthenticated(response.user)
    return response.user
  }

  async function register(credentials: RegisterCredentials) {
    const response = await api.request<AuthResponse, RegisterCredentials>('/auth/register', {
      method: 'POST',
      body: credentials,
      skipAuthRefresh: true
    })

    authState.setAuthenticated(response.user)
    return response.user
  }

  async function refresh() {
    const response = await api.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      skipAuthRefresh: true
    })

    authState.setAuthenticated(response.user)
    return response.user
  }

  async function logout() {
    await api.request('/auth/logout', {
      method: 'POST',
      skipAuthRefresh: true
    })

    authState.setAnonymous()
  }

  async function requestOtp(payload: OtpRequestPayload) {
    return await api.request<OtpRequestResponse, OtpRequestPayload>('/auth/otp/request', {
      method: 'POST',
      body: payload,
      skipAuthRefresh: true
    })
  }

  async function verifyOtp(payload: OtpVerifyPayload) {
    const response = await api.request<AuthResponse, OtpVerifyPayload>('/auth/otp/verify', {
      method: 'POST',
      body: payload,
      skipAuthRefresh: true
    })

    authState.setAuthenticated(response.user)
    return response.user
  }

  return {
    ...authState,
    fetchSession,
    ensureSession: fetchSession,
    login,
    register,
    requestOtp,
    verifyOtp,
    refresh,
    logout
  }
}
