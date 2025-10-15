import { Device } from "@/domain/entities";
import { IPaginated } from "@/shared/interfaces";
import { IDeviceRepository } from "@domain/interfaces"

export class DeviceRepositoryMock implements IDeviceRepository {
  findById(deviceId: string): Promise<Device | null> {
    throw new Error("Method not implemented.");
  }
  findByArea(areaId: string): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }
  save(device: Device): Promise<void> {
    throw new Error("Method not implemented.");
  }
  create(device: Device): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(device: Device): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(deviceId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
