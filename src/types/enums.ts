// Mirrors the backend Java enums. String unions (not TS enums) because
// `erasableSyntaxOnly` is on; the `as const` arrays are for dropdowns and Zod.

export const ROLES = ['STUDENT', 'MENTOR', 'ADMIN'] as const
export type Role = (typeof ROLES)[number]

export const ACCOUNT_STATUSES = ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'] as const
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

export const VERIFICATION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number]

export const SLOT_STATUSES = ['AVAILABLE', 'HELD', 'BOOKED', 'BLOCKED'] as const
export type SlotStatus = (typeof SLOT_STATUSES)[number]

export const BOOKING_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED',
  'NO_SHOW',
] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const SESSION_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
export type SessionStatus = (typeof SESSION_STATUSES)[number]

export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const REFUND_STATUSES = ['PENDING', 'COMPLETED', 'FAILED'] as const
export type RefundStatus = (typeof REFUND_STATUSES)[number]

export const PROGRAM_STATUSES = ['ACTIVE', 'COMPLETED', 'CANCELLED'] as const
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number]

export const GOAL_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const
export type GoalStatus = (typeof GOAL_STATUSES)[number]

export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const NOTE_VISIBILITIES = ['PRIVATE', 'SHARED'] as const
export type NoteVisibility = (typeof NOTE_VISIBILITIES)[number]

export const REPORT_STATUSES = ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'] as const
export type ReportStatus = (typeof REPORT_STATUSES)[number]
