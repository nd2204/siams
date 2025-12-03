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
      device_id: "device_id",
      local_id: "local_id",
      commands: "commands",
    }

    super(pool, "commands", mapping,
      PostgresRepositoryBase.createRowMapper(mapping),
      // (row) => new DeviceCommand({
      //   id: row[mapping.id],
      //   name: row[mapping.name],
      //   type: row[mapping.type],
      //   device_id: row[mapping.device_id],
      //   local_id: row[mapping.local_id],
      //   commands: row[mapping.commands],
      // }),
      ["commands"]
    )
  }

}
