import { DeviceEventType, DeviceEventTypeConstants } from "@domain/entities/device-event";
import { IDomainEvent } from "@domain/interfaces/events";

export interface DeviceRegisteredPayload {
  device_id: string;
}

export class DeviceRegisteredEvent implements IDomainEvent<DeviceRegisteredPayload> {
  name: DeviceEventType = DeviceEventTypeConstants.DeviceRegistered;
  ts = Date.now();

  constructor(
    public payload: DeviceRegisteredPayload,
    public org_id: string,
    public cluster_id?: string
  ) { }
}
