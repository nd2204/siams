export interface DeviceSendCommandResponse {
  token?: string,
  deviceId?: string,
  payload?: { command: string, params: Record<string, any> }
}
