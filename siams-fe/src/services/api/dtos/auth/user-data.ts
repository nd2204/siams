import type { PermissionKey } from "@/types/role"

export type OrgRole =
  | "ORG_OWNER"
  | "ORG_ADMIN"
  | "ORG_VIEWER"

export function roleSanitized(role: OrgRole) {
  return role.split("_").slice(1)[0].toLowerCase();
}

export type OrganizationUserData = {
  id: string,
  name: string,
  slug: string,
  role: OrgRole,
  permissions: PermissionKey[]
}

export type UserData = {
  id: string,
  name: string,
  email: string,
  organizations?: OrganizationUserData[]
}

