import { Entity } from "@domain/interfaces"
import { ActuatorType, SensorType } from "./";

export type SensorCapability = {
  localId: number,
  type: SensorType,
  unit: string,
  command?: CommandCapability
}
export type ActuatorCapability = {
  localId: number,
  type: ActuatorType,
  command?: CommandCapability
}
export type CommandCapability = {
  action: string,
  params?: {
    name: string,
    type: string,
    enums?: string[]
  }[]
}

export class DeviceCapabilities extends Entity<DeviceCapabilities, string> {
  declare deviceId: string
  declare sensors?: SensorCapability[];
  declare actuators?: ActuatorCapability[];
  declare commands?: CommandCapability[];
  declare reportedAt: Date;
}
