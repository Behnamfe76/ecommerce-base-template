import type { MutationStatus } from '~/types'
import { ApiError } from '~/composables/useApiClient'

interface ApiMutationOptions<TData, TVariables> {
  mutation: (variables: TVariables) => Promise<TData>
  invalidate?: string[]
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>
}

export function useApiMutation<TData, TVariables = void>(
  options: ApiMutationOptions<TData, TVariables>
) {
  const data = ref<TData | null>(null)
  const error = ref<ApiError | null>(null)
  const status = ref<MutationStatus>('idle')

  async function mutateAsync(variables: TVariables): Promise<TData> {
    status.value = 'pending'
    error.value = null

    try {
      const response = await options.mutation(variables)
      data.value = response
      status.value = 'success'

      if (options.invalidate?.length) {
        await Promise.all(options.invalidate.map(key => refreshNuxtData(key)))
      }

      await options.onSuccess?.(response, variables)

      return response
    } catch (cause) {
      const apiError = cause instanceof ApiError ? cause : new ApiError('Mutation failed')
      error.value = apiError
      status.value = 'error'
      await options.onError?.(apiError, variables)
      throw apiError
    }
  }

  function mutate(variables: TVariables) {
    mutateAsync(variables).catch(() => undefined)
  }

  function reset() {
    data.value = null
    error.value = null
    status.value = 'idle'
  }

  return {
    data,
    error,
    status,
    isIdle: computed(() => status.value === 'idle'),
    isPending: computed(() => status.value === 'pending'),
    isSuccess: computed(() => status.value === 'success'),
    isError: computed(() => status.value === 'error'),
    mutate,
    mutateAsync,
    reset
  }
}
