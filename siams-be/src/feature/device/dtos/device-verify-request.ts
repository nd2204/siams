import { SignedDevicePayload } from "./signed-device-payload";

export interface DeviceVerifyRequest {
  deviceId?: string,
  payload?: SignedDevicePayload,
}

export interface DeviceVerifyPayload {
  fw_ver: string
}
