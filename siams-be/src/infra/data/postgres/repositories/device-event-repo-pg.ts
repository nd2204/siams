import { DeviceEvent } from "@domain/entities";
import { IDeviceEventRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IPaginated } from "@shared/interfaces";
import { IBucketOf } from "@shared/interfaces/bucket";
import { Pool } from "pg";

export class DeviceEventRepositoryPg
  extends PostgresRepositoryBase<DeviceEvent>
  implements IDeviceEventRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceEvent, string> = {
      id: "id",
      device_id: "device_id",
      cluster_id: "cluster_id",
      org_id: "org_id",
      event_type: "event_type",
      event_uuid: "event_uuid",
      raw_payload: "raw_payload",
      data_hash: "data_hash",
      created_at: "created_at"
    }

    super(pool, "device_events", mapping, (row) => {
      return new DeviceEvent(row)
    })
  }

  async listRecentBy(filters: Partial<DeviceEvent>, page: number, perPage: number): Promise<IPaginated<DeviceEvent>> {
    const { whereClause, values } = this.buildWhere(filters);

    const sql = `
      SELECT *${this.geometrySelectSql()}
      FROM ${this.tableName} ${whereClause}
      ORDER BY ${this.columns.created_at} DESC
      OFFSET $${values.length + 1}
      LIMIT $${values.length + 2}
    `;
    const countSql = `
      SELECT COUNT(*)
      FROM ${this.tableName} ${whereClause}
    `;

    const offset = (page - 1) * perPage;
    const res = await this.pool.query(sql, [...values, offset, perPage]);
    const countRes = await this.pool.query(countSql, values);

    return {
      data: res.rows.map(r => this.toEntity(this.postProcessGeometry(r))),
      pagination: {
        total: parseInt(countRes.rows[0].count, 10),
        page,
        perPage,
      }
    };
  }
}
