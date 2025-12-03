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
      device_id: "device_id",
      cluster_id: "cluster_id",
      org_id: "org_id",
      event_type: "event_type",
      event_uuid: "event_uuid",
      raw_payload: "raw_payload",
      data_hash: "data_hash",
      created_at: "created_at"
    }

    super(pool, "device_events", mapping, (row) => {
      return new DeviceEvent(row)
    })
  }

  listRecent(deviceId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceEvent>> {
    throw new Error("Method not implemented.");
  }
}
