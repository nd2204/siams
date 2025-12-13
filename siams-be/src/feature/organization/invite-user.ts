import { IUseCase, IValidator } from "@shared/interfaces";
import { InviteUserToOrgRequest, InviteUserToOrgResponse } from "./dtos/invite-user-to-org-request";
import { IAuthService } from "@domain/services/auth-service";
import { IOrganizationInviteRepository } from "@domain/repositories/organization-invite-repo";
import { IEmailService } from "@domain/services/email-service";
import { ValidationError } from "@shared/errors";
import { ICryptoService } from "@domain/services/crypto-service";
import dayjs from "dayjs";
import { IAppConfig } from "@domain/interfaces/config";

export class InviteUserToOrgUC implements IUseCase<InviteUserToOrgResponse> {
  constructor(
    private readonly authService: IAuthService,
    private readonly inviteRepo: IOrganizationInviteRepository,
    private readonly cryptoService: ICryptoService,
    private readonly mailer: IEmailService,
    private readonly validator: IValidator<InviteUserToOrgRequest>,
    private readonly config: IAppConfig
  ) { }

  async call(req: InviteUserToOrgRequest): Promise<InviteUserToOrgResponse> {
    const { value: r, errors: e } = this.validator.validate(req)
    if (e && e.length > 0) {
      throw new ValidationError("Invalid invite request", e);
    }

    const user_claims = this.authService.verifyToken(r.token);
    const org = await this.authService.canAccessOrg(user_claims.id, r.org_id);

    const token = this.cryptoService.generate_token()
    const invite = await this.inviteRepo.create({
      org_id: org.id,
      email: user_claims.email,
      role_id: r.role,
      token,
      invited_by: user_claims.id,
      expires_at: dayjs().add(7, 'days').toDate(),
    });

    this.mailer.sendMail({
      to: r.email,
      subject: `Siams: Invitation to join ${org.name}`,
      html: `
        <p>You have been invited to join <b>${org.name}</b>.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${this.config.feHost}/invite?token=${token}">
          Accept Invitation
        </a>
      `
    });

    return invite;
  }
}
