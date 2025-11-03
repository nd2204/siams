import { Entity } from "@domain/interfaces";

export class User extends Entity<User, string> {
  declare name: string;
  declare email: string;
  declare password?: string
  declare salt?: string
  // preferences?: Record<string, unknown>;
  // permission?: Record<string, unknown>; // Map cluster id to permission
}
