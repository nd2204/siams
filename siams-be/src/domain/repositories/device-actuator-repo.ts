import { DeviceActuator } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceActuatorRepository extends IRepository<DeviceActuator> {
  upsert(payload: Partial<DeviceActuator>): Promise<DeviceActuator>
}
