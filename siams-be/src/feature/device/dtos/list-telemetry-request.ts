import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export type GroupByDateType = "second" | "minute" | "hour" | "day" | "week" | "month"

export interface ListTelemetryRequest extends IPaginatedRequest {
  token?: string,
  deviceId?: string,
  sensorId?: string,
  from?: Date,
  to?: Date,
  groupBy?: GroupByDateType,
  limit?: number
}
