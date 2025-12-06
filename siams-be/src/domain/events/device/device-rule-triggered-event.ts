import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";
import { DeviceEventTypeConstants } from "@domain/entities/device-event";

export interface DeviceRuleTriggeredEventPayload extends IDeviceEventPayload { }

export class DeviceRuleTriggeredEvent extends DomainEvent<DeviceRuleTriggeredEventPayload> {
  constructor(payload: DeviceRuleTriggeredEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceRuleTriggered)
  }
}
