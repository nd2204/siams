import { Entity } from "@domain/interfaces";

export class OrganizationUser extends Entity<OrganizationUser, string> {
  declare orgId: string;
  declare userId: string;
  declare roleId: string;
  declare invitedBy?: string;
  declare acceptedAt?: Date;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}
