import { DeviceCapabilities } from "@domain/entities"

export class RegisterDevicePayload {
  constructor(
    public model: string,
    public firmwareVersion: string,
    public capabilities: Pick<DeviceCapabilities, "sensors" | "actuators" | "commands">,
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
