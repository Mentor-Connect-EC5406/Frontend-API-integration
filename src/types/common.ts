/** UUID as serialised by Spring (java.util.UUID -> string). */
export type UUID = string

/** ISO-8601 timestamp in UTC (java.time.Instant / OffsetDateTime). */
export type IsoDateTime = string

/** ISO-8601 calendar date, e.g. "2026-10-22" (java.time.LocalDate). */
export type IsoDate = string

/**
 * Spring Data `Page<T>` serialisation.
 * TODO(backend): confirm shape — Spring Boot 3.3+ with `VIA_DTO` nests the
 * paging fields under `page` instead.
 */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  /** Zero-based page index. */
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface PageRequest {
  /** Zero-based page index. */
  page?: number
  size?: number
  /** Spring sort syntax, e.g. "rating,desc". */
  sort?: string
}

/** Error body returned by the backend's @ControllerAdvice. */
export interface ApiErrorBody {
  status?: number
  message?: string
  code?: string
  /** Field name -> message, from DTO (@Valid) failures. */
  errors?: Record<string, string>
  timestamp?: IsoDateTime
  path?: string
}
