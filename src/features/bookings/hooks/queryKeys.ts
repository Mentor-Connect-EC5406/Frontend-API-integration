import type { BookingStatus, UUID } from '../../../types'

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (status?: BookingStatus) => ['bookings', status ?? 'ALL'] as const,
  detail: (id: UUID) => ['booking', id] as const,
}
