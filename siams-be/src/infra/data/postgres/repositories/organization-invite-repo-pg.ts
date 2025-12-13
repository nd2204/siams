import { OrganizationInvite, OrganizationInviteId } from "@domain/entities/organization-invite";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IOrganizationInviteRepository } from "@domain/repositories/organization-invite-repo";

export class OrganizationRepositoryPg
  extends PostgresRepositoryBase<OrganizationInvite>
  implements IOrganizationInviteRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof OrganizationInvite, string> = {
      id: "id",
      org_id: "organization_id",
      email: "email",
      role_id: "role_id",
      token: "token",
      invited_by: "invited_by",
      expires_at: "expires_at",
      accepted: "accepted",
      created_at: "created_at",
    }

    super(
      pool,
      "organizations",
      mapping,
      PostgresRepositoryBase.createRowMapper(mapping)
    )
  }

  async markAccepted(id: OrganizationInviteId): Promise<void> {
    await this.update(id, { [this.columns.accepted]: true })
  }
}
