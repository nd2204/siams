// domain/entities/telemetry.ts
export class Telemetry {
  constructor(
    public deviceId: string,
    public timestamp: Date,
    public readings: Record<string, number>, // sensorType -> value
    public status?: { [k: string]: any; heapFree?: number;wifiRssi?: number; }
  ) { }
}

