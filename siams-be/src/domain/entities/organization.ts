import { Entity } from "@domain/interfaces";

export type OrganizationId = string

export class Organization extends Entity<Organization, OrganizationId> {
  declare name: string;
  declare slug: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}
