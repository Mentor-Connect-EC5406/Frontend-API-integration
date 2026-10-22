import { api } from '../../../lib/api/client'
import type { Page, UUID } from '../../../types'
import type { MentorDetail, MentorFilters, MentorSummary } from '../types'

/** Drop empty values so they aren't sent as `?industry=`. */
const toParams = (f: MentorFilters) =>
  Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== ''))

export const mentorsApi = {
  list: (f: MentorFilters) =>
    api.get<Page<MentorSummary>>('/api/mentors', { params: toParams(f) }).then((r) => r.data),
  get: (id: UUID) => api.get<MentorDetail>(`/api/mentors/${id}`).then((r) => r.data),
}
