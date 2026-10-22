import type { BookingStatus, IsoDateTime, PaymentStatus, UUID } from '../../types'

/** CreateBookingRequest */
export interface CreateBookingRequest {
  slotId: UUID
  topic: string
}

/** BookingResponse */
export interface BookingResponse {
  id: UUID
  studentId: UUID
  mentorId: UUID
  slotId: UUID
  scheduledStart: IsoDateTime
  scheduledEnd: IsoDateTime
  topic: string
  status: BookingStatus
  cancellationReason?: string | null
  rescheduledFromId?: UUID | null
  createdAt: IsoDateTime
  /**
   * Latest payment status, if the backend includes it.
   * TODO(backend): confirm — needed to tell "payment failed" from "still pending".
   */
  paymentStatus?: PaymentStatus | null
}
