import { type Device } from "@domain/entities/index";

export interface DeviceRepository {
  getById(deviceId: string): Promise<Device | null>;
  listByArea(areaId: string): Promise<Device[]>;
  save(device: Device): Promise<void>;
}
