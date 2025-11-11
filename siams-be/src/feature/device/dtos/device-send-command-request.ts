import { CommandDesc } from "@domain/value-objects/command";

export interface DeviceCommandPayload extends CommandDesc {
  localId: number,
  action: string,
  params?: {
    name: string,
    type: string,
    enums?: string[]
  }[]
}

export interface DeviceSendCommandRequest {
  token: string,
  orgId: string,
  deviceId: string,
  payload: DeviceCommandPayload
}
