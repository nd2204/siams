import { Entity } from "@domain/interfaces";

export class SensorTelemetry extends Entity<SensorTelemetry, number> {
  declare device_id: string; // the device that this telemetry originate
  declare timestamp: Date;   // time when the telemetry arrived to server
  declare sensor_id: string;
  declare value: number;
}

export class DeviceStatus extends Entity<DeviceStatus, number> {
  declare device_id: string;  // the device that this telemetry originate
  declare cpu_usage?: number; // normalized [0..1]
  declare heap_free?: number; // normalized [0..1], true value based on device metadata
  declare wifi_rssi?: number;
  declare timestamp: Date;    // the time when the telemetry arrived to server
}
