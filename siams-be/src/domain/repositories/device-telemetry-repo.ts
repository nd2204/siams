import { IRepository } from "@/shared/interfaces";
import { DeviceTelemetry } from "@domain/entities";
import { GroupByDateType, TelemetryGroupDto } from "@feature/device/dtos";

export interface IDeviceTelemetryRepository extends IRepository<DeviceTelemetry> {
  listByRange(
    sensorId: string,
    from: Date,
    to: Date,
    groupBy: GroupByDateType,
    limit?: number
  ): Promise<TelemetryGroupDto[]>
}
