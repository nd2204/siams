import { DeviceCommand } from "@domain/entities"

export interface DeviceCommandPayload {
  localId: DeviceCommand["local_id"],
  action: string,
  params?: Record<string, any>
}

export interface DeviceSendCommandRequest {
  token?: string,
  device_id?: string,
  payload?: DeviceCommandPayload
}
