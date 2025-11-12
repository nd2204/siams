import { IRepository } from "@/shared/interfaces";
import { DeviceTelemetry } from "@domain/entities";
import { GroupByDateType } from "@feature/device/dtos/list-telemetry-request";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

export interface IDeviceTelemetryRepository extends IRepository<DeviceTelemetry> {
  listByRange(
    sensorId: string,
    from: Date,
    to: Date,
    groupBy: GroupByDateType,
    limit?: number
  ): Promise<TelemetryGroupDto[]>
}
