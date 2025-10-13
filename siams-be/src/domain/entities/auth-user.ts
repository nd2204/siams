import User from "@domain/entities/user.js"

export default class AuthUser extends User {
  password!: string
  salt!: string
  confirmPassword?: string
}
