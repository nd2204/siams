import Entity from "@domain/entity";

export type CommandStatus = 'acked' | 'expired' | 'failed' | 'pending' | 'sent';

export class Command extends Entity<Command, string> {
  declare deviceId: string;
  declare issuedBy?: null | string;
  declare commandType: string;
  declare payload: Record<string, unknown>;
  declare expiresAt?: Date
  status = 'pending';
  createdAt = new Date();

  isExpired(now: Date = new Date()): boolean {
    return !!this.expiresAt && this.expiresAt.getTime() < now.getTime();
  }
  markAcked() { this.status = 'acked'; }
  markFailed(reason?: string) { this.status = 'failed'; }
  markSent() { this.status = 'sent'; }
}

