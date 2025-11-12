export interface TelemetryGroup {
  bucket: string,
  sensorId: string,
  minValue: number,
  maxValue: number,
  avgValue: number,
  count: number
}
