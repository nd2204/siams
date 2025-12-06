import { DeviceEvent } from "@domain/entities";
import { IPaginated } from "@shared/interfaces";
import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export interface ListRecentDeviceEventRequest extends IPaginatedRequest {
  token?: string
  device_id: string
}

export type ListRecentDeviceEventResponse = IPaginated<DeviceEvent>
