import axios from 'axios'
import { readToken } from '../auth/tokenStore'
import { toApiError } from './errors'

export const AUTH_EXPIRED_EVENT = 'auth:expired'
export const AUTH_BLOCKED_EVENT = 'auth:blocked'
export const API_CONFLICT_EVENT = 'api:conflict'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
})

api.interceptors.request.use((config) => {
  const token = readToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const apiErr = toApiError(err)
    if (apiErr.status === 401) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    if (apiErr.status === 403 && apiErr.code === 'ACCOUNT_NOT_ACTIVE')
      window.dispatchEvent(new Event(AUTH_BLOCKED_EVENT))
    // 409s are still rejected so the calling mutation can react (e.g. slot taken);
    // the event lets global UI (toasts) listen without coupling to each caller.
    if (apiErr.status === 409)
      window.dispatchEvent(new CustomEvent(API_CONFLICT_EVENT, { detail: apiErr }))
    return Promise.reject(apiErr)
  },
)
