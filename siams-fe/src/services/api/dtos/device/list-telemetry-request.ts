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
