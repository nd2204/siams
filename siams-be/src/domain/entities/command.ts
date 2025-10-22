import { Entity } from "@domain/interfaces";

export type CommandStatus = 'acked' | 'expired' | 'failed' | 'pending' | 'sent';

export class Command extends Entity<Command, string> {
  declare deviceId: string;
  declare issuedBy?: null | string;
  declare command: string;
  declare payload: Record<string, unknown>;
  declare expiresAt?: Date
  status = 'pending';
  declare createdAt?: Date;
  declare ackedAt?: Date;

  static isExpired(command: Command, now: Date = new Date()): boolean {
    return !!command.expiresAt && command.expiresAt.getTime() < now.getTime();
  }
  static markAcked(command: Command): Command { command.status = 'acked'; return command }
  static markFailed(command: Command): Command { command.status = 'failed'; return command }
  static markSent(command: Command): Command {
    command.status = 'sent';
    return command
  }
}

