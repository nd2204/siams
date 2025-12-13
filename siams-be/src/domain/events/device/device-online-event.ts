import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceOnlineEventPayload
  extends IDeviceEventPayload {
}

export class DeviceOnlineEvent extends DomainEvent<DeviceOnlineEventPayload> {
  constructor(event_payload: DeviceOnlineEventPayload) {
    super(event_payload, DeviceEventTypeConstants.DeviceStatusOnline);
  }
}
