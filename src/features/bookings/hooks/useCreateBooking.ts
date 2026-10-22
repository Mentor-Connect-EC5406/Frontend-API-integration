import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '../../../lib/api/errors'
import type { UUID } from '../../../types'
import { slotKeys } from '../../mentors/hooks/queryKeys'
import { bookingsApi } from '../api/bookings.api'
import type { BookingResponse, CreateBookingRequest } from '../types'
import { bookingKeys } from './queryKeys'

/**
 * Creates a PENDING booking (slot becomes HELD). On 409 the slot was taken by
 * someone else, so the mentor's slots are refetched; callers check
 * `error.isConflict` to show the "slot no longer available" state.
 */
export const useCreateBooking = (mentorId: UUID) => {
  const qc = useQueryClient()
  return useMutation<BookingResponse, ApiError, CreateBookingRequest>({
    mutationFn: bookingsApi.create,
    onSuccess: (booking) => {
      qc.setQueryData(bookingKeys.detail(booking.id), booking)
      qc.invalidateQueries({ queryKey: bookingKeys.all })
      qc.invalidateQueries({ queryKey: slotKeys.all(mentorId) })
    },
    onError: (error) => {
      if (error.isConflict) qc.invalidateQueries({ queryKey: slotKeys.all(mentorId) })
    },
  })
}
