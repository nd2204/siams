import { IRequest, IUseCase } from '@shared/interfaces'
import { UserLoginRO } from '@feature/user/interfaces'
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

  async register(request: IRequest): Promise<{ success: boolean }> {
    const userPayload = request.body
    const user = await this.registerUser.call(userPayload)
    return { success: !!user.id }
  }

  async login(request: IRequest): Promise<UserLoginRO> {
    const { email, password } = request.body ?? {} as { email?: string; password?: string }
    return this.loginUser.call(email, password)
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
