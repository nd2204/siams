export interface TelemetryGroupDto {
  bucket: string,
  sensorId: string,
  avgValue: number,
  minValue: number,
  maxValue: number,
  count: number,
}
