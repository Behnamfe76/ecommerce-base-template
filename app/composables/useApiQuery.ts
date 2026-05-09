import type { AsyncData, AsyncDataOptions } from '#app'
import type { QueryStatus } from '~/types'
import { stableStringify } from '~/utils'

type QueryKey = string | unknown[]
type QueryHandler<T> = (context: { signal?: AbortSignal }) => Promise<T>

interface ApiQueryOptions<T> extends Pick<AsyncDataOptions<T, T, keyof T, T>, 'default' | 'lazy' | 'server' | 'watch' | 'immediate' | 'deep' | 'dedupe'> {
  enabled?: boolean | Ref<boolean> | ComputedRef<boolean>
}

export async function useApiQuery<T>(
  key: QueryKey,
  handler: QueryHandler<T>,
  options: ApiQueryOptions<T> = {}
) {
  const enabled = computed(() => toValue(options.enabled) ?? true)
  const queryKey = Array.isArray(key) ? stableStringify(key) : key

  const asyncData = await useAsyncData<T>(
    queryKey,
    async (_nuxtApp, { signal }) => {
      if (!enabled.value) {
        return options.default ? options.default() : (undefined as T)
      }

      return handler({ signal })
    },
    {
      default: options.default,
      lazy: options.lazy,
      server: options.server,
      watch: [enabled, ...(options.watch ?? [])],
      immediate: options.immediate ?? true,
      deep: options.deep,
      dedupe: options.dedupe
    }
  ) as AsyncData<T, Error | null>

  const status = computed<QueryStatus>(() => asyncData.status.value)

  function setData(value: T) {
    asyncData.data.value = value as never
  }

  async function invalidate() {
    await refreshNuxtData(queryKey)
  }

  return {
    ...asyncData,
    queryKey,
    status,
    isIdle: computed(() => status.value === 'idle'),
    isPending: computed(() => status.value === 'pending'),
    isSuccess: computed(() => status.value === 'success'),
    isError: computed(() => status.value === 'error'),
    setData,
    invalidate
  }
}
