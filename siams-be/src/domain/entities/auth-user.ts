import { User } from "@domain/entities"
import Entity from "@domain/entity"

export class AuthUser extends User {
  password: string
  salt: string
  confirmPassword?: string

  constructor(args?: Partial<AuthUser>) {
    super(args)
    Object.assign(this, args)
  }
}
