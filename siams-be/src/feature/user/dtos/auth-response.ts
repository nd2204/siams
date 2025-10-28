import { PermissionKey } from "@domain/entities"

export class AuthResponse {
  user!: {
    id: string,
    name: string,
    email: string,
    organizations?: {
      id: string,
      role: string,
      permissions: PermissionKey[]
    }[]
  }
  token!: string
}
