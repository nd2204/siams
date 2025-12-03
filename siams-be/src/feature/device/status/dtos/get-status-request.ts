import { DeviceStatus } from "@domain/entities";

export interface GetDeviceStatusRequest {
  token?: string;
  device_id: string;
}

export interface GetDeviceStatusResponse {
  cpu?: number;
  mem?: number;
  wifi?: number;
  online: boolean;
  ts: Date;
}
