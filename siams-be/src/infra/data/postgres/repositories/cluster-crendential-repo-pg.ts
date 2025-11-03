import { ClusterCredential } from "@domain/entities";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { Pool } from "pg";

export class ClusterCredentialRepositoryPg
  extends PostgresRepositoryBase<ClusterCredential> {

  constructor(pool: Pool) {
    const mapping = {
      id: "id",
      clusterId: "cluster_id",
      loginId: "login_id",
      password: "password_hash",
      salt: "salt",
      createdAt: "created_at",
    }

    super(pool, "cluster_credentials",
      mapping
      , (row: any) =>
        new ClusterCredential({
          id: row[mapping.id],
          clusterId: row[mapping.clusterId],
          loginId: row[mapping.loginId],
          password: row[mapping.password],
          salt: row[mapping.salt],
          createdAt: row[mapping.createdAt],
        })
    )
  }
}
