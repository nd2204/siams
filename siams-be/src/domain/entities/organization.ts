import { Entity } from "@domain/interfaces";

export class Organization extends Entity<Organization, string> {
  declare name: string;
  declare created_at: Date;
}
