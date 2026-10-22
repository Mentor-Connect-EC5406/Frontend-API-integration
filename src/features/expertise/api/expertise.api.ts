import { api } from '../../../lib/api/client'
import type { ExpertiseCategory } from '../types'

export const expertiseApi = {
  categories: () =>
    api.get<ExpertiseCategory[]>('/api/expertise-categories').then((r) => r.data),
}
