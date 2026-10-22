import { useQuery } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { usersApi } from '../../features/users/api/users.api'

export const meQueryKey = ['me'] as const

/** Role and account status come from the backend, not from JWT claims. */
export const useCurrentUser = () => {
  const auth = useAuth()
  return useQuery({
    queryKey: meQueryKey,
    queryFn: usersApi.getMe,
    enabled: auth.isAuthenticated,
    staleTime: 5 * 60_000,
  })
}
