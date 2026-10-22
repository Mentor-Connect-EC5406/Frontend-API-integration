import type {
  IsoDateTime,
  PageRequest,
  SlotStatus,
  UUID,
  VerificationStatus,
} from '../../types'

export interface MentorExpertise {
  expertiseId: UUID
  name: string
  categoryName?: string
  proficiency: string
}

/** MentorSummaryResponse — one card in the browse list. */
export interface MentorSummary {
  /** MentorProfile id (used in /api/mentors/{id}). */
  id: UUID
  userId: UUID
  firstName: string
  lastName: string
  profileImageUrl?: string | null
  title: string
  organization?: string | null
  industry: string
  experienceYears: number
  /** BigDecimal; booking price per hour. */
  hourlyRate: number
  currency?: string
  /** Aggregate of review ratings, 0–5. */
  rating: number
  reviewCount?: number
  expertise: MentorExpertise[]
}

/** MentorDetailResponse */
export interface MentorDetail extends MentorSummary {
  bio?: string | null
  verificationStatus: VerificationStatus
}

/** Query params for GET /api/mentors. */
export interface MentorFilters extends PageRequest {
  expertiseId?: UUID
  industry?: string
  minRating?: number
  maxRate?: number
  minExperience?: number
  availableFrom?: IsoDateTime
}

/** AvailabilitySlotResponse */
export interface AvailabilitySlot {
  id: UUID
  mentorId: UUID
  startTime: IsoDateTime
  endTime: IsoDateTime
  /** IANA zone the mentor works in, e.g. "Asia/Colombo". */
  timezone: string
  status: SlotStatus
}
