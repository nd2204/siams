import { Entity } from "@domain/interfaces";

export class OutboxEntry extends Entity<OutboxEntry, string> {
  declare aggregateType: string;
  declare aggregateId: string;
  declare topic: string;
  declare payload: any;
  declare status: 'PENDING' | 'SENT' | 'FAILED';
  declare sentAt?: Date;
  declare createdAt?: Date;
}
