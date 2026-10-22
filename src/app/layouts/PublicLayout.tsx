import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import type { AuthReturnState } from '../../lib/auth/oidcConfig'

export function PublicLayout() {
  const auth = useAuth()
  const qc = useQueryClient()
  const location = useLocation()

  const login = () => {
    const state: AuthReturnState = { returnTo: location.pathname + location.search }
    void auth.signinRedirect({ state })
  }

  const logout = () => {
    qc.clear()
    void auth.signoutRedirect({ post_logout_redirect_uri: window.location.origin })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-lg font-bold">
            Mentor<span className="text-brand">Connect</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/mentors"
              className={({ isActive }) => (isActive ? 'text-brand' : 'hover:text-brand')}
            >
              Browse mentors
            </NavLink>
            {auth.isAuthenticated ? (
              <Button variant="ghost" className="border-neutral-600 text-white hover:bg-neutral-800" onClick={logout}>
                Log out
              </Button>
            ) : (
              <Button onClick={login}>Log in</Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} MentorConnect
      </footer>
    </div>
  )
}
