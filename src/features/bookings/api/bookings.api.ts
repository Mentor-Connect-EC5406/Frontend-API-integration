import { api } from '../../../lib/api/client'
import type { BookingStatus, UUID } from '../../../types'
import type { BookingResponse, CreateBookingRequest } from '../types'

export const bookingsApi = {
  /** 409 when the slot is no longer AVAILABLE (pessimistic lock lost). */
  create: (b: CreateBookingRequest) =>
    api.post<BookingResponse>('/api/bookings', b).then((r) => r.data),
  list: (status?: BookingStatus) =>
    api.get<BookingResponse[]>('/api/bookings', { params: { status } }).then((r) => r.data),
  /** TODO(backend): confirm GET /api/bookings/{id} exists — required for polling. */
  get: (id: UUID) => api.get<BookingResponse>(`/api/bookings/${id}`).then((r) => r.data),
}
