import Entity from "@domain/entity";

export type Role = 'admin' | 'operator' | 'viewer';
export type Permission = '' | ''

export class User extends Entity<User, string> {
  firstName: string;
  lastName: string;
  email!: string;
  roles: Role[] = ['viewer'];
  preferences?: Record<string, unknown>;
  permission?: Record<string, unknown>; // Map cluster id to permission
}
