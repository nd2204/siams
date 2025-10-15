import type { Telemetry } from "@domain/entities";

export interface ITelemetryRepository {
  append(t: Telemetry): Promise<void>;
  query(deviceId: string, from: Date, to: Date): Promise<Telemetry[]>;
}
