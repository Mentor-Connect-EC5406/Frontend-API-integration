import { cn } from '../../../lib/utils/cn'
import { formatTime, isPast } from '../../../lib/utils/date'
import type { SlotStatus } from '../../../types'
import type { AvailabilitySlot } from '../types'

const unavailableLabel: Record<Exclude<SlotStatus, 'AVAILABLE'>, string> = {
  HELD: 'On hold',
  BOOKED: 'Booked',
  BLOCKED: 'Unavailable',
}

interface Props {
  slot: AvailabilitySlot
  timeZone: string
  selected?: boolean
  onSelect?: (slot: AvailabilitySlot) => void
}

/** Only AVAILABLE, future slots are clickable; HELD/BOOKED/BLOCKED render disabled. */
export function SlotChip({ slot, timeZone, selected, onSelect }: Props) {
  const bookable = slot.status === 'AVAILABLE' && !isPast(slot.startTime)
  const time = formatTime(slot.startTime, timeZone)
  const reason = slot.status === 'AVAILABLE' ? 'Past' : unavailableLabel[slot.status]

  return (
    <button
      type="button"
      disabled={!bookable}
      aria-pressed={selected}
      aria-label={bookable ? `Select ${time}` : `${time}, ${reason}`}
      onClick={() => onSelect?.(slot)}
      className={cn(
        'w-full rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
        bookable && !selected && 'border-ink bg-white hover:bg-brand',
        bookable && selected && 'border-ink bg-ink text-brand',
        !bookable && 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through',
      )}
    >
      {time}
    </button>
  )
}
