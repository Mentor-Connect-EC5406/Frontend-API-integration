import type { IsoDateTime, PaymentStatus, UUID } from '../../types'

/** CheckoutRequest */
export interface CheckoutRequest {
  bookingId: UUID
}

/** CheckoutResponse — Lemon Squeezy hosted checkout session. */
export interface CheckoutResponse {
  checkoutUrl: string
  paymentId: UUID
}

/** PaymentResponse */
export interface Payment {
  id: UUID
  bookingId: UUID
  amount: number
  currency: string
  provider: string
  transactionId?: string | null
  status: PaymentStatus
  paidAt?: IsoDateTime | null
}
