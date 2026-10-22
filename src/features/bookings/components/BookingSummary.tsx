import { formatDateTimeRange } from '../../../lib/utils/date'
import { formatMoney } from '../../../lib/utils/money'
import type { MentorDetail } from '../../mentors/types'

interface Props {
  mentor?: MentorDetail
  start: string
  end: string
  timeZone: string
  topic?: string
}

const HOUR_MS = 60 * 60 * 1000

export function BookingSummary({ mentor, start, end, timeZone, topic }: Props) {
  const hours = (new Date(end).getTime() - new Date(start).getTime()) / HOUR_MS
  return (
    <dl className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-5 text-sm sm:grid-cols-[8rem_1fr]">
      {mentor && (
        <>
          <dt className="text-neutral-500">Mentor</dt>
          <dd className="font-medium">
            {mentor.firstName} {mentor.lastName}
          </dd>
        </>
      )}
      <dt className="text-neutral-500">When</dt>
      <dd className="font-medium">
        {formatDateTimeRange(start, end, timeZone)}{' '}
        <span className="font-normal text-neutral-500">({timeZone})</span>
      </dd>
      {topic && (
        <>
          <dt className="text-neutral-500">Topic</dt>
          <dd className="whitespace-pre-line">{topic}</dd>
        </>
      )}
      {mentor && (
        <>
          <dt className="text-neutral-500">Estimated price</dt>
          <dd className="font-semibold">
            {formatMoney(mentor.hourlyRate * hours, mentor.currency)}
            <span className="ml-1 font-normal text-neutral-500">
              (final amount shown at checkout)
            </span>
          </dd>
        </>
      )}
    </dl>
  )
}
