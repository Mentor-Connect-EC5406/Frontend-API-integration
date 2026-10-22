import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '../../components/feedback/States'
import { useCurrentUser } from '../../lib/auth/useCurrentUser'
import type { Role } from '../../types'

/** Must sit inside <RequireActive>, which handles loading/error for `me`. */
export function RequireRole({ roles }: { roles: Role[] }) {
  const { data: me } = useCurrentUser()
  if (!me) return <PageLoader />
  if (!roles.includes(me.role)) return <Navigate to="/403" replace />
  return <Outlet />
}
