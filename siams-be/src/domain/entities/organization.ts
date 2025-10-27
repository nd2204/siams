import { Entity } from "@domain/interfaces";

export class Organization extends Entity<Organization, string> {
  declare name: string;
  declare slug: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}
