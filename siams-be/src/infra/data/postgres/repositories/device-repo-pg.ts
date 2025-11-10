import { Device } from "@domain/entities";
import { IDeviceRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";

export class DeviceRepositoryPg
  extends PostgresRepositoryBase<Device>
  implements IDeviceRepository {

  constructor(
    pool: Pool
  ) {
    const mapping: Record<keyof Device, string> = {
      id: "id",
      clusterId: "cluster_id",
      name: "device_name",
      model: "model",
      geom: "geom",
      firmwareVersion: "firmware_version",
      status: "status",
      lastSeen: "last_seen_at",
      createdAt: "created_at",
    }

    super(
      pool,
      "devices",
      mapping,
      (row: any) => {
        return new Device({
          id: row[mapping.id],
          clusterId: row[mapping.clusterId],
          name: row[mapping.name],
          model: row[mapping.model],
          geom: row[mapping.model],
          firmwareVersion: row[mapping.firmwareVersion],
          status: row[mapping.status],
          lastSeen: row[mapping.lastSeen],
          createdAt: row[mapping.createdAt]
        })
      },
      undefined,
      ["geom"]
    )
  }
  async listByOrg(orgId: string, page: number, perPage: number): Promise<IPaginated<Device>> {
    const offset = (page - 1) * perPage;

    const countResult = await this.pool.query(
      `SELECT COUNT(*) as total 
       FROM devices d
       JOIN clusters c ON d.cluster_id = c.id
       WHERE c.org_id = $1`,
      [orgId]
    );

    const total = parseInt(countResult.rows[0].total);

    const result = await this.pool.query(
      `SELECT d.* 
       FROM devices d
       JOIN clusters c ON d.cluster_id = c.id
       WHERE c.org_id = $1
       ORDER BY d.created_at DESC
       LIMIT $2 OFFSET $3`,
      [orgId, perPage, offset]
    );

    return {
      data: result.rows.map(row => this.toEntity(row)),
      pagination: {
        total,
        page,
        perPage
      }
    };
  }
}
