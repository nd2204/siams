import { SensorType } from "@domain/entities/sensor"

export type DeviceCapabilites = {
  sensors?: SensorType[],
  actuators?: string[]
}

export class RegisterDevicePayload {
  constructor(
    public name: string,
    public model: string,
    public firmwareVersion: string,
    public capabilities: DeviceCapabilites
  ) { }
}

export class RegisterDeviceRequest {
  constructor(
    public orgId: string,
    public clusterId: string,
    public payload: RegisterDevicePayload
  ) { }
}
