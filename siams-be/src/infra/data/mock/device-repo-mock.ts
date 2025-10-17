import { Device } from "@/domain/entities";
import { IPaginated } from "@/shared/interfaces";
import { IDeviceRepository } from "@domain/repositories"

export class DeviceRepositoryMock implements IDeviceRepository {
  devices: Device[] = []

  constructor() { }

  findOneBy(filters: Partial<Device>): Promise<Device | undefined> {
    throw new Error("Method not implemented.");
  }

  findAllBy(filters: Partial<Device>): Promise<Device[]> {
    throw new Error("Method not implemented.");
  }

  listBy(filters: Partial<Device>, page: number, perPage: number): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }

  findByArea(areaId: string): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }

  update(id: string, payload: Partial<Device>): Promise<Device> {
    throw new Error("Method not implemented.");
  }

  create(device: Device): Promise<Device> {
    throw new Error("Method not implemented.");
  }

  delete(deviceId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
