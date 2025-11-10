export type SensorCapabilityResponse = { localId: number, sensorId: string }
export type ActuatorCapabilityResponse = { localId: number, actuatorId: string }

export class RegisterDeviceResponse {
  constructor(
    public deviceId: string,
    public assignedCluster: string,
    public status: string,
    public sensorsRegistered?: number,
    public actuatorRegistered?: number,
    public commandsRegistered?: number
  ) { }
}
