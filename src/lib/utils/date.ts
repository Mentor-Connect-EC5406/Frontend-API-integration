import type { IsoDateTime } from '../../types'

const DAY_MS = 24 * 60 * 60 * 1000

export const localTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

/** "YYYY-MM-DD" for the calendar day `date` falls on in `timeZone`. */
export const dayKey = (date: Date | IsoDateTime, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))

export const formatTime = (iso: IsoDateTime, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, { timeZone, hour: 'numeric', minute: '2-digit' }).format(
    new Date(iso),
  )

export const formatDate = (iso: IsoDateTime | Date, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))

export const formatDateTimeRange = (start: IsoDateTime, end: IsoDateTime, timeZone: string) =>
  `${formatDate(start, timeZone)}, ${formatTime(start, timeZone)} – ${formatTime(end, timeZone)}`

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS)

/** Local midnight of the Monday on or before `date`. */
export const startOfWeek = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const offset = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - offset)
  return d
}

export const isPast = (iso: IsoDateTime) => new Date(iso).getTime() <= Date.now()
