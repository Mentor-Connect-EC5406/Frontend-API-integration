import { Link } from 'react-router-dom'
import { RatingStars } from '../../../components/shared/RatingStars'
import { formatMoney } from '../../../lib/utils/money'
import type { MentorSummary } from '../types'

export function MentorAvatar({ mentor, size = 56 }: { mentor: MentorSummary; size?: number }) {
  const initials = `${mentor.firstName[0] ?? ''}${mentor.lastName[0] ?? ''}`
  return mentor.profileImageUrl ? (
    <img
      src={mentor.profileImageUrl}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-brand"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  )
}

export function MentorCard({ mentor }: { mentor: MentorSummary }) {
  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <MentorAvatar mentor={mentor} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold">
            <Link to={`/mentors/${mentor.id}`} className="hover:underline">
              {mentor.firstName} {mentor.lastName}
            </Link>
          </h3>
          <p className="truncate text-sm text-neutral-600">
            {mentor.title}
            {mentor.organization && ` · ${mentor.organization}`}
          </p>
          <RatingStars rating={mentor.rating} count={mentor.reviewCount} />
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {mentor.expertise.slice(0, 4).map((e) => (
          <li key={e.expertiseId} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs">
            {e.name}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between pt-4 text-sm">
        <span className="text-neutral-600">
          {mentor.industry} · {mentor.experienceYears} yrs
        </span>
        <span className="font-semibold">
          {formatMoney(mentor.hourlyRate, mentor.currency)}
          <span className="font-normal text-neutral-500">/hr</span>
        </span>
      </div>
    </article>
  )
}
