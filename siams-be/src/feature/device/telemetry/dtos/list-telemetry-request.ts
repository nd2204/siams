import { GroupByDateType } from "@domain/interfaces/group-by-date";
import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export interface ListTelemetryRequest extends IPaginatedRequest {
  token?: string,
  deviceId?: string,
  sensorId?: string,
  from?: Date,
  to?: Date,
  groupBy?: GroupByDateType,
  limit?: number
}
