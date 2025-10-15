import Entity from "@domain/entity";

export type CommandStatus = 'acked' | 'expired' | 'failed' | 'pending' | 'sent';

export class Command extends Entity<Command, string> {
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

