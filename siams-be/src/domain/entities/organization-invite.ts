import { Entity } from "@domain/interfaces";
import { UserId } from "./user";

export type OrganizationInviteId = string

export class OrganizationInvite extends Entity<string, OrganizationInviteId> {
  declare org_id: string
  declare email: string
  declare role_id: string
  declare token: string
  declare invited_by: UserId
  declare expires_at: Date
  accepted?: boolean = false
  created_at?: Date = new Date()

  static isExprired(invite: OrganizationInvite) {
    return invite.expires_at.getTime() - Date.now() <= 0
  }
}
