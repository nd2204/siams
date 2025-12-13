import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceCommandAckEventPayload extends IDeviceEventPayload {
  status: string,
  message?: string
}

export class DeviceCommandAckEvent extends DomainEvent<DeviceCommandAckEventPayload> {
  constructor(payload: DeviceCommandAckEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceCommandAck)
  }
}
