import type { Command } from "@domain/entities/index.js";

export interface CommandRepository {
  getPending(deviceId: string): Promise<Command[]>;
  save(c: Command): Promise<void>;
}
