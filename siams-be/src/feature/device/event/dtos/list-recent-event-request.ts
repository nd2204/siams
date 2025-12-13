import { DeviceEvent } from "@domain/entities";
import { IBucketOf, IBucketRequest } from "@shared/interfaces/bucket";

export interface ListRecentDeviceEventRequest extends IBucketRequest {
  token?: string
  device_id: string
}

export type ListRecentDeviceEventResponse = IBucketOf<DeviceEvent>[]
