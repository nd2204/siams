import { IRepository } from "@/shared/interfaces";
import { DeviceTelemetry } from "@domain/entities";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

export interface IDeviceTelemetryRepository extends IRepository<DeviceTelemetry> {
  listByRange(
    sensorId: string,
    from: Date,
    to: Date,
    groupBy: "hour" | "day" | "week" | "month"
  ): Promise<TelemetryGroupDto[]>
}
