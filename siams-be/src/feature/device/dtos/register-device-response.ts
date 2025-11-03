export type SensorCapabilityResponse = { localId: number, sensorId: string }
export type ActuatorCapabilityResponse = { localId: number, actuatorId: string }

export class RegisterDeviceResponse {
  constructor(
    public deviceId: string,
    public assignedCluster: string,
    public status: string,
    public sensors?: SensorCapabilityResponse[],
    public actuators?: ActuatorCapabilityResponse[],
    public commandRegistered?: number
  ) { }
}
