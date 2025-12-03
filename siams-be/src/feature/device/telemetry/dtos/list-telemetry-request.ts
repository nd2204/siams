import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export const GroupByTypeConstants = {
  second: "second",
  minute: "minute",
  hour: "hour",
  day: "day",
  week: "week",
  month: "month"
} as const

export type GroupByDateType = typeof GroupByTypeConstants[keyof typeof GroupByTypeConstants]

export interface ListTelemetryRequest extends IPaginatedRequest {
  token?: string,
  deviceId?: string,
  sensorId?: string,
  from?: Date,
  to?: Date,
  groupBy?: GroupByDateType,
  limit?: number
}
