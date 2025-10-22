import { Organization } from "@domain/entities";
import { IOrganizationRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class OrganizationRepositoryPg
  extends PostgresRepositoryBase<Organization>
  implements IOrganizationRepository {

  constructor(pool: Pool) {
    const mapping = {
      id: "id",
      name: "name",
      created_at: "created_at"
    }

    super(
      pool,
      "organizations",
      mapping,
      (row) => {
        return new Organization({
          id: row[mapping.id],
          name: row[mapping.name],
          created_at: row[mapping.created_at]
        })
      }
    )
  }
}
