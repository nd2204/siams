import { IDeviceCommandRepository } from "@domain/repositories";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { Command } from "@domain/entities";
import { type Pool } from "pg"

export class DeviceCommandRepositoryPg
  extends PostgresRepositoryBase<Command>
  implements IDeviceCommandRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof Command, string> = {
      id: "id",
      deviceId: "device_id",
      issuedBy: "issued_by",
      command: "commands",
      payload: "payload",
      expiresAt: "expires_at",
      status: "status",
      createdAt: "created_at",
      ackedAt: "acked_at"
    }

    super(pool, "commands", mapping,
      (row) => new Command({
        id: row[mapping.id],
        deviceId: row[mapping.deviceId],
        issuedBy: row[mapping.issuedBy],
        command: row[mapping.command],
        payload: row[mapping.payload],
        expiresAt: row[mapping.expiresAt],
        status: row[mapping.status],
        createdAt: row[mapping.createdAt],
      })
    )
  }

  getPending(deviceId: string): Promise<Command[]> {
    throw new Error("Method not implemented.");
  }

  save(c: Command): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
