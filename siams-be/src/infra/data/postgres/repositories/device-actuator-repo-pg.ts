import { Actuator } from "@domain/entities";
import { IDeviceActuatorRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class DeviceActuatorRepositoryPg
  extends PostgresRepositoryBase<Actuator>
  implements IDeviceActuatorRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof Actuator, string> = {
      id: "id",
      deviceId: "device_id",
      localId: "local_id",
      type: "type",
      status: "status",
      lastSeen: "last_seen_at",
    }

    super(
      pool,
      "actuators",
      mapping,
      (row) => new Actuator({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        localId: row[mapping.localId],
        type: row[mapping.type],
        status: row[mapping.status],
        lastSeen: row[mapping.lastSeen],
      })
    )
  }
  async upsert(payload: Partial<Actuator>): Promise<Actuator> {
    const existing = await this.findOneBy({
      localId: payload.localId!,
      deviceId: payload.deviceId!
    })
    if (!existing) {
      return await this.create(payload);
    } else {
      const omittedPayload = payload as Omit<Actuator, "id">
      return await this.update(existing.id, omittedPayload);
    }
  }
}
