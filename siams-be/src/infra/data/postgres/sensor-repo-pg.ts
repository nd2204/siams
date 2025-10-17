import { Sensor } from "@domain/entities";
import { ISensorRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { pool } from "./pool-pg";

export class SensorRepositoryPg implements ISensorRepository {

  constructor() { }

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
