import { Sensor } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceSensorRepository extends IRepository<Sensor> {
  upsert(payload: Partial<Sensor>): Promise<Sensor>
}
