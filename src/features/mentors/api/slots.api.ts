import { api } from '../../../lib/api/client'
import type { IsoDateTime, UUID } from '../../../types'
import type { AvailabilitySlot } from '../types'

export const slotsApi = {
  forMentor: (mentorId: UUID, from: IsoDateTime, to: IsoDateTime) =>
    api
      .get<AvailabilitySlot[]>(`/api/mentors/${mentorId}/slots`, { params: { from, to } })
      .then((r) => r.data),
}
