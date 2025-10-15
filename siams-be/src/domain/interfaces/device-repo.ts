import { IPaginated } from "@/shared/interfaces";
import { type Device } from "@domain/entities";

export interface IDeviceRepository {
  findById(deviceId: string): Promise<Device | null>;
  findByArea(areaId: string): Promise<IPaginated<Device>>;
  save(device: Device): Promise<void>;
  create(device: Device): Promise<void>;
  update(device: Device): Promise<void>;
  delete(deviceId: string): Promise<void>;
}
