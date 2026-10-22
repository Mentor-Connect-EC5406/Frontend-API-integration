import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '../../components/feedback/States'
import type { AuthReturnState } from '../../lib/auth/oidcConfig'

/** Sends unauthenticated users to Asgardeo, returning them here afterwards. */
export function RequireAuth() {
  const auth = useAuth()
  const location = useLocation()
  const needsLogin = !auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator

  useEffect(() => {
    if (!needsLogin) return
    const state: AuthReturnState = { returnTo: location.pathname + location.search }
    void auth.signinRedirect({ state })
  }, [needsLogin, auth, location.pathname, location.search])

  if (!auth.isAuthenticated) return <PageLoader label="Signing you in…" />
  return <Outlet />
}
