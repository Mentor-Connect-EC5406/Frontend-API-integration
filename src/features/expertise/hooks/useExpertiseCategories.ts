import { useQuery } from '@tanstack/react-query'
import { expertiseApi } from '../api/expertise.api'

export const useExpertiseCategories = () =>
  useQuery({
    queryKey: ['expertise-categories'],
    queryFn: expertiseApi.categories,
    // Taxonomy is admin-managed and rarely changes.
    staleTime: 60 * 60_000,
  })
