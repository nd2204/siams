import type { IPaginated } from "./paginated";

// Data types for the farm IoT system
export type SensorType =
  | 'temperature'
  | 'humidity'
  | 'soil_moisture'
  | 'ph'
  | 'light'
  | 'pressure'
  | 'npk'
  | 'wind_speed';

export type ActuatorType =
  | 'valve'
  | 'pump'
  | 'fan'
  | 'heater'
  | 'cooler'
  | 'led_light'
  | 'motor'
  | 'relay';

export interface DeviceCommand {
  action: string,
  params: {
    name: string,
    type: string,
    enums?: string[]
  }[]
}

export interface Sensor {
  deviceId: string;
  localId: string;
  name: string;
  type: SensorType;
  unit: string;
  commands?: DeviceCommand[];
  lastUpdate: string;
}

export interface Actuator {
  deviceId: string;
  localId: string;
  name: string;
  type: ActuatorType;
  value?: number;             // For actuators with variable control (0-100)
  commands?: DeviceCommand[], // supported command
  lastCommand: string;
}

export interface Command extends DeviceCommand {
  localId: string;
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
  type: string; // MCU type: ESP32, Arduino, etc.
  clusterId: string;
  status: DeviceStatus;
  sensors?: Sensor[];
  actuators?: Actuator[];
  commands?: Command[];
  lastUpdate: string;
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
