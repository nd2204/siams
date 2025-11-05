import type { PermissionKey } from "@/types/role"

export type UserData = {
  id: string,
  name: string,
  email: string,
  organizations?: {
    id: string,
    role: string,
    permissions: PermissionKey[]
  }[]
}

