import Entity from "@domain/entity";

export class SensorTelemetry extends Entity<SensorTelemetry, number> {
  device_id: string; // the device that this telemetry originate
  timestamp: Date;   // time when the telemetry arrived to server
  sensor_id: string;
  value: number;
}

export class DeviceTelemetry extends Entity<DeviceTelemetry, number> {
  device_id: string;  // the device that this telemetry originate
  timestamp: Date;    // time when the telemetry arrived to server
  cpu_usage?: number; // normalized [0..1]
  heap_free?: number; // normalized [0..1], true value based on device metadata
  wifi_rssi?: number;
}
