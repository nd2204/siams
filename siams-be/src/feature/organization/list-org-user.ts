import { IUseCase, IValidator } from "@shared/interfaces";
import { ListOrgUserRequest, ListOrgUserResponse } from "./dtos";
import { IOrganizationUserRepository } from "@domain/repositories";
import { ValidationError } from "@shared/errors";
import { IAuthService } from "@domain/services/auth-service";

export class ListOrgUserUC implements IUseCase<ListOrgUserResponse> {
  constructor(
    private readonly orgUserRepo: IOrganizationUserRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<ListOrgUserRequest>
  ) { }

  async call(req: ListOrgUserRequest): Promise<ListOrgUserResponse> {
    const { value: r, errors: e } = this.validator.validate(req);
    if (e && e.length > 0) {
      throw new ValidationError("Invalid list organization users request", e);
    }

    const claims = this.authService.verifyToken(req.token);
    const org = await this.authService.canAccessOrg(claims.id, r.org_id);

    const users = await this.orgUserRepo.listOrgUsers(
      org.id, r.page ?? 1, r.perPage ?? 10
    );

    return users
  }
}
