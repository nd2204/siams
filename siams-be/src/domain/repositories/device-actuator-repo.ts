import { Actuator } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceActuatorRepository extends IRepository<Actuator> {
  upsert(payload: Partial<Actuator>): Promise<Actuator>
}
