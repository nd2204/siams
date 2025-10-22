import { Sensor } from "@domain/entities";
import { IDeviceSensorRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";

export class SensorRepositoryMock implements IDeviceSensorRepository {

  constructor() { }

  upsert(payload: Partial<Sensor>): Promise<Sensor> {
    throw new Error("Method not implemented.");
  }

  findOneBy(filters: Partial<Sensor>): Promise<Sensor | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllBy(filters: Partial<Sensor>): Promise<Sensor[]> {
    throw new Error("Method not implemented.");
  }

  listBy(filters: Partial<Sensor>, page: number, perPage: number): Promise<IPaginated<Sensor>> {
    throw new Error("Method not implemented.");
  }

  create(payload: Partial<Sensor>): Promise<Sensor> {
    throw new Error("Method not implemented.");
  }

  update(id: number | string, payload: Partial<Sensor>): Promise<Sensor> {
    throw new Error("Method not implemented.");
  }

  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
