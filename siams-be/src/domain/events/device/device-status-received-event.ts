import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceStatusReceivedEventPayload
  extends IDeviceEventPayload {
  cpu?: number,
  mem?: number,
  wifi?: number,
  online: boolean, // TODO: removes this to online payload
  ts: Date
}

export class DeviceStatusReceivedEvent extends DomainEvent<DeviceStatusReceivedEventPayload> {
  constructor(public payload: DeviceStatusReceivedEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceStatusReceived);
  }
}
