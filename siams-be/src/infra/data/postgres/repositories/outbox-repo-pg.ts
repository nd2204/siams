import { OutboxEntry } from "@domain/entities/outbox";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { Pool } from "pg";

export class OutboxRepositoryPg
  extends PostgresRepositoryBase<OutboxEntry>
  implements IOutboxRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof OutboxEntry, string> = {
      aggregateType: "aggregate_type",
      aggregateId: "aggregate_id",
      topic: "topic",
      payload: "payload",
      status: "status",
      sentAt: "sent_at",
      createdAt: "created_at",
      id: "id"
    }
    super(pool, "outbox", mapping, (row: any) => {
      return new OutboxEntry({
        aggregateType: row[mapping.aggregateType],
        aggregateId: row[mapping.aggregateId],
        topic: row[mapping.topic],
        payload: row[mapping.payload],
        status: row[mapping.status],
        createdAt: row[mapping.createdAt],
        id: row[mapping.id]
      })
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
