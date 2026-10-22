import type { AccountStatus, IsoDateTime, Role, UUID } from '../../types'

/** UserProfileResponse */
export interface UserProfile {
  id: UUID
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  profileImageUrl?: string | null
  role: Role
  accountStatus: AccountStatus
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}
