import { cn } from '../../../lib/utils/cn'

export const BOOKING_STEPS = ['slot', 'details', 'review'] as const
export type BookingStep = (typeof BOOKING_STEPS)[number]

const labels: Record<BookingStep, string> = {
  slot: 'Choose a time',
  details: 'Session topic',
  review: 'Review & pay',
}

export function BookingStepper({ current }: { current: BookingStep }) {
  const currentIndex = BOOKING_STEPS.indexOf(current)
  return (
    <ol className="flex gap-2 text-sm" aria-label="Booking progress">
      {BOOKING_STEPS.map((step, i) => (
        <li
          key={step}
          aria-current={step === current ? 'step' : undefined}
          className={cn(
            'flex flex-1 items-center gap-2 border-t-4 pt-2',
            i <= currentIndex ? 'border-brand font-semibold' : 'border-neutral-200 text-neutral-500',
          )}
        >
          <span className="tabular-nums">{i + 1}.</span>
          {labels[step]}
        </li>
      ))}
    </ol>
  )
}
