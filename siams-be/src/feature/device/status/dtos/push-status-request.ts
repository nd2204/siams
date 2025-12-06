import { SignedDevicePayload } from "@feature/device/dtos";

export interface PushStatusPayload {
  cpu?: number,
  mem?: number,
  wifi?: number,
  online: boolean,
  ts: number
}

export interface PushStatusRequest {
  deviceId: string,
  orgId: string,
  payload: SignedDevicePayload,
}
