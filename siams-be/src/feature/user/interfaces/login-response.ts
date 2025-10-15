import { User } from "@/domain/entities";

export class UserLoginRO {
  user!: Partial<User>
  token!: string
}
