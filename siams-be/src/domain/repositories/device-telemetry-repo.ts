import { IRepository } from "@/shared/interfaces";
import { DeviceTelemetry } from "@domain/entities/telemetry";

export interface IDeviceTelemetryRepository extends IRepository<DeviceTelemetry> {
}
