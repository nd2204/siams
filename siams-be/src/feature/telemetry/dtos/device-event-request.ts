import { DeviceEventSeverity, DeviceEventType, EventPayloadType } from "@domain/entities/device-event";

export class DeviceEventRequest {
  constructor(
    public deviceId: string,
    public clusterId: string,
    public orgId: string,
    public type: DeviceEventType,
    public severity: DeviceEventSeverity,
    public title: string,
    public message: string,
    public timestamp: string,
    public payload?: EventPayloadType,
  ) { }
}

