import { DeviceSensor } from "@domain/entities";
import { IDeviceSensorRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class DeviceSensorRepositoryPg
  extends PostgresRepositoryBase<DeviceSensor>
  implements IDeviceSensorRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceSensor, string> = {
      id: "id",
      device_id: "device_id",
      local_id: "local_id",
      type: "type",
      unit: "unit",
      status: "status",
      last_seen_at: "last_seen_at",
      name: "name"
    }

    super(
      pool,
      "sensors",
      mapping,
      (row: any) => new DeviceSensor({
        id: row["id"],
        device_id: row["device_id"],
        local_id: row[mapping.local_id],
        type: row["type"],
        unit: row["unit"],
        status: row["status"],
        last_seen_at: row["last_seen_at"],
        name: row["name"]
      })
    )
  }

  async upsert(payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    return super.upsert(payload, ["device_id", "local_id"])
  }
}
