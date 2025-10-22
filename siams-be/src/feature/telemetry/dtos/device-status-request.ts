export class DeviceStatusPayload {
  constructor(
    public cpu?: number,
    public mem?: number,
    public wifi?: number,
    public online?: boolean,
    public ts?: string
  ) { }
}

export class DeviceStatusRequest {
  constructor(
    public deviceId?: string,
    public payload?: DeviceStatusPayload,
  ) { }
}
