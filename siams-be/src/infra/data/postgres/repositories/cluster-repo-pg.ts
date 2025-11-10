import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { Pool } from "pg";

export class ClusterRepositoryPg
  extends PostgresRepositoryBase<Cluster>
  implements IClusterRepository {

  constructor(
    pool: Pool
  ) {
    const mapping: Record<keyof Cluster, string> = {
      id: "id",
      orgId: "org_id",
      name: "name",
      geom: "area_geom",
      locName: "location",
      description: "description",
      createdAt: "created_at"
    }

    super(pool, "clusters", mapping,
      (row) => {
        return new Cluster({
          id: row[mapping.id],
          orgId: row[mapping.orgId],
          locName: row[mapping.locName],
          name: row[mapping.name],
          description: row[mapping.description],
          createdAt: row[mapping.createdAt],
          geom: row[mapping.geom]
        })
      },
      undefined,
      ["geom"]
    )
  }

  async updateClusterArea(clusterId: string) {
    await this.pool.query("SELECT update_cluster_area($1)", [clusterId])
  }
}
