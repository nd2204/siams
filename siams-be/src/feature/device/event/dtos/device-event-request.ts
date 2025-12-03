import { DeviceEvent, } from "@domain/entities/device-event";

export class DeviceEventRequest {
  constructor(
    public event: Omit<DeviceEvent,
      "id" | "event_uuid" | "data_hash">
  ) { }
}

