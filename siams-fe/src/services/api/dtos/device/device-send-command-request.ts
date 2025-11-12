export interface DeviceCommandPayload {
  localId: number,
  action: string,
  params?: Record<string, number | boolean | string>
}

export interface DeviceSendCommandRequest {
  deviceId: string,
  payload: DeviceCommandPayload
}
