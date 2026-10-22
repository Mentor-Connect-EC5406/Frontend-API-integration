import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef, type ReactNode } from 'react'
import { AuthProvider, useAuth } from 'react-oidc-context'
import { PageLoader } from '../components/feedback/States'
import { AUTH_BLOCKED_EVENT, AUTH_EXPIRED_EVENT } from '../lib/api/client'
import { queryClient } from '../lib/api/queryClient'
import { oidcConfig } from '../lib/auth/oidcConfig'
import { setTokenGetter } from '../lib/auth/tokenStore'

/** Exposes the in-memory OIDC access token to axios and reacts to auth events. */
function TokenBridge({ children }: { children: ReactNode }) {
  const auth = useAuth()
  // Set during render so child queries fired on mount already see the token.
  setTokenGetter(() => auth.user?.access_token)

  const renewing = useRef(false)
  useEffect(() => {
    const onExpired = () => {
      if (renewing.current) return
      renewing.current = true
      auth
        .signinSilent()
        .catch(() => auth.removeUser())
        .finally(() => {
          renewing.current = false
        })
    }
    const onBlocked = () => window.location.assign('/suspended')
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    window.addEventListener(AUTH_BLOCKED_EVENT, onBlocked)
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
      window.removeEventListener(AUTH_BLOCKED_EVENT, onBlocked)
    }
  }, [auth])

  // Don't render the app until the stored session (if any) has been restored.
  if (auth.isLoading) return <PageLoader />
  return <>{children}</>
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <TokenBridge>{children}</TokenBridge>
      </QueryClientProvider>
    </AuthProvider>
  )
}
