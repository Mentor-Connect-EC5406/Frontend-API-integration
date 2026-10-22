// Keeps the access token out of localStorage; axios reads it from here.
// The getter is wired to react-oidc-context's in-memory user by <TokenBridge>.
type TokenGetter = () => string | undefined

let getToken: TokenGetter = () => undefined

export const setTokenGetter = (fn: TokenGetter) => {
  getToken = fn
}

export const readToken = () => getToken()
