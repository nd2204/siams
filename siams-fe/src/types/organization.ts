import type { PermissionKey } from "@/types/role"
import type { UserData } from "./user";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrgRole =
  | "ORG_OWNER"
  | "ORG_ADMIN"
  | "ORG_VIEWER"
  | "ORG_OPERATOR"

export function roleSanitized(role: OrgRole) {
  return role.split("_").slice(1)[0].toLowerCase();
}

export type OrganizationUser = {
  user_id: UserData["id"],
  user_name: UserData["name"],
  user_email: UserData["email"],
  role_name: OrgRole,
  permissions: PermissionKey[],
  joined_at: Date
}

export type UserOrgInfo = {
  id: string,
  name: string,
  slug: string,
  role: OrgRole,
  permissions: PermissionKey[]
}

export interface CreateOrganizationRequest { name: string; slug: string; userId: string; }
export type CreateOrganizationResponse = UserOrgInfo

export interface InviteUserToOrgRequest { orgId: string }
export interface InviteUserToOrgResponse { success: boolean, message: string }
