import { DomainEvent } from "./events";
import { DeviceEventType } from "@domain/entities/device-event";
import { DeviceEventPayload } from "@domain/events/event-map";

// TOOD: refactor to using event object
export class DeviceRealtimeMessage<T extends DeviceEventType>
  extends DomainEvent<DeviceEventPayload<T>> {
  meta?: { source?: string }
}

export interface IRealtimeClient {
  publishDeviceEvent<T extends DeviceEventType>(message: DeviceRealtimeMessage<T>): Promise<void>;
  // publishOrgEvent<T extends OrganizationEventType>(message: OrganizationRealtimeMessage<T>): Promise<void>;
}
