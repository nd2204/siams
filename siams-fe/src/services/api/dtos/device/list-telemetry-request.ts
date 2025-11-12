export interface ListTelemtryPayload {
  from: Date,
  to: Date,
  groupBy: "minute" | "hour" | "day" | "week" | "month"
}

export interface ListTelemtryRequest {
  deviceId: string,
  sensorId: string,
  payload: ListTelemtryPayload
}
