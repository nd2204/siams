import type { PermissionKey } from "@/lib/types"

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

