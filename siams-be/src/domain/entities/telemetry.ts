import Entity from "@domain/entity";

export class Telemetry extends Entity<Telemetry, number> {
  deviceId: string;
  timestamp: Date;
  readings: Record<string, number>; // sensorType -> value
  status?: { [k: string]: unknown; heapFree?: number; wifiRssi?: number; }
}

