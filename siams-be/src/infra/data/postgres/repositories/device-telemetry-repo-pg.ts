import { DeviceTelemetry } from "@domain/entities";
import { IDeviceTelemetryRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { Pool } from "pg";

export class DeviceTelemetryRepositoryPg
  extends PostgresRepositoryBase<DeviceTelemetry>
  implements IDeviceTelemetryRepository {

  constructor(
    pool: Pool
  ) {
    const mapping: Record<keyof DeviceTelemetry, string> = {
      id: "id",
      value: "value",
      sensorId: "sensor_id",
      timestamp: "timestamp"
    }

    super(pool, "telemetry", mapping, (row) => {
      return new DeviceTelemetry({
        id: row[mapping.id],
        value: row[mapping.value],
        sensorId: row[mapping.sensorId],
        timestamp: row[mapping.timestamp]
      })
    })
  }
}
