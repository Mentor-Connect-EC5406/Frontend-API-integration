import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router-dom'
import { ErrorState, PageLoader } from '../../../components/feedback/States'
import type { AuthReturnState } from '../../../lib/auth/oidcConfig'

/** Asgardeo redirect target. react-oidc-context exchanges the code itself. */
export default function AuthCallbackPage() {
  const auth = useAuth()

  if (auth.error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorState error={auth.error} onRetry={() => void auth.signinRedirect()} />
      </div>
    )
  }
  if (!auth.isAuthenticated) return <PageLoader label="Signing you in…" />

  const returnTo = (auth.user?.state as AuthReturnState | undefined)?.returnTo
  // Only follow same-origin relative paths.
  const safe = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
  return <Navigate to={safe} replace />
}
