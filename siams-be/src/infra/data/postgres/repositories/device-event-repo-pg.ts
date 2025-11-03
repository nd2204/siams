import { DeviceEvent } from "@domain/entities";
import { IDeviceEventRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IPaginated } from "@shared/interfaces";
import { Pool } from "pg";

export class DeviceEventRepositoryPg
  extends PostgresRepositoryBase<DeviceEvent>
  implements IDeviceEventRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof DeviceEvent, string> = {
      id: "id",
      deviceId: "device_id",
      clusterId: "cluster_id",
      orgId: "org_id",
      type: "event_type",
      message: "message",
      timestamp: "timestamp",
      severity: "severity",
      title: "title",
      payload: "payload"
    }

    super(pool, "alert", mapping, (row) => {
      return new DeviceEvent({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        clusterId: row[mapping.clusterId],
        orgId: row[mapping.orgId],
        type: row[mapping.type],
        message: row[mapping.message],
        timestamp: row[mapping.timestamp],
        severity: row[mapping.severity],
        title: row[mapping.title],
        payload: row[mapping.payload]
      })
    })
  }

  listRecent(deviceId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceEvent>> {
    throw new Error("Method not implemented.");
  }
}
