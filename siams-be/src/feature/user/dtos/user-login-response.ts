export class UserLoginResponse {
  user!: {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    orgId?: string
  }
  token!: string
}
