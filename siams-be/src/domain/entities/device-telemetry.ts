import { Entity } from "@domain/interfaces";

export class DeviceTelemetry extends Entity<DeviceTelemetry, number> {
  declare sensorId: string; // the device that this telemetry originate
  declare timestamp: Date;   // time when the telemetry arrived to server
  declare value: number;
}

export class DeviceStatus extends Entity<DeviceStatus, number> {
  declare deviceId: string;  // the device that this telemetry originate
  declare cpuUsage?: number; // normalized [0..1]
  declare memUsage?: number; // normalized [0..1], true value based on device metadata
  declare wifiRssi?: number;
  declare timestamp: Date;    // the time when the telemetry arrived to server
  declare online: boolean;
}
