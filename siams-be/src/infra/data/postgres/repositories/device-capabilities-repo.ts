import { DeviceCapabilities } from "@domain/entities/device-capabilities";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IDeviceCapabilitiesRepository } from "@domain/repositories";
import { Pool } from "pg";

export class DeviceCapabilitiesRepositoryPg
  extends PostgresRepositoryBase<DeviceCapabilities>
  implements IDeviceCapabilitiesRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceCapabilities, string> = {
      id: "id",
      deviceId: "device_id",
      sensors: "sensors_supported",
      actuators: "actuators_supported",
      commands: "commands",
      reportedAt: "reported_at"
    }
    super(pool, "device_capabilities",
      mapping,
      (row) => {
        return new DeviceCapabilities({
          id: row[mapping.id],
          deviceId: row[mapping.deviceId],
          sensors: row[mapping.sensors],
          actuators: row[mapping.actuators],
          commands: row[mapping.commands],
          reportedAt: row[mapping.reportedAt]
        })
      },
      ["sensors", "actuators", "commands"]
    )
  }
}
