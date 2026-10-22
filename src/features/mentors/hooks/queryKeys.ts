import type { IsoDateTime, UUID } from '../../../types'
import type { MentorFilters } from '../types'

export const mentorKeys = {
  list: (f: MentorFilters) => ['mentors', f] as const,
  detail: (id: UUID) => ['mentor', id] as const,
}

export const slotKeys = {
  /** Prefix — invalidate this to refetch every loaded week for a mentor. */
  all: (mentorId: UUID) => ['slots', mentorId] as const,
  range: (mentorId: UUID, from: IsoDateTime, to: IsoDateTime) =>
    ['slots', mentorId, { from, to }] as const,
}
