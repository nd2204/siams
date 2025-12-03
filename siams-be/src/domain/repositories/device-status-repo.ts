import { Device, DeviceStatus } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IDeviceStatusRepository extends IRepository<DeviceStatus> {
  getLatest(device_id: Device["id"]): Promise<DeviceStatus>;
}
