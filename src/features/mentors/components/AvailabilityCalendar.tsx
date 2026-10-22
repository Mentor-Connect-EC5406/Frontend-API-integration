import { useMemo, useState } from 'react'
import { ErrorState } from '../../../components/feedback/States'
import { Button, Spinner } from '../../../components/ui/Button'
import {
  addDays,
  dayKey,
  formatDate,
  localTimeZone,
  startOfWeek,
} from '../../../lib/utils/date'
import type { UUID } from '../../../types'
import { useMentorWeekSlots } from '../hooks/useMentorSlots'
import type { AvailabilitySlot } from '../types'
import { SlotChip } from './SlotChip'

interface Props {
  mentorId: UUID
  selectedSlotId?: UUID
  onSelect: (slot: AvailabilitySlot) => void
}

/** Week view of a mentor's slots, shown in the slot's (mentor's) timezone. */
export function AvailabilityCalendar({ mentorId, selectedSlotId, onSelect }: Props) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const { data: slots, isPending, isFetching, isError, error, refetch } = useMentorWeekSlots(
    mentorId,
    weekStart,
  )

  const timeZone = slots?.[0]?.timezone ?? localTimeZone()
  const isCurrentWeek = weekStart.getTime() <= startOfWeek(new Date()).getTime()

  const days = useMemo(() => {
    // Noon avoids DST/offset edges when mapping a local day onto `timeZone`.
    const columns = Array.from({ length: 7 }, (_, i) => {
      const noon = addDays(weekStart, i)
      noon.setHours(12)
      return { key: dayKey(noon, timeZone), date: noon, slots: [] as AvailabilitySlot[] }
    })
    const byKey = new Map(columns.map((c) => [c.key, c]))
    for (const s of slots ?? []) byKey.get(dayKey(s.startTime, timeZone))?.slots.push(s)
    for (const c of columns) c.slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
    return columns
  }, [slots, weekStart, timeZone])

  const hasAny = days.some((d) => d.slots.length > 0)

  return (
    <section aria-label="Availability" className="rounded-xl border border-neutral-200 bg-white p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Availability</h2>
          <p className="text-xs text-neutral-500">Times shown in {timeZone}</p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && <Spinner className="text-neutral-400" />}
          <Button
            variant="ghost"
            disabled={isCurrentWeek}
            onClick={() => setWeekStart((w) => addDays(w, -7))}
            aria-label="Previous week"
          >
            ‹
          </Button>
          <span className="min-w-36 text-center text-sm font-medium">
            {formatDate(days[0].date, timeZone)} – {formatDate(days[6].date, timeZone)}
          </span>
          <Button
            variant="ghost"
            onClick={() => setWeekStart((w) => addDays(w, 7))}
            aria-label="Next week"
          >
            ›
          </Button>
        </div>
      </header>

      {isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {days.map((d) => (
              <div key={d.key} className="min-w-0">
                <p className="mb-2 text-center text-xs font-semibold uppercase text-neutral-500">
                  {formatDate(d.date, timeZone)}
                </p>
                <div className="flex flex-col gap-1.5">
                  {d.slots.map((s) => (
                    <SlotChip
                      key={s.id}
                      slot={s}
                      timeZone={timeZone}
                      selected={s.id === selectedSlotId}
                      onSelect={onSelect}
                    />
                  ))}
                  {!isPending && d.slots.length === 0 && (
                    <p className="text-center text-xs text-neutral-300">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!isPending && !hasAny && (
            <p className="mt-4 text-center text-sm text-neutral-500">
              No slots this week. Try the next week.
            </p>
          )}
        </>
      )}
    </section>
  )
}
