import type { Command } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceCommandRepository extends IRepository<Command> {
  getPending(deviceId: string): Promise<Command[]>;
  save(c: Command): Promise<void>;
}
