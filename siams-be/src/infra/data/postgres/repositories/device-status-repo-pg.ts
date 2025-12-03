import { Device, DeviceStatus } from "@domain/entities";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { Pool } from "pg";

export class DeviceStatusRepositoryPg
  extends PostgresRepositoryBase<DeviceStatus>
  implements IDeviceStatusRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceStatus, string> = {
      id: "id",
      device_id: "device_id",
      cpuUsage: "cpu_usage",
      memUsage: "memory_usage",
      wifiRssi: "wifi_strength",
      timestamp: "reported_at",
      online: "online"
    }
    super(pool, "device_status", mapping, (row) => {
      return new DeviceStatus({
        id: row[mapping.id],
        device_id: row[mapping.device_id],
        cpuUsage: Number(row[mapping.cpuUsage]),
        memUsage: Number(row[mapping.memUsage]),
        wifiRssi: Number(row[mapping.wifiRssi]),
        timestamp: row[mapping.timestamp],
        online: row[mapping.online]
      })
    })

  }

  async getLatest(device_id: Device["id"]): Promise<DeviceStatus> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ${this.columns.device_id}=$1
      ORDER BY ${this.columns.timestamp} DESC
      LIMIT 1
    `;
    const res = await this.pool.query(query, [device_id]);
    return this.toEntity(res.rows[0]);
  }
}
