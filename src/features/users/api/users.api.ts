import { api } from '../../../lib/api/client'
import type { UserProfile } from '../types'

export const usersApi = {
  getMe: () => api.get<UserProfile>('/api/users/me').then((r) => r.data),
}
