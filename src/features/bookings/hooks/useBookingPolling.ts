import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { ApiError } from '../../../lib/api/errors'
import type { UUID } from '../../../types'
import { bookingsApi } from '../api/bookings.api'
import type { BookingResponse } from '../types'
import { bookingKeys } from './queryKeys'

export type BookingOutcome = 'pending' | 'confirmed' | 'failed' | 'timeout' | 'error'

interface Options {
  intervalMs?: number
  timeoutMs?: number
}

const isAwaitingPayment = (b: BookingResponse | undefined) =>
  !!b && b.status === 'PENDING' && b.paymentStatus !== 'FAILED'

const outcomeOf = (b: BookingResponse | undefined, timedOut: boolean): BookingOutcome => {
  if (!b) return 'pending'
  if (b.status === 'CONFIRMED' || b.status === 'COMPLETED') return 'confirmed'
  if (b.status === 'CANCELLED' || b.paymentStatus === 'FAILED') return 'failed'
  if (b.status === 'PENDING') return timedOut ? 'timeout' : 'pending'
  // RESCHEDULED / NO_SHOW aren't reachable from checkout; treat as settled.
  return 'confirmed'
}

/**
 * Polls a booking after the Lemon Squeezy redirect until the webhook confirms
 * it. The redirect alone never means "paid" — only the backend status does.
 */
export const useBookingPolling = (
  id: UUID | undefined,
  { intervalMs = 2_500, timeoutMs = 60_000 }: Options = {},
) => {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), timeoutMs)
    return () => window.clearTimeout(t)
  }, [id, timeoutMs])

  const query = useQuery<BookingResponse, ApiError>({
    queryKey: bookingKeys.detail(id ?? ''),
    queryFn: () => bookingsApi.get(id!),
    enabled: !!id,
    staleTime: 0,
    refetchInterval: (q) => (!timedOut && isAwaitingPayment(q.state.data) ? intervalMs : false),
    refetchIntervalInBackground: true,
  })

  const outcome: BookingOutcome =
    query.isError && !query.data ? 'error' : outcomeOf(query.data, timedOut)

  return { ...query, outcome }
}
