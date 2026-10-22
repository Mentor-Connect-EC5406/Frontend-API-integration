import { api } from '../../../lib/api/client'
import type { CheckoutRequest, CheckoutResponse, Payment } from '../types'

// The Lemon Squeezy webhook endpoint is server-to-server only — never call it here.
export const paymentsApi = {
  checkout: (b: CheckoutRequest) =>
    api.post<CheckoutResponse>('/api/payments/checkout', b).then((r) => r.data),
  list: () => api.get<Payment[]>('/api/payments').then((r) => r.data),
}
