import { DeviceSensor } from "@domain/entities";
import { IDeviceSensorRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";

export class SensorRepositoryMock implements IDeviceSensorRepository {

  constructor() { }

  upsert(payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    throw new Error("Method not implemented.");
  }

  findOneBy(filters: Partial<DeviceSensor>): Promise<DeviceSensor | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllBy(filters: Partial<DeviceSensor>): Promise<DeviceSensor[]> {
    throw new Error("Method not implemented.");
  }

  listBy(filters: Partial<DeviceSensor>, page: number, perPage: number): Promise<IPaginated<DeviceSensor>> {
    throw new Error("Method not implemented.");
  }

  create(payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    throw new Error("Method not implemented.");
  }

  update(id: number | string, payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    throw new Error("Method not implemented.");
  }

  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
