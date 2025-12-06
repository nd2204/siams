import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { DomainEvent } from "@domain/interfaces/events";
import { IDeviceEventPayload } from "./device-event-payload";

export interface DeviceTelemetryReceivedEventPayload
  extends IDeviceEventPayload {
  bucket: string,
  sensorId: string,
  avgValue: number,
  minValue: number,
  maxValue: number,
  count: number,
}

export class DeviceTelemetryReceivedEvent extends DomainEvent<DeviceTelemetryReceivedEventPayload> {
  constructor(public payload: DeviceTelemetryReceivedEventPayload) {
    super(payload, DeviceEventTypeConstants.DeviceTelemetryReceived);
  }
}
