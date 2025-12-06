import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceDeletedEventPayload extends IDeviceEventPayload { }

export class DeviceDeletedEvent extends DomainEvent<DeviceDeletedEventPayload> {
  constructor(payload: DeviceDeletedEventPayload,) {
    super(payload, DeviceEventTypeConstants.DeviceRegistered)
  }
}
