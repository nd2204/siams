export interface DeviceVerifyRequest {
  deviceId?: string,
  payload?: DeviceVerifyPayload,
}

export interface DeviceVerifyPayload {
  firmwareVersion: string
}
