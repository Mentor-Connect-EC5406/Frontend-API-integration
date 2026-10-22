import { useQuery } from '@tanstack/react-query'
import type { BookingStatus } from '../../../types'
import { bookingsApi } from '../api/bookings.api'
import { bookingKeys } from './queryKeys'

export const useBookings = (status?: BookingStatus) =>
  useQuery({
    queryKey: bookingKeys.list(status),
    queryFn: () => bookingsApi.list(status),
  })
