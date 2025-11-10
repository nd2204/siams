import { DeviceSensor } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceSensorRepository extends IRepository<DeviceSensor> {
  upsert(payload: Partial<DeviceSensor>): Promise<DeviceSensor>
}
