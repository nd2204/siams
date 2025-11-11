import { IDomainEvent } from "@domain/interfaces/events";

export interface DeviceRegisteredPayload {
  deviceId: string;
}

export class DeviceRegisteredEvent implements IDomainEvent<DeviceRegisteredPayload> {
  name = "device.registered";
  ts = Date.now();
  constructor(
    public orgId: string,
    public clusterId: string,
    public payload: DeviceRegisteredPayload
  ) { }
}
