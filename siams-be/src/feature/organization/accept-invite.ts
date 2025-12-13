import { IUseCase, IValidator } from "@shared/interfaces";
import { IAuthService } from "@domain/services/auth-service";
import { IOrganizationInviteRepository } from "@domain/repositories/organization-invite-repo";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { AcceptInviteToOrgRequest, AcceptInviteToOrgResponse } from "./dtos";
import { OrganizationInvite } from "@domain/entities/organization-invite";
import { IOrganizationUserRepository } from "@domain/repositories";

export class AcceptInviteToOrgUC implements IUseCase<AcceptInviteToOrgResponse> {
  constructor(
    private readonly authService: IAuthService,
    private readonly orgUserRepo: IOrganizationUserRepository,
    private readonly inviteRepo: IOrganizationInviteRepository,
    private readonly validator: IValidator<AcceptInviteToOrgRequest>
  ) { }

  async call(req: AcceptInviteToOrgRequest): Promise<AcceptInviteToOrgResponse> {
    const { value: r, errors: e } = this.validator.validate(req)
    if (e && e.length > 0) {
      throw new ValidationError("Invalid invite accept request", e);
    }

    const user_claims = this.authService.verifyToken(r.token);
    const invite = await this.inviteRepo.findOneBy({ token: req.invite_token })

    if (!invite || OrganizationInvite.isExprired(invite)) {
      throw new Error("Invalid or expired invite");
    }

    // NOTE: This is a suspicious behaviour
    if (invite.email !== user_claims.email) {
      throw new UnauthorizedError();
    }

    const saved_org_user = await this.orgUserRepo.addUserToOrg(
      invite.org_id,
      user_claims.id,
      { id: invite.role_id }
    )
    await this.inviteRepo.markAccepted(invite.id);

    return { org_id: saved_org_user.orgId }
  }
}
