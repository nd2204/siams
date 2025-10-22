import { Entity } from "@domain/interfaces"
import { SensorType } from "./sensor";
import { ActuatorType } from "./actuator";

export type SensorCapability = { localId: number, type: SensorType, unit: string }
export type ActuatorCapability = { localId: number, type: ActuatorType, }
export type CommandCapability = { action: string, params?: string[] }

export class DeviceCapabilities extends Entity<DeviceCapabilities, string> {
  declare deviceId: string
  declare sensors?: SensorCapability[];
  declare actuators?: ActuatorCapability[];
  declare commands?: CommandCapability[];
  declare reportedAt: Date;
}
