import { IRepository } from "@/shared/interfaces";
import type { SensorTelemetry } from "@domain/entities";

export interface ITelemetryRepository extends IRepository<SensorTelemetry> {
  append(t: SensorTelemetry): Promise<void>;
  query(deviceId: string, from: Date, to: Date): Promise<SensorTelemetry[]>;
}
