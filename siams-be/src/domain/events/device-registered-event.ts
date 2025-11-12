import { IDomainEvent } from "@domain/interfaces/events";

export interface DeviceRegisteredPayload {
  deviceId: string;
}

export class DeviceRegisteredEvent implements IDomainEvent<DeviceRegisteredPayload> {
  static readonly eventName = "device.created";

  name = DeviceRegisteredEvent.eventName;
  ts = Date.now();

  constructor(
    public orgId: string,
    public clusterId: string,
    public payload: DeviceRegisteredPayload
  ) { }
}
