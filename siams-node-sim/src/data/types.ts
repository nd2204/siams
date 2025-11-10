import { ActuatorType, SensorType } from "@domain/entities";
import { CommandDesc } from "@domain/value-objects/command";
import { RegisterDevicePayload } from "@feature/device/dtos/register-device-request";

export type GlobalConfig = {
  mqttUrl: string;
  mqttOptions?: any;
  orgId: string;
  clusterId: string;
  sensors: { type: SensorType, unit: string }[];
  actuators: { type: ActuatorType }[];
  commands: { commands: CommandDesc[] }[];
  telemetryIntervalMs: number;
  statusIntervalMs: number;
  telemetryJitterMs?: number;
}

type DeviceCapabilities = RegisterDevicePayload["capabilities"]

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
  capabilities: DeviceCapabilities
};

export type DevInfo = {
  tempId?: string;
  id: string; // deviceId or tempId
  registered: boolean;
  lastSeen?: string;
  capabilities: RegisterDevicePayload["capabilities"]
  reading?: Record<number, number>,
  cpu?: number;
  mem?: number;
  wifi?: number;
  lastMessage?: string;
};

export type LogLevel = "Info" | "Warn" | "Error" | "Important"

export type DeviceEventInput =
  | { type: "created"; tempId?: string, capabilities: DeviceCapabilities }
  | { type: "registered"; tempId?: string; deviceId: string }
  | { type: "telemetry"; tempId?: string; localId: number, sensor: string; value: number }
  | { type: "status"; tempId?: string; cpu: number; mem: number, wifi: number }
  | { type: "verified"; tempId?: string; }
  | { type: "log"; tempId?: string; level: LogLevel, message: string, obj?: any };

export type DeviceEvent =
  | { type: "created"; tempId: string, capabilities: DeviceCapabilities }
  | { type: "registered"; tempId: string; deviceId: string }
  | { type: "telemetry"; tempId: string; localId: number, sensor: string; value: number }
  | { type: "status"; tempId: string; cpu: number; mem: number, wifi: number }
  | { type: "verified"; tempId?: string; }
  | { type: "log"; tempId: string; level: LogLevel, message: string, obj?: any };

export type TopicType = "command" | "register-ack" | "verify-ack" | "unknown"
