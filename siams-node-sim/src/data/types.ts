import { ActuatorCapability, CommandCapability, SensorCapability } from "@domain/entities/device-capabilities";
import { SensorType, ActuatorType } from "@domain/entities";

export type GlobalConfig = {
  mqttUrl: string;
  mqttOptions?: any;
  orgId: string;
  clusterId: string;
  sensors: { type: SensorType, unit: string }[];
  actuators: { type: ActuatorType }[];
  commands: CommandCapability[];
  telemetryIntervalMs: number;
  statusIntervalMs: number;
  telemetryJitterMs?: number;
}

export type DeviceConfig = {
  tempId: string;
  orgId: string;
  deviceId?: string;
  clusterId: string;
  mqtt: {
    url: string;
    opts?: any;
  }
  simulation: {
    telemetryIntervalMs: number;
    statusIntervalMs: number;
    telemetryJitterMs?: number;
  }
  capabilities: {
    sensors: SensorCapability[],
    actuators: ActuatorCapability[],
    commands: CommandCapability[]
  }
};

export type DevInfo = {
  tempId?: string;
  id: string; // deviceId or tempId
  registered: boolean;
  lastSeen?: string;
  sensors?: SensorCapability[]
  actuators?: ActuatorCapability[]
  reading?: Record<number, number>,
  cpu?: number;
  mem?: number;
  wifi?: number;
  lastMessage?: string;
};

export type LogLevel = "Info" | "Warn" | "Error" | "Important"

export type DeviceEventInput =
  | { type: "created"; tempId?: string, sensors: SensorCapability[], actuators: ActuatorCapability[], commands: CommandCapability[] }
  | { type: "registered"; tempId?: string; deviceId: string }
  | { type: "telemetry"; tempId?: string; localId: number, sensor: string; value: number }
  | { type: "status"; tempId?: string; cpu: number; mem: number, wifi: number }
  | { type: "log"; tempId?: string; level: LogLevel, message: string, obj?: any };

export type DeviceEvent =
  | { type: "created"; tempId: string, sensors: SensorCapability[], actuators: ActuatorCapability[], commands: CommandCapability[] }
  | { type: "registered"; tempId: string; deviceId: string }
  | { type: "telemetry"; tempId: string; localId: number, sensor: string; value: number }
  | { type: "status"; tempId: string; cpu: number; mem: number, wifi: number }
  | { type: "log"; tempId: string; level: LogLevel, message: string, obj?: any };

export type TopicType = "command" | "register-ack" | "unknown"
