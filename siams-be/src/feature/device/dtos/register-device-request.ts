import { DeviceActuator, DeviceCommand, DeviceSensor } from "@domain/entities"

export class RegisterDevicePayload {
  constructor(
    public model: string,
    public firmwareVersion: string,
    public capabilities: {
      sensors: Pick<DeviceSensor, "localId" | "name" | "type" | "unit">[],
      actuators: Pick<DeviceActuator, "localId" | "name" | "type">[],
      commands: Omit<DeviceCommand, "deviceId">[],
    },
    public location: { lon: number, lat: number },
    public name?: string,
  ) { }
}

export class RegisterDeviceRequest {
  constructor(
    public orgId: string,
    public clusterId: string,
    public payload: RegisterDevicePayload
  ) { }
}
