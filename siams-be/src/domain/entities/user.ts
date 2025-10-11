export type Role = 'admin' | 'operator' | 'viewer';

export class User {
  constructor(
    public userId: string,
    public email: string,
    public roles: Role[] = ['viewer'],
    public preferences?: Record<string, any>
  ) { }
}
