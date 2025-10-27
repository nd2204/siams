import { OrganizationUser } from "@domain/entities";
import { IOrganizationUserRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class OrganizationUserRepositoryPg
  extends PostgresRepositoryBase<OrganizationUser>
  implements IOrganizationUserRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof OrganizationUser, string> = {
      id: "id",
      orgId: "org_id",
      userId: "user_id",
      roleId: "role_id",
      invitedBy: "invited_by",
      acceptedAt: "accepted_at",
      createdAt: "created_at",
      updatedAt: "update_at"
    }

    super(
      pool,
      "organization_users",
      mapping,
      (row) => {
        return new OrganizationUser({
          id: row[mapping.id],
          orgId: row[mapping.orgId],
          userId: row[mapping.userId],
          roleId: row[mapping.roleId],
          invitedBy: row[mapping.invitedBy],
          acceptedAt: row[mapping.acceptedAt],
          createdAt: row[mapping.createdAt],
          updatedAt: row[mapping.updatedAt]
        })
      }
    )
  }
}
