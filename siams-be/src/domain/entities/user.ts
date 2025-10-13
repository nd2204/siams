import Entity from "@shared/entity.js";

export type Role = 'admin' | 'operator' | 'viewer';

export default class User extends Entity<User> {
  userId!: string;
  email!: string;
  roles: Role[] = ['viewer'];
  preferences?: Record<string, unknown>;
}
