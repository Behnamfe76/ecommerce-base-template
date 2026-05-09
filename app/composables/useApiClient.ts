import type { FetchOptions } from 'ofetch'
import type { ApiErrorData } from '~/types'
import { joinUrl } from '~/utils'

interface ApiRequestOptions<TBody = unknown> extends Omit<FetchOptions<'json'>, 'body'> {
  body?: TBody
  skipAuthRefresh?: boolean
}

export class ApiError extends Error {
  statusCode: number
  data?: ApiErrorData

  constructor(message: string, statusCode = 500, data?: ApiErrorData) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.data = data
  }
}

let refreshPromise: Promise<boolean> | null = null

function createApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  const statusCode = typeof error === 'object' && error && 'statusCode' in error
    ? Number(error.statusCode)
    : typeof error === 'object' && error && 'status' in error
      ? Number(error.status)
      : 500

  const data = typeof error === 'object' && error && 'data' in error
    ? error.data as ApiErrorData
    : undefined

  const fallbackMessage = statusCode === 401 ? 'Unauthorized' : 'Request failed'
  const message = data?.message
    ?? (typeof error === 'object' && error && 'message' in error ? String(error.message) : fallbackMessage)

  return new ApiError(message, statusCode, data)
}

function isUnauthorized(error: unknown): boolean {
  return createApiError(error).statusCode === 401
}

export function useApiClient() {
  const runtimeConfig = useRuntimeConfig()
  const authState = useAuthState()

  async function rawRequest<TResponse, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {}
  ): Promise<TResponse> {
    const requestFetch = (import.meta.server ? useRequestFetch() : $fetch) as typeof $fetch
    const { skipAuthRefresh: _skipAuthRefresh, ...fetchOptions } = options
    const requestOptions = {
      ...(fetchOptions as FetchOptions<'json'>),
      body: options.body as FetchOptions<'json'>['body'],
      credentials: 'include'
    } as Parameters<typeof requestFetch>[1]

    try {
      return await requestFetch<TResponse>(joinUrl(runtimeConfig.public.apiBase, path), requestOptions) as TResponse
    } catch (error) {
      throw createApiError(error)
    }
  }

  async function refreshAccessToken() {
    if (!refreshPromise) {
      refreshPromise = rawRequest('/auth/refresh', {
        method: 'POST',
        skipAuthRefresh: true
      })
        .then(() => true)
        .catch(() => {
          authState.setAnonymous()
          return false
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    return refreshPromise
  }

  async function request<TResponse, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {}
  ): Promise<TResponse> {
    try {
      return await rawRequest<TResponse, TBody>(path, options)
    } catch (error) {
      const apiError = createApiError(error)
      const shouldRefresh = !options.skipAuthRefresh && isUnauthorized(apiError) && !path.endsWith('/auth/refresh')

      if (!shouldRefresh) {
        throw apiError
      }

      const refreshed = await refreshAccessToken()

      if (!refreshed) {
        throw apiError
      }

      return rawRequest<TResponse, TBody>(path, {
        ...options,
        skipAuthRefresh: true
      })
    }
  }

  return {
    request,
    rawRequest
  }
}
