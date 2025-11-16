import type { IPaginated } from "./paginated";

// Data types for the farm IoT system
export type SensorType =
  | 'TEMPERATURE'
  | 'HUMIDITY'
  | 'MOISTURE'
  | 'PH'
  | 'LIGHT_INTENSITY'
  | 'PRESSURE'
  | 'NPK'
  | 'WIND_SPEED';

export type ActuatorType =
  | 'VALVE'
  | 'PUMP'
  | 'FAN'
  | 'HEATER'
  | 'COOLER'
  | 'LED_LIGHT'
  | 'MOTOR'
  | 'RELAY';

export type ParamType = "int" | "number" | "string" | "boolean"

export type ParamDesc = {
  name: string,
  type: ParamType,
  enums?: string[]
}

export interface CommandDesc {
  action: string,
  params: ParamDesc[]
}

export interface Sensor {
  id: string;
  deviceId: string;
  localId: number;
  name: string;
  type: SensorType;
  unit: string;
  lastUpdate: string;
}

export interface Actuator {
  id: string;
  deviceId: string;
  localId: number;
  name: string;
  type: ActuatorType;
}

export interface Command {
  id: string;
  localId: number;
  name?: string;
  type?: string;
  commands: CommandDesc[];
}

export interface DeviceTelemetry {
  localId: string;
}

export interface DeviceStatus {
  cpu: number,
  mem: number,
  wifi: number,
  online: boolean
}

export interface Device {
  id: string;
  name: string;
  geom: GeoJSON.Point;
  model: string; // MCU model: ESP32, Arduino, etc.
  clusterId: string;
  status: "online" | "offline";
  firmwareVersion: string;
  lastSeen: string;
}

export interface Cluster {
  id: string;
  name: string;
  locName: string;
  geom?: GeoJSON.Feature;
  devices?: IPaginated<Device>;
  coordinates: { x: number; y: number };
  credentials?: {
    loginId: string;
    password: string;
    createdAt: string;
  };
}
