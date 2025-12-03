import { DeviceEvent, DeviceEventType } from "@domain/entities/device-event";

export interface PublishDeviceEventRequest {
  org_id: string;
  cluster_id?: string;
  device_id: string;
  store_event: boolean;
  event_type: DeviceEventType; // for publishing
  event_payload: any;
  raw_payload?: string
}

export interface IDeviceEventPublisher {
  /**
   * Publish a device event: saves to DB (if requested) and  publishes to event bus.
   * Handles hashing, persistence, and event broadcasting in one call.
   */
  publish(request: PublishDeviceEventRequest): Promise<DeviceEvent | null>;
}
