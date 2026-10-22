import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState } from '../../../components/feedback/States'
import { Button, ButtonLink, Spinner } from '../../../components/ui/Button'
import { localTimeZone } from '../../../lib/utils/date'
import { BookingSummary } from '../components/BookingSummary'
import { useBookingPolling } from '../hooks/useBookingPolling'

/** Lemon Squeezy redirects here after checkout: /bookings/:bookingId/processing */
export default function BookingProcessingPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  // Remount per booking so the polling timeout restarts.
  return <BookingProcessing key={bookingId} bookingId={bookingId} />
}

function BookingProcessing({ bookingId }: { bookingId?: string }) {
  const { data: booking, outcome, error, refetch, isFetching } = useBookingPolling(bookingId)

  const summary = booking && (
    <BookingSummary
      start={booking.scheduledStart}
      end={booking.scheduledEnd}
      timeZone={localTimeZone()}
      topic={booking.topic}
    />
  )

  let body: ReactNode
  switch (outcome) {
    case 'pending':
      body = (
        <Panel title="Confirming your payment…" icon={<Spinner className="size-6" />}>
          <p>This usually takes a few seconds. Please don't close this page.</p>
        </Panel>
      )
      break
    case 'confirmed':
      body = (
        <Panel title="You're booked!" icon={<span className="text-3xl">✓</span>}>
          <p>Payment received and your session is confirmed. We've sent you an email with the details.</p>
          {summary}
          <ButtonLink to="/mentors">Browse more mentors</ButtonLink>
        </Panel>
      )
      break
    case 'failed':
      body = (
        <Panel title="Payment didn't go through" icon={<span className="text-3xl">✕</span>}>
          <p>
            {booking?.cancellationReason ??
              'The payment failed or the hold on your slot expired. You have not been charged.'}
          </p>
          {booking && (
            <ButtonLink to={`/mentors/${booking.mentorId}`}>Choose another time</ButtonLink>
          )}
        </Panel>
      )
      break
    case 'timeout':
      body = (
        <Panel title="Still processing" icon={<span className="text-3xl">⏳</span>}>
          <p>
            Your payment is taking longer than usual to confirm. We'll notify you as soon as it's
            done — you don't need to pay again.
          </p>
          {summary}
          <Button variant="ghost" onClick={() => refetch()} loading={isFetching}>
            Check again
          </Button>
        </Panel>
      )
      break
    case 'error':
      body = <ErrorState error={error} onRetry={() => refetch()} />
      break
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12" aria-live="polite">
      {body}
    </div>
  )
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-8 text-center">
      {icon}
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex w-full flex-col items-center gap-4 text-neutral-600">{children}</div>
    </section>
  )
}
