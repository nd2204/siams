import { User } from '@domain/entities'
import { IUserRepository } from '@domain/interfaces'
import { IUseCase } from '@shared/interfaces'
import { UnauthorizedError } from '@shared/errors'

export class AuthorizeUserUC implements IUseCase<User> {
  constructor(
    protected userRepo: IUserRepository,
    protected verifyToken: (token: string) => User,
  ) { }

  async call(token?: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedError('You`re not authorized')
    }

    const { id } = this.verifyToken(token)
    const user = await this.userRepo.findOneBy({ id })

    if (!user) {
      throw new UnauthorizedError('You`re not authorized')
    }

    return user
  }
}
