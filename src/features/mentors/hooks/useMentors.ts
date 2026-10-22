import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { UUID } from '../../../types'
import { mentorsApi } from '../api/mentors.api'
import type { MentorFilters } from '../types'
import { mentorKeys } from './queryKeys'

export const useMentors = (f: MentorFilters) =>
  useQuery({
    queryKey: mentorKeys.list(f),
    queryFn: () => mentorsApi.list(f),
    // Keep the current page on screen while the next page/filter loads.
    placeholderData: keepPreviousData,
  })

export const useMentor = (id: UUID | undefined) =>
  useQuery({
    queryKey: mentorKeys.detail(id ?? ''),
    queryFn: () => mentorsApi.get(id!),
    enabled: !!id,
  })
