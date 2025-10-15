import type { Command } from "@domain/entities";

export interface ICommandRepository {
  getPending(deviceId: string): Promise<Command[]>;
  save(c: Command): Promise<void>;
}
