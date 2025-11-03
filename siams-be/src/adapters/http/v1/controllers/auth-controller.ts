import { IRequest } from '@shared/interfaces'
import { AuthResponse } from '@feature/user/dtos/auth-response'
import { User } from '@domain/entities'
import * as u from '@/feature/user'

export default class AuthController {
  constructor(
    protected registerUser: u.RegisterUserUC,
    protected loginUser: u.LoginUserUC,
    protected authorizeUser: u.AuthorizeUserUC,
    protected updateProfile: u.UpdateUserUC,
    protected getProfile: u.UserProfileUC,
  ) { }

  async register(req: IRequest): Promise<AuthResponse> {
    const result = await this.registerUser.call(req.body)
    return result
  }

  async login(req: IRequest): Promise<AuthResponse> {
    return this.loginUser.call(req.body)
  }

  async update(request: IRequest): Promise<boolean> {
    const user = await this.authorizeUser.call(request.token)
    return this.updateProfile.call(user.id, request.body)
  }

  async me(request: IRequest): Promise<User> {
    const user = await this.authorizeUser.call(request.token)
    return this.getProfile.call(user.id, request.body)
  }
}
