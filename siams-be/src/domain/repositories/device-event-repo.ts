import type { DeviceEvent } from "@domain/entities";
import { IPaginated, IRepository } from "@shared/interfaces";

export interface IDeviceEventRepository extends IRepository<DeviceEvent> {
  listRecent(deviceId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceEvent>>;
}
