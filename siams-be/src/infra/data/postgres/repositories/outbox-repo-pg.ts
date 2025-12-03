import { OutboxEntry } from "@domain/entities/outbox";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { Pool } from "pg";

export class OutboxRepositoryPg
  extends PostgresRepositoryBase<OutboxEntry>
  implements IOutboxRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof OutboxEntry, string> = {
      type: "type",
      payload: "payload",
      status: "status",
      id: "id",
      attempts: "attempts",
      locked_by: "locked_by",
      locket_at: "locked_at",
      scheduled_at: "scheduled_at",
      last_attempt_at: "last_attempt_at",
      sent_at: "sent_at",
      created_at: "created_at"
    }
    super(pool, "outbox", mapping, (row: any) => {
      return new OutboxEntry(row)
    }, ["payload"])
  }

  async listPending(limit: number): Promise<OutboxEntry[]> {
    return (await this.listBy({ status: "PENDING" }, 1, limit)).data
  }

  async markAsFailed(id: string): Promise<void> {
    await this.update(id, { status: "FAILED" })
  }

  async markAsPublished(id: string): Promise<void> {
    await this.update(id, { status: "SENT" })
  }
}
