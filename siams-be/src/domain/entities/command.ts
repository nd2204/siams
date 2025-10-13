import Entity from "@shared/entity.js";

export type CommandStatus = 'acked' | 'expired' | 'failed' | 'pending' | 'sent';

export default class Command extends Entity<Command> {
  public commandId!: string;
  public deviceId!: string;
  public issuedBy?: null | string;
  public commandType!: string;
  public payload!: Record<string, unknown>;
  public expiresAt?: Date
  public status = 'pending';
  public createdAt = new Date();

  isExpired(now: Date = new Date()): boolean {
    return !!this.expiresAt && this.expiresAt.getTime() < now.getTime();
  }
  markAcked() { this.status = 'acked'; }
  markFailed(reason?: string) { this.status = 'failed'; }
  markSent() { this.status = 'sent'; }
}

