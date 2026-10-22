import { Navigate, Outlet } from 'react-router-dom'
import { ErrorState, PageLoader } from '../../components/feedback/States'
import { useCurrentUser } from '../../lib/auth/useCurrentUser'

/** Blocks SUSPENDED / DEACTIVATED accounts. Must sit inside <RequireAuth>. */
export function RequireActive() {
  const { data: me, isPending, isError, error, refetch } = useCurrentUser()

  if (isPending) return <PageLoader />
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (me.accountStatus === 'SUSPENDED') return <Navigate to="/suspended" replace />
  if (me.accountStatus === 'DEACTIVATED') return <Navigate to="/deactivated" replace />
  return <Outlet />
}
