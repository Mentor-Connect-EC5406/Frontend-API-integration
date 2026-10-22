import { QueryClient } from '@tanstack/react-query'
import { isApiError } from './errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // 4xx responses won't change on retry; only retry network/5xx errors.
      retry: (failureCount, error) =>
        !(isApiError(error) && error.isClientError) && failureCount < 2,
    },
    mutations: { retry: false },
  },
})
