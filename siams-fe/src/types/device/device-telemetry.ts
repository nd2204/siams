export interface TelemetryGroup {
  bucket: string,
  sensorId: string,
  minValue: number,
  maxValue: number,
  avgValue: number,
  count: number
}

export interface ListTelemtryPayload {
  from: Date,
  to: Date,
  groupBy: "second" | "minute" | "hour" | "day" | "week" | "month",
  limit?: number
}

export interface ListTelemtryRequest {
  deviceId: string,
  sensorId: string,
  payload: ListTelemtryPayload
}

export type ListTelemtryResponse = TelemetryGroup[]
