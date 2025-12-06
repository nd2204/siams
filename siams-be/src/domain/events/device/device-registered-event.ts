import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceRegisteredEventPayload
  extends IDeviceEventPayload { }

export class DeviceRegisteredEvent extends DomainEvent<DeviceRegisteredEventPayload> {
  constructor(public payload: DeviceRegisteredEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceRegistered)
  }
}
