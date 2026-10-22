import type { UUID } from '../../types'

export interface Expertise {
  id: UUID
  categoryId: UUID
  name: string
  description?: string | null
}

/** ExpertiseCategoryResponse — a category with its expertise items. */
export interface ExpertiseCategory {
  id: UUID
  name: string
  description?: string | null
  expertises: Expertise[]
}
