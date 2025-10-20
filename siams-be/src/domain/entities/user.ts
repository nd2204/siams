import { Entity } from "@domain/interfaces";

export type Role = 'admin' | 'operator' | 'viewer';
export type Permission = '' | ''

export class User extends Entity<User, string> {
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare orgId?: string;
  declare password: string
  declare salt: string
  // preferences?: Record<string, unknown>;
  // permission?: Record<string, unknown>; // Map cluster id to permission
}
