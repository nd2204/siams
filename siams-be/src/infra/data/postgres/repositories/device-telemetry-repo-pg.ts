import { DeviceTelemetry } from "@domain/entities";
import { IDeviceTelemetryRepository } from "@domain/repositories";
import { GroupByDateType } from "@feature/device/telemetry/dtos/list-telemetry-request";
import { TelemetryGroupDto } from "@feature/device/telemetry/dtos/telemtry-dto";
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
      timestamp: "timestamp",
      raw_payload: "raw_payload"
    }

    super(
      pool,
      "telemetry",
      mapping,
      PostgresRepositoryBase.createRowMapper(mapping)
    )
  }

  async listByRange(
    sensorId: string,
    from: Date,
    to: Date,
    groupBy: GroupByDateType,
    limit?: number
  ): Promise<TelemetryGroupDto[]> {
    const groupExpr = this.groupExpression(groupBy);
    const query = `
      SELECT
        sensor_id,
        ${groupExpr} AS bucket,
        AVG(value) AS avg_value,
        MIN(value) AS min_value,
        MAX(value) AS max_value,
        COUNT(*) AS samples
      FROM telemetry
      WHERE ${this.columns.sensorId} = $1 AND ${this.columns.timestamp} BETWEEN $2 AND $3
      GROUP BY ${this.columns.sensorId}, bucket
      ORDER BY bucket ASC
      LIMIT $4
    `;
    const res = await this.pool.query(query, [sensorId, from, to, limit ?? 50]);

    return res.rows.map(r => ({
      sensorId: r.sensor_id,
      avgValue: Number(r.avg_value),
      minValue: Number(r.min_value),
      maxValue: Number(r.max_value),
      count: Number(r.samples),
      bucket: r.bucket,
    }));
  }

  private groupExpression(granularity: GroupByDateType) {
    const ts = this.columns.timestamp
    switch (granularity) {
      case "second": return `date_trunc('second', ${ts})`;
      case "minute": return `date_trunc('minute', ${ts})`;
      case "hour": return `date_trunc('hour', ${ts})`;
      case "week": return `date_trunc('week', ${ts})`;
      case "month": return `date_trunc('month', ${ts})`;
      case "day":
      default: return `date_trunc('day', ${ts})`;
    }
  }
}
