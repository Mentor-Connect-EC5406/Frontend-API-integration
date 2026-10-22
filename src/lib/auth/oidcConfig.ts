import type { AuthProviderProps } from 'react-oidc-context'

/** Where to send the user after login; passed through OIDC `state`. */
export interface AuthReturnState {
  returnTo: string
}

export const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_ASGARDEO_AUTHORITY,
  client_id: import.meta.env.VITE_ASGARDEO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  scope: 'openid profile email',
  response_type: 'code', // Authorization Code + PKCE
  // Strip ?code=&state= from the URL; AuthCallbackPage handles the redirect.
  onSigninCallback: () => window.history.replaceState({}, '', window.location.pathname),
}
