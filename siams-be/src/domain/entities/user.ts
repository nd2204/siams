import { Entity } from "@domain/interfaces";

export type UserId = string;

export class User extends Entity<User, UserId> {
  declare name: string;
  declare email: string;
  declare password?: string;
  declare salt?: string;
  is_active?: boolean;
  created_at?: Date = new Date()
  // preferences?: Record<string, unknown>;
  // permission?: Record<string, unknown>; // Map cluster id to permission
}
