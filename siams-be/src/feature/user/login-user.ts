import { User } from "@/domain/entities";
import { IUseCase } from "@/shared/interfaces";
import { UserLoginResponse } from "@/feature/user/dtos/user-login-response"
import { IUserRepository } from "@/domain/repositories";
import { UnauthorizedError, ValidationError } from "@/shared/errors";
import { UserLoginRequest } from "./dtos/user-login-request";

export class LoginUserUC implements IUseCase<UserLoginResponse> {
  constructor(
    protected comparePasswords: (input: string, encrypted: string) => Promise<boolean>,
    protected userRepo: IUserRepository,
    protected issueToken: (payload: Partial<User>) => string,
  ) { }

  async call(req: UserLoginRequest): Promise<UserLoginResponse> {
    // Validate request
    if (!req.email || !req.password) {
      throw new ValidationError('Email and Password are required')
    }

    // Validate input
    const user = await this.userRepo.findForAuth(req.email)
    const passwordsMatch = user ? await this.comparePasswords(req.password, user.password) : false

    // Condition
    if (user && passwordsMatch) {
      const { id, firstName, lastName, email, orgId } = user
      return {
        user: { id, firstName, lastName, email, orgId },
        token: this.issueToken({ id, firstName, lastName, email, orgId }),
      }
    } else {
      throw new UnauthorizedError('Invalid login or password')
    }
  }
}
