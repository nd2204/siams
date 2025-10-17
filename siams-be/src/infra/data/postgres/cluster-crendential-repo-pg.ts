import { ClusterCredential } from "@domain/entities";
import { PostgresRepositoryBase } from "./postgres-repo-base";
import { Pool } from "pg";

export class ClusterCredentialRepositoryPg
  extends PostgresRepositoryBase<ClusterCredential> {

  constructor(pool: Pool) {
    super(pool, "cluster_credentials", {
      id: "id",
      clusterId: "cluster_id",
      loginId: "username",
      password: "password_hash",
      salt: "salt",
      createdAt: "created_at",
    }, (row: any) =>
      new ClusterCredential({
        id: row["id"],
        clusterId: row["cluster_id"],
        loginId: row["username"],
        password: row["password_hash"],
        salt: row["salt"],
        createdAt: row["created_at"],
      })
    )
  }
}
