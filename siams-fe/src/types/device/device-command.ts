export type ParamType = "int" | "number" | "string" | "boolean"

export interface Command {
  id: string;
  local_id: number;
  name?: string;
  type?: string;
  commands: CommandDesc[];
}

export type ParamDesc = {
  name: string,
  type: ParamType,
  enums?: string[]
}

export interface CommandDesc {
  action: string,
  params: ParamDesc[]
}

export interface DeviceCommandPayload {
  localId: number,
  action: string,
  params?: Record<string, number | boolean | string>
}

export interface DeviceSendCommandRequest {
  device_id: string,
  payload: DeviceCommandPayload
}

export interface DeviceSendCommandResponse {
  success: boolean,
  message?: string
}
