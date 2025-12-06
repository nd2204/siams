import { Entity } from "@domain/interfaces";

export const OutboxTypeConstants = {
  SentDeviceCommand: "device.command",
  AnchorEvent: "anchor.event",
  AnchorBatch: "anchor.batch",
} as const;

type OutboxType = typeof OutboxTypeConstants[keyof typeof OutboxTypeConstants]

export class OutboxEntry extends Entity<OutboxEntry, string> {
  declare type: OutboxType;
  declare payload: any;
  status?: 'PENDING' | 'SENT' | 'FAILED' = 'PENDING';
  attempts?: number = 0;
  declare locked_by?: string;
  declare locket_at?: Date;
  declare scheduled_at?: Date;
  declare last_attempt_at?: Date;
  declare sent_at?: Date;
  created_at?: Date = new Date();
}
