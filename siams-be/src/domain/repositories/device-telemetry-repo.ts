import { IRepository } from "@/shared/interfaces";
import { DeviceTelemetry } from "@domain/entities";

export interface IDeviceTelemetryRepository extends IRepository<DeviceTelemetry> { }
