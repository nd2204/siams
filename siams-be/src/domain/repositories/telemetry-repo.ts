import type { Telemetry } from "@domain/entities/telemetry.js";

export interface TelemetryRepository {
  append(t: Telemetry): Promise<void>;
  query(deviceId: string, from: Date, to: Date): Promise<Telemetry[]>;
}
