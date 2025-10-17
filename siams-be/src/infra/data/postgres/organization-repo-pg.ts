import { Organization } from "@domain/entities";
import { IOrganizationRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "./postgres-repo-base";
import { QueryResult, type Pool } from "pg";

export class OrganizationRepositoryPg
  extends PostgresRepositoryBase<Organization>
  implements IOrganizationRepository {

  constructor(pool: Pool) {
    super(
      pool,
      "organizations",
      {
        name: "name",
        id: "id",
        created_at: "created_at"
      },
      (row: Organization) => {
        return new Organization(row)
      }
    )
  }
}
