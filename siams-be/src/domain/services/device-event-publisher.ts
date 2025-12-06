import { DeviceEvent, DeviceEventType } from "@domain/entities/device-event";
import { DeviceEventPayload } from "@domain/events/event-map";
import { DomainEvent } from "@domain/interfaces/events";

export interface PublishDeviceEventOpts {
  store_event?: { raw_payload: string };
  skip_publish?: boolean;
}

export interface IDeviceEventPublisher {
  /**
   * Publish a device event: saves to DB (if requested) and  publishes to event bus.
   * Handles hashing, persistence, and event broadcasting in one call.
   */
  publish<T extends DeviceEventType>(
    event: DomainEvent<DeviceEventPayload<T>>,
    opts?: PublishDeviceEventOpts
  ): Promise<DeviceEvent | null>;
}
