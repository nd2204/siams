import { Device } from "@domain/entities";
import { IDeviceRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";
import { type Pool } from "pg";

export class DeviceRepositoryPg implements IDeviceRepository {

  constructor(
    private readonly pool: Pool
  ) { }

  findByArea(areaId: string): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }

  findOneBy(filters: Partial<Device>): Promise<Device | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllBy(filters: Partial<Device>): Promise<Device[]> {
    throw new Error("Method not implemented.");
  }

  listBy(filters: Partial<Device>, page: number, perPage: number): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }

  create(payload: Partial<Device>): Promise<Device> {
    throw new Error("Method not implemented.");
  }

  update(id: number | string, payload: Partial<Device>): Promise<Device> {
    throw new Error("Method not implemented.");
  }

  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
