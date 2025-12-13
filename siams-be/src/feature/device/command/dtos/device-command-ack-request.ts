import { DeviceId } from "@domain/entities/device"
import { SignedDevicePayload } from "@feature/device/dtos"

export interface DeviceCommandAckRequest {
  device_id: DeviceId,
  payload: SignedDevicePayload
}

export interface DeviceCommandAckPayload {
  status: string,
  message?: string
}
