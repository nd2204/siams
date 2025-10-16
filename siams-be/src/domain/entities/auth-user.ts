import { User } from "@domain/entities"
import Entity from "@domain/entity"

export class AuthUser extends User {
  declare password: string
  declare salt: string
  confirmPassword?: string

  constructor(args?: Partial<AuthUser>) {
    super(args)
    Object.assign(this, args)
  }
}
