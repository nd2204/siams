import type { Command } from "@domain/entities/command.js";

export interface CommandRepository {
  getPending(deviceId: string): Promise<Command[]>;
  save(c: Command): Promise<void>;
}
