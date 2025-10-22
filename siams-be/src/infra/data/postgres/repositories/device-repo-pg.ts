import { Device } from "@domain/entities";
import { IDeviceRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";

export class DeviceRepositoryPg
  extends PostgresRepositoryBase<Device>
  implements IDeviceRepository {

  constructor(
    pool: Pool
  ) {
    const mapping: Record<string, string> = {
      id: "id",
      clusterId: "cluster_id",
      name: "device_name",
      model: "model",
      firmwareVersion: "firmware_version",
      status: "status",
      lastSeen: "last_seen_at",
      createdAt: "created_at",
    }

    super(
      pool,
      "devices",
      mapping,
      (row: any) => {
        return new Device({
          id: row[mapping.id],
          clusterId: row[mapping.clusterId],
          name: row[mapping.name],
          model: row[mapping.model],
          firmwareVersion: row[mapping.firmwareVersion],
          status: row[mapping.status],
          lastSeen: row[mapping.lastSeen],
          createdAt: row[mapping.createdAt]
        })
      }
    )
  }

  findByArea(areaId: string): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }
}
