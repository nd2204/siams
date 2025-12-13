import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceOfflineEventPayload
  extends IDeviceEventPayload {
}

export class DeviceOfflineEvent extends DomainEvent<DeviceOfflineEventPayload> {
  constructor(payload: DeviceOfflineEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceStatusOffline);
  }
}
