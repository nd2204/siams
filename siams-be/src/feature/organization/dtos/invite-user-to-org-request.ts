import { OrganizationInvite } from "@domain/entities/organization-invite"

export interface InviteUserToOrgRequest {
  token: string,
  org_id: string,
  email: string,
  role: string
}

export type InviteUserToOrgResponse = OrganizationInvite
