import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import type { MentorFilters } from '../types'

export const MENTOR_PAGE_SIZE = 12

const optionalNumber = z.coerce.number().nonnegative().optional().catch(undefined)
const optionalString = z.string().trim().min(1).optional().catch(undefined)

// Parses untrusted URL params; anything malformed is silently dropped.
const urlFiltersSchema = z.object({
  expertiseId: optionalString,
  industry: optionalString,
  minRating: optionalNumber,
  maxRate: optionalNumber,
  minExperience: optionalNumber,
  sort: optionalString,
  page: z.coerce.number().int().nonnegative().catch(0),
})

/**
 * Mentor filters backed by the URL query string, so filtered/paged views are
 * shareable and survive refresh/back navigation.
 */
export const useMentorFilterParams = () => {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<MentorFilters>(() => {
    const parsed = urlFiltersSchema.parse(Object.fromEntries(params))
    return { ...parsed, size: MENTOR_PAGE_SIZE }
  }, [params])

  /** Merges `next` into the current filters. Changing any filter resets to page 0. */
  const setFilters = useCallback(
    (next: Partial<MentorFilters>) => {
      setParams((prev) => {
        const merged: Record<string, unknown> = {
          ...Object.fromEntries(prev),
          page: undefined,
          ...next,
        }
        const out = new URLSearchParams()
        for (const [k, v] of Object.entries(merged)) {
          if (k === 'size' || v === undefined || v === '' || (k === 'page' && v === 0)) continue
          out.set(k, String(v))
        }
        return out
      })
    },
    [setParams],
  )

  const clearFilters = useCallback(() => setParams(new URLSearchParams()), [setParams])

  return { filters, setFilters, clearFilters }
}
