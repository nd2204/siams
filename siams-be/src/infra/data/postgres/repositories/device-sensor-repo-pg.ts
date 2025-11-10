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
      deviceId: "device_id",
      localId: "local_id",
      type: "type",
      unit: "unit",
      status: "status",
      lastSeen: "last_seen_at",
      name: "name"
    }

    super(pool, "sensors", mapping, (row: any) => {
      return new DeviceSensor({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        localId: row[mapping.localId],
        type: row[mapping.type],
        unit: row[mapping.unit],
        name: row[mapping.name],
        status: row[mapping.status],
        lastSeen: row[mapping.lastSeen],
      })
    })
  }

  async upsert(payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    const existing = await this.findOneBy({
      localId: payload.localId!,
      deviceId: payload.deviceId!
    })
    if (!existing) {
      return await this.create(payload);
    } else {
      const omittedPayload = payload as Omit<DeviceSensor, "id">
      return await this.update(existing.id, omittedPayload);
    }
  }
}
