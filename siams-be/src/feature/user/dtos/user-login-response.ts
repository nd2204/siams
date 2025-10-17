import { User } from "@/domain/entities";

export class UserLoginResponse {
  user!: Partial<User>
  token!: string
}
