import { SignedDevicePayload } from "@feature/device/dtos"

export interface PushTelemetryRequest {
  deviceId: string
  orgId: string
  payload: SignedDevicePayload
}

export interface PushTelemetryPayload {
  value: number,
  localId: number,
  ts: number
}
