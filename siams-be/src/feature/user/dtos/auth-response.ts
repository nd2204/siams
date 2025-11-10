import { PermissionKey } from "@domain/entities"

export class AuthResponse {
  user!: {
    id: string,
    name: string,
    email: string,
    organizations?: {
      id: string,
      name: string,
      slug: string,
      role: string,
      permissions: PermissionKey[]
    }[]
  }
  token!: string
}
