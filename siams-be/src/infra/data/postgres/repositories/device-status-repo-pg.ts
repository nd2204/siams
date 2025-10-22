import { DeviceStatus } from "@domain/entities";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { Pool } from "pg";

export class DeviceStatusRepositoryPg
  extends PostgresRepositoryBase<DeviceStatus>
  implements IDeviceStatusRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceStatus, string> = {
      id: "id",
      deviceId: "device_id",
      cpuUsage: "cpu_usage",
      memUsage: "memory_usage",
      wifiRssi: "wifi_strength",
      timestamp: "reported_at",
      online: "online"
    }
    super(pool, "device_status", mapping, (row) => {
      return new DeviceStatus({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        cpuUsage: row[mapping.cpuUsage],
        memUsage: row[mapping.memUsage],
        wifiRssi: row[mapping.wifiRssi],
        timestamp: row[mapping.timestamp],
        online: row[mapping.online]
      })
    })
  }
}
