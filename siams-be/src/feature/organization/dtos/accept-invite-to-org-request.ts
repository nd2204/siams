import { OrganizationId } from "@domain/entities/organization"

export interface AcceptInviteToOrgRequest {
  token: string,
  invite_token: string,
}

export interface AcceptInviteToOrgResponse {
  org_id: OrganizationId
}
