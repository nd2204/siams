import { Organization } from "@domain/entities";
import { IOrganizationRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class OrganizationRepositoryPg
  extends PostgresRepositoryBase<Organization>
  implements IOrganizationRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof Organization, string> = {
      id: "id",
      name: "name",
      createdAt: "created_at",
      slug: "slug",
      updatedAt: "updatedAt"
    }

    super(
      pool,
      "organizations",
      mapping,
      (row) => {
        return new Organization({
          id: row[mapping.id],
          name: row[mapping.name],
          createdAt: row[mapping.createdAt],
          slug: row[mapping.slug],
          updatedAt: row[mapping.updatedAt]
        })
      }
    )
  }
}
