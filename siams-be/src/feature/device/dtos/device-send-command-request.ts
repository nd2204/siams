import { CommandDesc } from "@domain/value-objects/command";

export interface DeviceCommandPayload {
  localId: number,
  action: string,
  params?: Record<string, any>
}

export interface DeviceSendCommandRequest {
  token?: string,
  deviceId?: string,
  payload?: DeviceCommandPayload
}
