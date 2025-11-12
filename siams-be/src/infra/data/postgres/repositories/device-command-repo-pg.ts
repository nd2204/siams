import { IDeviceCommandRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { DeviceCommand } from "@domain/entities";
import { type Pool } from "pg"

export class DeviceCommandRepositoryPg
  extends PostgresRepositoryBase<DeviceCommand>
  implements IDeviceCommandRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceCommand, string> = {
      id: "id",
      name: "name",
      type: "type",
      deviceId: "device_id",
      localId: "local_id",
      commands: "commands_desc",
    }

    super(pool, "commands", mapping,
      (row) => new DeviceCommand({
        id: row[mapping.id],
        name: row[mapping.name],
        type: row[mapping.type],
        deviceId: row[mapping.deviceId],
        localId: row[mapping.localId],
        commands: row[mapping.commands],
      }),
      ["commands"]
    )
  }

}
