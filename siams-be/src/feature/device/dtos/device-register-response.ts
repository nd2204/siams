export type SensorCapabilityResponse = { localId: number, sensorId: string }
export type ActuatorCapabilityResponse = { localId: number, actuatorId: string }

export interface DeviceRegisterResponse {
  status: string,
  deviceId: string,
  assignedOrg: string,
  assignedCluster?: string,
  device_secret?: string,
}
