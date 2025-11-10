import { DeviceActuator } from "@domain/entities";
import { IDeviceActuatorRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";

export class ActuatorRepositoryMock implements IDeviceActuatorRepository {
  constructor() { }

  upsert(payload: Partial<DeviceActuator>): Promise<DeviceActuator> {
    throw new Error("Method not implemented.");
  }

  findOneBy(filters: Partial<DeviceActuator>): Promise<DeviceActuator | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllBy(filters: Partial<DeviceActuator>): Promise<DeviceActuator[]> {
    throw new Error("Method not implemented.");
  }

  listBy(filters: Partial<DeviceActuator>, page: number, perPage: number): Promise<IPaginated<DeviceActuator>> {
    throw new Error("Method not implemented.");
  }

  create(payload: Partial<DeviceActuator>): Promise<DeviceActuator> {
    throw new Error("Method not implemented.");
  }

  update(id: number | string, payload: Partial<DeviceActuator>): Promise<DeviceActuator> {
    throw new Error("Method not implemented.");
  }

  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
