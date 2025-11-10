import type { DeviceCommand } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceCommandRepository extends IRepository<DeviceCommand> {
}
