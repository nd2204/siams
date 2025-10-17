import { Actuator } from "@domain/entities";
import { IActuatorRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { pool } from "./pool-pg";

export class ActuatorRepositoryPg implements IActuatorRepository {
  findOneBy(filters: Partial<Actuator>): Promise<Actuator | undefined> {
    throw new Error("Method not implemented.");
  }
  findAllBy(filters: Partial<Actuator>): Promise<Actuator[]> {
    throw new Error("Method not implemented.");
  }
  listBy(filters: Partial<Actuator>, page: number, perPage: number): Promise<IPaginated<Actuator>> {
    throw new Error("Method not implemented.");
  }
  create(payload: Partial<Actuator>): Promise<Actuator> {
    throw new Error("Method not implemented.");
  }
  update(id: number | string, payload: Partial<Actuator>): Promise<Actuator> {
    throw new Error("Method not implemented.");
  }
  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
