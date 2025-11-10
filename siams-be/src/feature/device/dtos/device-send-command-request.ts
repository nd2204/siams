import { CommandDesc } from "@domain/value-objects/command";

export interface DeviceCommandPayload extends CommandDesc {
  localId: number,
}

export interface DeviceSendCommandRequest {
  token: string,
  orgId: string,
  deviceId: string,
  payload: DeviceCommandPayload
}
