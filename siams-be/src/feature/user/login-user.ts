import { User } from "@/domain/entities";
import { IUseCase, IValidator } from "@/shared/interfaces";
import { AuthResponse } from "@/feature/user/dtos/auth-response"
import { IOrganizationRepository, IOrganizationUserRepository, IRoleRepository, IUserRepository } from "@/domain/repositories";
import { UnauthorizedError, ValidationError } from "@/shared/errors";
import { UserLoginRequest } from "./dtos/user-login-request";
import { PermissionKey } from "@domain/entities/user-permission";

export class LoginUserUC implements IUseCase<AuthResponse> {
  constructor(
    protected comparePasswords: (input: string, encrypted: string) => Promise<boolean>,
    protected userRepo: IUserRepository,
    protected orgUserRepo: IOrganizationUserRepository,
    protected orgRepo: IOrganizationRepository,
    protected roleRepo: IRoleRepository,
    protected validator: IValidator<UserLoginRequest>,
    protected issueToken: (payload: AuthResponse["user"]) => string,
  ) { }

  async call(req: UserLoginRequest): Promise<AuthResponse> {
    // Validate request
    if (!req.email || !req.password) {
      throw new ValidationError('Email and Password are required')
    }

    // Validate input
    const user = await this.userRepo.findForAuth(req.email)
    const passwordsMatch = user ? await this.comparePasswords(req.password, user.password!) : false

    // Compare
    if (!user || !passwordsMatch) {
      throw new UnauthorizedError('Invalid login or password')
    }

    const responseUser: AuthResponse["user"] = {
      id: user.id,
      name: user.name,
      email: user.email,
      organizations: []
    };

    const orgUsers = await this.orgUserRepo.findAllBy({ userId: user.id })
    if (orgUsers && orgUsers.length > 0) {
      for (let i = 0; i < orgUsers.length; i++) {
        const role = await this.roleRepo.findOneBy({ id: orgUsers[i].roleId })
        const map = await this.roleRepo.getRolePermissionMap()
        const org = await this.orgRepo.findOneBy({ id: orgUsers[i].orgId })
        if (!role || !map) {
          throw new Error("Role and permissions does not exists");
        }
        if (role && map) {
          responseUser.organizations!.push({
            id: orgUsers[i].orgId,
            name: org!.name,
            slug: org!.slug,
            role: role.name,
            permissions: map[role.name]
          });
        } else {
        }
      }
    }

    return {
      user: responseUser,
      token: this.issueToken(responseUser),
    }
  }
}
