export type CommandStatus = 'acked' | 'expired' | 'failed' | 'pending' | 'sent';

export class Command {
  commandId: string;
  createdAt: Date;
  status: CommandStatus;

  constructor(
    commandId: string,
    public deviceId: string,
    public issuedBy: null | string,
    public commandType: string,
    public payload: Record<string, any>,
    public expiresAt?: Date
  ) {
    this.commandId = commandId;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  isExpired(now: Date = new Date()): boolean {
    return !!this.expiresAt && this.expiresAt.getTime() < now.getTime();
  }
  markAcked() { this.status = 'acked'; }
  markFailed(reason?: string) { this.status = 'failed'; }
  markSent() { this.status = 'sent'; }
}

