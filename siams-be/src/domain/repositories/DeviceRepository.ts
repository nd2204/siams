import { Device } from "@domain/entities/device.js";

export interface DeviceRepository {
  getById(deviceId: string): Promise<Device | null>;
  listByArea(areaId: string): Promise<Device[]>;
  save(device: Device): Promise<void>;
}

