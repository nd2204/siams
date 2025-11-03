import { Sensor } from "@domain/entities";
import { IDeviceSensorRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class DeviceSensorRepositoryPg
  extends PostgresRepositoryBase<Sensor>
  implements IDeviceSensorRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof Sensor, string> = {
      id: "id",
      deviceId: "device_id",
      localId: "local_id",
      type: "type",
      unit: "unit",
      status: "status",
      lastSeen: "last_seen_at"
    }

    super(pool, "sensors", mapping, (row: any) => {
      return new Sensor({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        localId: row[mapping.localId],
        type: row[mapping.type],
        unit: row[mapping.unit],
        status: row[mapping.status],
        lastSeen: row[mapping.lastSeen]
      })
    })
  }

  async upsert(payload: Partial<Sensor>): Promise<Sensor> {
    const existing = await this.findOneBy({
      localId: payload.localId!,
      deviceId: payload.deviceId!
    })
    if (!existing) {
      return await this.create(payload);
    } else {
      const omittedPayload = payload as Omit<Sensor, "id">
      return await this.update(existing.id, omittedPayload);
    }
  }
}
