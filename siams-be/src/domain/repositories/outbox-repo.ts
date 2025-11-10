import { OutboxEntry } from "@domain/entities/outbox";
import { IRepository } from "@shared/interfaces";

export interface IOutboxRepository extends IRepository<OutboxEntry> {
  listPending(limit: number): Promise<OutboxEntry[]>
  markAsFailed(id: string): Promise<void>
  markAsPublished(id: string): Promise<void>
}
