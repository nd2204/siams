import { DeviceEventType, DeviceEventTypeConstants } from "@domain/entities/device-event";
import { IDomainEvent } from "@domain/interfaces/events";

export interface DeviceDeletedPayload {
  device_id: string;
}

export class DeviceRegisteredEvent implements IDomainEvent<DeviceDeletedPayload> {
  name: DeviceEventType = DeviceEventTypeConstants.DeviceRegistered;
  ts = Date.now();

  constructor(
    public payload: DeviceDeletedPayload,
    public org_id: string,
    public cluster_id?: string
  ) { }
}
