import { UserClaims } from "./user-claims"

export class AuthResponse {
  user!: UserClaims
  token!: string
}
