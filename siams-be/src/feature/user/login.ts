import { User } from "@/domain/entities";
import { IUseCase } from "@/shared/interfaces";
import { UserLoginRO } from "./interfaces";
import { IUserRepository } from "@/domain/interfaces/user-repo";
import { UnauthorizedError, ValidationError } from "@/shared/errors";

export class LoginUserUC implements IUseCase<UserLoginRO> {
  constructor(
    protected comparePasswords: (input: string, encrypted: string) => Promise<boolean>,
    protected userRepo: IUserRepository,
    protected issueToken: (payload: Partial<User>) => string,
  ) { }

  async call(email?: string, password?: string): Promise<UserLoginRO> {
    // Validate request
    if (!email || !password) {
      throw new ValidationError('Email and Password are required')
    }

    // Validate input
    const user = await this.userRepo.findForAuth(email)
    const passwordsMatch = user ? await this.comparePasswords(password, user.password) : false

    // Condition
    if (user && passwordsMatch) {
      const { id, firstName, lastName, email, roles } = user
      return {
        user: { id, firstName, lastName, email, roles },
        token: this.issueToken({ id, firstName, lastName, email }),
      }
    } else {
      throw new UnauthorizedError('Invalid login or password')
    }
  }
}
