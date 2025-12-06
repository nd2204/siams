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
      name: "device_name",
      cluster_id: "cluster_id",
      org_id: "org_id",
      model: "model",
      geom: "geom",
      fw_ver: "fw_ver",
      status: "status",
      pubkey: "pubkey",
      prov_status: "prov_status",
      last_seen_at: "last_seen_at",
      created_at: "created_at",
      hardware_id: "hardware_id",
      trust_level: "trust_level",
      updated_at: "updated_at",
      device_secret: "device_secret",
      prov_onchain: "prov_onchain",
      deleted: "deleted"
    }

    super(
      pool,
      "devices",
      mapping,
      PostgresRepositoryBase.createRowMapper(mapping),
      undefined,
      ["geom"]
    )
  }

  async listByOrg(orgId: string, page: number, perPage: number): Promise<IPaginated<Device>> {
    const offset = (page - 1) * perPage;

    const countResult = await this.pool.query(
      `SELECT COUNT(*) as total 
       FROM devices d
       WHERE d.org_id = $1`,
      [orgId]
    );

    const total = parseInt(countResult.rows[0].total);

    const result = await this.pool.query(
      `SELECT d.* 
       FROM ${this.tableName} d
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
