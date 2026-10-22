import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState, PageLoader } from '../../../components/feedback/States'
import { RatingStars } from '../../../components/shared/RatingStars'
import { formatMoney } from '../../../lib/utils/money'
import type { BookSessionLocationState } from '../../bookings/pages/BookSessionPage'
import { AvailabilityCalendar } from '../components/AvailabilityCalendar'
import { MentorAvatar } from '../components/MentorCard'
import { useMentor } from '../hooks/useMentors'

export default function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>()
  const navigate = useNavigate()
  const { data: mentor, isPending, isError, error, refetch } = useMentor(mentorId)

  if (isPending) return <PageLoader />
  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link to="/mentors" className="text-sm text-neutral-600 hover:underline">
        ← All mentors
      </Link>

      <section className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 sm:flex-row">
        <MentorAvatar mentor={mentor} size={96} />
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-bold">
            {mentor.firstName} {mentor.lastName}
          </h1>
          <p className="text-neutral-600">
            {mentor.title}
            {mentor.organization && ` at ${mentor.organization}`}
          </p>
          <RatingStars rating={mentor.rating} count={mentor.reviewCount} />
          <p className="text-sm text-neutral-600">
            {mentor.industry} · {mentor.experienceYears} years experience
          </p>
          {mentor.bio && <p className="max-w-prose whitespace-pre-line pt-2">{mentor.bio}</p>}
          <ul className="flex flex-wrap gap-1.5 pt-2">
            {mentor.expertise.map((e) => (
              <li key={e.expertiseId} className="rounded-full bg-neutral-100 px-3 py-1 text-xs">
                {e.name} <span className="text-neutral-500">· {e.proficiency}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatMoney(mentor.hourlyRate, mentor.currency)}</p>
          <p className="text-sm text-neutral-500">per hour</p>
        </div>
      </section>

      {mentor.verificationStatus === 'APPROVED' ? (
        <>
          <AvailabilityCalendar
            mentorId={mentor.id}
            onSelect={(slot) =>
              navigate(`/mentors/${mentor.id}/book`, {
                state: { slot } satisfies BookSessionLocationState,
              })
            }
          />
          <p className="text-sm text-neutral-500">Pick a time to start booking.</p>
        </>
      ) : (
        <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600">
          This mentor isn't accepting bookings yet.
        </p>
      )}
    </div>
  )
}
