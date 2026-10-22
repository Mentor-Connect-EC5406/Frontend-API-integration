import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ErrorState, PageLoader } from '../../../components/feedback/States'
import { Button } from '../../../components/ui/Button'
import { AvailabilityCalendar } from '../../mentors/components/AvailabilityCalendar'
import { useMentor } from '../../mentors/hooks/useMentors'
import type { AvailabilitySlot } from '../../mentors/types'
import { useCheckout } from '../../payments/hooks/useCheckout'
import { BookingStepper, type BookingStep } from '../components/BookingStepper'
import { BookingSummary } from '../components/BookingSummary'
import { useCreateBooking } from '../hooks/useCreateBooking'
import { bookingTopicSchema, type BookingTopicForm } from '../schemas/bookingSchema'
import type { BookingResponse } from '../types'

/** Router state passed from the mentor profile when a slot is picked there. */
export interface BookSessionLocationState {
  slot?: AvailabilitySlot
}

export default function BookSessionPage() {
  const { mentorId = '' } = useParams<{ mentorId: string }>()
  const location = useLocation()
  const preselected = (location.state as BookSessionLocationState | null)?.slot

  const mentorQuery = useMentor(mentorId)
  const createBooking = useCreateBooking(mentorId)
  const checkout = useCheckout()

  const [slot, setSlot] = useState<AvailabilitySlot | undefined>(preselected)
  const [step, setStep] = useState<BookingStep>(preselected ? 'details' : 'slot')
  const [slotTakenNotice, setSlotTakenNotice] = useState(false)
  // Once created, the booking (and its HELD slot) is reused for checkout retries.
  const [booking, setBooking] = useState<BookingResponse>()

  const form = useForm<BookingTopicForm>({
    resolver: zodResolver(bookingTopicSchema),
    defaultValues: { topic: '' },
  })

  const chooseSlot = (s: AvailabilitySlot) => {
    setSlot(s)
    setSlotTakenNotice(false)
    setStep('details')
  }

  const startCheckout = (bookingId: string) => checkout.mutate({ bookingId })

  const confirm = () => {
    if (booking) return startCheckout(booking.id)
    if (!slot) return setStep('slot')

    createBooking.mutate(
      { slotId: slot.id, topic: form.getValues('topic') },
      {
        onSuccess: (b) => {
          setBooking(b)
          startCheckout(b.id)
        },
        onError: (err) => {
          if (err.isConflict) {
            // Slot was taken between selection and confirm; slots are refetched by the hook.
            setSlot(undefined)
            setSlotTakenNotice(true)
            setStep('slot')
          } else if (err.fieldErrors?.topic) {
            form.setError('topic', { message: err.fieldErrors.topic })
            setStep('details')
          }
        },
      },
    )
  }

  if (mentorQuery.isPending) return <PageLoader />
  if (mentorQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ErrorState error={mentorQuery.error} onRetry={() => mentorQuery.refetch()} />
      </div>
    )
  }
  const mentor = mentorQuery.data

  const submitting = createBooking.isPending || checkout.isPending || checkout.isSuccess
  const bookingError = createBooking.error && !createBooking.error.isConflict ? createBooking.error : null

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link to={`/mentors/${mentor.id}`} className="text-sm text-neutral-600 hover:underline">
        ← Back to {mentor.firstName}'s profile
      </Link>
      <h1 className="text-2xl font-bold">
        Book a session with {mentor.firstName} {mentor.lastName}
      </h1>
      <BookingStepper current={step} />

      {step === 'slot' && (
        <>
          {slotTakenNotice && (
            <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
              <p className="font-semibold">That slot is no longer available</p>
              <p>Someone else booked it moments ago. Please choose another time.</p>
            </div>
          )}
          <AvailabilityCalendar mentorId={mentor.id} selectedSlotId={slot?.id} onSelect={chooseSlot} />
        </>
      )}

      {step === 'details' && slot && (
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(() => setStep('review'))}
          noValidate
        >
          <BookingSummary
            mentor={mentor}
            start={slot.startTime}
            end={slot.endTime}
            timeZone={slot.timezone}
          />
          <label className="block text-sm font-medium">
            What would you like to discuss?
            <textarea
              {...form.register('topic')}
              rows={4}
              aria-invalid={!!form.formState.errors.topic}
              placeholder="e.g. Reviewing my resume for software engineering internships"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          {form.formState.errors.topic && (
            <p className="text-sm text-red-600">{form.formState.errors.topic.message}</p>
          )}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep('slot')} disabled={!!booking}>
              Change time
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      )}

      {step === 'review' && slot && (
        <div className="space-y-4">
          <BookingSummary
            mentor={mentor}
            start={slot.startTime}
            end={slot.endTime}
            timeZone={slot.timezone}
            topic={form.getValues('topic')}
          />

          {bookingError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {bookingError.message}
            </div>
          )}
          {checkout.isError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">We couldn't start the payment</p>
              <p>{checkout.error.message} Your slot is still held — please try again.</p>
            </div>
          )}

          <p className="text-sm text-neutral-500">
            Your slot is held while you pay. The booking is confirmed once payment succeeds.
          </p>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep('details')} disabled={submitting || !!booking}>
              Back
            </Button>
            <Button onClick={confirm} loading={submitting}>
              {checkout.isSuccess
                ? 'Redirecting to checkout…'
                : booking
                  ? 'Retry payment'
                  : 'Confirm & pay'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
