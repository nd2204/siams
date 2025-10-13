import Entity from "@shared/entity.js";

export default class Telemetry extends Entity<Telemetry> {
  deviceId: string;
  timestamp: Date;
  readings: Record<string, number>; // sensorType -> value
  status?: { [k: string]: unknown; heapFree?: number; wifiRssi?: number; }
}

