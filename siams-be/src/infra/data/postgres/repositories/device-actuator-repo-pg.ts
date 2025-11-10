import { DeviceActuator } from "@domain/entities";
import { IDeviceActuatorRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { type Pool } from "pg";

export class DeviceActuatorRepositoryPg
  extends PostgresRepositoryBase<DeviceActuator>
  implements IDeviceActuatorRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceActuator, string> = {
      id: "id",
      deviceId: "device_id",
      localId: "local_id",
      type: "type",
      name: "name",
      status: "status",
    }

    super(
      pool,
      "actuators",
      mapping,
      (row) => new DeviceActuator({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        localId: row[mapping.localId],
        type: row[mapping.type],
        name: row[mapping.name],
        status: row[mapping.status],
      })
    )
  }
  async upsert(payload: Partial<DeviceActuator>): Promise<DeviceActuator> {
    const existing = await this.findOneBy({
      localId: payload.localId!,
      deviceId: payload.deviceId!
    })
    if (!existing) {
      return await this.create(payload);
    } else {
      const omittedPayload = payload as Omit<DeviceActuator, "id">
      return await this.update(existing.id, omittedPayload);
    }
  }
}
