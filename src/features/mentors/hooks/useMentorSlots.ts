import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UUID } from '../../../types'
import { addDays } from '../../../lib/utils/date'
import { slotsApi } from '../api/slots.api'
import { slotKeys } from './queryKeys'

/**
 * Slots for the 7 days starting at `weekStart`. The fetched range is padded by
 * a day each side so slots near midnight still appear after timezone conversion.
 */
export const useMentorWeekSlots = (mentorId: UUID | undefined, weekStart: Date) => {
  const from = addDays(weekStart, -1).toISOString()
  const to = addDays(weekStart, 8).toISOString()
  return useQuery({
    queryKey: slotKeys.range(mentorId ?? '', from, to),
    queryFn: () => slotsApi.forMentor(mentorId!, from, to),
    enabled: !!mentorId,
    placeholderData: keepPreviousData,
    // Slots change as other students book; keep them reasonably fresh.
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  })
}
