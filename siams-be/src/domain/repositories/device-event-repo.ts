import type { DeviceEvent } from "@domain/entities";
import { IRepository } from "@shared/interfaces";
import { IBucketOf } from "@shared/interfaces/bucket";

export interface IDeviceEventRepository extends IRepository<DeviceEvent> {
  listRecentBy(filters: Partial<DeviceEvent>, perBucket?: number): Promise<IBucketOf<DeviceEvent>[]>;
}
