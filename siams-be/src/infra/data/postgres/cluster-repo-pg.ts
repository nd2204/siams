import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { pool } from "./pool-pg"
import { PostgresRepositoryBase } from "./postgres-repo-base";
import { Pool } from "pg";

export class ClusterRepositoryPg
  extends PostgresRepositoryBase<Cluster>
  implements IClusterRepository {

  constructor(
    pool: Pool
  ) {
    super(pool, "clusters", {
      id: "id",
      orgId: "org_id",
      name: "name",
      description: "description",
      location: "location",
      createdAt: "created_at"
    },
      (row) => {
        return new Cluster({
          id: row["id"],
          orgId: row["org_id"],
          name: row["name"],
          description: row["description"],
          location: row["location"],
          createdAt: row["created_at"]
        })
      }
    )
  }

  addDevice(deviceId: string, clusterId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  removeDevice(deviceId: string, clusterId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
