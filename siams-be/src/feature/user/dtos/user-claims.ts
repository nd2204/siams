import { PermissionKey } from "@domain/entities"

export interface UserClaims {
  id: string,
  name: string,
  email: string,
  organizations?: {
    id: string,
    name: string,
    slug: string,
    role: string,
    permissions: Set<PermissionKey>
  }[]
}
