export class DeviceTelemetryRequest {
  constructor(
    public deviceId?: string,
    public payload?: DeviceTelemetryPayload,
  ) { }
}

export class DeviceTelemetryPayload {
  constructor(
    public value: number,
    public localId?: number,
    public ts?: number
  ) { }
}
