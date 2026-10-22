import { useMutation } from '@tanstack/react-query'
import { ApiError } from '../../../lib/api/errors'
import { paymentsApi } from '../api/payments.api'
import type { CheckoutRequest, CheckoutResponse } from '../types'

const assertSafeCheckoutUrl = (url: string) => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new ApiError(0, 'Received an invalid checkout link.')
  }
  if (parsed.protocol !== 'https:') throw new ApiError(0, 'Received an insecure checkout link.')
}

/**
 * Creates a Lemon Squeezy checkout for a PENDING booking and sends the browser
 * to the hosted checkout page. Lemon Squeezy redirects back to
 * /bookings/:id/processing (configured on the backend).
 */
export const useCheckout = () =>
  useMutation<CheckoutResponse, ApiError, CheckoutRequest>({
    mutationFn: async (b) => {
      const res = await paymentsApi.checkout(b)
      assertSafeCheckoutUrl(res.checkoutUrl)
      return res
    },
    onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
  })
